"use server";

import { PasswordFormType, ProfileFormType } from "@/validators";
import { getCurrentUser } from "./auth.action";

import { eq, and, sql, desc, gt, count, avg } from "drizzle-orm";

import {
  CatchReturn,
  ReturnAttended,
  ReturnProfile,
  ReturnPublished,
  ReturnUpcoming,
  ReturnUserAnalytics,
  ReturnUserRecents,
  Duration,
  AnalyticsQueryRow,
} from "./type";
import { db } from "@/drizzle";
import { feedback, interviews, scheduledInterviews } from "../schema";
import { createClient } from "@/supabase/admin";
import { formatAnalytics, getAnalyticsDateRangesAndGrouping } from "../utils";

export const updateProfile = async (updatedProfile: ProfileFormType) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "User not found or unauthorized",
      };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      email: updatedProfile.email,
      data: {
        name: updatedProfile.name,
        role: updatedProfile.role,
        about: updatedProfile.about,
        ...(updatedProfile.avatar && { avatar: updatedProfile.avatar }),
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error: unknown) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const updatePassword = async (passwords: PasswordFormType) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized user",
      };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password: passwords.newPassword,
    });

    if (error) {
      throw error.message;
    }

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error: unknown) {
    console.error("Error updating password:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const getUserRecents = async (): Promise<
  ReturnUserRecents | CatchReturn
> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw "Unauthorized user";

    const recents = await db
      .select({
        role: interviews.role,
        attendedAt: feedback.createdAt,
        type: interviews.type,
        score: feedback.totalScore,
      })
      .from(feedback)
      .innerJoin(interviews, eq(feedback.interviewId, interviews.id))
      .where(eq(feedback.userId, user.id))
      .orderBy(desc(feedback.createdAt))
      .limit(3);

    return { success: true, recents };
  } catch (err: unknown) {
    console.error(err);
    return { success: false, message: err };
  }
};

export const getUpcomingStats = async (): Promise<
  ReturnUpcoming | CatchReturn
> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw "Unauthorized user";

    const now = new Date();

    const upcomingStats = await db
      .select({
        totalScheduled: count(scheduledInterviews.id),
        averageQuestions: avg(interviews.questionCount),
      })
      .from(scheduledInterviews)
      .innerJoin(interviews, eq(scheduledInterviews.interviewId, interviews.id))
      .where(
        and(
          eq(scheduledInterviews.userId, user.id),
          gt(scheduledInterviews.scheduledAt, now),
          eq(interviews.isDeleted, false)
        )
      );

    return {
      success: true,
      upcomingStats: {
        totalScheduled: upcomingStats[0].totalScheduled,
        averageQuestions: upcomingStats[0]?.averageQuestions
          ? parseInt(upcomingStats[0].averageQuestions)
          : 0,
      },
    };
  } catch (err: unknown) {
    console.error(err);
    return { success: false, message: err };
  }
};

export const getPublishedStats = async (): Promise<
  ReturnPublished | CatchReturn
> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized user");

    const publishedStats = await db
      .select({
        totalPublished: sql<number>`COUNT(DISTINCT ${interviews.id})`,
        totalAttendees: sql<number>`COUNT(DISTINCT ${feedback.userId})`,
        active: sql<number>`COUNT(DISTINCT CASE 
          WHEN ${interviews.isDeleted} = false 
          THEN ${interviews.id} 
          ELSE NULL 
        END)`,
      })
      .from(interviews)
      .leftJoin(feedback, eq(interviews.id, feedback.interviewId))
      .where(eq(interviews.publishedBy, user.id));

    const stats = publishedStats[0];

    return {
      success: true,
      publishedStats: {
        totalPublished: stats.totalPublished || 0,
        totalAttendees: stats.totalAttendees || 0,
        active: stats.active || 0,
      },
    };
  } catch (err: unknown) {
    console.error(err);
    return {
      success: false,
      message: err instanceof Error ? err.message : String(err),
    };
  }
};

export const getAttendedStats = async (): Promise<
  ReturnAttended | CatchReturn
> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized user");

    const attendedStats = await db
      .select({
        averageScore: sql<number>`ROUND(COALESCE(AVG(${feedback.totalScore}), 0), 2)`,
        averageQuestions: sql<number>`ROUND(COALESCE(AVG(
          CASE 
            WHEN ${interviews.questionCount} IS NOT NULL AND ${interviews.questionCount} > 0 
            THEN ${interviews.questionCount}
            ELSE 10 
          END
        ), 0), 2)`,
        completed: sql<number>`COUNT(DISTINCT ${feedback.interviewId})`,
      })
      .from(feedback)
      .leftJoin(interviews, eq(feedback.interviewId, interviews.id))
      .where(eq(feedback.userId, user.id));

    const stats = attendedStats[0];

    return {
      success: true,
      attendedStats: {
        averageScore: stats.averageScore || 0,
        averageQuestions: stats.averageQuestions || 0,
        completed: stats.completed || 0,
      },
    };
  } catch (err: unknown) {
    console.error(err);
    return {
      success: false,
      message: err instanceof Error ? err.message : String(err),
    };
  }
};

export const getProfileStats = async (): Promise<
  ReturnProfile | CatchReturn
> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized user");

    const profileStats = await db.execute(sql`
      WITH user_stats AS (
        SELECT
          COUNT(DISTINCT f.interview_id) as interviews_taken,
          ROUND(COALESCE(AVG(f.total_score), 0), 2) as average_score
        FROM ${feedback} f
        WHERE f.user_id = ${user.id}
      ),
      created_stats AS (
        SELECT
          COUNT(DISTINCT i.id) as interviews_created
        FROM ${interviews} i
        WHERE i.published_by = ${user.id}
      )
      SELECT
        COALESCE(us.interviews_taken, 0) as interviews_taken,
        COALESCE(cs.interviews_created, 0) as interviews_created,
        COALESCE(us.average_score, 0) as average_score
      FROM user_stats us
      CROSS JOIN created_stats cs
    `);

    const stats = profileStats[0];

    return {
      success: true,
      profileStats: {
        interviewsTaken: Number(stats?.interviews_taken) || 0,
        interviewsCreated: Number(stats?.interviews_created) || 0,
        averageScore: Number(stats?.average_score) || 0,
        memberSince: user.createdAt,
      },
    };
  } catch (err: unknown) {
    console.error(err);
    return {
      success: false,
      message: err instanceof Error ? err.message : String(err),
    };
  }
};

export const getUserAnalytics = async (
  duration: Duration = "week"
): Promise<ReturnUserAnalytics | CatchReturn> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized user");

    const now = new Date();
    const {
      currentStart,
      currentEnd,
      previousStart,
      previousEnd,
      periodSelect,
      groupBy,
    } = getAnalyticsDateRangesAndGrouping(duration, now);

    const nowIso = now.toISOString();
    const currentStartIso = currentStart.toISOString();
    const previousStartIso = previousStart.toISOString();
    const previousEndIso = previousEnd.toISOString();

    const result = await db.execute<
      AnalyticsQueryRow & Record<string, unknown>
    >(sql`
      WITH all_periods AS (
        SELECT
          CASE
            WHEN f.created_at >= ${currentStartIso}::timestamptz THEN 'current'
            ELSE 'previous'
          END as time_frame,
          ${sql.raw(periodSelect)} as period,
          ${sql.raw(groupBy)} as group_key,
          COUNT(DISTINCT f.interview_id) as total_attended_interviews,
          AVG(f.total_score) as average_score,
          AVG(COALESCE(i.question_count, 10)) as average_questions
        FROM feedback f
        LEFT JOIN interviews i ON f.interview_id = i.id
        WHERE f.user_id = ${user.id}
          AND (
            (f.created_at >= ${currentStartIso}::timestamptz AND f.created_at <= ${nowIso}::timestamptz)
            OR
            (f.created_at >= ${previousStartIso}::timestamptz AND f.created_at <= ${previousEndIso}::timestamptz)
          )
        GROUP BY time_frame, ${sql.raw(groupBy)}, ${sql.raw(periodSelect)}
      )
      SELECT
        time_frame,
        TRIM(period) as period,
        COALESCE(total_attended_interviews, 0) as total_attended_interviews,
        ROUND(COALESCE(average_score, 0), 2) as average_score,
        ROUND(COALESCE(average_questions, 0), 2) as average_questions
      FROM all_periods
      ORDER BY time_frame, group_key
    `);

    const currentRows = result.filter((r) => r.time_frame === "current");
    const previousRows = result.filter((r) => r.time_frame === "previous");

    const currentPeriod = formatAnalytics(
      currentRows,
      duration,
      currentStart,
      currentEnd,
      currentEnd
    );
    const previousPeriod = formatAnalytics(
      previousRows,
      duration,
      previousStart,
      previousEnd,
      currentEnd
    );

    return {
      success: true,
      analytics: {
        currentPeriod,
        previousPeriod,
      },
    };
  } catch (err: unknown) {
    console.error("getUserAnalytics error:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : String(err),
    };
  }
};

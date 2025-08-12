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
  // ReturnUserAnalytics,
  ReturnUserRecents,
} from "./type";
import { db } from "@/drizzle";
import {
  dailyStats,
  feedback,
  interviews,
  scheduledInterviews,
  userStats,
} from "../schema";
import { createClient } from "@/supabase/admin";

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

// export const getUserAnalytics = async (): Promise<
//   ReturnUserAnalytics | CatchReturn
// > => {
//   try {
//     const user = await getCurrentUser();
//     if (!user) throw "Unauthorized user";

//     return { success: true, analytics };
//   } catch (err: unknown) {
//     console.error(err);
//     return { success: false, message: err };
//   }
// };

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

const insertUserStat = (userId: string) => {
  return db
    .insert(userStats)
    .values({ userId })
    .onConflictDoNothing()
    .returning();
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

    if (!upcomingStats.length) {
      const stats = await insertUserStat(user.id);
      if (!stats.length) {
        throw "Failed to insert user stats";
      }
      return {
        success: true,
        upcomingStats: {
          totalScheduled: 0,
          averageQuestions: 0,
        },
      };
    }

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
    if (!user) throw "Unauthorized user";

    const publishedStats = await db
      .select({
        totalPublished: userStats.totalPublishedInterviews,
        totalAttendees: userStats.totalAttendedInterviews,
        active: userStats.activePublishedInterviews,
      })
      .from(userStats)
      .limit(1);

    if (!publishedStats.length) {
      const stats = await insertUserStat(user.id);
      if (!stats.length) {
        throw "Failed to insert user stats";
      }
      return {
        success: true,
        publishedStats: { totalAttendees: 0, totalPublished: 0, active: 0 },
      };
    }

    return { success: true, publishedStats: publishedStats[0] };
  } catch (err: unknown) {
    console.error(err);
    return { success: false, message: err };
  }
};

export const getAttendedStats = async (): Promise<
  ReturnAttended | CatchReturn
> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw "Unauthorized user";

    const attendedStats = await db
      .select({
        averageScore: userStats.averageScore,
        averageQuestions: userStats.averageQuestionCount,
        completed: userStats.totalAttendedInterviews,
      })
      .from(userStats)
      .where(eq(userStats.userId, user.id))
      .limit(1);

    if (!attendedStats.length) {
      const stats = await insertUserStat(user.id);
      if (!stats.length) {
        throw "Failed to insert user stats";
      }
      return {
        success: true,
        attendedStats: {
          averageScore: 0,
          averageQuestions: 0,
          completed: 0,
        },
      };
    }

    return { success: true, attendedStats: attendedStats[0] };
  } catch (err: unknown) {
    console.error(err);
    return { success: false, message: err };
  }
};

export const getProfileStats = async (): Promise<
  ReturnProfile | CatchReturn
> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw "Unauthorized user";

    const profileStats = await db
      .select({
        interviewsTaken: userStats.totalAttendedInterviews,
        interviewsCreated: userStats.totalPublishedInterviews,
        averageScore: userStats.averageScore,
      })
      .from(userStats)
      .where(eq(userStats.userId, user.id))
      .limit(1);

    if (!profileStats.length) {
      const stats = await insertUserStat(user.id);
      if (!stats.length) {
        throw "Failed to insert user stats";
      }
      return {
        success: true,
        profileStats: {
          interviewsTaken: 0,
          interviewsCreated: 0,
          memberSince: user.createdAt,
          averageScore: 0,
        },
      };
    }
    return {
      success: true,
      profileStats: { ...profileStats[0], memberSince: user.createdAt },
    };
  } catch (err: unknown) {
    console.error(err);
    return { success: false, message: err };
  }
};

export const updateDailyStatsAfterInterview = async (
  userId: string,
  interviewData: { score: number; questionCount: number }
) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    await db
      .insert(dailyStats)
      .values({
        userId,
        date: today,
        interviewCount: 1,
        totalScore: interviewData.score,
        totalQuestions: interviewData.questionCount,
        averageScore: interviewData.score.toString(),
      })
      .onConflictDoUpdate({
        target: [dailyStats.userId, dailyStats.date],
        set: {
          interviewCount: sql`${dailyStats.interviewCount} + 1`,
          totalScore: sql`${dailyStats.totalScore} + ${interviewData.score}`,
          totalQuestions: sql`${dailyStats.totalQuestions} + ${interviewData.questionCount}`,
          averageScore: sql`ROUND((${dailyStats.totalScore} + ${interviewData.score})::decimal / (${dailyStats.interviewCount} + 1), 2)`,
          updatedAt: new Date(),
        },
      });

    return { success: true };
  } catch (error) {
    console.error("Error updating daily stats:", error);
    return { success: false, message: error };
  }
};

"use server";

import { CreateInterviewFormType } from "@/validators";
import { getCurrentUser } from "./auth.action";
import {
  CatchReturn,
  // CatchReturn,
  // InterviewDetailsData,
  InterviewSearchParams,
  ReturnAttendedInterviews,
  ReturnInterviewSearch,
  ReturnPublishedInterviews,
  ReturnUpcomingInterviews,
  // ReturnAttendedInterviews,
  // ReturnInterviewSearch,
  // ReturnPublishedInterviews,
  // ReturnUpcomingInterviews,
  ScheduleDetails,
  // ScheduledInterview,
  // ScheduledInterviewData,
} from "./type";
import { runBigQueryQuery } from "../bigQuery";
import { getRecommendationsQuery } from "@/constants/queries";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/drizzle";
import { eq, and, gt, inArray, desc, asc, count, sql } from "drizzle-orm";
import { interviews, scheduledInterviews, feedback } from "../schema";
import dayjs from "dayjs";

export const createInterview = async (
  interviewDetails: CreateInterviewFormType
) => {
  try {
    console.log(interviewDetails, "interview details");
    const user = await getCurrentUser();
    if (!user) throw "User not found";

    const additionalValues = {
      userId: user.id,
      questionCount: interviewDetails.questions.length,
      isDeleted: false,
    };

    const interview = {
      ...interviewDetails,
      ...additionalValues,
      questions: interviewDetails.questions.map((question) => question.value),
      techstack: interviewDetails.techstack.split(","),
      publishedBy: user.id,
    };

    await db.insert(interviews).values(interview);

    return { success: true };
  } catch (error: unknown) {
    console.error("Error: Creating interview", error);
    return { success: false };
  }
};

export const getPublishedInterviews = async (
  page = 1,
  offset = 12
): Promise<ReturnPublishedInterviews | CatchReturn> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw "User not found";

    const whereCondition = eq(interviews.isDeleted, false);

    // Get total count and paginated results in parallel
    const [totalCountResult, publishedInterviewsResult] = await Promise.all([
      db.select({ count: count() }).from(interviews).where(whereCondition),
      db
        .select({
          id: interviews.id,
          difficulty: interviews.difficulty,
          createdAt: interviews.createdAt,
          questions: interviews.questions,
          description: interviews.description,
          techstack: interviews.techstack,
          attendees: interviews.attendees,
          averageScore: interviews.averageScore,
          type: interviews.type,
          level: interviews.level,
          role: interviews.role,
        })
        .from(interviews)
        .where(whereCondition)
        .orderBy(desc(interviews.createdAt))
        .limit(offset)
        .offset((page - 1) * offset),
    ]);

    const interviewsData = publishedInterviewsResult.map((interview) => ({
      ...interview,
      totalQuestions: interview.questions.length,
    }));

    return {
      success: true,
      publishedInterviews: interviewsData,
      totalCounts: totalCountResult[0].count,
    };
  } catch (error: unknown) {
    console.error("Error: Getting published interviews", error);
    return { success: false, message: error };
  }
};

export const getUpcomingInterviews = async (
  page = 1,
  offset = 12
): Promise<ReturnUpcomingInterviews | CatchReturn> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw "User not found";

    const today = dayjs().toDate();
    const whereCondition = and(
      eq(scheduledInterviews.userId, user.id),
      gt(scheduledInterviews.scheduledAt, today)
    );

    const [scheduledResult, totalCountResult] = await Promise.all([
      db
        .select()
        .from(scheduledInterviews)
        .where(whereCondition)
        .orderBy(asc(scheduledInterviews.scheduledAt))
        .limit(offset)
        .offset((page - 1) * offset),
      db
        .select({ count: count() })
        .from(scheduledInterviews)
        .where(whereCondition),
    ]);

    if (scheduledResult.length === 0) {
      return { success: true, upcomingInterviews: [], totalCounts: 0 };
    }

    const interviewIds = scheduledResult.map((s) => s.interviewId!);
    const interviewDetails = await db
      .select({
        id: interviews.id,
        role: interviews.role,
        questionCount: interviews.questionCount,
        attendees: interviews.attendees,
        averageScore: interviews.averageScore,
        createdAt: interviews.createdAt,
        level: interviews.level,
        type: interviews.type,
        difficulty: interviews.difficulty,
        description: interviews.description,
        techstack: interviews.techstack,
      })
      .from(interviews)
      .where(inArray(interviews.id, interviewIds));

    const interviewDetailsMap = new Map(
      interviewDetails.map((interview) => [interview.id, interview])
    );

    const upcomingInterviews = scheduledResult.map((scheduled) => {
      const interviewData = interviewDetailsMap.get(scheduled.interviewId!)!;
      return {
        scheduledAt: scheduled.scheduledAt!,
        ...interviewData,
      };
    });

    return {
      success: true,
      upcomingInterviews,
      totalCounts: totalCountResult[0].count,
    };
  } catch (error: unknown) {
    console.error("Error getting upcoming interviews:", error);
    return { success: false, message: error };
  }
};

export const getAttendedInterviews = async (
  page = 1,
  offset = 12
): Promise<ReturnAttendedInterviews | CatchReturn> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw "User not found";

    const whereCondition = eq(feedback.userId, user.id);

    const [feedbackResult, totalCountResult] = await Promise.all([
      db
        .select()
        .from(feedback)
        .where(whereCondition)
        .orderBy(desc(feedback.createdAt))
        .limit(offset)
        .offset((page - 1) * offset),
      db.select({ count: count() }).from(feedback).where(whereCondition),
    ]);

    if (feedbackResult.length === 0) {
      return { success: true, attendedInterviews: [], totalCounts: 0 };
    }

    // Get interview details for all feedback entries
    const interviewIds = feedbackResult.map((f) => f.interviewId!);
    const interviewDetails = await db
      .select()
      .from(interviews)
      .where(inArray(interviews.id, interviewIds));

    // Create a map for O(1) lookup
    const interviewDetailsMap = new Map(
      interviewDetails.map((interview) => [interview.id, interview])
    );

    const attendedInterviewsData = feedbackResult.map((feedbackItem) => {
      const interviewData = interviewDetailsMap.get(feedbackItem.interviewId!);

      if (!interviewData) {
        throw new Error(
          `Interview details not found for ID: ${feedbackItem.interviewId}`
        );
      }

      return {
        id: feedbackItem.interviewId!,
        attendedAt: feedbackItem.createdAt,
        score: feedbackItem.totalScore!,
        feedback: feedbackItem.interviewId!, // Adjust based on your needs
        role: interviewData.role,
        type: interviewData.type,
        level: interviewData.level,
        difficulty: interviewData.difficulty,
        techStack: interviewData.techstack,
        description: interviewData.description,
        questionCount: interviewData.questionCount,
      };
    });

    return {
      success: true,
      attendedInterviews: attendedInterviewsData,
      totalCounts: totalCountResult[0].count,
    };
  } catch (error: unknown) {
    console.error("Error getting attended interviews:", error);
    return { success: false, message: error };
  }
};

export const getInterviewsWithQuery = async ({
  query,
  sortType = "rating",
  interviewType = "all",
  page = 1,
  offset = 12,
}: InterviewSearchParams): Promise<ReturnInterviewSearch | CatchReturn> => {
  try {
    const searchTerm = query.trim().toLowerCase();

    const tsQueryTerm =
      searchTerm
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter((term) => term.length > 0)
        .map((term) => `${term}:*`)
        .join(" & ") || "simple:*";

    const skip = (page - 1) * offset;

    const baseConditions =
      interviewType === "all"
        ? eq(interviews.isDeleted, false)
        : and(
            eq(interviews.isDeleted, false),
            eq(interviews.type, interviewType)
          );

    const searchConditions = [
      sql`(
        lower(${interviews.role}) LIKE ${"%" + searchTerm + "%"} OR
        EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(${
            interviews.techstack
          }) AS tech
          WHERE lower(tech) LIKE ${"%" + searchTerm + "%"}
        ) OR
        setweight(to_tsvector('english', ${interviews.role}), 'A') || 
        setweight(to_tsvector('english', (
          SELECT string_agg(tech, ' ')
          FROM jsonb_array_elements_text(${interviews.techstack}) AS tech
        )), 'B') @@ to_tsquery('english', ${tsQueryTerm})
      )`,
    ];

    const searchQuery = and(baseConditions, ...searchConditions);

    const sortColumn =
      sortType === "rating"
        ? sql`${interviews.rating}.average DESC`
        : sortType === "attendees"
        ? sql`${interviews.attendees} DESC`
        : sortType === "questions"
        ? sql`${interviews.questionCount} DESC`
        : sql`${interviews.rating}.average DESC`;

    // Rank expression
    const tsRank = sql`ts_rank(
      setweight(to_tsvector('english', ${interviews.role}), 'A') || 
      setweight(to_tsvector('english', (
        SELECT string_agg(tech, ' ')
        FROM jsonb_array_elements_text(${interviews.techstack}) AS tech
      )), 'B'),
      to_tsquery('english', ${tsQueryTerm})
    )`;

    const [searchResults, totalCountResult] = await Promise.all([
      db
        .selectDistinct({
          id: interviews.id,
          role: interviews.role,
          techstack: interviews.techstack,
          type: interviews.type,
          rating: interviews.rating,
          isDeleted: interviews.isDeleted,
          description: interviews.description,
          questions: interviews.questions,
          questionCount: interviews.questionCount,
          averageScore: interviews.averageScore,
          createdAt: interviews.createdAt,
          difficulty: interviews.difficulty,
          attendees: interviews.attendees,
          level: interviews.level,
          ts_rank: tsRank,
        })
        .from(interviews)
        .where(searchQuery)
        .orderBy(sql`"ts_rank" DESC`, sortColumn)
        .limit(offset)
        .offset(skip),
      db.select({ count: count() }).from(interviews).where(searchQuery),
    ]);

    return {
      success: true,
      interviews: searchResults,
      totalCount: totalCountResult[0].count,
      hasNextPage: page < Math.ceil(totalCountResult[0].count / offset),
    };
  } catch (error: unknown) {
    console.error("Error fetching interviews:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export const scheduleInterview = async (scheduleDetails: ScheduleDetails) => {
  try {
    const { interviewId, role, date, time, timezone } = scheduleDetails;
    const user = await getCurrentUser();
    if (!user) throw "Please log in to schedule interviews";

    const scheduledDateTime = dayjs(
      `${date} ${time}`,
      "YYYY-MM-DD HH:mm"
    ).toDate();

    await db.insert(scheduledInterviews).values({
      interviewId,
      userId: user.id,
      email: user.email,
      role,
      scheduledAt: scheduledDateTime,
      timezone,
    });

    return { success: true };
  } catch (error: unknown) {
    console.error(error, "error occurred while scheduling interview");
    return { success: false, error: typeof error === "string" ? error : null };
  }
};

export const getInterviewRecommendations = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) throw "User not found";
    const recommendations = await runBigQueryQuery(
      getRecommendationsQuery(user.id)
    );
    return { success: true, recommendations };
  } catch (error: unknown) {
    console.error(error, "error occured while getting recommendations");
    return { success: false };
  }
};

export const generateInterviewQuestions = async (
  interviewDetails: Partial<CreateInterviewFormType> & { amount: number }
) => {
  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${interviewDetails.role}.
        The job experience level is ${interviewDetails.level}.
        The tech stack used in the job is: ${interviewDetails.techstack}.
        The focus between behavioural and technical questions should lean towards: ${interviewDetails.type}.
        The difficulty of questions must be ${interviewDetails.difficulty},
        The amount of questions required is: ${interviewDetails.amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant and follow this description ${interviewDetails.description}.
        Return the questions formatted like this and following ***MUST BE*** the only response type:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    return { success: true, questions: JSON.parse(questions) as string[] };
  } catch (err: unknown) {
    console.error(err, "error occured while generating questions");
    return { success: false };
  }
};

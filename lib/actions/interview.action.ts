"use server";

import { CreateInterviewFormType } from "@/validators";
import { getCurrentUser } from "./auth.action";
import { runBigQueryQuery } from "../bigQuery";
import { getRecommendationsQuery } from "@/constants/queries";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/drizzle";
import { eq, and, inArray, desc, asc, count, sql } from "drizzle-orm";
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

    const whereCondition = and(
      eq(interviews.publishedBy, user.id),
      eq(interviews.isDeleted, false)
    );

    const [totalCountResult, publishedInterviewsResult] = await Promise.all([
      db.select({ count: count() }).from(interviews).where(whereCondition),
      db
        .select({
          id: interviews.id,
          difficulty: interviews.difficulty,
          createdAt: interviews.createdAt,
          questions: interviews.questions,
          questionCount: interviews.questionCount,
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

    return {
      success: true,
      publishedInterviews: publishedInterviewsResult,
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

    const todayEpoch = dayjs().unix();
    const whereCondition = and(
      eq(scheduledInterviews.userId, user.id),
      sql`extract(epoch from (${scheduledInterviews.scheduledAt} AT TIME ZONE ${scheduledInterviews.timezone})) > ${todayEpoch}`
    );

    const [upcomingInterviewsResult, totalCountResult] = await Promise.all([
      db
        .select({
          scheduledAt: sql<string>`${scheduledInterviews.scheduledAt}::text`,
          timezone: scheduledInterviews.timezone,
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
        .from(scheduledInterviews)
        .innerJoin(
          interviews,
          eq(scheduledInterviews.interviewId, interviews.id)
        )
        .where(whereCondition)
        .orderBy(asc(scheduledInterviews.scheduledAt))
        .limit(offset)
        .offset((page - 1) * offset),

      db
        .select({ count: count() })
        .from(scheduledInterviews)
        .where(whereCondition),
    ]);

    if (upcomingInterviewsResult.length === 0) {
      return { success: true, upcomingInterviews: [], totalCounts: 0 };
    }

    return {
      success: true,
      upcomingInterviews: upcomingInterviewsResult,
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

    const interviewIds = feedbackResult.map((f) => f.interviewId!);
    const interviewDetails = await db
      .select()
      .from(interviews)
      .where(inArray(interviews.id, interviewIds));

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
        feedback: feedbackItem.interviewId!,
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

    const tsRank = sql`ts_rank(
      setweight(to_tsvector('english', ${interviews.role}), 'A') || 
      setweight(to_tsvector('english', (
        SELECT string_agg(tech, ' ')
        FROM jsonb_array_elements_text(${interviews.techstack}) AS tech
      )), 'B'),
      to_tsquery('english', ${tsQueryTerm})
    )`;

    const sortColumn =
      sortType === "rating"
        ? sql`CAST(${interviews.rating} ->> 'average' AS FLOAT) DESC`
        : sortType === "attendees"
        ? desc(interviews.attendees)
        : sortType === "questions"
        ? desc(interviews.questionCount)
        : sql`CAST(${interviews.rating} ->> 'average' AS FLOAT) DESC`;

    const [searchResults, totalCountResult] = await Promise.all([
      db
        .selectDistinct({
          id: interviews.id,
          role: interviews.role,
          techstack: interviews.techstack,
          type: interviews.type,
          rating: interviews.rating,
          avg_rating: sql`CAST(${interviews.rating} ->> 'average' AS FLOAT)`.as(
            "avg_rating"
          ),
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
        .orderBy(
          sortType === "rating" ||
            sortType === "attendees" ||
            sortType === "questions"
            ? sortColumn
            : sql`ts_rank DESC`,
          sortType === "rating" ||
            sortType === "attendees" ||
            sortType === "questions"
            ? sql`ts_rank DESC`
            : sortColumn
        )
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
    const { interviewId, date, time, timezone } = scheduleDetails;
    const user = await getCurrentUser();
    if (!user) throw "Please log in to schedule interviews";

    const scheduledDateTime = dayjs(
      `${date} ${time}`,
      "YYYY-MM-DD HH:mm"
    ).toDate();

    await db.insert(scheduledInterviews).values({
      interviewId,
      userId: user.id,
      scheduledAt: scheduledDateTime,
      timezone,
    });

    return { success: true };
  } catch (error: unknown) {
    console.error(error, "error occurred while scheduling interview");
    return { success: false, error: typeof error === "string" ? error : null };
  }
};

export const getInterviewRecommendations = async (): Promise<
  { success: true; recommendations: Interview[] } | CatchReturn
> => {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: true, recommendations: [] };
    const recommendations = (await runBigQueryQuery(
      getRecommendationsQuery(user.id)
    )) as BigQueryRecommendation;

    const recommendedInterviews = await db
      .select()
      .from(interviews)
      .where(
        inArray(
          interviews.id,
          recommendations.map((r) => r.item_id)
        )
      );

    return { success: true, recommendations: recommendedInterviews };
  } catch (error: unknown) {
    console.error(error, "error occured while getting recommendations");
    return { success: false, message: "Failed to get recommendations" };
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

"use server";

import { CreateInterviewFormType } from "@/schema";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "./auth.action";
import {
  CatchReturn,
  InterviewDetailsData,
  InterviewSearchParams,
  ReturnAttendedInterviews,
  ReturnInterviewSearch,
  ReturnPublishedInterviews,
  ReturnUpcomingInterviews,
  ScheduleDetails,
  ScheduledInterview,
  ScheduledInterviewData,
} from "./type";
import { FieldValue } from "firebase-admin/firestore";
import { runBigQueryQuery } from "../bigQuery";
import { getRecommendationsQuery } from "@/constants/queries";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const createInterview = async (
  interviewDetails: CreateInterviewFormType
) => {
  try {
    console.log(interviewDetails, "interview details");
    const user = await getCurrentUser();
    if (!user) throw "User not found";

    const additionalValues = {
      userId: user.id,
      rating: {
        count: 0,
        average: 0,
      },
      averageScore: 0,
      attendees: 0,
      createdAt: new Date().getTime(),
      questionCount: interviewDetails.questions.length,
      isDeleted: false,
    };

    const interview = {
      ...interviewDetails,
      ...additionalValues,
      questions: interviewDetails.questions.map((question) => question.value),
      techstack: interviewDetails.techstack.split(","),
    };

    await db.runTransaction(async (transaction) => {
      const interviewRef = db.collection("interviews").doc();
      transaction.set(interviewRef, interview);

      const userStatsQuery = await db
        .collection("userstats")
        .where("userId", "==", user.id)
        .limit(1)
        .get();

      if (!userStatsQuery.empty) {
        const docRef = userStatsQuery.docs[0].ref;
        transaction.update(docRef, {
          "published.totalPublished": FieldValue.increment(1),
        });
      }
    });

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

    const baseQuery = db
      .collection("interviews")
      .where("userId", "==", user.id);

    const [totalCountSnapshot, publishedInterviews] = await Promise.all([
      baseQuery.get(),
      baseQuery
        .select(
          "difficulty",
          "createdAt",
          "questions",
          "description",
          "techstack",
          "attendees",
          "averageScore",
          "type",
          "level"
        )
        .offset((page - 1) * offset)
        .limit(offset)
        .get(),
    ]);

    const interviewsData: PublishedInterview[] = publishedInterviews.docs.map(
      (doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<PublishedInterview, "id">),
        totalQuestions: doc.data().questions.length,
      })
    );

    return {
      success: true,
      publishedInterviews: interviewsData,
      totalCounts: totalCountSnapshot.size,
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

    const dateFilter = Date.now();
    const baseQuery = db
      .collection("scheduledInterviews")
      .orderBy("scheduledAt", "asc")
      .where("userId", "==", user.id)
      .where("scheduledAt", ">", dateFilter);

    const [scheduledInterviewsSnapshot, totalCountSnapshot] = await Promise.all(
      [
        baseQuery
          .offset((page - 1) * offset)
          .limit(offset)
          .get(),
        baseQuery.get(),
      ]
    );

    if (scheduledInterviewsSnapshot.empty) {
      return { success: true, upcomingInterviews: [], totalCounts: 0 };
    }

    const scheduledInterviews: ScheduledInterview[] =
      scheduledInterviewsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as ScheduledInterviewData),
      }));

    const interviewIds = scheduledInterviews.map(
      (scheduled) => scheduled.interviewId
    );
    const interviewDetailsMap = await fetchInterviewDetails(interviewIds);

    const upcomingInterviews: UpcomingInterview[] = scheduledInterviews.map(
      (scheduled) => {
        const interviewData = interviewDetailsMap.get(scheduled.interviewId)!;
        return {
          id: scheduled.interviewId,
          scheduledAt: scheduled.scheduledAt,
          role: interviewData.role,
          questionCount: interviewData.questionCount,
          attendees: interviewData.attendees,
          averageScore: interviewData.averageScore,
          createdAt: interviewData.createdAt,
          level: interviewData.level,
          type: interviewData.type,
          difficulty: interviewData.difficulty,
          description: interviewData.description,
          techstack: interviewData.techstack,
        };
      }
    );

    return {
      success: true,
      upcomingInterviews,
      totalCounts: totalCountSnapshot.size,
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

    const baseQuery = db.collection("feedback").where("userId", "==", user.id);

    const [feedbackSnapshot, totalCountSnapshot] = await Promise.all([
      baseQuery
        .orderBy("createdAt", "desc")
        .offset((page - 1) * offset)
        .limit(offset)
        .get(),
      baseQuery.get(),
    ]);

    if (feedbackSnapshot.empty) {
      return { success: true, attendedInterviews: [], totalCounts: 0 };
    }

    const feedbacks: Feedback[] = feedbackSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Feedback, "id">),
    }));

    const interviewIds = feedbacks.map((feedback) => feedback.interviewId);
    const interviewDetailsMap = await fetchAttendedInterviewDetails(
      interviewIds
    );

    const attendedInterviewsData: AttendedInterview[] = feedbacks.map(
      (feedback) => {
        const interviewData = interviewDetailsMap.get(feedback.interviewId);

        if (!interviewData) {
          throw new Error(
            `Interview details not found for ID: ${feedback.interviewId}`
          );
        }

        return {
          id: feedback.interviewId,
          attendedAt: feedback.createdAt,
          score: feedback.totalScore,
          feedback: feedback.id,
          role: interviewData.role,
          type: interviewData.type,
          level: interviewData.level,
          difficulty: interviewData.difficulty,
          techStack: interviewData.techstack,
          description: interviewData.description,
          questionCount: interviewData.questionCount,
        };
      }
    );

    return {
      success: true,
      attendedInterviews: attendedInterviewsData,
      totalCounts: totalCountSnapshot.size,
    };
  } catch (error: unknown) {
    console.error("Error getting attended interviews:", error);
    return { success: false, message: error };
  }
};

const fetchInterviewDetails = async (
  interviewIds: string[]
): Promise<Map<string, InterviewDetailsData>> => {
  const interviewDetailsMap = new Map();

  if (interviewIds.length <= 10) {
    const snapshot = await db
      .collection("interviews")
      .where("__name__", "in", interviewIds)
      .select(
        "role",
        "questions",
        "attendees",
        "averageScore",
        "createdAt",
        "type",
        "level",
        "difficulty",
        "questionCount",
        "description",
        "techstack"
      )
      .get();

    snapshot.docs.forEach((doc) => {
      const data = doc.data()!;
      interviewDetailsMap.set(doc.id, {
        role: data.role,
        questionCount: data.questionCount,
        attendees: data.attendees,
        averageScore: data.averageScore,
        createdAt: data.createdAt,
        level: data.level,
        type: data.type,
        difficulty: data.difficulty,
        description: data.description,
        techstack: data.techstack,
      });
    });
  } else {
    const snapshots = await Promise.all(
      interviewIds.map((id) => db.collection("interviews").doc(id).get())
    );

    snapshots.forEach((doc, index) => {
      if (doc.exists) {
        const data = doc.data()!;
        interviewDetailsMap.set(interviewIds[index], {
          role: data.role,
          questionCount: data.questionCount,
          attendees: data.attendees,
          averageScore: data.averageScore,
          createdAt: data.createdAt,
          level: data.level,
          type: data.type,
          difficulty: data.difficulty,
          description: data.description,
          techstack: data.techstack,
        });
      }
    });
  }

  return interviewDetailsMap;
};

const fetchAttendedInterviewDetails = async (
  interviewIds: string[]
): Promise<Map<string, Interview>> => {
  if (interviewIds.length === 0) return new Map();

  const interviewDetailsMap = new Map<string, Interview>();

  const batches = [];
  for (let i = 0; i < interviewIds.length; i += 10) {
    batches.push(interviewIds.slice(i, i + 10));
  }

  const interviewPromises = batches.map((batch) =>
    db.collection("interviews").where("__name__", "in", batch).get()
  );

  const interviewSnapshots = await Promise.all(interviewPromises);

  interviewSnapshots.forEach((snapshot) => {
    snapshot.docs.forEach((doc) => {
      interviewDetailsMap.set(doc.id, {
        id: doc.id,
        ...(doc.data() as Omit<Interview, "id">),
      });
    });
  });

  return interviewDetailsMap;
};

const sortInterviews = (
  interviews: Interview[],
  sortType: string
): Interview[] => {
  const sorted = [...interviews];

  switch (sortType) {
    case "rating":
      return sorted.sort(
        (a, b) => (b.rating?.average || 0) - (a.rating?.average || 0)
      );

    case "attendees":
      return sorted.sort((a, b) => (b.attendees || 0) - (a.attendees || 0));

    case "questions":
      return sorted.sort((a, b) => {
        const aCount = a.questionCount || a.questions?.length || 0;
        const bCount = b.questionCount || b.questions?.length || 0;
        return bCount - aCount;
      });

    default:
      return sorted.sort((a, b) => {
        const aTime = new Date(a.createdAt) || new Date(0);
        const bTime = new Date(b.createdAt) || new Date(0);
        return bTime.getTime() - aTime.getTime();
      });
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
    const skip = (page - 1) * offset;
    const searchTerms =
      query
        ?.toLowerCase()
        .trim()
        .split(/\s+/)
        .filter((term) => term.length > 0) || [];
    const hasSearchQuery = searchTerms.length > 0;

    const buildBaseQuery = () => {
      let baseQuery = db
        .collection("interviews")
        .where("isDeleted", "==", false);

      if (interviewType !== "all") {
        baseQuery = baseQuery.where("type", "==", interviewType);
      }

      return baseQuery;
    };

    let interviews: Interview[] = [];
    let totalCount: number = 0;

    if (hasSearchQuery) {
      const allDocsQuery = buildBaseQuery();
      const allDocsSnapshot = await allDocsQuery.get();

      const allInterviews: Interview[] = allDocsSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Interview)
      );

      const filteredInterviews = allInterviews.filter(
        (interview: Interview) => {
          const searchableText = [
            interview.role || "",
            ...(interview.techstack || []),
          ]
            .map((text) => text.toLowerCase())
            .join(" ");

          return searchTerms.every((term) => searchableText.includes(term));
        }
      );

      const sortedInterviews = sortInterviews(filteredInterviews, sortType);
      totalCount = sortedInterviews.length;
      interviews = sortedInterviews.slice(skip, skip + offset);
    } else {
      let interviewsQuery = buildBaseQuery();

      switch (sortType) {
        case "rating":
          interviewsQuery = interviewsQuery.orderBy("rating.average", "desc");
          break;
        case "attendees":
          interviewsQuery = interviewsQuery.orderBy("attendees", "desc");
          break;
        case "questions":
          interviewsQuery = interviewsQuery.orderBy("questionCount", "desc");
          break;
        default:
          interviewsQuery = interviewsQuery.orderBy("createdAt", "desc");
      }

      const interviewsSnapshot = await interviewsQuery
        .offset(skip)
        .limit(offset)
        .get();

      interviews = interviewsSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Interview)
      );

      if (
        sortType === "questions" &&
        interviews.some((i) => !i.questionCount)
      ) {
        interviews = sortInterviews(interviews, sortType);
      }

      const totalCountSnapshot = await buildBaseQuery().get();
      totalCount = totalCountSnapshot.size;
    }

    const totalPages = Math.ceil(totalCount / offset);

    return {
      success: true,
      interviews,
      totalCount,
      hasNextPage: page < totalPages,
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

    const epochTime = new Date(`${date}T${time}:00`).getTime();
    const scheduledRef = db.collection("scheduledInterviews").doc();

    await scheduledRef.set({
      interviewId,
      userId: user.id,
      email: user.email,
      role,
      scheduledAt: epochTime,
      createdAt: Date.now(),
      timezone,
    });

    return { success: true };
  } catch (error: unknown) {
    console.error(error, "error occured while scheduling interview");
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

"use server";

import { CreateInterviewFormType } from "@/schema";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "./auth.action";
import {
  AttendedInterviewData,
  AttendedInterviewDetailsData,
  AttendedInterviewDoc,
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

    const baseQuery = db
      .collection("attendedInterviews")
      .where("userId", "==", user.id);

    const [attendedInterviewsSnapshot, totalCountSnapshot] = await Promise.all([
      baseQuery
        .orderBy("attendedAt", "desc")
        .offset((page - 1) * offset)
        .limit(offset)
        .get(),
      baseQuery.get(),
    ]);

    if (attendedInterviewsSnapshot.empty) {
      return { success: true, attendedInterviews: [], totalCounts: 0 };
    }

    const attendedInterviews: AttendedInterviewDoc[] =
      attendedInterviewsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as AttendedInterviewData),
      }));

    const interviewIds = attendedInterviews.map(
      (attended) => attended.interviewId
    );
    const interviewDetailsMap = await fetchAttendedInterviewDetails(
      interviewIds
    );

    const attendedInterviewsData: AttendedInterview[] = attendedInterviews.map(
      (attended) => {
        const interviewData = interviewDetailsMap.get(attended.interviewId)!;
        return {
          id: attended.interviewId,
          attendedAt: attended.attendedAt,
          score: attended.score,
          feedback: attended.feedback,
          role: interviewData.role,
          type: interviewData.type,
          level: interviewData.level,
          difficulty: interviewData.difficulty,
          techStack: interviewData.techStack,
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
): Promise<Map<string, AttendedInterviewDetailsData>> => {
  const interviewDetailsMap = new Map();

  if (interviewIds.length <= 10) {
    const snapshot = await db
      .collection("interviews")
      .where("__name__", "in", interviewIds)
      .select("type", "role", "techStack", "level", "difficulty")
      .get();

    snapshot.docs.forEach((doc) => {
      const data = doc.data()!;
      interviewDetailsMap.set(doc.id, {
        type: data.type,
        level: data.level,
        role: data.role,
        difficulty: data.difficulty,
        techStack: data.techStack,
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
          type: data.type,
          level: data.level,
          role: data.role,
          difficulty: data.difficulty,
          techStack: data.techStack,
        });
      }
    });
  }

  return interviewDetailsMap;
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
    let interviewsQuery = db
      .collection("interviews")
      .where("isDeleted", "==", false);

    if (interviewType !== "all")
      interviewsQuery = interviewsQuery.where("type", "==", interviewType);

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

    let interviews: Interview[] = interviewsSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Interview)
    );

    if (query && query.trim() !== "") {
      const searchQuery = query.toLowerCase().trim();
      interviews = interviews.filter((interview: Interview) => {
        const roleMatch = interview.role.toLowerCase().includes(searchQuery);
        const techstackMatch =
          interview.techstack &&
          interview.techstack.some((tech: string) =>
            tech.toLowerCase().includes(searchQuery)
          );
        return roleMatch || techstackMatch;
      });
    }

    if (sortType === "questions") {
      interviews.sort(
        (a: Interview, b: Interview) => b.questions.length - a.questions.length
      );
    }

    const totalCountQuery = db
      .collection("interviews")
      .where("type", "==", interviewType)
      .where("isDeleted", "==", false);

    const totalSnapshot = await totalCountQuery.get();
    let totalCount: number = totalSnapshot.size;

    if (query && query.trim() !== "") {
      const searchQuery = query.toLowerCase().trim();
      const allDocs = totalSnapshot.docs.map((doc) => doc.data() as Interview);
      totalCount = allDocs.filter((interview: Interview) => {
        const roleMatch = interview.role.toLowerCase().includes(searchQuery);
        const techstackMatch =
          interview.techstack &&
          interview.techstack.some((tech: string) =>
            tech.toLowerCase().includes(searchQuery)
          );
        return roleMatch || techstackMatch;
      }).length;
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
      message: "",
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

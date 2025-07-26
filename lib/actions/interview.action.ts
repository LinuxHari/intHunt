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

    const totalCountSnapshot = await baseQuery.get();
    const totalCounts = totalCountSnapshot.size;

    const publishedInterviews = await baseQuery
      .select(
        "difficulty",
        "createdAt",
        "questions",
        "description",
        "techstack",
        "attendees",
        "averageScore",
        "type",
        "level",
        "difficulty"
      )
      .offset((page - 1) * offset)
      .limit(offset)
      .get();

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
      totalCounts,
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

    const scheduledInterviewsSnapshot = await db
      .collection("scheduledInterviews")
      .where("userId", "==", user.id)
      .where("scheduledAt", ">", new Date().toISOString())
      .orderBy("scheduledAt", "asc")
      .offset((page - 1) * offset)
      .limit(offset)
      .get();

    if (scheduledInterviewsSnapshot.empty) {
      return { success: true, upcomingInterviews: [], totalCounts: 0 };
    }

    const scheduledInterviews: ScheduledInterview[] =
      scheduledInterviewsSnapshot.docs.map((doc) => {
        const data = doc.data() as ScheduledInterviewData;
        return {
          id: doc.id,
          ...data,
        };
      });

    const interviewIds = scheduledInterviews.map(
      (scheduled) => scheduled.interviewId
    );

    const interviewDetailsMap = new Map<string, InterviewDetailsData>();

    if (interviewIds.length <= 10) {
      const interviewDetailsSnapshot = await db
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
          "difficulty"
        )
        .get();

      interviewDetailsSnapshot.docs.forEach((doc) => {
        const data = doc.data() as InterviewDetailsData;
        interviewDetailsMap.set(doc.id, data);
      });
    } else {
      const interviewDetailsPromises = interviewIds.map((id) =>
        db.collection("interviews").doc(id).get()
      );

      const interviewDetailsSnapshots = await Promise.all(
        interviewDetailsPromises
      );

      interviewDetailsSnapshots.forEach((doc, index) => {
        if (doc.exists) {
          const data = doc.data();
          if (data) {
            const interviewData: InterviewDetailsData = {
              role: data.role || "Unknown",
              questions: data.questions || 0,
              attendees: data.attendees || 0,
              averageScore: data.averageScore || 0,
              createdAt: data.createdAt || "",
              level: data.level,
              type: data.type,
              difficulty: data.difficulty,
              questionCount: data.questionCount,
              description: data.description,
              techstack: data.techstack,
            };
            interviewDetailsMap.set(interviewIds[index], interviewData);
          }
        }
      });
    }

    const upcomingInterviews: UpcomingInterview[] = scheduledInterviews.map(
      (scheduled) => {
        const interviewData = interviewDetailsMap.get(scheduled.interviewId);

        return {
          id: scheduled.interviewId,
          role: interviewData?.role || "Unknown",
          questionCount: interviewData?.questionCount || 0,
          attendees: interviewData?.attendees || 0,
          averageScore: interviewData?.averageScore || 0,
          createdAt: interviewData?.createdAt || "",
          scheduledAt: scheduled.scheduledAt,
          level: interviewData?.level || "junior",
          type: interviewData?.type || "technical",
          difficulty: interviewData?.difficulty || "easy",
          description: interviewData?.description || "",
          techstack: interviewData?.techstack || [],
        };
      }
    );

    const totalCountSnapshot = await db
      .collection("scheduledInterviews")
      .where("userId", "==", user.id)
      .where("scheduledAt", ">", new Date().toISOString())
      .get();

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

    const attendedInterviewsSnapshot = await db
      .collection("attendedInterviews")
      .where("userId", "==", user.id)
      .orderBy("attendedAt", "desc")
      .offset((page - 1) * offset)
      .limit(offset)
      .get();

    if (attendedInterviewsSnapshot.empty) {
      return { success: true, attendedInterviews: [], totalCounts: 0 };
    }

    const attendedInterviews: AttendedInterviewDoc[] =
      attendedInterviewsSnapshot.docs.map((doc) => {
        const data = doc.data() as AttendedInterviewData;
        return {
          id: doc.id,
          ...data,
        };
      });

    const interviewIds = attendedInterviews.map(
      (attended) => attended.interviewId
    );

    const interviewDetailsMap = new Map<string, AttendedInterviewDetailsData>();

    if (interviewIds.length <= 10) {
      const interviewDetailsSnapshot = await db
        .collection("interviews")
        .where("__name__", "in", interviewIds)
        .select("type", "role", "techStack")
        .get();

      interviewDetailsSnapshot.docs.forEach((doc) => {
        const data = doc.data() as AttendedInterviewDetailsData;
        interviewDetailsMap.set(doc.id, data);
      });
    } else {
      const interviewDetailsPromises = interviewIds.map((id) =>
        db.collection("interviews").doc(id).get()
      );

      const interviewDetailsSnapshots = await Promise.all(
        interviewDetailsPromises
      );

      interviewDetailsSnapshots.forEach((doc, index) => {
        if (doc.exists) {
          const data = doc.data();
          if (data) {
            const interviewData: AttendedInterviewDetailsData = {
              type: data.type || "technical",
              level: data.level,
              role: data.role || "Unknown",
              difficulty: data.difficulty,
              techStack: data.techStack || [],
            };
            interviewDetailsMap.set(interviewIds[index], interviewData);
          }
        }
      });
    }

    const attendedInterviewsData: AttendedInterview[] = attendedInterviews.map(
      (attended) => {
        const interviewData = interviewDetailsMap.get(attended.interviewId);

        return {
          id: attended.interviewId,
          role: interviewData?.role || "Unknown",
          type: interviewData?.type || "technical",
          attendedAt: attended.attendedAt,
          score: attended.score,
          feedback: attended.feedback,
          techStack: interviewData?.techStack || [],
          level: interviewData?.level || "junior",
          difficulty: interviewData?.difficulty || "easy",
        };
      }
    );

    const totalCountSnapshot = await db
      .collection("attendedInterviews")
      .where("userId", "==", user.id)
      .get();

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
      message: error,
    };
  }
};

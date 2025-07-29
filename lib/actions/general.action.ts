"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export const manageInterviewCompletion = async (
  params: CreateFeedbackParams
) => {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });
    const feedbackRef = feedbackId
      ? db.collection("feedback").doc(feedbackId)
      : db.collection("feedback").doc();
    await db.runTransaction(async (transaction) => {
      const feedback = {
        interviewId,
        userId,
        totalScore: object.totalScore,
        categoryScores: object.categoryScores,
        strengths: object.strengths,
        areasForImprovement: object.areasForImprovement,
        finalAssessment: object.finalAssessment,
        createdAt: new Date().toISOString(),
      };

      transaction.set(feedbackRef, feedback);

      const interviewQuerySnapshot = await transaction.get(
        db.collection("interviews").where("userId", "==", userId)
      );

      if (interviewQuerySnapshot.empty) {
        throw new Error("Interview document not found for this user");
      }

      const interviewDoc = interviewQuerySnapshot.docs[0];
      const interviewRef = interviewDoc.ref;
      const interviewData = interviewDoc.data();

      const oldCount = interviewData.attendeesCount || 0;
      const oldTotalScore = (interviewData.averageScore || 0) * oldCount;

      const newCount = oldCount + 1;
      const newAverageScore = (oldTotalScore + object.totalScore) / newCount;

      transaction.update(interviewRef, {
        attendeesCount: newCount,
        averageScore: newAverageScore,
      });
    });

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
};

export const getInterviewById = async (
  id: string
): Promise<Interview | null> => {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
};

export const getFeedbackByInterviewId = async (
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> => {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
};

export const getLatestInterviews = async (
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> => {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
};

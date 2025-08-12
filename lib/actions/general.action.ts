"use server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { feedbackSchema } from "@/validators";
import { db } from "@/drizzle";
import { interviews, feedback } from "../schema";
import { eq, and } from "drizzle-orm";

export const manageInterviewCompletion = async (
  params: InterviewCompletionParams
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

    await db.transaction(async (tx) => {
      const feedbackData = {
        interviewId,
        userId,
        totalScore: object.totalScore,
        categoryScores: object.categoryScores,
        strengths: object.strengths,
        areasForImprovement: object.areasForImprovement,
        finalAssessment: object.finalAssessment,
      };

      if (feedbackId) {
        await tx
          .update(feedback)
          .set(feedbackData)
          .where(eq(feedback.interviewId, feedbackId));
      } else {
        await tx.insert(feedback).values(feedbackData);
      }

      const interview = await tx
        .select()
        .from(interviews)
        .where(eq(interviews.id, interviewId))
        .limit(1);

      if (interview.length === 0) {
        throw new Error("Interview document not found");
      }

      const interviewData = interview[0];
      const oldCount = interviewData.attendees || 0;
      const oldTotalScore = (interviewData.averageScore || 0) * oldCount;
      const newCount = oldCount + 1;
      const newAverageScore = Math.round(
        (oldTotalScore + object.totalScore) / newCount
      );

      await tx
        .update(interviews)
        .set({
          attendees: newCount,
          averageScore: newAverageScore,
        })
        .where(eq(interviews.id, interviewId));
    });

    return { success: true, feedbackId: feedbackId || "generated" };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
};

export const getInterviewById = async (
  id: string
): Promise<Interview | null> => {
  try {
    const interview = await db
      .select()
      .from(interviews)
      .where(eq(interviews.id, id))
      .limit(1);

    return interview.length > 0 ? (interview[0] as Interview) : null;
  } catch (error) {
    console.error("Error getting interview by ID:", error);
    return null;
  }
};

export const getFeedbackByInterviewId = async (
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> => {
  try {
    const { interviewId, userId } = params;

    const feedbackResult = await db
      .select()
      .from(feedback)
      .where(
        and(eq(feedback.interviewId, interviewId), eq(feedback.userId, userId))
      )
      .limit(1);

    return feedbackResult.length > 0 ? (feedbackResult[0] as Feedback) : null;
  } catch (error) {
    console.error("Error getting feedback by interview ID:", error);
    return null;
  }
};

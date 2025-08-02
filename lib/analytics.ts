import { sendGAEvent } from "@next/third-parties/google";

const getInterviewEventParams = (interview: Interview) => {
  return {
    interview_id: interview.id,
    interview_role: interview.role,
    interview_level: interview.level,
    interview_type: interview.type,
    interview_difficulty: interview.difficulty,
    interview_techstack: interview.techstack.join(", "),

    interview_question_count: interview.questionCount,
    interview_average_rating: interview.rating?.average,
    interview_rating_count: interview.rating?.count,
    interview_average_score: interview.averageScore,
    interview_attendees: interview.attendees,
  };
};

export const searchAnalytics = (searchTerm: string) => {
  sendGAEvent("event", "interview_search", {
    search_term: searchTerm,
    debug_mode: true,
  });
  console.log("Attempting to send interview_search event:", searchTerm);
};

export const clickAnalytics = (interview: Interview, userId: string) => {
  sendGAEvent("event", "interview_clicked", {
    ...getInterviewEventParams(interview),
    user_id_internal: userId,
    debug_mode: true,
  });
  console.log(
    "Attempting to send interview_clicked event for interview:",
    interview.id
  );
};

export const completedAnalytics = (interview: Interview, userId: string) => {
  sendGAEvent("event", "interview_completed", {
    ...getInterviewEventParams(interview),
    user_id_internal: userId,
    debug_mode: true,
  });
  console.log(
    "Attempting to send interview_completed event for interview:",
    interview.id
  );
};

export const scheduleAnalytics = (interview: Interview, userId: string) => {
  sendGAEvent("event", "interview_scheduled", {
    ...getInterviewEventParams(interview),
    user_id_internal: userId,
    debug_mode: true,
  });
  console.log(
    "Attempting to send interview_scheduled event for interview:",
    interview.id
  );
};

import { sendGAEvent } from "@next/third-parties/google";
import { useCallback } from "react";

const useAnalytics = () => {
  const memoizedSearchAnalytics = useCallback((searchTerm: string) => {
    sendGAEvent({
      event: "interview_search",
      searchTerm,
    });
  }, []);

  const memoizedClickedAnalytics = useCallback(
    (interview: Interview, userId: string) => {
      sendGAEvent({
        event: "interview_clicked",
        interview: {
          id: interview.id,
          techstack: interview.techstack,
          role: interview.role,
          level: interview.level,
          type: interview.type,
          attendees: interview.attendees,
          rating: interview.rating,
        },
        user: userId,
      });
    },
    []
  );

  const memoizedCompletedAnalytics = useCallback((interview: Interview) => {
    sendGAEvent({
      event: "interview_completed",
      interview: {
        id: interview.id,
        techstack: interview.techstack,
        role: interview.role,
        level: interview.level,
        type: interview.type,
        attendees: interview.attendees,
        rating: interview.rating,
      },
    });
  }, []);

  return {
    searchAnalytics: memoizedSearchAnalytics,
    clickAnalytics: memoizedClickedAnalytics,
    completedAnalytics: memoizedCompletedAnalytics,
  };
};

export default useAnalytics;

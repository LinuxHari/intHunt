import { clickAnalytics, scheduleAnalytics } from "@/lib/analytics";
import { useState } from "react";

const useScheduleInterview = (user: User | null) => {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  );

  const handleClick = (interview: Interview) => {
    if (user?.id) {
      clickAnalytics(interview, user.id);
    }
  };

  const handleSchedule = (interview: Interview) => {
    setSelectedInterview(interview);
    setScheduleModalOpen(true);
    if (user?.id) scheduleAnalytics(interview, user.id);
  };

  return {
    scheduleModalOpen,
    selectedInterview,
    setScheduleModalOpen,
    handleClick,
    handleSchedule,
  };
};

export default useScheduleInterview;

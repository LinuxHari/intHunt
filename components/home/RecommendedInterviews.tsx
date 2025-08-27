"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import InterviewCard from "../interviews/InterviewCard";
import ScheduleModal from "../interview/schedule/ScheduleModal";
import { useState } from "react";
import { clickAnalytics, scheduleAnalytics } from "@/lib/analytics";

interface RecommendedInterviewsProps {
  recommendations: Interview[];
  user: User | null;
}

const RecommendedInterviews = ({
  recommendations,
  user,
}: RecommendedInterviewsProps) => {
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

  return (
    <>
      <Swiper
        modules={[Navigation]}
        slidesPerView={3}
        spaceBetween={16}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
      >
        {recommendations.map((interview) => (
          <SwiperSlide key={interview.id} className="min-h-full py-5">
            <InterviewCard
              interview={interview}
              onSelect={handleClick}
              onSchedule={handleSchedule}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {selectedInterview && (
        <ScheduleModal
          open={scheduleModalOpen}
          onOpenChange={setScheduleModalOpen}
          interview={selectedInterview}
        />
      )}
    </>
  );
};

export default RecommendedInterviews;

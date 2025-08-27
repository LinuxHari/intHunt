"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import InterviewCard from "../interviews/InterviewCard";
import ScheduleModal from "../interview/schedule/ScheduleModal";
import useScheduleInterview from "@/hooks/useScheduleInterview";

interface RecommendedInterviewsProps {
  recommendations: Interview[];
  user: User | null;
}

const RecommendedInterviews = ({
  recommendations,
  user,
}: RecommendedInterviewsProps) => {
  const {
    selectedInterview,
    setScheduleModalOpen,
    handleClick,
    handleSchedule,
    scheduleModalOpen,
  } = useScheduleInterview(user);
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
          isAuthenticated={Boolean(user)}
        />
      )}
    </>
  );
};

export default RecommendedInterviews;

"use client";

import { use, useState, useTransition } from "react";
import LoadMore from "@/components/shared/LoadMore";
import AttendedInterview from "./AttendedInterview";
import AllCaughtup from "@/components/shared/AllCaughtup";
import { getAttendedInterviews } from "@/lib/actions/interview.action";
import { PER_PAGE } from "@/constants";
import { toast } from "sonner";

interface AttendedInterviewsListProps {
  attendedInterviews: Promise<ReturnAttendedInterviews | CatchReturn>;
}

const AttendedInterviewsList = ({
  attendedInterviews,
}: AttendedInterviewsListProps) => {
  const interviews = use(attendedInterviews);
  const [initialInterviews, totalInterviews] = interviews.success
    ? [interviews.attendedInterviews, interviews.totalCounts]
    : [[], 0];
  const [interviewsList, setInterviewsList] = useState(initialInterviews);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const hasMore = interviewsList.length < totalInterviews;

  const loadMore = () => {
    startTransition(async () => {
      const interviews = await getAttendedInterviews(page + 1, PER_PAGE);
      if (interviews.success) {
        setInterviewsList((prev) => [
          ...prev,
          ...interviews.attendedInterviews,
        ]);
        setPage((prev) => prev + 1);
      } else {
        toast.error("Failed to load interviews");
      }
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviewsList.map((interview) => (
          <AttendedInterview key={interview.id} interview={interview} />
        ))}
        {hasMore && <LoadMore loading={isPending} onClick={loadMore} />}
      </div>
      {!hasMore && <AllCaughtup />}
    </>
  );
};

export default AttendedInterviewsList;

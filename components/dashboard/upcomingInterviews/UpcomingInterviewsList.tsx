"use client";

import AllCaughtup from "@/components/shared/AllCaughtup";
import LoadMore from "@/components/shared/LoadMore";
import React, { use, useState, useTransition } from "react";
import UpcomingInterviewCard from "./UpcomingInterviewCard";
import { toast } from "sonner";
import { getUpcomingInterviews } from "@/lib/actions/interview.action";
import { PER_PAGE } from "@/constants";

interface UpcomingInterviewsListProps {
  upcomingInterviews: Promise<ReturnUpcomingInterviews | CatchReturn>;
}

const UpcomingInterviewsList = ({
  upcomingInterviews,
}: UpcomingInterviewsListProps) => {
  const interviews = use(upcomingInterviews);

  const [initialInterviews, totalInterviews] = interviews.success
    ? [interviews.upcomingInterviews, interviews.totalCounts]
    : [[], 0];
  const [interviewsList, setInterviewsList] =
    useState<Array<UpcomingInterview>>(initialInterviews);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const hasMore = interviewsList.length < totalInterviews;

  const loadMore = () => {
    startTransition(async () => {
      const interviews = await getUpcomingInterviews(page + 1, PER_PAGE);
      if (interviews.success) {
        setInterviewsList((prev) => [
          ...prev,
          ...interviews.upcomingInterviews,
        ]);
        setPage((prev) => prev + 1);
      } else {
        toast.error("Failed to load interviews");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviewsList.map((interview) => (
          <UpcomingInterviewCard key={interview.id} interview={interview} />
        ))}
      </div>

      {hasMore && <LoadMore loading={isPending} onClick={loadMore} />}

      {!hasMore && <AllCaughtup />}
    </div>
  );
};

export default UpcomingInterviewsList;

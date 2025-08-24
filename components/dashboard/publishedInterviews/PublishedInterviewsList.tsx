"use client";

import { use, useState, useTransition } from "react";
import InterviewCard from "./PublishedInterviewCard";
import AllCaughtup from "@/components/shared/AllCaughtup";
import LoadMore from "@/components/shared/LoadMore";
import { PER_PAGE } from "@/constants";
import { getPublishedInterviews } from "@/lib/actions/interview.action";
import { toast } from "sonner";

interface InterviewsListProps {
  publishedInterviews: Promise<ReturnPublishedInterviews | CatchReturn>;
}

const PublishedInterviewsList = ({
  publishedInterviews,
}: InterviewsListProps) => {
  const interviews = use(publishedInterviews);

  const [initialInterviews, totalInterviews] = interviews.success
    ? [interviews.publishedInterviews, interviews.totalCounts]
    : [[], 0];
  const [interviewsList, setInterviewsList] =
    useState<PublishedInterview[]>(initialInterviews);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const hasMore = interviewsList.length < totalInterviews;

  const loadMore = () => {
    startTransition(async () => {
      const interviews = await getPublishedInterviews(page + 1, PER_PAGE);
      if (interviews.success) {
        setInterviewsList((prev) => [
          ...prev,
          ...interviews.publishedInterviews,
        ]);
        setPage((prev) => prev + 1);
      } else {
        toast.error("Failed to load interviews");
      }
    });
  };

  const handleDelete = (interviewId: string) => {
    console.log("Delete interview:", interviewId);
    // Show confirmation dialog and delete
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviewsList.map((interview) => (
          <InterviewCard
            key={interview.id}
            interview={interview}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {hasMore && <LoadMore loading={isPending} onClick={loadMore} />}

      {!hasMore && <AllCaughtup />}
    </div>
  );
};

export default PublishedInterviewsList;

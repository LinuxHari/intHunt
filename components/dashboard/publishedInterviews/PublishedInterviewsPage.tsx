import InterviewsList from "@/components/dashboard/publishedInterviews/PublishedInterviewsList";
import InterviewsHeader from "@/components/dashboard/publishedInterviews/PublishedInterviewsHeader";
import InterviewsStats from "@/components/dashboard/publishedInterviews/PublishedInterviewCardStats";
import { Suspense } from "react";
import { InterviewCardsLoading, StatsCardLoading } from "../Loader";

interface PublishedInterviewsPageProps {
  publishedStats: Promise<ReturnPublished | CatchReturn>;
  publishedInterviews: Promise<ReturnPublishedInterviews | CatchReturn>;
}

const PublishedInterviewsPage = ({
  publishedStats,
  publishedInterviews,
}: PublishedInterviewsPageProps) => {
  return (
    <div className="space-y-8">
      <InterviewsHeader />
      <Suspense fallback={<StatsCardLoading />}>
        <InterviewsStats publishedStats={publishedStats} />
      </Suspense>
      <Suspense fallback={<InterviewCardsLoading />}>
        <InterviewsList publishedInterviews={publishedInterviews} />
      </Suspense>
    </div>
  );
};

export default PublishedInterviewsPage;

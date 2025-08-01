import InterviewsList from "@/components/dashboard/publishedInterviews/PublishedInterviewsList";
import InterviewsHeader from "@/components/dashboard/publishedInterviews/PublishedInterviewsHeader";
import InterviewsStats from "@/components/dashboard/publishedInterviews/PublishedInterviewCardStats";
import {
  CatchReturn,
  ReturnPublished,
  ReturnPublishedInterviews,
} from "@/lib/actions/type";
import { Suspense } from "react";

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
      <Suspense fallback="Loading...">
        <InterviewsStats publishedStats={publishedStats} />
      </Suspense>
      <Suspense fallback="Loading...">
        <InterviewsList publishedInterviews={publishedInterviews} />
      </Suspense>
    </div>
  );
};

export default PublishedInterviewsPage;

import PublishedInterviewsPage from "@/components/dashboard/publishedInterviews/PublishedInterviewsPage";
import { getPublishedInterviews } from "@/lib/actions/interview.action";
import { getPublishedStats } from "@/lib/actions/user.action";

export const dynamic = "force-dynamic";

const PublishedInterviews = async () => {
  const publishedStats = getPublishedStats();
  const publishedInterviews = getPublishedInterviews();

  return (
    <PublishedInterviewsPage
      publishedStats={publishedStats}
      publishedInterviews={publishedInterviews}
    />
  );
};

export default PublishedInterviews;

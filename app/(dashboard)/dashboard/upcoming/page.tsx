import UpcomingInterviewsPage from "@/components/dashboard/upcomingInterviews/UpcomingInterviewsPage";
import { getUpcomingInterviews } from "@/lib/actions/interview.action";
// import { getUpcomingStats } from "@/lib/actions/user.action";

const UpcomingInterviews = async () => {
  // const upcomingInterviewsStats = getUpcomingStats();
  const upcomingInterviews = getUpcomingInterviews();

  return (
    <UpcomingInterviewsPage
      upcomingInterviews={upcomingInterviews}
      // upcomingInterviewsStats={upcomingInterviewsStats}
    />
  );
};

export default UpcomingInterviews;

import AnalyticsPage from "@/components/dashboard/analytics/AnalyticsPage";
import { getUserAnalytics, getUserRecents } from "@/lib/actions/user.action";

export const dynamic = "force-dynamic";

const Analytics = async () => {
  const analytics = getUserAnalytics();
  const recents = getUserRecents();

  return <AnalyticsPage analytics={analytics} recents={recents} />;
};

export default Analytics;

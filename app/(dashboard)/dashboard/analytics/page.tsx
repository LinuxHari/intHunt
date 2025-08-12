import AnalyticsPage from "@/components/dashboard/analytics/AnalyticsPage";
// import { getUserAnalytics } from "@/lib/actions/user.action";

export const dynamic = "force-dynamic";

const Analytics = async () => {
  // const analytics = getUserAnalytics();

  // return <AnalyticsPage analytics={analytics} />;
  return <AnalyticsPage />;
};

export default Analytics;

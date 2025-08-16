"use client";

import ChartSection from "@/components/dashboard/analytics/ChartSection";
import RecentPerformance from "@/components/dashboard/analytics/RecentPerformance";
import StatsCards from "@/components/dashboard/analytics/StatsCards";
import TimeFilter from "@/components/dashboard/analytics/TimeFilter";
import {
  CatchReturn,
  Duration,
  ReturnUserAnalytics,
  ReturnUserRecents,
} from "@/lib/actions/type";
import { use, useEffect, useRef, useState, useTransition } from "react";
import { getUserAnalytics } from "@/lib/actions/user.action";
import { AnalyticsLoader } from "./Loader";

interface AnalyticsPageProps {
  analytics: Promise<ReturnUserAnalytics | CatchReturn>;
  recents: Promise<ReturnUserRecents | CatchReturn>;
}

const AnalyticsPage = ({ analytics, recents }: AnalyticsPageProps) => {
  const [timeFilter, setTimeFilter] = useState<Duration>("week");

  const analyticsData = use(analytics);
  const initialAnalytics = analyticsData.success
    ? analyticsData.analytics
    : { currentPeriod: [], previousPeriod: [] };

  const [userAnalytics, setUserAnalytics] =
    useState<ReturnUserAnalytics["analytics"]>(initialAnalytics);
  const durationFilters = ["week", "month", "year"] as const;

  const [isPending, startTransition] = useTransition();

  const renderRef = useRef(false);

  const currentData = userAnalytics
    ? userAnalytics.currentPeriod.map((data) => ({
        name: data.period,
        interviews: data.totalAttendedInterviews,
        score: data.averageScore,
      }))
    : [];

  useEffect(() => {
    const getAnalytics = () => {
      startTransition(async () => {
        const analytics = await getUserAnalytics(timeFilter);
        if (analytics.success) setUserAnalytics(analytics.analytics);
      });
    };

    if (renderRef.current) {
      console.log("Fetching analytics for:", timeFilter);
      getAnalytics();
    } else {
      renderRef.current = true;
    }
  }, [timeFilter]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your interview performance and progress
          </p>
        </div>

        <TimeFilter
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          durationFilters={durationFilters}
        />
      </div>

      {isPending ? (
        <>
          <AnalyticsLoader />
        </>
      ) : (
        <>
          <StatsCards analytics={userAnalytics} timeFilter={timeFilter} />

          <ChartSection data={currentData} />
        </>
      )}

      <RecentPerformance recents={recents} />
    </div>
  );
};

export default AnalyticsPage;

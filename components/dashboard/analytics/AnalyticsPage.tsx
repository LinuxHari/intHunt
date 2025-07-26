"use client";

import ChartSection from "@/components/dashboard/analytics/ChartSection";
import RecentPerformance from "@/components/dashboard/analytics/RecentPerformance";
import StatsCards from "@/components/dashboard/analytics/StatsCards";
import TimeFilter from "@/components/dashboard/analytics/TimeFilter";
import { CatchReturn, ReturnUserAnalytics } from "@/lib/actions/type";
import { Suspense, useState } from "react";

interface AnalyticsPageProps {
  analytics: Promise<ReturnUserAnalytics | CatchReturn>;
}

const AnalyticsPage = ({ analytics }: AnalyticsPageProps) => {
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year">(
    "week"
  );
  const durationFilters = ["week", "month", "year"] as const;
  const analyticsData = {
    week: [
      { name: "Mon", interviews: 4, score: 85 },
      { name: "Tue", interviews: 3, score: 78 },
      { name: "Wed", interviews: 6, score: 92 },
      { name: "Thu", interviews: 2, score: 88 },
      { name: "Fri", interviews: 5, score: 79 },
      { name: "Sat", interviews: 1, score: 95 },
      { name: "Sun", interviews: 3, score: 82 },
    ],
    month: [
      { name: "Week 1", interviews: 24, score: 85 },
      { name: "Week 2", interviews: 18, score: 78 },
      { name: "Week 3", interviews: 32, score: 92 },
      { name: "Week 4", interviews: 28, score: 88 },
    ],
    year: [
      { name: "Jan", interviews: 45, score: 85 },
      { name: "Feb", interviews: 52, score: 78 },
      { name: "Mar", interviews: 48, score: 92 },
      { name: "Apr", interviews: 61, score: 88 },
      { name: "May", interviews: 55, score: 79 },
      { name: "Jun", interviews: 67, score: 95 },
    ],
  };

  const currentData = analyticsData[timeFilter];

  return (
    <div className="space-y-8">
      {/* Header */}
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

      <Suspense fallback="Loading...">
        <StatsCards analytics={analytics} timeFilter={timeFilter} />
      </Suspense>

      <ChartSection data={currentData} />

      <RecentPerformance />
    </div>
  );
};

export default AnalyticsPage;

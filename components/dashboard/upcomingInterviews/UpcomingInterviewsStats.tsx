import React, { use } from "react";
import StatCard from "./StatCard";
import { CatchReturn, ReturnUpcoming } from "@/lib/actions/type";
import { Calendar, Clock, Play } from "lucide-react";

interface UpcomingInterviewsStatsProps {
  upcomingInterviewsStats: Promise<ReturnUpcoming | CatchReturn>;
}

const UpcomingInterviewsStats = ({
  upcomingInterviewsStats,
}: UpcomingInterviewsStatsProps) => {
  const stats = use(upcomingInterviewsStats);

  if (!stats.success) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={Calendar}
        value={stats.upcomingStats.totalScheduled}
        label="Total Scheduled"
        bgColor="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
      />
      <StatCard
        icon={Clock}
        value={stats.upcomingStats.dueToday}
        label="Due Today"
        bgColor="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
      />
      <StatCard
        icon={Play}
        value={stats.upcomingStats.averageQuestions}
        label="Avg Duration"
        bgColor="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
      />
    </div>
  );
};

export default UpcomingInterviewsStats;

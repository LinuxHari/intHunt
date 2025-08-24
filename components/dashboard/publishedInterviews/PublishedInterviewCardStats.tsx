import { use } from "react";
import { Calendar, Eye, Edit } from "lucide-react";
import StatCard from "./StatsCard";

interface InterviewsStatsProps {
  publishedStats: Promise<ReturnPublished | CatchReturn>;
}

const InterviewsStats = ({ publishedStats }: InterviewsStatsProps) => {
  const stats = use(publishedStats);

  if (!stats.success) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={<Calendar className="h-6 w-6" />}
        value={stats.publishedStats.totalPublished}
        label="Total Published"
        bgColor="bg-blue-100 dark:bg-blue-900"
        iconColor="text-primary dark:text-blue-400"
      />
      <StatCard
        icon={<Eye className="h-6 w-6" />}
        value={stats.publishedStats.totalAttendees}
        label="Total Takers"
        bgColor="bg-green-100 dark:bg-green-900"
        iconColor="text-green-600 dark:text-green-400"
      />
      <StatCard
        icon={<Edit className="h-6 w-6" />}
        value={stats.publishedStats.active}
        label="Active"
        bgColor="bg-purple-100 dark:bg-purple-900"
        iconColor="text-purple-600 dark:text-purple-400"
      />
      {/* <StatCard
        icon={<Calendar className="h-6 w-6" />}
        value={draftCount}
        label="Drafts"
        bgColor="bg-yellow-100 dark:bg-yellow-900"
        iconColor="text-yellow-600 dark:text-yellow-400"
      /> */}
    </div>
  );
};

export default InterviewsStats;

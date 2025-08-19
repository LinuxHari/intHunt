import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReturnUserAnalytics } from "@/lib/actions/type";
import { getAnalytics } from "@/lib/utils";

interface StatsCardsProps {
  analytics: ReturnUserAnalytics["analytics"] | null;
  timeFilter: "week" | "month" | "year";
}

const StatsCards = ({ analytics, timeFilter }: StatsCardsProps) => {
  if (!analytics) return null;

  const statsData = getAnalytics(analytics);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stat.value}
              {stat.suffix}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {stat.change} from last {timeFilter}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;

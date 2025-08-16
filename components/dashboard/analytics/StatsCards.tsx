import { TrendingUp, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReturnUserAnalytics } from "@/lib/actions/type";

interface StatsCardsProps {
  analytics: ReturnUserAnalytics["analytics"] | null;
  timeFilter: "week" | "month" | "year";
}

const StatsCards = ({ analytics, timeFilter }: StatsCardsProps) => {
  if (!analytics) return null;

  const sumReducer = (
    arr: typeof analytics.currentPeriod,
    key: keyof (typeof arr)[number]
  ) => arr.reduce((total, item) => total + (Number(item[key]) || 0), 0);

  const avgReducer = (
    arr: typeof analytics.currentPeriod,
    key: keyof (typeof arr)[number]
  ) => {
    if (!arr.length) return 0;
    return sumReducer(arr, key) / arr.length;
  };

  const totalInterviewsCurr = sumReducer(
    analytics.currentPeriod,
    "totalAttendedInterviews"
  );
  const avgScoreCurr = avgReducer(analytics.currentPeriod, "averageScore");
  const avgQuestionsCurr = avgReducer(
    analytics.currentPeriod,
    "averageQuestions"
  );

  const totalInterviewsPrev = sumReducer(
    analytics.previousPeriod,
    "totalAttendedInterviews"
  );
  const avgScorePrev = avgReducer(analytics.previousPeriod, "averageScore");
  const avgQuestionsPrev = avgReducer(
    analytics.previousPeriod,
    "averageQuestions"
  );

  const calcChange = (curr: number, prev: number, isPercent = true) => {
    if (prev === 0) return curr > 0 ? "+100%" : "0%";
    const change = ((curr - prev) / prev) * 100;
    return `${change >= 0 ? "+" : ""}${
      isPercent ? change.toFixed(1) + "%" : change.toFixed(1)
    }`;
  };

  const statsData = [
    {
      title: "Total Interviews",
      value: totalInterviewsCurr,
      icon: Users,
      change: calcChange(totalInterviewsCurr, totalInterviewsPrev),
      suffix: "",
    },
    {
      title: "Average Score",
      value: avgScoreCurr.toFixed(1),
      icon: TrendingUp,
      change: calcChange(avgScoreCurr, avgScorePrev),
      suffix: "%",
    },
    {
      title: "Avg Questions",
      value: avgQuestionsCurr,
      icon: Clock,
      change: calcChange(avgQuestionsCurr, avgQuestionsPrev),
      suffix: "",
    },
  ];

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

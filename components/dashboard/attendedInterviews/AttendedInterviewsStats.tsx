import { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CatchReturn, ReturnAttended } from "@/lib/actions/type";
import { Calendar, Star, Clock } from "lucide-react";

interface AttendedStatsProps {
  attendedStats: Promise<ReturnAttended | CatchReturn>;
}

const AttendedInterviewsStats = ({ attendedStats }: AttendedStatsProps) => {
  const stats = use(attendedStats);

  if (!stats.success) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.attendedStats.completed}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Total Completed
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.attendedStats.averageScore}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Average Score
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.attendedStats.averageQuestions}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Average Questions
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendedInterviewsStats;

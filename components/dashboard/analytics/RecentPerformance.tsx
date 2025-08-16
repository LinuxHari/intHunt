import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CatchReturn, ReturnUserRecents } from "@/lib/actions/type";
import { Users } from "lucide-react";
import { use } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface RecentPerformanceProps {
  recents: Promise<ReturnUserRecents | CatchReturn>;
}

const RecentPerformance = ({ recents }: RecentPerformanceProps) => {
  const recentPerformance = use(recents);

  if (!recentPerformance.success || !recentPerformance.recents.length)
    return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPerformance.recents.map((interview, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-primary dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                    {interview.role}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {dayjs(interview.attendedAt).fromNow()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <Badge variant="secondary" className="text-xs">
                  {interview.type}
                </Badge>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {interview.score}%
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Score
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentPerformance;

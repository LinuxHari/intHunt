import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";

interface ProfileStatsProps {
  profileStats: ReturnProfile;
}

const ProfileStats = ({ profileStats }: ProfileStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-slate-400">
            Interviews Taken
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {profileStats.profileStats.interviewsTaken}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-slate-400">
            Interviews Created
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {profileStats.profileStats.interviewsCreated}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-slate-400">
            Average Score
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {profileStats.profileStats.averageScore}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-slate-400">
            Member Since
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {dayjs(profileStats.profileStats.memberSince).format("MMM DD YYYY")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStats;

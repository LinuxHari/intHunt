import { Mail, Briefcase } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReturnProfile } from "@/lib/actions/type";
import dayjs from "dayjs";

interface ProfileStatsProps {
  profileStats: ReturnProfile;
}

const ProfileStats = ({ profileStats }: ProfileStatsProps) => {
  return (
    <div className="space-y-6">
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
              {dayjs(profileStats.profileStats.memberSince).format(
                "MMM DD YYYY"
              )}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">
            <Mail className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button
            variant="outline"
            className="w-full text-red-600 hover:text-red-700"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Deactivate Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileStats;

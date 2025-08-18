import DisplayTechIcons from "@/components/shared/DisplayTechIcons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getScoreColor } from "@/lib/utils";
import dayjs from "dayjs";
import { Calendar, Star } from "lucide-react";
import InterviewBadges from "../publishedInterviews/InterviewBadges";

interface AttendedInterviewProps {
  interview: AttendedInterview;
}

const AttendedInterview = ({ interview }: AttendedInterviewProps) => {
  const formattedDate = dayjs(interview.attendedAt).format("MMM D, YYYY");

  return (
    <Card
      key={interview.id}
      className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-default"
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white capitalize">
                {interview.role}
              </h3>
              <InterviewBadges
                type={interview.type}
                level={interview.level}
                difficulty={interview.difficulty}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span
                className={cn("font-medium", getScoreColor(interview.score))}
              >
                {interview.score}%
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {interview.feedback}
          </p>

          <DisplayTechIcons techStack={interview.techStack} />

          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendedInterview;

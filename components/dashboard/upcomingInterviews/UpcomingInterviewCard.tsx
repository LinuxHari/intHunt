import { Calendar, Notebook, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTimeUntil } from "@/lib/utils";
import InterviewBadges from "../publishedInterviews/InterviewBadges";
import Link from "next/link";
import DisplayTechIcons from "@/components/shared/DisplayTechIcons";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const UpcomingInterviewCard = ({
  interview,
}: {
  interview: UpcomingInterview;
}) => {
  const timeUntil = getTimeUntil(interview.scheduledAt);
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-default">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white capitalize">
                {interview.role}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <InterviewBadges
                  difficulty={interview.difficulty}
                  level={interview.level}
                  type={interview.type}
                />
                <Badge className="text-xs py-1 px-2 text-nowrap leading-tight capitalize bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800">
                  {timeUntil}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {dayjs
                  .utc(interview.scheduledAt)
                  .tz(interview.timezone.toLowerCase())
                  .tz(userTimezone)
                  .format("MMM D, YYYY hh:mm A")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Notebook className="h-4 w-4" />
              <span>{interview.questionCount} questions</span>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {interview.description}
          </p>

          <DisplayTechIcons techStack={interview.techstack} />

          <Link href={`/interview/${interview.id}`}>
            <Button className="w-full">
              <Play className="h-4 w-4 mr-1" />
              Start Interview
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingInterviewCard;

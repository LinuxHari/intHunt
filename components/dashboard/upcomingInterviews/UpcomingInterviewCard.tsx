import dayjs from "dayjs";
import { Calendar, Notebook, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTimeUntil } from "@/lib/utils";
import InterviewBadges from "../publishedInterviews/InterviewBadges";
import Link from "next/link";

const UpcomingInterviewCard = ({
  interview,
}: {
  interview: UpcomingInterview;
}) => {
  const formattedDate = dayjs(interview.scheduledAt).format(
    "MMM D, YYYY hh:mm A"
  );
  const timeUntil = getTimeUntil(interview.scheduledAt);

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
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
                <Badge className="text-xs py-1 px-2 leading-tight capitalize bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800">
                  {timeUntil}
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Notebook className="h-4 w-4" />
              <span>{interview.questionCount} questions</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {interview.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1">
            {interview.techstack.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>

          {/* Action */}
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

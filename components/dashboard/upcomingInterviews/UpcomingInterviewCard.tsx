import dayjs from "dayjs";
import { Calendar, Notebook, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getTimeUntil, getTypeConfig } from "@/lib/utils";

const UpcomingInterviewCard = ({
  interview,
}: {
  interview: UpcomingInterview;
}) => {
  const typeConfig = getTypeConfig(interview.type);
  const formattedDate = dayjs(interview.scheduledAt).format("MMM D, YYYY");
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
                <Badge className={cn("text-xs", typeConfig.color)}>
                  {interview.type}
                </Badge>
                <Badge className="text-xs bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800">
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
          <Button className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Start Interview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingInterviewCard;

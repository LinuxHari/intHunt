import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import InterviewBadges from "@/components/dashboard/publishedInterviews/InterviewBadges";

interface ScheduleInterviewDetailsProps {
  interview: Interview;
}

const ScheduleInterviewDetails = ({
  interview,
}: ScheduleInterviewDetailsProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{interview.role}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <InterviewBadges
            difficulty={interview.difficulty}
            type={interview.type}
            level={interview.level}
          />
          <Badge variant="outline">
            <Calendar className="h-3 w-3 mr-1" />
            {interview.questions.length} Questions
          </Badge>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {interview.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default ScheduleInterviewDetails;

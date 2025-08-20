import { Edit, Trash2, Eye } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DisplayTechIcons from "@/components/shared/DisplayTechIcons";
import InterviewBadges from "./InterviewBadges";
import InterviewStats from "./PublishedInterviewsStats";
import Link from "next/link";

interface InterviewCardProps {
  interview: PublishedInterview;
  onDelete: (id: string) => void;
}

const PublishedInterviewCard = ({
  interview,
  onDelete,
}: InterviewCardProps) => {
  const formattedDate = dayjs(interview.createdAt).format("MMM D, YYYY");

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-200 overflow-hidden hover:scale-105 cursor-default">
      <CardHeader className="flex flex-row items-start justify-between p-6 pb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg capitalize text-slate-900 dark:text-white">
            {interview.role}
          </h3>
          <InterviewBadges
            difficulty={interview.difficulty}
            type={interview.type}
            level={interview.level}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(interview.id)}
          aria-label="Delete Interview"
        >
          <Trash2 className="h-5 w-5 text-red-500 hover:text-red-600 transition-colors" />
        </Button>
      </CardHeader>

      <CardContent className="flex-grow p-6 pt-0 space-y-6">
        <InterviewStats
          questionsCount={interview.questionCount}
          takersCount={interview.attendees}
          avgScore={interview.averageScore}
          createdDate={formattedDate}
        />
        {interview.techstack && interview.techstack.length > 0 && (
          <DisplayTechIcons techStack={interview.techstack} />
        )}
      </CardContent>
      <div className="grid grid-cols-2 w-full">
        <Link
          href={`/interview/${interview.id}`}
          className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Eye className="h-4 w-4" />
          <span>View</span>
        </Link>
        <Link
          href={`${interview.id}/edit`}
          className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </Link>
      </div>
    </Card>
  );
};

export default PublishedInterviewCard;

import { Play, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DisplayTechIcons from "@/components/shared/DisplayTechIcons";
import InterviewCardStats from "./interviewCardStats";
import InterviewBadges from "../dashboard/publishedInterviews/InterviewBadges";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrowseInterviewCardProps {
  interview: Interview;
  onSchedule: (interview: Interview) => void;
  onSelect: (interview: Interview) => void;
  scale?: "large" | "small";
}

const InterviewCard = ({
  interview,
  onSchedule,
  onSelect,
  scale = "large",
}: BrowseInterviewCardProps) => {
  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-all duration-200 cursor-default",
        scale === "large" ? "hover:scale-105" : "hover:scale-[1.02] mx-1"
      )}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
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

          <InterviewCardStats
            rating={interview.rating}
            attendees={interview.attendees}
            questions={interview.questionCount}
          />

          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {interview.description}
          </p>

          <DisplayTechIcons techStack={interview.techstack} />

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onSchedule(interview)}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Link
              href={`/interview/${interview.id}`}
              onClick={() => onSelect(interview)}
              className="flex-1 w-full"
            >
              <Button className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Attend Now
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewCard;

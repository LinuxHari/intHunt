import dayjs from "dayjs";
import Link from "next/link";
import {
  Calendar,
  Star,
  Clock,
  ArrowRight,
  Trophy,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DisplayTechIcons from "@/components/shared/DisplayTechIcons";

import { cn } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import InterviewBadges from "../dashboard/publishedInterviews/InterviewBadges";

interface InterviewCardProps {
  interviewId: string;
  userId?: string;
  role: string;
  type: Interview["type"];
  techstack: string[];
  createdAt: Date | string;
  difficulty: Interview["difficulty"];
  level: Interview["level"];
}

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  difficulty,
  level,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const isCompleted = !!feedback;

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white capitalize">
                  {role} Interview
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <InterviewBadges
                    type={type}
                    difficulty={difficulty}
                    level={level}
                  />
                  {isCompleted && (
                    <Badge className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                      <Trophy className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              {feedback?.totalScore ? (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span
                    className={cn(
                      "font-medium",
                      getScoreColor(feedback.totalScore)
                    )}
                  >
                    {feedback.totalScore}/100
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Not taken</span>
                </div>
              )}
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
              {feedback?.finalAssessment ||
                "Practice your skills with this comprehensive interview and get instant feedback."}
            </p>

            <div className="mb-4">
              <DisplayTechIcons techStack={techstack} />
            </div>

            <Button
              asChild
              className={cn(
                "w-full",
                isCompleted ? "bg-green-600 hover:bg-green-700 text-white" : ""
              )}
            >
              <Link
                href={
                  feedback
                    ? `/interview/${interviewId}/feedback`
                    : `/interview/${interviewId}`
                }
                className="flex items-center justify-center gap-2"
              >
                {isCompleted ? (
                  <>
                    <Trophy className="h-4 w-4" />
                    View Feedback
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4" />
                    Start Interview
                  </>
                )}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewCard;

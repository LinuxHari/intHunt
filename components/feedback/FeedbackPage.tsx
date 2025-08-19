import Link from "next/link";
import { ArrowLeft, TrendingUp, Calendar } from "lucide-react";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Performance from "./Performance";
import AssesmentImprovement from "./AssesmentImprovement";

interface FeedbackProps {
  interview: Interview;
  feedback: Feedback;
}

const FeedbackPage = ({ interview, feedback }: FeedbackProps) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Interview Feedback
              </h1>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2">
                <p className="text-slate-600 dark:text-slate-400 capitalize">
                  {interview.role} • {interview.type} Interview
                </p>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {feedback?.createdAt
                      ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Performance
            totalScore={feedback.totalScore}
            categoryScores={feedback.categoryScores}
          />
          <AssesmentImprovement
            finalAssessment={feedback.finalAssessment}
            areasForImprovement={feedback.areasForImprovement}
            strengths={feedback.strengths}
          />
          <Card className="shadow-none border-0">
            <CardContent className="p-6 flex justify-end">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  asChild
                  className="text-base bg-transparent p-5"
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </Button>

                <Button asChild className="text-base p-5">
                  <Link
                    href={`/interview/${interview.id}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Retake Interview
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;

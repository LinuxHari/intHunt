import Link from "next/link";
import { ArrowLeft, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Performance from "./Performance";
import AssesmentImprovement from "./AssesmentImprovement";
import FeedbackHeader from "./FeedbackHeader";

interface FeedbackProps {
  feedback: Feedback;
}

const FeedbackPage = ({ feedback }: FeedbackProps) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          <FeedbackHeader
            role={feedback.role}
            type={feedback.type}
            createdAt={feedback.createdAt}
          />
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
                    href={`/interview/${feedback.interviewId}`}
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

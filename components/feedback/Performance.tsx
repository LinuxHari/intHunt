import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, Award, BarChart3 } from "lucide-react";
import {
  cn,
  getScoreBackground,
  getScoreColor,
  getScoreLabel,
} from "@/lib/utils";

interface PerformanceProps {
  totalScore: number;
  categoryScores: Feedback["categoryScores"];
}

const Performance = ({ totalScore, categoryScores }: PerformanceProps) => {
  return (
    <>
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <div className="p-3 bg-blue-600 rounded-full">
              <Award className="h-6 w-6 text-white" />
            </div>
            Overall Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center space-y-4">
            <div className="relative">
              <div
                className={cn("text-7xl font-bold", getScoreColor(totalScore))}
              >
                {totalScore}
                <span className="text-3xl text-slate-400">/100</span>
              </div>
              <Badge
                className={cn(
                  "absolute top-2 right-0 text-sm px-3 py-1",
                  getScoreBackground(totalScore)
                )}
              >
                {getScoreLabel(totalScore)}
              </Badge>
            </div>
            <Progress value={totalScore} className="h-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <div className="p-3 bg-blue-600 rounded-full w-fit mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="font-bold text-lg text-slate-900 dark:text-white">
                Completed
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Interview finished successfully
              </div>
            </div>

            <div className="text-center p-6 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <div className="p-3 bg-blue-600 rounded-full w-fit mx-auto mb-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="font-bold text-lg text-slate-900 dark:text-white">
                Duration
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Interview session
              </div>
            </div>

            <div className="text-center p-6 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <div className="p-3 bg-blue-600 rounded-full w-fit mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="font-bold text-lg text-slate-900 dark:text-white">
                Categories
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {categoryScores?.length || 0} evaluated
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {categoryScores && categoryScores.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Performance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="grid lg:grid-cols-2 gap-5">
            {categoryScores.map((category, index) => (
              <div
                key={index}
                className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-lg text-slate-900 dark:text-white">
                    {index + 1}. {category.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-bold text-lg",
                        getScoreColor(category.score)
                      )}
                    >
                      {category.score}/100
                    </span>
                    <Badge
                      className={cn(
                        "text-xs",
                        getScoreBackground(category.score)
                      )}
                    >
                      {getScoreLabel(category.score)}
                    </Badge>
                  </div>
                </div>
                <Progress value={category.score} className="h-2" />
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {category.comment}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Performance;

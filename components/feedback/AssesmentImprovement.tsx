import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, CheckCircle, Target } from "lucide-react";

interface AssesmentImprovementProps {
  finalAssessment: string;
  strengths: Array<string>;
  areasForImprovement: Array<string>;
}

const AssesmentImprovement = ({
  finalAssessment,
  strengths,
  areasForImprovement,
}: AssesmentImprovementProps) => {
  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Star className="h-5 w-5 text-blue-600" />
            Detailed Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {finalAssessment}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {strengths.length > 0 && (
          <Card className="shadow-lg border-green-200 dark:border-green-800">
            <CardHeader className="bg-green-50 dark:bg-green-950/20">
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <div className="p-2 bg-green-600 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-slate-700 dark:text-slate-300"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="leading-relaxed">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {areasForImprovement.length > 0 && (
          <Card className="shadow-lg border-orange-200 dark:border-orange-800">
            <CardHeader className="bg-orange-50 dark:bg-orange-950/20">
              <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <Target className="h-4 w-4 text-white" />
                </div>
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {areasForImprovement.map((area, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-slate-700 dark:text-slate-300"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="leading-relaxed">{area}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default AssesmentImprovement;

import { Card, CardContent } from "@/components/ui/card";
import { InterviewCardsLoading } from "../dashboard/Loader";

const InterviewsLoading = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="flex-1 min-w-0">
                  <div className="w-80 h-10 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="w-40 h-10 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
                  <div className="w-40 h-10 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          <InterviewCardsLoading />

          <div className="flex justify-center">
            <div className="w-32 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewsLoading;

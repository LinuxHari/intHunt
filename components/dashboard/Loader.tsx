import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

const DashboardLoadingLayout = ({ children }: { children: ReactNode }) => {
  return <div className="space-y-8">{children}</div>;
};

export const InterviewCardsLoading = () => {
  return (
    <DashboardLoadingLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="w-32 h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    <div className="flex gap-2">
                      <div className="w-16 h-5 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                      <div className="w-20 h-5 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                      <div className="w-12 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    </div>
                  ))}
                </div>

                <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />

                <div className="flex gap-1 justify-center">
                  {[...Array(3)].map((_, k) => (
                    <div
                      key={k}
                      className="w-12 h-5 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"
                    />
                  ))}
                </div>

                <div className="w-full h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLoadingLayout>
  );
};

export const StatsCardLoading = () => {
  return (
    <DashboardLoadingLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  <div className="w-20 h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLoadingLayout>
  );
};

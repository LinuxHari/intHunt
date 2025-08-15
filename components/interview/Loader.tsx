import { Card, CardContent } from "@/components/ui/card";

const InterviewDetailLoading = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex flex-row gap-4 items-center">
                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                    <div className="space-y-2">
                      <div className="w-48 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                      <div className="w-64 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-16 h-5 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-20 h-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                  <div className="w-24 h-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row gap-10 items-center justify-between w-full">
                  <div className="flex-1 sm:basis-1/2 w-full h-[400px] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-7 flex flex-col items-center justify-center gap-4">
                    <div className="w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                    <div className="text-center space-y-2">
                      <div className="w-24 h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
                      <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
                    </div>
                  </div>

                  <div className="flex-1 sm:basis-1/2 w-full h-[400px] bg-slate-50 dark:bg-slate-800 rounded-lg p-7 flex flex-col items-center justify-center gap-4">
                    <div className="w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                    <div className="text-center space-y-2">
                      <div className="w-20 h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
                      <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-center">
                  <div className="w-24 h-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="w-40 h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse flex-shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                      <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailLoading;

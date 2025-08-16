export const AnalyticsLoader = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
          >
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
          <div className="h-[300px] space-y-4">
            <div className="flex justify-between items-end h-full pb-8">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="w-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"
                  style={{ height: `${Math.random() * 60 + 40}%` }}
                />
              ))}
            </div>
            {/* <div className="flex justify-between text-xs">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="h-3 w-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"
                />
              ))}
            </div> */}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="h-6 w-28 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
          <div className="h-[300px] space-y-4">
            <div className="h-full relative pb-8">
              <div className="h-full w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              {/* <div className="absolute bottom-8 left-0 right-0 flex justify-between">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                  />
                ))}
              </div> */}
            </div>
            {/* <div className="flex justify-between">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="h-3 w-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"
                />
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export const PerformanceLoader = () => {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
              <div className="text-right space-y-1">
                <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-3 w-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Loader = () => {
  return (
    <div className="space-y-8">
      <AnalyticsLoader />
      <PerformanceLoader />
    </div>
  );
};

export default Loader;

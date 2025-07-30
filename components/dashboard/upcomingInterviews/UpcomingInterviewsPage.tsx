import {
  CatchReturn,
  // ReturnUpcoming,
  ReturnUpcomingInterviews,
} from "@/lib/actions/type";
import UpcomingInterviewsList from "./UpcomingInterviewsList";
// import UpcomingInterviewsStats from "./UpcomingInterviewsStats";
import { Suspense } from "react";

interface UpcomingInterviewsPageProps {
  upcomingInterviews: Promise<ReturnUpcomingInterviews | CatchReturn>;
  // upcomingInterviewsStats: Promise<ReturnUpcoming | CatchReturn>;
}

const UpcomingInterviewsPage = ({
  upcomingInterviews,
}: // upcomingInterviewsStats,
UpcomingInterviewsPageProps) => {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Upcoming Interviews
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Prepare for your scheduled interviews
        </p>
      </div>
      {/* <Suspense fallback="Loading...">
        <UpcomingInterviewsStats
          upcomingInterviewsStats={upcomingInterviewsStats}
        />
      </Suspense> */}
      <Suspense fallback="Loading...">
        <UpcomingInterviewsList upcomingInterviews={upcomingInterviews} />
      </Suspense>
    </div>
  );
};

export default UpcomingInterviewsPage;

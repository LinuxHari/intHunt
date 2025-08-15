import AttendedStats from "@/components/dashboard/attendedInterviews/AttendedInterviewsStats";
import AttendedInterviewsList from "@/components/dashboard/attendedInterviews/AttendedInterviewsList";
import {
  CatchReturn,
  ReturnAttended,
  ReturnAttendedInterviews,
} from "@/lib/actions/type";
import { Suspense } from "react";
import { InterviewCardsLoading, StatsCardLoading } from "../Loader";

interface AttendedInterviewPage {
  attendedInterviews: Promise<ReturnAttendedInterviews | CatchReturn>;
  attendedStats: Promise<ReturnAttended | CatchReturn>;
}

const AttendedInterviewsPage = ({
  attendedInterviews,
  attendedStats,
}: AttendedInterviewPage) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Attended Interviews
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Review your completed interviews and performance
        </p>
      </div>
      <Suspense fallback={<StatsCardLoading />}>
        <AttendedStats attendedStats={attendedStats} />
      </Suspense>
      <Suspense fallback={<InterviewCardsLoading />}>
        <AttendedInterviewsList attendedInterviews={attendedInterviews} />
      </Suspense>
    </div>
  );
};

export default AttendedInterviewsPage;

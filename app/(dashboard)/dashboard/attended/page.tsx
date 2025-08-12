import AttendedInterviewsPage from "@/components/dashboard/attendedInterviews/AttendedInterviewsPage";
import { getAttendedInterviews } from "@/lib/actions/interview.action";
import { getAttendedStats } from "@/lib/actions/user.action";

export const dynamic = "force-dynamic";

const AttendedInterviews = async () => {
  const attendedInterviews = getAttendedInterviews();
  const attendedStats = getAttendedStats();

  return (
    <AttendedInterviewsPage
      attendedInterviews={attendedInterviews}
      attendedStats={attendedStats}
    />
  );
};

export default AttendedInterviews;

import { redirect } from "next/navigation";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import InterviewPage from "@/components/interview/InterviewPage";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const Interview = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);

  if (!interview) redirect("/");

  const feedback = user
    ? await getFeedbackByInterviewId({
        interviewId: id,
        userId: user.id,
      })
    : null;

  return (
    <InterviewPage user={user} interview={interview} feedback={feedback} />
  );
};

export default Interview;

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

  if (!interview || !user) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  return (
    <InterviewPage
      user={user}
      interview={interview}
      feedback={feedback}
      interviewId={id}
    />
  );
};

export default Interview;

import { redirect } from "next/navigation";

import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import FeedbackPage from "@/components/feedback/FeedbackPage";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export default async function Feedback({ params }: RouteParams) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  if (!feedback) {
    redirect(`/interview/${id}`);
  }

  return <FeedbackPage feedback={feedback} />;
}

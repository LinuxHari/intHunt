import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
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

  const [interview, feedback] = await Promise.all([
    getInterviewById(id),
    getFeedbackByInterviewId({ interviewId: id, userId: user.id }),
  ]);

  if (!interview || !feedback) {
    redirect(`/interview/${id}`);
  }

  return <FeedbackPage interview={interview} feedback={feedback} />;
}

"use client";

import useInterviewAgent from "@/hooks/useInterviewAgent";
import AgentButton from "./AgentButton";
import TranscriptSection from "./TranscriptSection";
import UserCard from "./UserCard";
import InterviewerCard from "./InterviewerCard";
import Link from "next/link";

const AuthenticatedAgent = ({
  interview,
  user,
  feedbackId,
  type,
}: AgentProps & { user: User }) => {
  const {
    isSpeaking,
    callStatus,
    lastMessage,
    isMessageExist,
    handleCall,
    handleDisconnect,
  } = useInterviewAgent({
    interview,
    user,
    feedbackId,
    type,
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="call-view w-full max-w-2xl">
        <InterviewerCard isSpeaking={isSpeaking} />
        {user && <UserCard callStatus={callStatus} user={user} />}
      </div>
      {isMessageExist && <TranscriptSection lastMessage={lastMessage} />}
      <div className="w-full flex justify-center">
        <AgentButton
          callStatus={callStatus}
          handleCall={handleCall}
          handleDisconnect={handleDisconnect}
        />
      </div>
    </div>
  );
};

const UnauthenticatedAgent = () => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="call-view w-full max-w-2xl">
        <InterviewerCard isSpeaking={false} />
      </div>
      <p className="w-full text-center text-slate-900 dark:text-white">
        You must&nbsp;
        <Link href="/sign-in" className="text-primary underline decoration-1">
          Log In
        </Link>
        &nbsp;to attend this interview
      </p>
    </div>
  );
};

const Agent = (props: AgentProps) => {
  if (props.user) {
    return <AuthenticatedAgent {...props} user={props.user} />;
  }

  return <UnauthenticatedAgent />;
};

export default Agent;

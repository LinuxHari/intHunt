"use client";

import useInterviewAgent from "@/hooks/useInterviewAgent";
import AgentButton from "./AgentButton";
import TranscriptSection from "./TranscriptSection";
import UserCard from "./UserCard";
import InterviewerCard from "./InterviewerCard";

const Agent = ({
  user,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const {
    isSpeaking,
    callStatus,
    lastMessage,
    isMessageExist,
    handleCall,
    handleDisconnect,
  } = useInterviewAgent({
    user,
    interviewId,
    feedbackId,
    type,
    questions,
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="call-view w-full max-w-2xl">
        <InterviewerCard isSpeaking={isSpeaking} />
        <UserCard callStatus={callStatus} user={user} />
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

export default Agent;

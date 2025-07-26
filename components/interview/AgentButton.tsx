import { CallStatus } from "@/hooks/useInterviewAgent";

interface AgentButtonProps {
  callStatus: CallStatus;
  handleCall: VoidFunction;
  handleDisconnect: VoidFunction;
}

const AgentButton = ({
  callStatus,
  handleCall,
  handleDisconnect,
}: AgentButtonProps) => {
  const isInactive = callStatus === "INACTIVE" || callStatus === "FINISHED";
  const isConnecting = callStatus === "CONNECTING";

  if (callStatus === "ACTIVE") {
    return (
      <button
        className="btn-disconnect group relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        onClick={handleDisconnect}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full" />
        <span className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <span className="relative z-10 flex items-center gap-2 font-bold text-white">
          <span className="w-4 h-4 bg-white rounded-sm block" />
          End Call
        </span>

        <span className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150" />
      </button>
    );
  }

  return (
    <button
      className="relative btn-call group overflow-hidden my-5 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
      onClick={handleCall}
      disabled={isConnecting}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full" />
      <span className="absolute inset-0 bg-gradient-to-r from-green-300 to-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {isConnecting && (
        <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
      )}

      <span className="relative z-10 flex items-center gap-2 font-bold text-white">
        {isInactive ? (
          <>
            <span className="w-4 h-4 bg-white rounded-full block" />
            Call
          </>
        ) : (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-white rounded-full animate-bounce block" />
            <span
              className="w-2 h-2 bg-white rounded-full animate-bounce block"
              style={{ animationDelay: "0.1s" }}
            />
            <span
              className="w-2 h-2 bg-white rounded-full animate-bounce block"
              style={{ animationDelay: "0.2s" }}
            />
          </span>
        )}
      </span>

      <span className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150" />
    </button>
  );
};

export default AgentButton;

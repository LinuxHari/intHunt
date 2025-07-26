import { cn } from "@/lib/utils";

interface TranscriptSectionProps {
  lastMessage: string;
}

const TranscriptSection = ({ lastMessage }: TranscriptSectionProps) => {
  return (
    <div className="transcript-border relative w-full max-w-2xl">
      <div className="transcript relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl" />

        <div className="relative z-10 flex items-center gap-3 p-4">
          <div className="flex-shrink-0">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
          </div>
          <p
            key={lastMessage}
            className={cn(
              "transition-all duration-500 opacity-0 transform translate-y-2",
              "animate-fadeIn opacity-100 translate-y-0",
              "text-white text-center flex-1 leading-relaxed"
            )}
          >
            {lastMessage}
          </p>
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white/60 rounded-full" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

export default TranscriptSection;

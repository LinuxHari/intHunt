import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface InterviewCardProps {
  isSpeaking: boolean;
}

const InterviewerCard = ({ isSpeaking }: InterviewCardProps) => {
  return (
    <Card className="relative group flex-1 w-full h-90 flex items-center justify-center overflow-hidden rounded-2xl border bg-transparent">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-800/40 dark:to-indigo-900/30 rounded-2xl pointer-events-none" />

      <CardContent className="relative z-10 flex flex-col items-center gap-4 p-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full blur-lg opacity-20 scale-110" />
          <div className="relative border-4 border-white dark:border-slate-700 rounded-full shadow-xl">
            <div className="h-32 w-32 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center">
              <Image
                src="/ai-avatar.png"
                alt="AI Interviewer"
                width={80}
                height={80}
                className="object-cover rounded-full"
              />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white dark:border-slate-700 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          {isSpeaking && (
            <>
              <div className="absolute inset-0 border-2 border-indigo-400/60 rounded-full animate-ping opacity-40" />
              <div
                className="absolute -inset-2 border border-indigo-400/40 rounded-full animate-ping opacity-20"
                style={{ animationDelay: "0.5s" }}
              />
            </>
          )}
        </div>

        <div className="text-center">
          <h3 className="text-slate-800 dark:text-white font-semibold text-lg mb-1">
            AI Interviewer
          </h3>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <div>{isSpeaking ? "Speaking..." : "Listening"}</div>
          </div>
        </div>
      </CardContent>

      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
    </Card>
  );
};

export default InterviewerCard;

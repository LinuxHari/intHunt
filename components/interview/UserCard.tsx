import { cn } from "@/lib/utils";
import { CallStatus } from "@/hooks/useInterviewAgent";
import { Card, CardContent } from "@/components/ui/card";
import UserAvatar from "./UserAvatar";

interface UserCardProps {
  callStatus: CallStatus;
  user: User;
}

const UserCard = ({ callStatus, user }: UserCardProps) => {
  return (
    <Card className="relative group overflow-hidden flex-1 h-90 flex items-center justify-center rounded-2xl border bg-transparent">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl pointer-events-none" />

      <CardContent className="relative z-10 flex flex-col items-center gap-4 p-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-20 scale-110" />
          <div className="relative border-4 border-white dark:border-slate-700 rounded-full shadow-xl">
            <UserAvatar
              user={user}
              className="h-32 w-32"
              fallbackClassName="text-4xl"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white dark:border-slate-700 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-slate-800 dark:text-white font-semibold text-lg mb-1">
            {user.name}
          </h3>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                callStatus === "ACTIVE" ? "bg-green-500" : "bg-gray-400"
              )}
            />
            <div>{callStatus === "ACTIVE" ? "Connected" : "Offline"}</div>
          </div>
        </div>
      </CardContent>

      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
    </Card>
  );
};

export default UserCard;

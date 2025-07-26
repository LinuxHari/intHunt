import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  icon: typeof Calendar;
  value: string | number;
  label: string;
  bgColor: string;
};

const StatCard = ({ icon: Icon, value, label, bgColor }: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            bgColor
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {label}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default StatCard;

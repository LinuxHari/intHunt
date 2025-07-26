import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  bgColor: string;
  iconColor: string;
}

const StatCard = ({
  icon,
  value,
  label,
  bgColor,
  iconColor,
}: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}
          >
            <div className={iconColor}>{icon}</div>
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
};

export default StatCard;

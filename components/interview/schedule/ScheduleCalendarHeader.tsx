import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dayjs } from "dayjs";

interface ScheduleCalendarHeaderProps {
  currentMonth: Dayjs;
  onNavigateMonth: (direction: "prev" | "next") => void;
}

const ScheduleCalendarHeader = ({
  currentMonth,
  onNavigateMonth,
}: ScheduleCalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onNavigateMonth("prev")}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h4 className="font-medium text-slate-900 dark:text-white">
        {currentMonth.format("MMMM YYYY")}
      </h4>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onNavigateMonth("next")}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ScheduleCalendarHeader;

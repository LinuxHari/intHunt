import { Button } from "@/components/ui/button";
import { WEEK_DAYS } from "@/constants";
import { cn } from "@/lib/utils";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface ScheduleCalendarProps {
  calendarDays: Dayjs[];
  currentMonth: Dayjs;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const ScheduleCalendar = ({
  calendarDays,
  currentMonth,
  selectedDate,
  onDateSelect,
}: ScheduleCalendarProps) => {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 p-2"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const isPast = date.isBefore(dayjs().startOf("day"));
          const isCurrentMonth = date.isSame(currentMonth, "month");
          const isSelected =
            selectedDate && dayjs(selectedDate).isSame(date, "day");

          return (
            <Button
              key={index}
              type="button"
              variant={isSelected ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-xs",
                !isCurrentMonth && "text-slate-300 dark:text-slate-600",
                isPast && "opacity-50 cursor-not-allowed",
                isSelected && "ring-2 ring-blue-500"
              )}
              disabled={isPast}
              onClick={() => !isPast && onDateSelect(date.toDate())}
            >
              {date.date()}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleCalendar;

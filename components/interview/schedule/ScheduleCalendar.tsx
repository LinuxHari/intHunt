import { Button } from "@/components/ui/button";
import { WEEK_DAYS } from "@/constants";
import { cn, generateCalendarDays } from "@/lib/utils";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useMemo } from "react";

interface ScheduleCalendarProps {
  currentMonth: Dayjs;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const ScheduleCalendar = ({
  currentMonth,
  selectedDate,
  onDateSelect,
}: ScheduleCalendarProps) => {
  const calendarDays = useMemo(
    () => generateCalendarDays(currentMonth),
    [currentMonth]
  );

  const getDateInfo = (date: Dayjs) => {
    const isPastOrToday = date.isBefore(dayjs().add(1, "day").startOf("day"));
    const isCurrentMonth = date.isSame(currentMonth, "month");
    const isSelected = selectedDate && dayjs(selectedDate).isSame(date, "day");

    return { isPastOrToday, isCurrentMonth, isSelected };
  };

  const getButtonClassName = (
    isCurrentMonth: boolean,
    isPastOrToday: boolean,
    isSelected: boolean | null
  ) => {
    return cn(
      "h-8 w-8 p-0 text-xs",
      !isCurrentMonth && "text-slate-300 dark:text-slate-600",
      isPastOrToday && "opacity-50 cursor-not-allowed",
      isSelected && "ring-2 ring-blue-500"
    );
  };

  const handleDateClick = (date: Dayjs, isPastOrToday: boolean) => {
    if (!isPastOrToday) {
      onDateSelect(date.toDate());
    }
  };

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
        {calendarDays.map((date, index) => (
          <Button
            key={index}
            type="button"
            variant={getDateInfo(date).isSelected ? "default" : "ghost"}
            size="sm"
            className={getButtonClassName(
              getDateInfo(date).isCurrentMonth,
              getDateInfo(date).isPastOrToday,
              getDateInfo(date).isSelected
            )}
            disabled={getDateInfo(date).isPastOrToday}
            onClick={() =>
              handleDateClick(date, getDateInfo(date).isPastOrToday)
            }
          >
            {date.date()}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ScheduleCalendar;

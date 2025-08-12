import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import CalendarHeader from "@/components/interview/schedule/ScheduleCalendarHeader";
import Calendar from "@/components/interview/schedule/ScheduleCalendar";
import { ScheduleFormType } from "@/validators";

interface ScheduleDatePickerProps {
  control: Control<ScheduleFormType>;
  currentMonth: Dayjs;
  watchedDate: Date | null;
  onNavigateMonth: (direction: "prev" | "next") => void;
}

const ScheduleDatePicker = ({
  control,
  currentMonth,
  watchedDate,
  onNavigateMonth,
}: ScheduleDatePickerProps) => {
  return (
    <FormField
      control={control}
      name="date"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="font-semibold text-slate-900 dark:text-white">
            Select Date
          </FormLabel>
          <FormControl>
            <div className="space-y-4">
              <CalendarHeader
                currentMonth={currentMonth}
                onNavigateMonth={onNavigateMonth}
              />
              <Calendar
                currentMonth={currentMonth}
                selectedDate={field.value}
                onDateSelect={field.onChange}
              />
              {watchedDate && (
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Selected: {dayjs(watchedDate).format("dddd, MMMM D, YYYY")}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ScheduleDatePicker;

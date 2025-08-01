import { scheduleInterview } from "@/lib/actions/interview.action";
import { scheduleFormSchema, ScheduleFormType } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const useSchedule = (
  onOpenChange: (value: boolean) => void,
  interview: Interview
) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [isScheduling, startScheduleTransition] = useTransition();

  const form = useForm<ScheduleFormType>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      timeType: "preset",
      presetTime: "",
      customTime: "",
    },
  });

  const watchedTimeType = form.watch("timeType");
  const watchedDate = form.watch("date");

  const generateCalendarDays = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const days = [];

    for (let i = 0; i < startOfMonth.day(); i++) {
      days.push(startOfMonth.subtract(startOfMonth.day() - i, "day"));
    }

    for (let i = 1; i <= currentMonth.daysInMonth(); i++) {
      days.push(currentMonth.date(i));
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(endOfMonth.add(i, "day"));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth =
      direction === "prev"
        ? currentMonth.subtract(1, "month")
        : currentMonth.add(1, "month");
    setCurrentMonth(newMonth);
  };

  const onSubmit = (values: ScheduleFormType) => {
    startScheduleTransition(async () => {
      const finalTime =
        values.timeType === "custom" ? values.customTime! : values.presetTime!;

      const { success } = await scheduleInterview({
        interviewId: interview.id,
        date: dayjs(values.date).format("YYYY-MM-DD"),
        time: finalTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        role: interview.role,
      });

      if (success) {
        toast.success("Interview scheduled successfully");
        onOpenChange(false);
        form.reset();
      } else {
        toast.error("Failed to schedule interview. Please try again.");
      }
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  return {
    form,
    isScheduling,
    watchedDate,
    watchedTimeType,
    calendarDays,
    currentMonth,
    navigateMonth,
    onSubmit,
    handleClose,
  };
};

export default useSchedule;

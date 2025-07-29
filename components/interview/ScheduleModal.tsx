"use client";

import { useState, useTransition } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs"; // Make sure to install dayjs: npm install dayjs
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { scheduleInterview } from "@/lib/actions/interview.action";
import InterviewBadges from "../dashboard/publishedInterviews/InterviewBadges";

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview: Interview;
}

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
];

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ScheduleModal = ({
  open,
  onOpenChange,
  interview,
}: ScheduleModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customTime, setCustomTime] = useState<string>("");
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [isScheduling, startScheduleTransition] = useTransition();

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

  const handleSchedule = () => {
    if (!selectedDate || (!selectedTime && !customTime)) return;

    startScheduleTransition(async () => {
      const finalTime = useCustomTime ? customTime : selectedTime;
      const { success } = await scheduleInterview({
        interviewId: interview.id,
        date: dayjs(selectedDate).format("YYYY-MM-DD"),
        time: finalTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        role: interview.role,
      });

      if (success) {
        toast.success("Interview scheduled successfully");
        onOpenChange(false);
      } else {
        toast.error("Failed to schedule interview. Please try again.");
      }
    });
  };

  const handleSelectTime = (time: string) => {
    setUseCustomTime(false);
    setSelectedTime(time);
    setCustomTime("");
  };

  const handleEnableCustomTime = () => {
    setUseCustomTime(true);
    setSelectedTime("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Interview
          </DialogTitle>
          <DialogDescription>
            Choose a convenient date and time for your {interview.role}{" "}
            interview.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Interview Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{interview.role}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <InterviewBadges
                  difficulty={interview.difficulty}
                  type={interview.type}
                  level={interview.level}
                />
                <Badge variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  {interview.questions.length} Questions
                </Badge>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {interview.description}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Date Picker */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Select Date
              </h3>
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth("prev")}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h4 className="font-medium text-slate-900 dark:text-white">
                  {currentMonth.format("MMMM YYYY")}
                </h4>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth("next")}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
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
                        variant={isSelected ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "h-8 w-8 p-0 text-xs",
                          !isCurrentMonth &&
                            "text-slate-300 dark:text-slate-600",
                          isPast && "opacity-50 cursor-not-allowed",
                          isSelected && "ring-2 ring-blue-500"
                        )}
                        disabled={isPast}
                        onClick={() =>
                          !isPast && setSelectedDate(date.toDate())
                        }
                      >
                        {date.date()}
                      </Button>
                    );
                  })}
                </div>
              </div>
              {selectedDate && (
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Selected: {dayjs(selectedDate).format("dddd, MMMM D, YYYY")}
                </div>
              )}
            </div>

            {/* Time Picker */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Select Time
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={!useCustomTime ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseCustomTime(false)}
                >
                  Preset
                </Button>
                <Button
                  variant={useCustomTime ? "default" : "outline"}
                  size="sm"
                  onClick={handleEnableCustomTime}
                >
                  Custom
                </Button>
              </div>

              {!useCustomTime ? (
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "h-8 text-xs",
                        selectedTime === time && "ring-2 ring-blue-500"
                      )}
                      onClick={() => handleSelectTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter time in 24-hour format.
                  </p>
                </div>
              )}

              {(selectedTime || customTime) && (
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Selected: {useCustomTime ? customTime : selectedTime}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={
                !selectedDate || (!selectedTime && !customTime) || isScheduling
              }
              onClick={handleSchedule}
            >
              {isScheduling ? "Scheduling..." : "Schedule Interview"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;

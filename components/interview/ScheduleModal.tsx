"use client";

import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

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

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview: Interview;
}

const ScheduleModal = ({
  open,
  onOpenChange,
  interview,
}: ScheduleModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customTime, setCustomTime] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [useCustomTime, setUseCustomTime] = useState(false);

  if (!interview) return null;

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  // Predefined time slots
  const timeSlots = [
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

  const handleSchedule = () => {
    if (selectedDate && (selectedTime || customTime)) {
      const finalTime = useCustomTime ? customTime : selectedTime;
      console.log("Scheduling interview:", {
        interviewId: interview.id,
        date: selectedDate.toISOString().split("T")[0],
        time: finalTime,
      });
      // Handle scheduling logic here
      onOpenChange(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedDate(null);
    setSelectedTime("");
    setCustomTime("");
    setUseCustomTime(false);
    setCurrentMonth(new Date());
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateInCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isDateSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
            interview
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{interview.role}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{interview.type}</Badge>
                <Badge variant="outline">{interview.difficulty}</Badge>
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
                  {formatMonthYear(currentMonth)}
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
                  {weekDays.map((day) => (
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
                    const disabled = isDateDisabled(date);
                    const inCurrentMonth = isDateInCurrentMonth(date);
                    const selected = isDateSelected(date);

                    return (
                      <Button
                        key={index}
                        variant={selected ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "h-8 w-8 p-0 text-xs",
                          !inCurrentMonth &&
                            "text-slate-300 dark:text-slate-600",
                          disabled && "opacity-50 cursor-not-allowed",
                          selected && "ring-2 ring-blue-500"
                        )}
                        disabled={disabled}
                        onClick={() => !disabled && setSelectedDate(date)}
                      >
                        {date.getDate()}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Selected:{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Select Time
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={!useCustomTime ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setUseCustomTime(false);
                    setCustomTime("");
                  }}
                >
                  Preset
                </Button>
                <Button
                  variant={useCustomTime ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setUseCustomTime(true);
                    setSelectedTime("");
                  }}
                >
                  Custom
                </Button>
              </div>

              {!useCustomTime ? (
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => {
                    const isSelected = selectedTime === time;

                    return (
                      <Button
                        key={time}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-8 text-xs",
                          isSelected && "ring-2 ring-blue-500"
                        )}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    );
                  })}
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
                    Enter any time in 24-hour format
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
              disabled={!selectedDate || (!selectedTime && !customTime)}
              onClick={handleSchedule}
            >
              Schedule Interview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;

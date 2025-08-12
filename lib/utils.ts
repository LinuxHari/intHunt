// import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import dayjs, { Dayjs } from "dayjs";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getTypeConfig = (
  type: Interview["type"]
): {
  color: string;
} => {
  const configs: Record<
    Interview["type"],
    {
      color: string;
    }
  > = {
    technical: {
      color:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800 p-1",
    },
    behavioral: {
      color:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 p-1",
    },
    // Mixed: {
    //   color:
    //     "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    // },
  };
  return configs[type];
};

export const getLevelConfig = (level: string) => {
  const configs = {
    junior: {
      color:
        "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-700",
    },
    mid: {
      color:
        "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
    },
    senior: {
      color:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    },
  };
  return configs[level as keyof typeof configs];
};

export const getDifficultyConfig = (difficulty: Interview["difficulty"]) => {
  const configs = {
    easy: {
      color:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    },
    medium: {
      color:
        "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    },
    hard: {
      color:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    },
  };
  return configs[difficulty as keyof typeof configs];
};

export function getTimeUntil(date: string | number | Date): string {
  const now = dayjs();
  const target = dayjs(date);
  const diffInMs = target.diff(now);

  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  if (days > 0) return `in ${days} day${days > 1 ? "s" : ""}`;
  if (hours > 0) return `in ${hours} hour${hours > 1 ? "s" : ""}`;
  return "starting soon";
}

export const getInterviewsDueToday = (
  interviews: UpcomingInterview[]
): number => {
  const tomorrow = new Date(Date.now() + 86400000);
  return interviews.filter(
    (interview) => new Date(interview.scheduledAt) <= tomorrow
  ).length;
};

export const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

export const generateCalendarDays = (currentMonth: Dayjs) => {
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

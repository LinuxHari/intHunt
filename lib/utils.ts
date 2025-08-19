// import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import dayjs, { Dayjs } from "dayjs";
import { twMerge } from "tailwind-merge";
import {
  AnalyticsData,
  AnalyticsQueryRow,
  Duration,
  ReturnUserAnalytics,
} from "./actions/type";
import { TrendingUp, Users, Clock } from "lucide-react";

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
        "bg-green-50 hover:bg-green-50 hover:dark:bg-green-950 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800 p-1",
    },
    behavioral: {
      color:
        "bg-blue-50 hover:bg-blue-50 dark:hover:bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 p-1",
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
        "bg-gray-50 hover:bg-gray-50 hover:dark:bg-gray-950  text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-700",
    },
    mid: {
      color:
        "bg-yellow-50 hover:bg-yellow-50 hover:dark:bg-yellow-950  text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
    },
    senior: {
      color:
        "bg-red-50 hover:bg-red-50 hover:dark:bg-red-950 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    },
  };
  return configs[level as keyof typeof configs];
};

export const getDifficultyConfig = (difficulty: Interview["difficulty"]) => {
  const configs = {
    easy: {
      color:
        "bg-blue-50 hover:bg-blue-50 hover:dark:bg-blue-950  text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    },
    medium: {
      color:
        "bg-purple-50 hover:bg-purple-50 hover:dark:bg-purple-950 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    },
    hard: {
      color:
        "bg-red-50 hover:bg-red-50 hover:dark:bg-red-950 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
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

export const getAnalyticsDateRangesAndGrouping = (
  duration: Duration,
  now: Date
) => {
  const currentDate = dayjs(now);

  switch (duration) {
    case "week": {
      const startOfCurrentWeek = currentDate.startOf("week").add(1, "day");
      const endOfCurrentWeek = currentDate;

      const startOfPreviousWeek = startOfCurrentWeek.subtract(1, "week");
      const endOfPreviousWeek = startOfCurrentWeek.subtract(1, "day");

      return {
        currentStart: startOfCurrentWeek.toDate(),
        currentEnd: endOfCurrentWeek.toDate(),
        previousStart: startOfPreviousWeek.toDate(),
        previousEnd: endOfPreviousWeek.toDate(),
        groupBy: "DATE_PART('dow', f.created_at)",
        periodSelect: `CASE 
          WHEN DATE_PART('dow', f.created_at) = 0 THEN 'Sunday'
          WHEN DATE_PART('dow', f.created_at) = 1 THEN 'Monday'
          WHEN DATE_PART('dow', f.created_at) = 2 THEN 'Tuesday'
          WHEN DATE_PART('dow', f.created_at) = 3 THEN 'Wednesday'
          WHEN DATE_PART('dow', f.created_at) = 4 THEN 'Thursday'
          WHEN DATE_PART('dow', f.created_at) = 5 THEN 'Friday'
          WHEN DATE_PART('dow', f.created_at) = 6 THEN 'Saturday'
        END`,
      };
    }

    case "month": {
      const startOfCurrentMonth = currentDate.startOf("month");
      const endOfCurrentMonth = currentDate;

      const startOfPreviousMonth = startOfCurrentMonth.subtract(1, "month");
      const endOfPreviousMonth = startOfCurrentMonth.subtract(1, "day");

      return {
        currentStart: startOfCurrentMonth.toDate(),
        currentEnd: endOfCurrentMonth.toDate(),
        previousStart: startOfPreviousMonth.toDate(),
        previousEnd: endOfPreviousMonth.toDate(),
        groupBy: "CEIL(DATE_PART('day', f.created_at) / 7.0)",
        periodSelect: `CONCAT('Week ', CEIL(DATE_PART('day', f.created_at) / 7.0))`,
      };
    }

    case "year": {
      const startOfCurrentYear = currentDate.startOf("year");
      const endOfCurrentYear = currentDate;

      const startOfPreviousYear = startOfCurrentYear.subtract(1, "year");
      const endOfPreviousYear = startOfCurrentYear.subtract(1, "day");

      return {
        currentStart: startOfCurrentYear.toDate(),
        currentEnd: endOfCurrentYear.toDate(),
        previousStart: startOfPreviousYear.toDate(),
        previousEnd: endOfPreviousYear.toDate(),
        groupBy: "DATE_PART('month', f.created_at)",
        periodSelect: `CASE 
          WHEN DATE_PART('month', f.created_at) = 1 THEN 'January'
          WHEN DATE_PART('month', f.created_at) = 2 THEN 'February'
          WHEN DATE_PART('month', f.created_at) = 3 THEN 'March'
          WHEN DATE_PART('month', f.created_at) = 4 THEN 'April'
          WHEN DATE_PART('month', f.created_at) = 5 THEN 'May'
          WHEN DATE_PART('month', f.created_at) = 6 THEN 'June'
          WHEN DATE_PART('month', f.created_at) = 7 THEN 'July'
          WHEN DATE_PART('month', f.created_at) = 8 THEN 'August'
          WHEN DATE_PART('month', f.created_at) = 9 THEN 'September'
          WHEN DATE_PART('month', f.created_at) = 10 THEN 'October'
          WHEN DATE_PART('month', f.created_at) = 11 THEN 'November'
          WHEN DATE_PART('month', f.created_at) = 12 THEN 'December'
        END`,
      };
    }

    default:
      throw `Unsupported duration: ${duration}`;
  }
};

const buildExpectedPeriods = (
  duration: Duration,
  start: Date,
  end: Date,
  currentEnd: Date
): string[] => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (duration === "week") {
    const startIdx = start.getDay();
    return Array.from(
      { length: currentEnd.getDay() },
      (_, i) => dayNames[(startIdx + i) % 7]
    );
  }

  if (duration === "month") {
    const endDay = end.getDate();
    const weeks = Math.ceil(endDay / 7);
    return Array.from({ length: weeks }, (_, i) => `Week ${i + 1}`);
  }

  const endMonthIdx = end.getMonth();
  return monthNames.slice(0, endMonthIdx + 1);
};

export const formatAnalytics = (
  rows: AnalyticsQueryRow[],
  dur: Duration,
  start: Date,
  end: Date,
  currentEnd: Date
): AnalyticsData[] => {
  const expected = buildExpectedPeriods(dur, start, end, currentEnd);

  const map = new Map<string, AnalyticsQueryRow>();
  for (const r of rows) {
    if (r.period) map.set(r.period, r);
  }

  return expected.map<AnalyticsData>((label) => {
    const r = map.get(label);
    return {
      period: label,
      totalAttendedInterviews: r?.total_attended_interviews ?? 0,
      averageScore: Number(r?.average_score ?? 0),
      averageQuestions: Number(r?.average_questions ?? 0),
    };
  });
};

export const getAnalytics = (analytics: ReturnUserAnalytics["analytics"]) => {
  const sumReducer = (
    arr: typeof analytics.currentPeriod,
    key: keyof (typeof arr)[number]
  ) => arr.reduce((total, item) => total + (Number(item[key]) || 0), 0);

  const avgReducer = (
    arr: typeof analytics.currentPeriod,
    key: keyof (typeof arr)[number]
  ) => {
    if (!arr.length) return 0;
    return sumReducer(arr, key) / arr.length;
  };

  const totalInterviewsCurr = sumReducer(
    analytics.currentPeriod,
    "totalAttendedInterviews"
  );
  const avgScoreCurr = avgReducer(analytics.currentPeriod, "averageScore");
  const avgQuestionsCurr = avgReducer(
    analytics.currentPeriod,
    "averageQuestions"
  );

  const totalInterviewsPrev = sumReducer(
    analytics.previousPeriod,
    "totalAttendedInterviews"
  );
  const avgScorePrev = avgReducer(analytics.previousPeriod, "averageScore");
  const avgQuestionsPrev = avgReducer(
    analytics.previousPeriod,
    "averageQuestions"
  );

  const calcChange = (curr: number, prev: number, isPercent = true) => {
    if (prev === 0) return curr > 0 ? "+100%" : "0%";
    const change = ((curr - prev) / prev) * 100;
    return `${change >= 0 ? "+" : ""}${
      isPercent ? change.toFixed(1) + "%" : change.toFixed(1)
    }`;
  };

  const statsData = [
    {
      title: "Total Interviews",
      value: totalInterviewsCurr,
      icon: Users,
      change: calcChange(totalInterviewsCurr, totalInterviewsPrev),
      suffix: "",
    },
    {
      title: "Average Score",
      value: avgScoreCurr.toFixed(1),
      icon: TrendingUp,
      change: calcChange(avgScoreCurr, avgScorePrev),
      suffix: "%",
    },
    {
      title: "Avg Questions",
      value: avgQuestionsCurr,
      icon: Clock,
      change: calcChange(avgQuestionsCurr, avgQuestionsPrev),
      suffix: "",
    },
  ];

  return statsData;
};

export const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
};

export const getScoreLabel = (score: number) => {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  return "Needs Improvement";
};

export const getScoreBackground = (score: number) => {
  if (score >= 80) return "!bg-green-400";
  if (score >= 60) return "!bg-yellow-400";
  return "bg-red-400";
};

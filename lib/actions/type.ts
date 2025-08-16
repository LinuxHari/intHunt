export interface CatchReturn {
  success: false;
  message: unknown;
}

export type ReturnPublishedInterviews = {
  success: true;
  publishedInterviews: Array<PublishedInterview>;
  totalCounts: number;
};

export interface AnalyticsData {
  period: string;
  totalAttendedInterviews: number;
  averageScore: number;
  averageQuestions: number;
}

export interface AnalyticsQueryRow {
  time_frame: "current" | "previous";
  period: string;
  total_attended_interviews: number | null;
  average_score: number | null;
  average_questions: number | null;
}

export interface ReturnUserAnalytics {
  success: true;
  analytics: {
    currentPeriod: AnalyticsData[];
    previousPeriod: AnalyticsData[];
  };
}

export type Duration = "week" | "month" | "year";

export type ReturnUserRecents = {
  success: true;
  recents: Array<{
    role: string;
    attendedAt: Date;
    type: Interview["type"];
    score: number;
  }>;
};

export type ReturnUpcoming = {
  success: true;
  upcomingStats: {
    totalScheduled: number;
    // dueToday: number;
    averageQuestions: number;
  };
};

export type ReturnPublished = {
  success: true;
  publishedStats: {
    totalPublished: number;
    totalAttendees: number;
    active: number;
  };
};

export interface ReturnAttended {
  success: true;
  attendedStats: {
    averageScore: number;
    averageQuestions: number;
    completed: number;
  };
}

export interface ReturnProfile {
  success: true;
  profileStats: {
    interviewsTaken: number;
    interviewsCreated: number;
    memberSince: string;
    averageScore: number;
  };
}

export interface ReturnUpcomingInterviews {
  success: true;
  upcomingInterviews: UpcomingInterview[];
  totalCounts: number;
}

export interface AttendedInterviewData {
  userId: string;
  interviewId: string;
  score: number;
  feedback: string;
  attendedAt: string;
  level: Interview["level"];
  type: Interview["type"];
}

export interface AttendedInterviewDoc extends AttendedInterviewData {
  id: string;
}

export interface AttendedInterviewDetailsData {
  type: Interview["type"];
  level: Interview["level"];
  difficulty: Interview["difficulty"];
  role: string;
  techStack: string[];
}

export interface ReturnAttendedInterviews {
  success: boolean;
  attendedInterviews: AttendedInterview[];
  totalCounts: number;
}

export interface InterviewSearchParams {
  query: string;
  sortType?: "rating" | "attendees" | "questions";
  interviewType?: Interview["type"] | "all";
  page?: number;
  offset?: number;
}

export type ReturnInterviewSearch = {
  success: true;
  interviews: Interview[];
  totalCount: number;
  hasNextPage: boolean;
};

export type ScheduleDetails = {
  interviewId: string;
  date: string;
  time: string;
  timezone: string;
};

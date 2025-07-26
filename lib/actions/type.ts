import { defaultUserStat } from "@/constants";

export interface CatchReturn {
  success: false;
  message: unknown;
}

export type ReturnPublishedInterviews = {
  success: true;
  publishedInterviews: Array<PublishedInterview>;
  totalCounts: number;
};

export type ReturnUserAnalytics = {
  success: true;
  analytics: (typeof defaultUserStat)["analytics"];
};

export type ReturnUserRecents = {
  success: true;
  recents: Array<{
    role: string;
    attendedAt: string;
    type: Interview["type"];
    score: number;
  }>;
};

export type ReturnUpcoming = {
  success: true;
  upcomingStats: (typeof defaultUserStat)["upcoming"];
};

export type ReturnPublished = {
  success: true;
  publishedStats: (typeof defaultUserStat)["published"];
};

export interface ReturnAttended {
  success: true;
  attendedStats: (typeof defaultUserStat)["attended"];
}

export interface ReturnProfile {
  success: true;
  profileStats: (typeof defaultUserStat)["profile"] & {
    averageScore: number;
  };
}

export interface ReturnUpcomingInterviews {
  success: true;
  upcomingInterviews: UpcomingInterview[];
  totalCounts: number;
}

export interface ScheduledInterviewData {
  userId: string;
  scheduledAt: string;
  interviewId: string;
  createdAt: string;
}

export interface ScheduledInterview extends ScheduledInterviewData {
  id: string;
}

export interface InterviewDetailsData {
  role: string;
  questions: number;
  attendees: number;
  averageScore: number;
  createdAt: string;
  level: Interview["level"];
  type: Interview["type"];
  difficulty: Interview["difficulty"];
  questionCount: number;
  description: string;
  techstack: string[];
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

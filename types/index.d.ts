interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: Date;
  role: string;
  type: Interview["type"];
}

interface BaseInterview {
  id: string;
  role: string;
  type: "behavioral" | "technical";
  level: "junior" | "mid" | "senior";
  difficulty: "easy" | "medium" | "hard";
  questionCount: number;
}

interface Interview extends BaseInterview {
  techstack: string[];
  description: string;
  questions: string[];
  rating: {
    average: number;
    count: number;
  };
  averageScore: number;
  attendees: number;
  createdAt: Date;
  isDeleted: boolean;
}

interface UpcomingInterview extends BaseInterview {
  attendees: number;
  averageScore: number;
  createdAt: Date;
  scheduledAt: Date;
  description: string;
  techstack: string[];
}

interface PublishedInterview extends BaseInterview {
  difficulty: Interview["difficulty"];
  createdAt: Date;
  description: string;
  techstack: string[];
  attendees: number;
  averageScore: number;
}

interface AttendedInterview extends BaseInterview {
  type: Interview["type"];
  attendedAt: Date;
  score: number;
  feedback: string;
  techStack: string[];
}

interface InterviewCompletionParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

interface User {
  name: string;
  email: string;
  id: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
  role?: string;
  about?: string;
  avatar?: string;
}

interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
}

interface AgentProps {
  user: User | null;
  interview: Interview;
  feedbackId?: string;
  type: "generate" | "interview";
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  password: string;
}

interface SignUpParams extends SignInParams {
  name: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}
interface CatchReturn {
  success: false;
  message: unknown;
}

type ReturnPublishedInterviews = {
  success: true;
  publishedInterviews: Array<PublishedInterview>;
  totalCounts: number;
};

interface AnalyticsData {
  period: string;
  totalAttendedInterviews: number;
  averageScore: number;
  averageQuestions: number;
}

interface AnalyticsQueryRow {
  time_frame: "current" | "previous";
  period: string;
  total_attended_interviews: number | null;
  average_score: number | null;
  average_questions: number | null;
}

interface ReturnUserAnalytics {
  success: true;
  analytics: {
    currentPeriod: AnalyticsData[];
    previousPeriod: AnalyticsData[];
  };
}

type Duration = "week" | "month" | "year";

type ReturnUserRecents = {
  success: true;
  recents: Array<{
    role: string;
    attendedAt: Date;
    type: Interview["type"];
    score: number;
  }>;
};

type ReturnUpcoming = {
  success: true;
  upcomingStats: {
    totalScheduled: number;
    // dueToday: number;
    averageQuestions: number;
  };
};

type ReturnPublished = {
  success: true;
  publishedStats: {
    totalPublished: number;
    totalAttendees: number;
    active: number;
  };
};

interface ReturnAttended {
  success: true;
  attendedStats: {
    averageScore: number;
    averageQuestions: number;
    completed: number;
  };
}

interface ReturnProfile {
  success: true;
  profileStats: {
    interviewsTaken: number;
    interviewsCreated: number;
    memberSince: string;
    averageScore: number;
  };
}

interface ReturnUpcomingInterviews {
  success: true;
  upcomingInterviews: UpcomingInterview[];
  totalCounts: number;
}

interface AttendedInterviewData {
  userId: string;
  interviewId: string;
  score: number;
  feedback: string;
  attendedAt: string;
  level: Interview["level"];
  type: Interview["type"];
}

interface AttendedInterviewDoc extends AttendedInterviewData {
  id: string;
}

interface AttendedInterviewDetailsData {
  type: Interview["type"];
  level: Interview["level"];
  difficulty: Interview["difficulty"];
  role: string;
  techStack: string[];
}

interface ReturnAttendedInterviews {
  success: boolean;
  attendedInterviews: AttendedInterview[];
  totalCounts: number;
}

interface InterviewSearchParams {
  query: string;
  sortType?: "rating" | "attendees" | "questions";
  interviewType?: Interview["type"] | "all";
  page?: number;
  offset?: number;
}

type ReturnInterviewSearch = {
  success: true;
  interviews: Interview[];
  totalCount: number;
  hasNextPage: boolean;
};

type ScheduleDetails = {
  interviewId: string;
  date: string;
  time: string;
  timezone: string;
};

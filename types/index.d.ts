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

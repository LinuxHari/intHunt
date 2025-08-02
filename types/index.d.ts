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
  createdAt: string;
}

interface BaseInterview {
  id: string;
  role: string;
  type: Interview["type"];
  level: Interview["level"];
  difficulty: Interview["difficulty"];
}

interface Interview extends BaseInterview {
  level: "junior" | "mid" | "senior";
  type: "behavioral" | "technical";
  techstack: string[];
  description: string;
  questions: string[];
  questionCount: number;
  rating: {
    average: number;
    count: number;
  };
  averageScore: number;
  attendees: number;
  difficulty: "easy" | "medium" | "hard";
  createdAt: string;
  isDeleted: boolean;
}

interface UpcomingInterview extends BaseInterview {
  questionCount: number;
  attendees: number;
  averageScore: number;
  createdAt: string;
  scheduledAt: string;
  description: string;
  techstack: string[];
}

interface PublishedInterview extends BaseInterview {
  difficulty: Interview["difficulty"];
  createdAt: string;
  totalQuestions: number;
  description: string;
  techstack: string[];
  attendees: number;
  averageScore: number;
}

interface AttendedInterview extends BaseInterview {
  type: Interview["type"];
  attendedAt: string;
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
  user: User;
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
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
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

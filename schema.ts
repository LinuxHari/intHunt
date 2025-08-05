import * as z from "zod";

export const createInterviewSchema = z.object({
  role: z.string().min(1, "Role is required"),
  level: z.enum(["junior", "mid", "senior"], {
    required_error: "Level is required",
  }),
  techstack: z.string().min(1, "Tech stack is required"),
  type: z.enum(["technical", "behavioral"], {
    required_error: "Interview type is required",
  }),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "Difficulty is required",
  }),
  questions: z
    .array(
      z.object({
        value: z.string().min(1, "Question cannot be empty"),
      })
    )
    .min(2, "At least twos questions are required"),
});

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  about: z.string().max(500, "About must be less than 500 characters"),
  avatar: z.string().optional(),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const scheduleFormSchema = z
  .object({
    date: z.date({
      required_error: "Please select a date for the interview.",
    }),
    timeType: z.enum(["preset", "custom"], {
      required_error: "Please select a time type.",
    }),
    presetTime: z.string().optional(),
    customTime: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.timeType === "preset" && !data.presetTime) {
        return false;
      }
      if (data.timeType === "custom" && !data.customTime) {
        return false;
      }
      return true;
    },
    {
      message: "Please select a time for the interview.",
      path: ["presetTime"],
    }
  );

const getAuthFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const signupFormSchema = getAuthFormSchema("sign-up");

export const signinFormSchema = getAuthFormSchema("sign-in");

export type ProfileFormType = z.infer<typeof profileSchema>;

export type PasswordFormType = z.infer<typeof passwordSchema>;

export type CreateInterviewFormType = z.infer<typeof createInterviewSchema>;

export type ScheduleFormType = z.infer<typeof scheduleFormSchema>;

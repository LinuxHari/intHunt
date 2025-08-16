import { FeedbackType } from "@/validators";
import {
  pgTable,
  integer,
  smallint,
  varchar,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const interviewTypeEnum = pgEnum("type", ["technical", "behavioral"]);
export const interviewDifficultyEnum = pgEnum("difficulty", [
  "easy",
  "medium",
  "hard",
]);
export const interviewLevelEnum = pgEnum("level", ["junior", "mid", "senior"]);

export const interviews = pgTable(
  "interviews",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    role: varchar("role", { length: 50 }).notNull(),
    type: interviewTypeEnum().notNull(),
    difficulty: interviewDifficultyEnum().notNull(),
    level: interviewLevelEnum().notNull(),
    techstack: jsonb("tech_stack").$type<string[]>().notNull().default([]),
    description: varchar("description", { length: 500 }).notNull(),
    questions: jsonb("questions").$type<string[]>().notNull().default([]),
    questionCount: smallint("question_count").notNull().default(0),
    rating: jsonb("rating")
      .$type<{ average: number; count: number }>()
      .notNull()
      .default({ average: 0, count: 0 }),
    averageScore: integer("average_score").notNull().default(0),
    attendees: integer("attendees").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    publishedBy: varchar("published_by", { length: 36 }).notNull(),
    isDeleted: boolean("is_deleted").notNull().default(false),
  },
  (table) => [
    uniqueIndex("id_idx").on(table.id),
    index("type_difficulty_role_idx").on(
      table.type,
      table.difficulty,
      table.role
    ),
  ]
);

export const scheduledInterviews = pgTable("scheduledInterviews", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  interviewId: uuid("interview_id")
    .notNull()
    .references(() => interviews.id),
  userId: varchar("user_id", { length: 36 }).notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  timezone: varchar("timezone", { length: 128 }).notNull(),
});

export const feedback = pgTable("feedback", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  interviewId: uuid("interview_id")
    .notNull()
    .references(() => interviews.id),
  userId: varchar("user_id", { length: 36 }).notNull(),
  totalScore: smallint("total_score").notNull(),
  categoryScores: jsonb("category_scores")
    .$type<FeedbackType["categoryScores"]>()
    .notNull(),
  strengths: jsonb().$type<string[]>().notNull(),
  areasForImprovement: jsonb("areas_for_improvement")
    .$type<string[]>()
    .notNull(),
  finalAssessment: varchar("final_assessment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const interviewsRelations = relations(interviews, ({ many }) => ({
  scheduledInterviews: many(scheduledInterviews),
  feedback: many(feedback),
}));

export const scheduledInterviewsRelations = relations(
  scheduledInterviews,
  ({ one }) => ({
    interview: one(interviews, {
      fields: [scheduledInterviews.interviewId],
      references: [interviews.id],
    }),
  })
);

export const feedbackRelations = relations(feedback, ({ one }) => ({
  interview: one(interviews, {
    fields: [feedback.interviewId],
    references: [interviews.id],
  }),
}));

// export type Interview = typeof interviews.$inferSelect;
// export type NewInterview = typeof interviews.$inferInsert;
// export type ScheduledInterview = typeof scheduledInterviews.$inferSelect;
// export type NewScheduledInterview = typeof scheduledInterviews.$inferInsert;
// export type Feedback = typeof feedback.$inferSelect;
// export type NewFeedback = typeof feedback.$inferInsert;
// export type UserStats = typeof userStats.$inferSelect;
// export type NewUserStats = typeof userStats.$inferInsert;
// export type DailyStats = typeof dailyStats.$inferSelect;
// export type NewDailyStats = typeof dailyStats.$inferInsert;

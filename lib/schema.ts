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
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

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
    index("role_idx").on(table.role),
    index("type_idx").on(table.type),
    index("difficulty_idx").on(table.difficulty),

    sql`CREATE INDEX techstack_gin_idx ON ${table} USING GIN (${table.techstack})`,
    sql`CREATE INDEX role_techstack_gin_idx ON ${table} (role) USING GIN (${table.techstack})`,
  ]
);

export const scheduledInterviews = pgTable(
  "scheduledInterviews",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    interviewId: uuid("interview_id")
      .notNull()
      .references(() => interviews.id),
    userId: varchar("user_id", { length: 36 }).notNull(),
    scheduledAt: timestamp("scheduled_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    timezone: varchar("timezone", { length: 128 }).notNull(),
    reminderSent: boolean("reminder_sent").notNull().default(false),
  },
  (table) => [
    index("user_interview_time_idx").on(
      table.userId,
      table.interviewId,
      table.scheduledAt
    ),
  ]
);

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

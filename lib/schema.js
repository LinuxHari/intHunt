"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackRelations = exports.scheduledInterviewsRelations = exports.interviewsRelations = exports.dailyStats = exports.userStats = exports.feedback = exports.scheduledInterviews = exports.interviews = exports.interviewLevelEnum = exports.interviewDifficultyEnum = exports.interviewTypeEnum = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_orm_1 = require("drizzle-orm");
exports.interviewTypeEnum = (0, pg_core_1.pgEnum)("type", ["technical", "behavioral"]);
exports.interviewDifficultyEnum = (0, pg_core_1.pgEnum)("difficulty", [
    "easy",
    "medium",
    "hard",
]);
exports.interviewLevelEnum = (0, pg_core_1.pgEnum)("level", ["junior", "mid", "senior"]);
exports.interviews = (0, pg_core_1.pgTable)("interviews", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    role: (0, pg_core_1.varchar)("role", { length: 50 }).notNull(),
    type: (0, exports.interviewTypeEnum)().notNull(),
    difficulty: (0, exports.interviewDifficultyEnum)().notNull(),
    level: (0, exports.interviewLevelEnum)().notNull(),
    techstack: (0, pg_core_1.jsonb)("tech_stack").$type().notNull().default([]),
    description: (0, pg_core_1.varchar)("description", { length: 500 }).notNull(),
    questions: (0, pg_core_1.jsonb)("questions").$type().notNull().default([]),
    questionCount: (0, pg_core_1.smallint)("question_count").notNull().default(0),
    rating: (0, pg_core_1.jsonb)("rating")
        .$type()
        .notNull()
        .default({ average: 0, count: 0 }),
    averageScore: (0, pg_core_1.integer)("average_score").notNull().default(0),
    attendees: (0, pg_core_1.integer)("attendees").notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    publishedBy: (0, pg_core_1.varchar)("published_by", { length: 36 }).notNull(),
    isDeleted: (0, pg_core_1.boolean)("is_deleted").notNull().default(false),
}, function (table) { return [
    (0, pg_core_1.uniqueIndex)("id_idx").on(table.id),
    (0, pg_core_1.index)("type_difficulty_role_idx").on(table.type, table.difficulty, table.role),
]; });
exports.scheduledInterviews = (0, pg_core_1.pgTable)("scheduledInterviews", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    interviewId: (0, pg_core_1.uuid)("interview_id")
        .notNull()
        .references(function () { return exports.interviews.id; }),
    userId: (0, pg_core_1.varchar)("user_id", { length: 36 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 100 }).notNull(),
    role: (0, pg_core_1.varchar)("role", { length: 50 }).notNull(),
    scheduledAt: (0, pg_core_1.timestamp)("scheduled_at").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    timezone: (0, pg_core_1.varchar)("timezone", { length: 128 }).notNull(),
});
exports.feedback = (0, pg_core_1.pgTable)("feedback", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    interviewId: (0, pg_core_1.uuid)("interview_id")
        .notNull()
        .references(function () { return exports.interviews.id; }),
    userId: (0, pg_core_1.varchar)("user_id", { length: 36 }).notNull(),
    totalScore: (0, pg_core_1.smallint)("total_score").notNull(),
    categoryScores: (0, pg_core_1.jsonb)("category_scores")
        .$type()
        .notNull(),
    strengths: (0, pg_core_1.jsonb)().$type().notNull(),
    areasForImprovement: (0, pg_core_1.jsonb)("areas_for_improvement")
        .$type()
        .notNull(),
    finalAssessment: (0, pg_core_1.varchar)("final_assessment").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.userStats = (0, pg_core_1.pgTable)("user_stats", {
    userId: (0, pg_core_1.varchar)("user_id", { length: 36 }).primaryKey().notNull(),
    totalPublishedInterviews: (0, pg_core_1.integer)("total_published_interviews")
        .notNull()
        .default(0),
    activePublishedInterviews: (0, pg_core_1.integer)("active_published_interviews")
        .notNull()
        .default(0),
    totalAttendedInterviews: (0, pg_core_1.integer)("total_attended_interviews")
        .notNull()
        .default(0),
    averageScore: (0, pg_core_1.integer)("average_score").notNull().default(0),
    averageQuestionCount: (0, pg_core_1.integer)("average_question_count").notNull().default(0),
});
exports.dailyStats = (0, pg_core_1.pgTable)("daily_stats", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    userId: (0, pg_core_1.varchar)("user_id", { length: 36 }).notNull(),
    date: (0, pg_core_1.date)("date").notNull(),
    interviewCount: (0, pg_core_1.integer)("interview_count").notNull().default(0),
    averageScore: (0, pg_core_1.decimal)("average_score", { precision: 5, scale: 2 })
        .notNull()
        .default("0.00"),
    totalScore: (0, pg_core_1.integer)("total_score").notNull().default(0),
    totalQuestions: (0, pg_core_1.integer)("total_questions").notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.interviewsRelations = (0, drizzle_orm_1.relations)(exports.interviews, function (_a) {
    var many = _a.many;
    return ({
        scheduledInterviews: many(exports.scheduledInterviews),
        feedback: many(exports.feedback),
    });
});
exports.scheduledInterviewsRelations = (0, drizzle_orm_1.relations)(exports.scheduledInterviews, function (_a) {
    var one = _a.one;
    return ({
        interview: one(exports.interviews, {
            fields: [exports.scheduledInterviews.interviewId],
            references: [exports.interviews.id],
        }),
    });
});
exports.feedbackRelations = (0, drizzle_orm_1.relations)(exports.feedback, function (_a) {
    var one = _a.one;
    return ({
        interview: one(exports.interviews, {
            fields: [exports.feedback.interviewId],
            references: [exports.interviews.id],
        }),
    });
});
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

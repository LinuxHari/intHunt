CREATE TYPE "public"."difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."level" AS ENUM('junior', 'mid', 'senior');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('technical', 'behavioral');--> statement-breakpoint
CREATE TABLE "daily_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"date" date NOT NULL,
	"interview_count" integer DEFAULT 0 NOT NULL,
	"average_score" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"total_score" integer DEFAULT 0 NOT NULL,
	"total_questions" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interview_id" uuid NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"total_score" smallint NOT NULL,
	"category_scores" jsonb NOT NULL,
	"strengths" jsonb NOT NULL,
	"areas_for_improvement" jsonb NOT NULL,
	"final_assessment" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" varchar(50) NOT NULL,
	"type" "type" NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"level" "level" NOT NULL,
	"tech_stack" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"description" varchar(500) NOT NULL,
	"questions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"question_count" smallint DEFAULT 0 NOT NULL,
	"rating" jsonb DEFAULT '{"average":0,"count":0}'::jsonb NOT NULL,
	"average_score" integer DEFAULT 0 NOT NULL,
	"attendees" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduledInterviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interview_id" uuid NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"email" varchar(100) NOT NULL,
	"role" varchar(50) NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"timezone" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"user_id" varchar(36) PRIMARY KEY NOT NULL,
	"total_published_interviews" integer DEFAULT 0 NOT NULL,
	"active_published_interviews" integer DEFAULT 0 NOT NULL,
	"total_attended_interviews" integer DEFAULT 0 NOT NULL,
	"average_score" integer DEFAULT 0 NOT NULL,
	"average_question_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_interview_id_interviews_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduledInterviews" ADD CONSTRAINT "scheduledInterviews_interview_id_interviews_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interviews"("id") ON DELETE no action ON UPDATE no action;
CREATE TYPE "public"."difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."level" AS ENUM('junior', 'mid', 'senior');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('technical', 'behavioral');--> statement-breakpoint
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
	"published_by" varchar(36) NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduledInterviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interview_id" uuid NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"timezone" varchar(128) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_interview_id_interviews_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduledInterviews" ADD CONSTRAINT "scheduledInterviews_interview_id_interviews_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "role_idx" ON "interviews" USING btree ("role");--> statement-breakpoint
CREATE INDEX "type_idx" ON "interviews" USING btree ("type");--> statement-breakpoint
CREATE INDEX "difficulty_idx" ON "interviews" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "user_interview_time_idx" ON "scheduledInterviews" USING btree ("user_id","interview_id","scheduled_at");
ALTER TABLE "interviews" ADD COLUMN "published_by" varchar(36) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "id_idx" ON "interviews" USING btree ("id");--> statement-breakpoint
CREATE INDEX "type_difficulty_role_idx" ON "interviews" USING btree ("type","difficulty","role");
CREATE TABLE "ask_ccf_conversations" (
	"id" serial PRIMARY KEY,
	"session_id" text NOT NULL,
	"user_message" text NOT NULL,
	"ai_reply" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "ask_ccf_conversations_session_idx" ON "ask_ccf_conversations" ("session_id");
CREATE TABLE "ask_ccf_inquiries" (
	"id" serial PRIMARY KEY,
	"session_hash" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"city" text NOT NULL,
	"preferred_date" text,
	"group_size" text,
	"activity" text,
	"budget" text,
	"notes" text,
	"status" text DEFAULT 'received' NOT NULL,
	"notify_error" text,
	"dedupe_key" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ask_ccf_pickup_orders" (
	"id" serial PRIMARY KEY,
	"customer_email" text NOT NULL,
	"customer_last_name" text NOT NULL,
	"order_ref" text,
	"class_name" text NOT NULL,
	"city" text NOT NULL,
	"class_date" date,
	"status" text DEFAULT 'in_studio' NOT NULL,
	"ready_on" date,
	"piece_count" integer,
	"note" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ask_ccf_rate_limits" (
	"id" serial PRIMARY KEY,
	"bucket" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ask_ccf_usage" (
	"id" serial PRIMARY KEY,
	"day" date NOT NULL,
	"model" text NOT NULL,
	"requests" integer DEFAULT 0 NOT NULL,
	"prompt_tokens" integer DEFAULT 0 NOT NULL,
	"completion_tokens" integer DEFAULT 0 NOT NULL,
	"errors" integer DEFAULT 0 NOT NULL,
	"via_gateway" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "ask_ccf_inquiries_dedupe_key_idx" ON "ask_ccf_inquiries" ("dedupe_key");--> statement-breakpoint
CREATE INDEX "ask_ccf_pickup_email_idx" ON "ask_ccf_pickup_orders" ("customer_email");--> statement-breakpoint
CREATE UNIQUE INDEX "ask_ccf_rate_limits_bucket_idx" ON "ask_ccf_rate_limits" ("bucket");--> statement-breakpoint
CREATE UNIQUE INDEX "ask_ccf_usage_day_model_idx" ON "ask_ccf_usage" ("day","model");
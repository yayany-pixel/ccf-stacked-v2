CREATE TABLE "analytics_events" (
	"id" serial PRIMARY KEY,
	"event_name" text NOT NULL,
	"city" text DEFAULT 'unknown' NOT NULL,
	"class_name" text,
	"class_id" text,
	"placement" text,
	"click_target" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" text
);
--> statement-breakpoint
CREATE INDEX "analytics_events_name_idx" ON "analytics_events" ("event_name");--> statement-breakpoint
CREATE INDEX "analytics_events_timestamp_idx" ON "analytics_events" ("timestamp");
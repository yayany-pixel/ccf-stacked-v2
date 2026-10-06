CREATE TABLE "meta_event_deliveries" (
	"event_key" text PRIMARY KEY,
	"status" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

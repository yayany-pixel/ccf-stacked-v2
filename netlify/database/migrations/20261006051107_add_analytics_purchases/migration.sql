CREATE TABLE "analytics_purchases" (
	"transaction_id" text PRIMARY KEY,
	"status" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

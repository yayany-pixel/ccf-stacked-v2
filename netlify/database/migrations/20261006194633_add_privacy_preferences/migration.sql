CREATE TABLE "privacy_preferences" (
	"id" text PRIMARY KEY,
	"analytics" boolean DEFAULT false NOT NULL,
	"marketing" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE INDEX "privacy_preferences_expires_at_idx" ON "privacy_preferences" ("expires_at");
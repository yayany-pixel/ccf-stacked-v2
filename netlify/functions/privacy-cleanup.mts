import { getDatabase } from "@netlify/database";
import type { Config } from "@netlify/functions";

export default async function cleanupPrivacyPreferences() {
  const database = getDatabase();
  await database.sql`DELETE FROM privacy_preferences WHERE expires_at <= now()`;
}

export const config: Config = { schedule: "15 3 * * *" };

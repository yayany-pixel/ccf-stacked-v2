import { drizzle } from "drizzle-orm/netlify-db";
import * as schema from "./schema";

/**
 * Whether a usable Postgres connection exists.
 *
 * The driver's zero-argument form reads `NETLIFY_DB_URL`, which Netlify injects
 * at runtime once the database is provisioned. The other names are accepted so
 * a self-managed Postgres URL also works; they only take effect because
 * `getDb()` passes the string explicitly — the driver does not look at them.
 */
export function connectionString(): string | undefined {
  const value =
    process.env.NETLIFY_DB_URL ||
    process.env.NETLIFY_DATABASE_URL ||
    process.env.NETLIFY_DATABASE_URL_UNPOOLED ||
    process.env.DATABASE_URL;
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

function createClient() {
  // When Netlify provides the connection, let the driver resolve it itself so
  // the platform keeps control of which client it uses (see NETLIFY_DB_DRIVER).
  if (process.env.NETLIFY_DB_URL?.trim()) {
    return drizzle({ schema });
  }
  const url = connectionString();
  if (!url) throw new Error("database_not_configured");
  return drizzle({ connection: url, schema });
}

let client: ReturnType<typeof createClient> | null = null;

/**
 * Lazily create the Drizzle client.
 *
 * The driver throws at construction time without a connection string, so
 * callers check availability first and only then ask for the client. This keeps
 * route handlers importable on deploys where the database isn't configured yet.
 */
export function getDb() {
  if (!client) {
    client = createClient();
  }
  return client;
}

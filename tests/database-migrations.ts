import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { generateDrizzleJson, generateMigration } from "drizzle-kit/api-postgres";
import * as schema from "../db/schema";

async function main() {
  const migrationsDirectory = "netlify/database/migrations";
  const appliedMigrations = [
    {
      name: "20260912231237_create_ask_ccf_tables",
      checksum: "c1e1876f13817bf9f1b3bf2aa3063005f1b5d027d4cbb28ea34532c849b2c6a3",
    },
    {
      name: "20260917170000_inquiry-delivery-retries",
      checksum: "a1491679c3c278d9acc684b74c0c964b166f011a9fd77762ac8baf18de17841b",
    },
  ];

  for (const migration of appliedMigrations) {
    const sql = readFileSync(join(migrationsDirectory, migration.name, "migration.sql"));
    assert.equal(
      createHash("sha256").update(sql).digest("hex"),
      migration.checksum,
      `${migration.name} must remain unchanged because it is already applied`,
    );
  }

  const reconciliationDirectory = join(
    migrationsDirectory,
    "20261005210101_reconcile_inquiry_delivery_snapshot",
  );
  assert.equal(
    readFileSync(join(reconciliationDirectory, "migration.sql"), "utf8").trim(),
    'ALTER TABLE "ask_ccf_inquiries" ADD COLUMN IF NOT EXISTS "notify_started_at" timestamp;',
    "reconciliation must safely handle databases where the column already exists",
  );

  const snapshotPaths = readdirSync(migrationsDirectory, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .flatMap(entry => {
      const directory = join(migrationsDirectory, entry.name);
      return readdirSync(directory).includes("snapshot.json")
        ? [join(directory, "snapshot.json")]
        : [];
    })
    .sort();
  assert.ok(snapshotPaths.length > 0, "migration history must contain a schema snapshot");
  const latestSnapshot = JSON.parse(readFileSync(snapshotPaths[snapshotPaths.length - 1], "utf8"));
  const currentSnapshot = await generateDrizzleJson(schema, latestSnapshot.id);
  assert.deepEqual(
    await generateMigration(latestSnapshot, currentSnapshot),
    [],
    "migration snapshots must match the schema so deploys do not regenerate duplicate columns",
  );

  console.log("Database migration checks passed: immutable history, safe reconciliation, and no schema drift.");
}

main();

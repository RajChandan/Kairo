import * as SQLite from "expo-sqlite";
import { DB_NAME, LATEST_DB_VERSION, schemaV1, migrateToV2 } from "./schema";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync(DB_NAME);
  return db;
}

async function getUserVersion(
  database: SQLite.SQLiteDatabase
): Promise<number> {
  const rows = await database.getAllAsync<{ user_version: number }>(
    "PRAGMA user_version;"
  );
  return rows[0]?.user_version ?? 0;
}

async function setUserVersion(
  database: SQLite.SQLiteDatabase,
  version: number
): Promise<void> {
  await database.execAsync(`PRAGMA user_version = ${version};`);
}

export async function initDb(): Promise<void> {
  const database = await getDb();

  // Create base schema (V1) always (idempotent)
  await database.execAsync(schemaV1);

  // Migrations
  const current = await getUserVersion(database);

  if (current < 2) {
    // Apply v2 migration
    // Note: ALTER TABLE will fail if column already exists; user_version prevents repeat.
    await database.execAsync(migrateToV2);
    await setUserVersion(database, 2);
  }

  // If you add future versions: if (current < 3) { ... }
  if (LATEST_DB_VERSION < 2) {
    // no-op, just to avoid unused warning if you later restructure
  }
}

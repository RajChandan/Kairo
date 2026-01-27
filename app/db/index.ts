import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";
import {
  DB_NAME,
  LATEST_DB_VERSION,
  schemaV1,
  migrateToV2,
  migrateToV3,
} from "./schema";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync(DB_NAME);
  return db;
}

async function getUserVersion(
  database: SQLite.SQLiteDatabase,
): Promise<number> {
  const rows = await database.getAllAsync<{ user_version: number }>(
    "PRAGMA user_version;",
  );
  return rows[0]?.user_version ?? 0;
}

async function setUserVersion(
  database: SQLite.SQLiteDatabase,
  version: number,
): Promise<void> {
  await database.execAsync(`PRAGMA user_version = ${version};`);
}

export async function initDb(): Promise<void> {
  // UI-only web mode
  if (Platform.OS === "web") return;

  const database = await getDb();

  await database.execAsync(schemaV1);

  const current = await getUserVersion(database);

  if (current < 2) {
    await database.execAsync(migrateToV2);
    await setUserVersion(database, 2);
  }

  if (current < 3) {
    await database.execAsync(migrateToV3);
    await setUserVersion(database, 3);
  }

  if (LATEST_DB_VERSION < 3) {
    // no-op
  }
}

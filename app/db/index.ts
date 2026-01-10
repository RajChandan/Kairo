import * as SQLite from "expo-sqlite";
import { DB_NAME, schemaSql } from "./schema";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync(DB_NAME);
  return db;
}

export async function initDb(): Promise<void> {
  const database = await getDb();

  // Execute schema (can run multiple statements)
  await database.execAsync(schemaSql);
}

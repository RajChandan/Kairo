export const DB_NAME = "kairo.db";

// We'll manage migrations with PRAGMA user_version
export const LATEST_DB_VERSION = 2;

export const schemaV1 = `
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  start_ts INTEGER NOT NULL,
  end_ts INTEGER NOT NULL,
  notes TEXT,
  created_ts INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_activities_start_ts ON activities(start_ts);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);
`;

// v2 changes: settings table + kind/area on activities; keep old category for compatibility
export const migrateToV2 = `
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
  day_start_minutes INTEGER NOT NULL DEFAULT 390, -- 6:30 AM
  default_chunk_minutes INTEGER NOT NULL DEFAULT 30
);

INSERT OR IGNORE INTO settings (id, day_start_minutes, default_chunk_minutes)
VALUES (1, 390, 30);

ALTER TABLE activities ADD COLUMN kind TEXT NOT NULL DEFAULT 'Productive';
ALTER TABLE activities ADD COLUMN area TEXT NOT NULL DEFAULT 'Startup';
`;

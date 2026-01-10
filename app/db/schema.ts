export const DB_NAME = "kairo.db";

export const schemaSql = `
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

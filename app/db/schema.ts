export const DB_NAME = "kairo.db";
export const LATEST_DB_VERSION = 3;

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

// V2: settings + kind/area text (older)
export const migrateToV2 = `
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
  day_start_minutes INTEGER NOT NULL DEFAULT 390,
  default_chunk_minutes INTEGER NOT NULL DEFAULT 30
);

INSERT OR IGNORE INTO settings (id, day_start_minutes, default_chunk_minutes)
VALUES (1, 390, 30);

ALTER TABLE activities ADD COLUMN kind TEXT NOT NULL DEFAULT 'Productive';
ALTER TABLE activities ADD COLUMN area TEXT NOT NULL DEFAULT 'Startup';
`;

// V3: user-defined kinds/areas + activity references by id + defaults
export const migrateToV3 = `
CREATE TABLE IF NOT EXISTS kinds (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL UNIQUE,
  color TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_ts INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS areas (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL UNIQUE,
  color TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_ts INTEGER NOT NULL
);

ALTER TABLE activities ADD COLUMN kind_id TEXT;
ALTER TABLE activities ADD COLUMN area_id TEXT;

ALTER TABLE settings ADD COLUMN default_kind_id TEXT;
ALTER TABLE settings ADD COLUMN default_area_id TEXT;

-- Seed defaults (fixed IDs so we can set defaults reliably)
INSERT OR IGNORE INTO kinds (id, name, color, is_active, created_ts) VALUES
('kind_productive', 'Productive', '#22c55e', 1, strftime('%s','now')*1000),
('kind_casual',     'Casual',     '#3b82f6', 1, strftime('%s','now')*1000),
('kind_other',      'Other',      '#6b7280', 1, strftime('%s','now')*1000);

INSERT OR IGNORE INTO areas (id, name, color, is_active, created_ts) VALUES
('area_startup',   'Startup',   '#f97316', 1, strftime('%s','now')*1000),
('area_job',       'Job',       '#0ea5e9', 1, strftime('%s','now')*1000),
('area_health',    'Health',    '#22c55e', 1, strftime('%s','now')*1000),
('area_learning',  'Learning',  '#6366f1', 1, strftime('%s','now')*1000),
('area_personal',  'Personal',  '#a855f7', 1, strftime('%s','now')*1000);

-- Backfill existing activities (best-effort: use old text columns if present)
UPDATE activities SET
  kind_id = COALESCE(kind_id,
    CASE kind
      WHEN 'Productive' THEN 'kind_productive'
      WHEN 'Casual' THEN 'kind_casual'
      WHEN 'Other' THEN 'kind_other'
      ELSE 'kind_other'
    END
  ),
  area_id = COALESCE(area_id,
    CASE area
      WHEN 'Startup' THEN 'area_startup'
      WHEN 'Job' THEN 'area_job'
      WHEN 'Health' THEN 'area_health'
      WHEN 'Learning' THEN 'area_learning'
      WHEN 'Personal' THEN 'area_personal'
      ELSE 'area_personal'
    END
  );

-- Set defaults if empty
UPDATE settings SET
  default_kind_id = COALESCE(default_kind_id, 'kind_productive'),
  default_area_id = COALESCE(default_area_id, 'area_startup')
WHERE id = 1;
`;

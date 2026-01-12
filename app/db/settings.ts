import { getDb } from "./index";

export type Settings = {
  day_start_minutes: number; // e.g. 390 = 6:30 AM
  default_chunk_minutes: number; // e.g. 30
};

export async function getSettings(): Promise<Settings> {
  const db = await getDb();
  const rows = await db.getAllAsync<Settings>(
    `SELECT day_start_minutes, default_chunk_minutes FROM settings WHERE id = 1`
  );
  // Should exist because migration inserts it, but fallback anyway:
  return rows[0] ?? { day_start_minutes: 390, default_chunk_minutes: 30 };
}

export async function updateSettings(
  partial: Partial<Settings>
): Promise<void> {
  const current = await getSettings();
  const next = { ...current, ...partial };

  const db = await getDb();
  await db.runAsync(
    `UPDATE settings
     SET day_start_minutes = ?, default_chunk_minutes = ?
     WHERE id = 1`,
    [next.day_start_minutes, next.default_chunk_minutes]
  );
}

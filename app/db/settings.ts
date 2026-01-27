import { getDb } from "./index";

export type Settings = {
  day_start_minutes: number;
  default_chunk_minutes: number;
  default_kind_id: string | null;
  default_area_id: string | null;
};

export async function getSettings(): Promise<Settings> {
  const db = await getDb();
  const rows = await db.getAllAsync<Settings>(
    `SELECT day_start_minutes, default_chunk_minutes, default_kind_id, default_area_id
     FROM settings WHERE id = 1`,
  );
  return (
    rows[0] ?? {
      day_start_minutes: 390,
      default_chunk_minutes: 30,
      default_kind_id: "kind_productive",
      default_area_id: "area_startup",
    }
  );
}

export async function updateSettings(
  partial: Partial<Settings>,
): Promise<void> {
  const current = await getSettings();
  const next = { ...current, ...partial };

  const db = await getDb();
  await db.runAsync(
    `UPDATE settings
     SET day_start_minutes = ?,
         default_chunk_minutes = ?,
         default_kind_id = ?,
         default_area_id = ?
     WHERE id = 1`,
    [
      next.day_start_minutes,
      next.default_chunk_minutes,
      next.default_kind_id,
      next.default_area_id,
    ],
  );
}

import { getDb } from "./index";

export type AreaRow = {
  id: string;
  name: string;
  color: string | null;
  is_active: number;
  created_ts: number;
};

function uuid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export async function listAreas(activeOnly = true): Promise<AreaRow[]> {
  const db = await getDb();
  const where = activeOnly ? "WHERE is_active = 1" : "";
  return db.getAllAsync<AreaRow>(
    `SELECT * FROM areas ${where} ORDER BY created_ts ASC`,
  );
}

export async function addArea(name: string): Promise<void> {
  const db = await getDb();
  const trimmed = name.trim();
  if (!trimmed) return;

  await db.runAsync(
    `INSERT INTO areas (id, name, color, is_active, created_ts)
     VALUES (?, ?, NULL, 1, ?)`,
    [uuid("area"), trimmed, Date.now()],
  );
}

export async function renameArea(id: string, name: string): Promise<void> {
  const db = await getDb();
  const trimmed = name.trim();
  if (!trimmed) return;
  await db.runAsync(`UPDATE areas SET name = ? WHERE id = ?`, [trimmed, id]);
}

export async function deactivateArea(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`UPDATE areas SET is_active = 0 WHERE id = ?`, [id]);
}

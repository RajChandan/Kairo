import { getDb } from "./index";

export type KindRow = {
  id: string;
  name: string;
  color: string | null;
  is_active: number;
  created_ts: number;
};

function uuid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export async function listKinds(activeOnly = true): Promise<KindRow[]> {
  const db = await getDb();
  const where = activeOnly ? "WHERE is_active = 1" : "";
  return db.getAllAsync<KindRow>(
    `SELECT * FROM kinds ${where} ORDER BY created_ts ASC`,
  );
}

export async function addKind(name: string): Promise<void> {
  const db = await getDb();
  const trimmed = name.trim();
  if (!trimmed) return;

  await db.runAsync(
    `INSERT INTO kinds (id, name, color, is_active, created_ts)
     VALUES (?, ?, NULL, 1, ?)`,
    [uuid("kind"), trimmed, Date.now()],
  );
}

export async function renameKind(id: string, name: string): Promise<void> {
  const db = await getDb();
  const trimmed = name.trim();
  if (!trimmed) return;
  await db.runAsync(`UPDATE kinds SET name = ? WHERE id = ?`, [trimmed, id]);
}

export async function deactivateKind(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`UPDATE kinds SET is_active = 0 WHERE id = ?`, [id]);
}

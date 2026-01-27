import { getDb } from "./index";

export type Activity = {
  id: string;
  title: string;
  category: string; // keep for now (legacy)
  start_ts: number;
  end_ts: number;
  notes: string | null;
  created_ts: number;

  kind_id: string | null;
  area_id: string | null;

  // joined display fields (optional)
  kind_name?: string | null;
  area_name?: string | null;
};

export async function insertActivity(activity: Activity): Promise<void> {
  const db = await getDb();

  await db.runAsync(
    `INSERT INTO activities
     (id, title, category, start_ts, end_ts, notes, created_ts, kind_id, area_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      activity.id,
      activity.title,
      activity.category,
      activity.start_ts,
      activity.end_ts,
      activity.notes,
      activity.created_ts,
      activity.kind_id,
      activity.area_id,
    ],
  );
}

export async function listActivitiesBetween(
  startTs: number,
  endTs: number,
): Promise<Activity[]> {
  const db = await getDb();

  return db.getAllAsync<Activity>(
    `SELECT
        a.*,
        k.name as kind_name,
        ar.name as area_name
     FROM activities a
     LEFT JOIN kinds k ON k.id = a.kind_id
     LEFT JOIN areas ar ON ar.id = a.area_id
     WHERE a.start_ts >= ? AND a.start_ts < ?
     ORDER BY a.start_ts ASC`,
    [startTs, endTs],
  );
}

export async function deleteActivity(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM activities WHERE id = ?`, [id]);
}

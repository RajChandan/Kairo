import { getDb } from "./index";

export type Kind = "Productive" | "Casual" | "Other";

export type Area =
  | "Startup"
  | "Job"
  | "Health"
  | "Learning"
  | "Rest"
  | "Personal"
  | "Admin";

export type Activity = {
  id: string;
  title: string;
  // keep category for backward compatibility (can delete later)
  category: string;
  kind: Kind;
  area: Area;
  start_ts: number;
  end_ts: number;
  notes: string | null;
  created_ts: number;
};

export async function insertActivity(activity: Activity): Promise<void> {
  const db = await getDb();

  await db.runAsync(
    `INSERT INTO activities 
     (id, title, category, kind, area, start_ts, end_ts, notes, created_ts)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      activity.id,
      activity.title,
      activity.category,
      activity.kind,
      activity.area,
      activity.start_ts,
      activity.end_ts,
      activity.notes,
      activity.created_ts,
    ]
  );
}

export async function listActivitiesBetween(
  startTs: number,
  endTs: number
): Promise<Activity[]> {
  const db = await getDb();

  const rows = await db.getAllAsync<Activity>(
    `SELECT * FROM activities
     WHERE start_ts >= ? AND start_ts < ?
     ORDER BY start_ts ASC`,
    [startTs, endTs]
  );

  return rows;
}

export async function deleteActivity(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM activities WHERE id = ?`, [id]);
}

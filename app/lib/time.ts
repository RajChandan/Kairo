export function startOfTodayMs(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function startOfTomorrowMs(): number {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d.getTime();
}

export function formatTime(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function minutesBetween(startMs: number, endMs: number): number {
  return Math.max(0, Math.round((endMs - startMs) / 60000));
}

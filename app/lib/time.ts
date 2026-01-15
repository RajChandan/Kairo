export function minutesToHhMm(m: number): { hh: number; mm: number } {
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return { hh, mm };
}

// Computes start and end timestamps for "today" based on day-start minutes
export function dayRangeForNow(dayStartMinutes: number): {
  startMs: number;
  endMs: number;
} {
  const now = new Date();
  const { hh, mm } = minutesToHhMm(dayStartMinutes);

  const start = new Date(now);
  start.setHours(hh, mm, 0, 0);

  // If we haven't reached day-start yet, today's start is yesterday at day-start
  if (now.getTime() < start.getTime()) {
    start.setDate(start.getDate() - 1);
  }

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { startMs: start.getTime(), endMs: end.getTime() };
}

export function formatTime(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function minutesBetween(startMs: number, endMs: number): number {
  return Math.max(0, Math.round((endMs - startMs) / 60000));
}

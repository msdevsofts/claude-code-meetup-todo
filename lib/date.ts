export function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isOverdue(dueDate: string | null, today: string = todayStr()): boolean {
  if (!dueDate) return false;
  return dueDate <= today;
}

export function formatDue(dueDate: string | null): string {
  if (!dueDate) return "期限なし";
  return dueDate.replaceAll("-", "/");
}

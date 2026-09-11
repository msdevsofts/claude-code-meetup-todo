export function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * 期限日までの残り日数。期限日当日は 0、期限日を過ぎていれば負の値になる。
 */
export function daysLeft(dueDate: string, today: string = todayStr()): number {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(dueDate) - Date.parse(today)) / MS_PER_DAY);
}

/**
 * 期限切れかどうか。期限日のないタスクは対象外。
 */
export function isOverdue(dueDate: string | null, today: string = todayStr()): boolean {
  if (!dueDate) return false;
  // 残り0日(=期限日当日)になった時点で警告を出したいので 0 も含める
  return daysLeft(dueDate, today) <= 0;
}

export function formatDue(dueDate: string | null): string {
  if (!dueDate) return "期限なし";
  return dueDate.replaceAll("-", "/");
}

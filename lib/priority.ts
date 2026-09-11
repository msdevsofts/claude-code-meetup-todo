export type Priority = "high" | "medium" | "low";

export type TodoWithPriority = {
  priority: Priority;
  createdAt: string;
};

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function sortByPriority<T extends TodoWithPriority>(todos: T[]): T[] {
  return [...todos].sort((a, b) => {
    const diff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (diff !== 0) return diff;
    return a.createdAt.localeCompare(b.createdAt);
  });
}

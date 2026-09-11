import { describe, it, expect } from "vitest";
import { sortByPriority } from "./priority";
import type { Priority } from "./priority";
import type { Todo } from "./store";

function makeTodo(id: string, priority: Priority, createdAt: string): Todo {
  return {
    id,
    title: `Todo ${id}`,
    dueDate: null,
    completed: false,
    createdAt,
    priority,
  };
}

describe("sortByPriority", () => {
  it("high → medium → low の順に並ぶ", () => {
    const todos = [
      makeTodo("a", "low", "2024-01-01T00:00:00.000Z"),
      makeTodo("b", "high", "2024-01-02T00:00:00.000Z"),
      makeTodo("c", "medium", "2024-01-03T00:00:00.000Z"),
    ];
    const result = sortByPriority(todos);
    expect(result.map((t) => t.priority)).toEqual(["high", "medium", "low"]);
  });

  it("同一優先度内では createdAt 昇順(作成順)を保つ", () => {
    const todos = [
      makeTodo("a", "high", "2024-01-03T00:00:00.000Z"),
      makeTodo("b", "high", "2024-01-01T00:00:00.000Z"),
      makeTodo("c", "high", "2024-01-02T00:00:00.000Z"),
    ];
    const result = sortByPriority(todos);
    expect(result.map((t) => t.id)).toEqual(["b", "c", "a"]);
  });

  it("全て同じ優先度ならば元の作成順を保つ", () => {
    const todos = [
      makeTodo("x", "medium", "2024-01-01T00:00:00.000Z"),
      makeTodo("y", "medium", "2024-01-02T00:00:00.000Z"),
      makeTodo("z", "medium", "2024-01-03T00:00:00.000Z"),
    ];
    const result = sortByPriority(todos);
    expect(result.map((t) => t.id)).toEqual(["x", "y", "z"]);
  });

  it("空配列を渡すと空配列を返す", () => {
    expect(sortByPriority([])).toEqual([]);
  });

  it("元の配列を変更しない(immutable)", () => {
    const todos = [
      makeTodo("a", "low", "2024-01-01T00:00:00.000Z"),
      makeTodo("b", "high", "2024-01-02T00:00:00.000Z"),
    ];
    const original = [...todos];
    sortByPriority(todos);
    expect(todos.map((t) => t.id)).toEqual(original.map((t) => t.id));
  });
});

import { vi, beforeEach, describe, it, expect } from "vitest";
import path from "path";
import { sortByPriority } from "./priority";
import type { Priority } from "./priority";
import type { Todo } from "./store";

// ---------- fs モック (store 関数テスト用) ----------
const fileStore = new Map<string, string>();
// シードが走らないよう各テスト前に空配列で初期化する
const DATA_FILE = path.join(process.cwd(), "data", "todos.json");

vi.mock("fs", () => ({
  promises: {
    readFile: vi.fn(async (p: string) => {
      const v = fileStore.get(p);
      if (v === undefined) throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      return v;
    }),
    writeFile: vi.fn(async (p: string, data: string) => { fileStore.set(p, data); }),
    mkdir: vi.fn(async () => {}),
  },
}));

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

// ---------- store 関数テスト ----------
describe("store functions", () => {
  beforeEach(() => {
    fileStore.clear();
    fileStore.set(DATA_FILE, "[]");
  });

  it("addTodo: タスクを追加して返す", async () => {
    const { addTodo } = await import("./store");
    const todo = await addTodo("テスト", null);
    expect(todo.title).toBe("テスト");
    expect(todo.completed).toBe(false);
    expect(todo.dueDate).toBeNull();
  });

  it("addTodo: priority 未指定時のデフォルトは medium", async () => {
    const { addTodo } = await import("./store");
    const todo = await addTodo("デフォルト優先度", null);
    expect(todo.priority).toBe("medium");
  });

  it("addTodo: priority を指定して保存できる", async () => {
    const { addTodo } = await import("./store");
    const todo = await addTodo("高優先度", null, "high");
    expect(todo.priority).toBe("high");
  });

  it("listTodos: 追加した順(作成順)で返す", async () => {
    const { addTodo, listTodos } = await import("./store");
    await addTodo("最初", null);
    await addTodo("次", null);
    await addTodo("最後", null);
    const todos = await listTodos();
    expect(todos.map((t) => t.title)).toEqual(["最初", "次", "最後"]);
  });

  it("updateTodo: completed をトグルできる", async () => {
    const { addTodo, updateTodo } = await import("./store");
    const todo = await addTodo("トグル", null);
    expect(todo.completed).toBe(false);
    const updated = await updateTodo(todo.id, { completed: true });
    expect(updated?.completed).toBe(true);
  });

  it("updateTodo: 存在しない id には null を返す", async () => {
    const { updateTodo } = await import("./store");
    fileStore.clear();
    const result = await updateTodo("nonexistent", { completed: true });
    expect(result).toBeNull();
  });

  it("deleteTodo: タスクを削除して true を返す", async () => {
    const { addTodo, deleteTodo, listTodos } = await import("./store");
    const todo = await addTodo("削除対象", null);
    const ok = await deleteTodo(todo.id);
    expect(ok).toBe(true);
    const todos = await listTodos();
    expect(todos.find((t) => t.id === todo.id)).toBeUndefined();
  });

  it("deleteTodo: 存在しない id には false を返す", async () => {
    const { deleteTodo } = await import("./store");
    fileStore.clear();
    const ok = await deleteTodo("nonexistent");
    expect(ok).toBe(false);
  });
});

// ---------- sortByPriority テスト ----------
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

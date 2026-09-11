import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Todo } from "@/lib/store";

// next/server モック
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((data: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => data,
    })),
  },
}));

// store モック
const mockListTodos = vi.fn();
const mockUpdateTodo = vi.fn();
const mockDeleteTodo = vi.fn();
vi.mock("@/lib/store", () => ({
  listTodos: (...args: unknown[]) => mockListTodos(...args),
  updateTodo: (...args: unknown[]) => mockUpdateTodo(...args),
  deleteTodo: (...args: unknown[]) => mockDeleteTodo(...args),
}));

const BASE_TODO: Todo = {
  id: "t1",
  title: "テスト",
  dueDate: null,
  completed: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  priority: "medium",
};

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe("PATCH /api/todos/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("完了を未完了 → 完了にトグルできる", async () => {
    mockListTodos.mockResolvedValue([BASE_TODO]);
    const toggled = { ...BASE_TODO, completed: true };
    mockUpdateTodo.mockResolvedValue(toggled);
    const { PATCH } = await import("./route");
    const res = await PATCH(new Request("http://localhost"), makeParams("t1"));
    expect(res.status).toBe(200);
    expect((await res.json()).completed).toBe(true);
    expect(mockUpdateTodo).toHaveBeenCalledWith("t1", { completed: true });
  });

  it("完了 → 未完了にトグルできる", async () => {
    const doneTodo = { ...BASE_TODO, completed: true };
    mockListTodos.mockResolvedValue([doneTodo]);
    mockUpdateTodo.mockResolvedValue({ ...doneTodo, completed: false });
    const { PATCH } = await import("./route");
    const res = await PATCH(new Request("http://localhost"), makeParams("t1"));
    expect(mockUpdateTodo).toHaveBeenCalledWith("t1", { completed: false });
    expect((await res.json()).completed).toBe(false);
  });

  it("存在しない id のとき 404 を返す", async () => {
    mockListTodos.mockResolvedValue([]);
    const { PATCH } = await import("./route");
    const res = await PATCH(new Request("http://localhost"), makeParams("unknown"));
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/todos/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("タスクを削除して ok: true を返す", async () => {
    mockDeleteTodo.mockResolvedValue(true);
    const { DELETE } = await import("./route");
    const res = await DELETE(new Request("http://localhost"), makeParams("t1"));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });

  it("存在しない id のとき 404 を返す", async () => {
    mockDeleteTodo.mockResolvedValue(false);
    const { DELETE } = await import("./route");
    const res = await DELETE(new Request("http://localhost"), makeParams("unknown"));
    expect(res.status).toBe(404);
  });
});

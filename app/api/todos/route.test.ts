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
const mockAddTodo = vi.fn();
const mockListTodos = vi.fn();
vi.mock("@/lib/store", () => ({
  addTodo: (...args: unknown[]) => mockAddTodo(...args),
  listTodos: (...args: unknown[]) => mockListTodos(...args),
}));

function makeReq(body: unknown): Request {
  return new Request("http://localhost/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/todos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAddTodo.mockResolvedValue({ id: "x", title: "test", priority: "medium", completed: false, dueDate: null, createdAt: "" } satisfies Todo);
  });

  it("タスク名が空文字のとき 400 を返す", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeReq({ title: "" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("タスク名を入力してください");
  });

  it("タスク名が空白のみのとき 400 を返す", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeReq({ title: "   " }));
    expect(res.status).toBe(400);
  });

  it("タスク名が 100 文字を超えるとき 400 を返す", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeReq({ title: "あ".repeat(101) }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("タスク名は100文字以内で入力してください");
  });

  it("タスク名がちょうど 100 文字のとき 201 を返す", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeReq({ title: "あ".repeat(100) }));
    expect(res.status).toBe(201);
  });

  it("priority 未指定のとき medium で addTodo を呼ぶ", async () => {
    const { POST } = await import("./route");
    await POST(makeReq({ title: "タスク" }));
    expect(mockAddTodo).toHaveBeenCalledWith("タスク", null, "medium");
  });

  it("priority: high を指定して addTodo を呼ぶ", async () => {
    const { POST } = await import("./route");
    await POST(makeReq({ title: "タスク", priority: "high" }));
    expect(mockAddTodo).toHaveBeenCalledWith("タスク", null, "high");
  });

  it("不正な priority は medium にフォールバックする", async () => {
    const { POST } = await import("./route");
    await POST(makeReq({ title: "タスク", priority: "invalid" }));
    expect(mockAddTodo).toHaveBeenCalledWith("タスク", null, "medium");
  });
});

describe("GET /api/todos", () => {
  beforeEach(() => vi.clearAllMocks());

  it("todos の一覧を返す", async () => {
    const todos: Todo[] = [
      { id: "1", title: "A", priority: "high", completed: false, dueDate: null, createdAt: "" },
    ];
    mockListTodos.mockResolvedValue(todos);
    const { GET } = await import("./route");
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(todos);
  });
});

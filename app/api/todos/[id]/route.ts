import { NextResponse } from "next/server";
import { deleteTodo, listTodos, updateTodo } from "@/lib/store";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const todos = await listTodos();
  const target = todos.find((t) => t.id === id);
  if (!target) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const updated = await updateTodo(id, { completed: !target.completed });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = await deleteTodo(id);
  if (!ok) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

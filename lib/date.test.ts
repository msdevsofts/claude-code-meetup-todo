import { describe, it, expect } from "vitest";
import { daysLeft, isOverdue, formatDue } from "./date";

describe("daysLeft", () => {
  it("期限日当日は 0 を返す", () => {
    expect(daysLeft("2026-07-01", "2026-07-01")).toBe(0);
  });

  it("期限日を過ぎていれば負の値を返す", () => {
    expect(daysLeft("2026-06-29", "2026-07-01")).toBe(-2);
  });

  it("期限日が未来なら正の値を返す", () => {
    expect(daysLeft("2026-07-05", "2026-07-01")).toBe(4);
  });
});

describe("isOverdue", () => {
  it("期限日がなければ期限切れにならない", () => {
    expect(isOverdue(null, "2026-07-01")).toBe(false);
  });

  it("期限日を過ぎていれば期限切れになる", () => {
    expect(isOverdue("2026-06-30", "2026-07-01")).toBe(true);
  });

  it("期限日当日は期限切れにならない", () => {
    expect(isOverdue("2026-07-01", "2026-07-01")).toBe(false);
  });

  it("期限日が未来なら期限切れにならない", () => {
    expect(isOverdue("2026-07-02", "2026-07-01")).toBe(false);
  });
});

describe("formatDue", () => {
  it("formats a due date with slashes", () => {
    expect(formatDue("2026-07-01")).toBe("2026/07/01");
  });

  it("returns a placeholder when there is no due date", () => {
    expect(formatDue(null)).toBe("期限なし");
  });
});

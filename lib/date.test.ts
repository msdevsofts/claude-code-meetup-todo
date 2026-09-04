import { describe, it, expect } from "vitest";
import { isOverdue, formatDue } from "./date";

describe("isOverdue", () => {
  it("returns false when there is no due date", () => {
    expect(isOverdue(null, "2026-07-01")).toBe(false);
  });

  it("returns true when the due date is in the past", () => {
    expect(isOverdue("2026-06-30", "2026-07-01")).toBe(true);
  });

  it("returns true when the due date is today", () => {
    expect(isOverdue("2026-07-01", "2026-07-01")).toBe(true);
  });

  it("returns false when the due date is in the future", () => {
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

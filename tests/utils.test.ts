import { describe, it, expect } from "vitest";
import { formatDuration, formatTimeSeconds, formatCurrency, truncateText } from "@/lib/utils";

describe("Utility Functions", () => {
  it("formats minutes into hours and minutes properly", () => {
    expect(formatDuration(169)).toBe("2h 49m");
    expect(formatDuration(60)).toBe("1h");
    expect(formatDuration(45)).toBe("45m");
    expect(formatDuration(0)).toBe("N/A");
    expect(formatDuration(null)).toBe("N/A");
  });

  it("formats seconds into video player timestamps", () => {
    expect(formatTimeSeconds(0)).toBe("00:00");
    expect(formatTimeSeconds(75)).toBe("01:15");
    expect(formatTimeSeconds(3665)).toBe("1:01:05");
  });

  it("formats currency in USD correctly", () => {
    expect(formatCurrency(1999)).toBe("$19.99");
    expect(formatCurrency(899)).toBe("$8.99");
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("truncates long text properly with ellipsis", () => {
    const text = "A long synopsis of an interstellar adventure in deep space";
    expect(truncateText(text, 18)).toBe("A long synopsis of...");
    expect(truncateText("Short", 10)).toBe("Short");
  });
});

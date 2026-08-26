import { describe, it, expect } from "vitest";

describe("Recommendation & Watch Math", () => {
  it("calculates watch progress percentages accurately", () => {
    const calculateProgress = (progress: number, duration: number) => {
      if (!duration || duration <= 0) return 0;
      return Math.min(100, Math.round((progress / duration) * 100));
    };

    expect(calculateProgress(3600, 7200)).toBe(50);
    expect(calculateProgress(7200, 7200)).toBe(100);
    expect(calculateProgress(0, 7200)).toBe(0);
    expect(calculateProgress(100, 0)).toBe(0);
  });

  it("marks videos as completed when threshold >= 92%", () => {
    const isCompleted = (progress: number, duration: number) => {
      return duration > 0 ? progress / duration >= 0.92 : false;
    };

    expect(isCompleted(930, 1000)).toBe(true);
    expect(isCompleted(800, 1000)).toBe(false);
    expect(isCompleted(0, 1000)).toBe(false);
  });
});

import { describe, it, expect } from "vitest";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const profileSchema = z.object({
  name: z.string().min(1, "Profile name is required").max(20, "Name too long"),
  avatar: z.string().optional(),
  isKids: z.boolean().optional(),
});

describe("API Input Validations", () => {
  it("validates successful user registration", () => {
    const valid = {
      name: "John Doe",
      email: "john@streamflix.com",
      password: "securepassword123",
    };
    const res = registerSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("rejects invalid emails and short passwords", () => {
    const invalidEmail = {
      name: "John Doe",
      email: "invalid-email",
      password: "securepassword123",
    };
    expect(registerSchema.safeParse(invalidEmail).success).toBe(false);

    const shortPass = {
      name: "John Doe",
      email: "john@streamflix.com",
      password: "123",
    };
    expect(registerSchema.safeParse(shortPass).success).toBe(false);
  });

  it("validates profile creation constraints", () => {
    expect(profileSchema.safeParse({ name: "Alex", isKids: true }).success).toBe(true);
    expect(profileSchema.safeParse({ name: "" }).success).toBe(false);
    expect(profileSchema.safeParse({ name: "a".repeat(25) }).success).toBe(false);
  });
});

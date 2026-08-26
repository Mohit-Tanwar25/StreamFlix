"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // Automatically sign in the user
      const loginRes = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        router.push("/login?registered=true");
      } else {
        router.push("/profiles");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected registration error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-cinema-black selection:bg-brand selection:text-white">
      <div className="absolute inset-0 z-0 opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/40 via-cinema-black to-cinema-black" />

      <div className="absolute top-6 left-6 sm:left-12 z-10">
        <Link href="/" className="text-2xl sm:text-3xl font-black text-brand tracking-tighter drop-shadow-md">
          STREAMFLIX
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md bg-cinema-card/90 border border-cinema-border/70 backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-cinema-muted mt-1">
            Unlimited movies, TV shows, and personalized profiles.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <p className="text-[11px] text-cinema-muted">
            By signing up, you agree to StreamFlix&apos;s Terms of Service and Privacy Policy.
          </p>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-lg"
            isLoading={isLoading}
          >
            Create Membership
          </Button>
        </form>

        <div className="text-center text-xs text-cinema-muted pt-2 border-t border-cinema-border/40">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:text-brand font-semibold underline">
            Sign In.
          </Link>
        </div>
      </div>
    </div>
  );
}

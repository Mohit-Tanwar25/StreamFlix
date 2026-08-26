"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ShieldCheck, User } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/browse";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
        return;
      }

      router.push("/profiles");
      router.refresh();
    } catch (err: any) {
      setError("An unexpected authentication error occurred.");
      setIsLoading(false);
    }
  };

  const handleFillDemoUser = () => {
    setEmail("demo@streamflix.com");
    setPassword("DemoPass123!");
    setError(null);
  };

  const handleFillAdmin = () => {
    setEmail("admin@streamflix.com");
    setPassword("AdminPass123!");
    setError(null);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-cinema-black selection:bg-brand selection:text-white">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/40 via-cinema-black to-cinema-black" />

      {/* Top Brand Link */}
      <div className="absolute top-6 left-6 sm:left-12 z-10">
        <Link href="/" className="text-2xl sm:text-3xl font-black text-brand tracking-tighter drop-shadow-md">
          STREAMFLIX
        </Link>
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md bg-cinema-card/90 border border-cinema-border/70 backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Sign In
          </h1>
          <p className="text-xs sm:text-sm text-cinema-muted mt-1">
            Access your personalized profiles and streaming library.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-cinema-muted hover:text-white transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-lg"
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>

        {/* Demo Quick Fill Shortcuts */}
        <div className="space-y-2 pt-2 border-t border-cinema-border/40">
          <p className="text-[11px] font-semibold text-cinema-muted uppercase tracking-wider text-center">
            One-Click Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleFillDemoUser}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-cinema-surface hover:bg-cinema-surfaceLight border border-cinema-border/50 text-xs text-zinc-300 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-brand" />
              Demo User
            </button>
            <button
              type="button"
              onClick={handleFillAdmin}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-cinema-surface hover:bg-cinema-surfaceLight border border-cinema-border/50 text-xs text-zinc-300 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Admin
            </button>
          </div>
        </div>

        {/* Registration Link */}
        <div className="text-center text-xs text-cinema-muted">
          New to StreamFlix?{" "}
          <Link href="/register" className="text-white hover:text-brand font-semibold underline">
            Sign up now.
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-cinema-black" />}>
      <LoginForm />
    </React.Suspense>
  );
}

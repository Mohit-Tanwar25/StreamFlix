"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-cinema-black selection:bg-brand selection:text-white">
      <div className="absolute top-6 left-6 sm:left-12 z-10">
        <Link href="/" className="text-2xl sm:text-3xl font-black text-brand tracking-tighter drop-shadow-md">
          STREAMFLIX
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md bg-cinema-card/90 border border-cinema-border/70 backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-2xl space-y-6">
        {isSubmitted ? (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white">Reset Link Sent</h2>
            <p className="text-xs text-cinema-muted leading-relaxed">
              If an account with <span className="text-white font-medium">{email}</span> exists,
              we have sent instructions to reset your password.
            </p>
            <Link href="/login" className="block pt-2">
              <Button variant="primary" size="md" className="w-full">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Forgot Password
              </h1>
              <p className="text-xs sm:text-sm text-cinema-muted mt-1">
                Enter your email address and we will send you a link to reset your password.
              </p>
            </div>

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

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-bold shadow-lg"
                isLoading={isLoading}
              >
                Send Password Reset Email
              </Button>
            </form>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-cinema-muted hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

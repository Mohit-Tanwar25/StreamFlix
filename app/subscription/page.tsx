"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/stripe";
import { Check, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

function SubscriptionContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const planParam = searchParams.get("plan");

  const [selectedPlanId, setSelectedPlanId] = useState("premium");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (success) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [success]);

  const handleSubscribe = async (planId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cinema-black text-white selection:bg-brand selection:text-white pb-20">
      <Navbar />

      <main className="pt-24 sm:pt-28 px-4 sm:px-8 md:px-12 max-w-6xl mx-auto space-y-10">
        {/* Success Banner */}
        {success && (
          <div className="p-4 sm:p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-4 animate-slide-up">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Subscription Active!</h3>
              <p className="text-xs sm:text-sm text-zinc-300">
                Thank you for subscribing to the {planParam || "StreamFlix"} plan. You now have unlimited access to ultra-high-definition streaming!
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="brand" className="mb-1">
            Flexible Plans
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Choose the right plan for you
          </h1>
          <p className="text-sm sm:text-base text-cinema-muted">
            Watch all you want. Cancel at any time. No commitments or hidden fees.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Plans Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 bg-cinema-card border ${
                  isSelected
                    ? "border-brand ring-2 ring-brand/50 shadow-2xl shadow-brand/10 scale-105"
                    : "border-cinema-border/60 hover:border-zinc-500"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand text-white text-[11px] font-extrabold uppercase tracking-wider py-1 px-4 rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white">
                        {plan.price}
                      </span>
                      <span className="text-xs text-cinema-muted">/ month</span>
                    </div>
                  </div>

                  {/* Plan Features */}
                  <div className="space-y-3 border-t border-cinema-border/50 pt-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-cinema-muted">Video Quality:</span>
                      <span className="text-white font-semibold">{plan.quality}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-cinema-muted">Resolution:</span>
                      <span className="text-white font-semibold">{plan.resolution}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-cinema-muted">Supported Devices:</span>
                      <span className="text-white font-semibold">{plan.devices} at a time</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 pt-2 border-t border-cinema-border/40">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Button
                    variant={isSelected ? "primary" : "outline"}
                    size="lg"
                    isLoading={isLoading && isSelected}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscribe(plan.id);
                    }}
                    className="w-full font-bold"
                  >
                    Select {plan.name}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Guarantee Note */}
        <div className="flex items-center justify-center gap-2 text-xs text-cinema-muted pt-4">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Encrypted 256-bit SSL checkout powered by Stripe. Cancel anytime.</span>
        </div>
      </main>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-cinema-black" />}>
      <SubscriptionContent />
    </React.Suspense>
  );
}

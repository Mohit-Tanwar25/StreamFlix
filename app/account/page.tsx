import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { User, CreditCard, ShieldCheck, Calendar, Film } from "lucide-react";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      profiles: true,
      subscription: true,
      payments: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const activeSubscription = user.subscription;

  return (
    <div className="min-h-screen bg-cinema-black text-white selection:bg-brand selection:text-white pb-20">
      <Navbar />

      <main className="pt-24 sm:pt-28 px-4 sm:px-8 md:px-12 max-w-5xl mx-auto space-y-8">
        <div className="border-b border-cinema-border/50 pb-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Account & Settings
          </h1>
          <p className="text-xs sm:text-sm text-cinema-muted mt-1">
            Manage your membership, billing, and streaming profiles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: User Profile & Membership Card */}
          <div className="p-6 rounded-2xl bg-cinema-card border border-cinema-border/60 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-brand">
                <Image
                  src={user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                  alt={user.name || "User"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{user.name || "Subscriber"}</h3>
                <p className="text-xs text-cinema-muted">{user.email}</p>
                <div className="mt-1">
                  <Badge variant={user.role === "ADMIN" ? "brand" : "outline"}>
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-cinema-border/40 space-y-2 text-xs text-zinc-400">
              <div className="flex items-center justify-between">
                <span>Member since:</span>
                <span className="text-white font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Profiles:</span>
                <span className="text-white font-medium">{user.profiles.length} of 5</span>
              </div>
            </div>

            <Link href="/profiles" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Manage Profiles
              </Button>
            </Link>
          </div>

          {/* Right: Subscription Plan Details */}
          <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl bg-cinema-card border border-cinema-border/60 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cinema-border/40 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand" />
                  Plan Details
                </h3>
                <p className="text-xs text-cinema-muted">
                  Your current streaming subscription tier
                </p>
              </div>

              <Link href="/subscription">
                <Button variant="primary" size="sm" className="text-xs font-semibold">
                  Change Plan
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-cinema-surface border border-cinema-border/50">
                <div>
                  <h4 className="text-base font-bold text-white">
                    {activeSubscription ? `${activeSubscription.plan} Plan` : "No Active Plan"}
                  </h4>
                  <p className="text-xs text-cinema-muted mt-0.5">
                    {activeSubscription?.status === "active"
                      ? "4K Ultra HD + HDR, 4 devices simultaneously"
                      : "Choose a plan to enable uninterrupted streaming"}
                  </p>
                </div>
                <Badge variant={activeSubscription?.status === "active" ? "success" : "warning"}>
                  {activeSubscription?.status?.toUpperCase() || "INACTIVE"}
                </Badge>
              </div>

              {/* Billing Info */}
              {activeSubscription?.currentPeriodEnd && (
                <p className="text-xs text-cinema-muted">
                  Your next billing date is{" "}
                  <span className="text-white font-medium">
                    {new Date(activeSubscription.currentPeriodEnd).toLocaleDateString()}
                  </span>
                  .
                </p>
              )}
            </div>

            {/* Payment History */}
            {user.payments.length > 0 && (
              <div className="pt-4 border-t border-cinema-border/40 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Recent Invoices
                </h4>
                <div className="space-y-2">
                  {user.payments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-cinema-surface/60 text-xs border border-cinema-border/30"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-cinema-muted" />
                        <span className="text-white">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="font-semibold text-emerald-400">
                        ${(p.amount / 100).toFixed(2)} USD
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

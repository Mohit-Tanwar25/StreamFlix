import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import {
  Users,
  Film,
  Tv,
  CreditCard,
  DollarSign,
  PlaySquare,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/browse");
  }

  const [
    totalUsers,
    totalMovies,
    totalShows,
    activeSubscriptions,
    payments,
    watchSessions,
    recentUsers,
    recentMovies,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.movie.count(),
    prisma.tvShow.count(),
    prisma.subscription.count({ where: { status: "active" } }),
    prisma.payment.findMany({ where: { status: "succeeded" } }),
    prisma.watchHistory.count(),
    prisma.user.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.movie.findMany({ take: 4, orderBy: { createdAt: "desc" } }),
  ]);

  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

  const stats = [
    { title: "Total Users", value: totalUsers, icon: Users, color: "text-blue-400" },
    { title: "Movies in Catalog", value: totalMovies, icon: Film, color: "text-brand-glow" },
    { title: "TV Series", value: totalShows, icon: Tv, color: "text-purple-400" },
    { title: "Active Subscriptions", value: activeSubscriptions, icon: CreditCard, color: "text-emerald-400" },
    { title: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-amber-400" },
    { title: "Watch Sessions", value: watchSessions, icon: PlaySquare, color: "text-cyan-400" },
  ];

  return (
    <div className="min-h-screen bg-cinema-black text-white selection:bg-brand selection:text-white pb-20">
      <Navbar />

      <main className="pt-24 sm:pt-28 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cinema-border/50 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="brand">ADMIN CONSOLE</Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Platform Analytics & Overview
            </h1>
            <p className="text-xs sm:text-sm text-cinema-muted mt-0.5">
              Live telemetry, media library management, and member directory.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/admin/movies">
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Add Movie
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" size="sm">
                Manage Users
              </Button>
            </Link>
          </div>
        </div>

        {/* 6 KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="p-5 sm:p-6 rounded-2xl bg-cinema-card border border-cinema-border/60 hover:border-brand/40 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cinema-muted uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <div className={`p-2.5 rounded-xl bg-cinema-surface ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {stat.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Management Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Recent Users Card */}
          <div className="p-6 rounded-2xl bg-cinema-card border border-cinema-border/60 space-y-4">
            <div className="flex items-center justify-between border-b border-cinema-border/40 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-brand" />
                Recent Signups
              </h3>
              <Link
                href="/admin/users"
                className="text-xs text-brand hover:underline flex items-center gap-1 font-semibold"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-cinema-surface border border-cinema-border/40 text-xs"
                >
                  <div>
                    <p className="font-semibold text-white">{u.name || "Anonymous"}</p>
                    <p className="text-cinema-muted">{u.email}</p>
                  </div>
                  <Badge variant={u.role === "ADMIN" ? "brand" : "outline"}>
                    {u.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Media Overview Card */}
          <div className="p-6 rounded-2xl bg-cinema-card border border-cinema-border/60 space-y-4">
            <div className="flex items-center justify-between border-b border-cinema-border/40 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-brand" />
                Catalog Additions
              </h3>
              <Link
                href="/admin/movies"
                className="text-xs text-brand hover:underline flex items-center gap-1 font-semibold"
              >
                Manage Movies <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentMovies.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-cinema-surface border border-cinema-border/40 text-xs"
                >
                  <div>
                    <p className="font-semibold text-white">{m.title}</p>
                    <p className="text-cinema-muted">{m.duration ? `${m.duration} min` : "Feature"}</p>
                  </div>
                  <span className="text-amber-400 font-bold">★ {m.rating?.toFixed(1) || "N/A"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

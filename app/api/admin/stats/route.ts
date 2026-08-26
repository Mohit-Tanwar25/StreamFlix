import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminStats } from "@/types";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const [
      totalUsers,
      totalMovies,
      totalShows,
      activeSubscriptions,
      payments,
      watchSessions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.movie.count(),
      prisma.tvShow.count(),
      prisma.subscription.count({ where: { status: "active" } }),
      prisma.payment.findMany({ where: { status: "succeeded" } }),
      prisma.watchHistory.count(),
    ]);

    const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

    const stats: AdminStats = {
      totalUsers,
      totalMovies,
      totalShows,
      activeSubscriptions,
      totalRevenue,
      watchSessions,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}

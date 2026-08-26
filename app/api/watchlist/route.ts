import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const addToWatchlistSchema = z.object({
  profileId: z.string().min(1, "Profile ID is required"),
  movieId: z.string().optional().nullable(),
  tvShowId: z.string().optional().nullable(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");

    if (!profileId) {
      return NextResponse.json({ error: "profileId is required" }, { status: 400 });
    }

    // Verify profile belongs to the session user
    const profile = await prisma.profile.findFirst({
      where: {
        id: profileId,
        user: { email: session.user.email },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found or access denied" }, { status: 403 });
    }

    const items = await prisma.watchlist.findMany({
      where: { profileId },
      include: {
        movie: {
          include: {
            genres: {
              include: { genre: true },
            },
          },
        },
        tvShow: {
          include: {
            genres: {
              include: { genre: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Watchlist GET error:", error);
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = addToWatchlistSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { profileId, movieId, tvShowId } = result.data;

    if (!movieId && !tvShowId) {
      return NextResponse.json({ error: "Either movieId or tvShowId must be provided" }, { status: 400 });
    }

    // Verify ownership
    const profile = await prisma.profile.findFirst({
      where: {
        id: profileId,
        user: { email: session.user.email },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Forbidden: Not your profile" }, { status: 403 });
    }

    // Toggle logic: if already present, delete; otherwise create
    if (movieId) {
      const existing = await prisma.watchlist.findUnique({
        where: {
          profileId_movieId: { profileId, movieId },
        },
      });

      if (existing) {
        await prisma.watchlist.delete({
          where: { id: existing.id },
        });
        return NextResponse.json({ action: "removed", id: existing.id });
      }

      const created = await prisma.watchlist.create({
        data: { profileId, movieId },
      });
      return NextResponse.json({ action: "added", item: created }, { status: 201 });
    }

    if (tvShowId) {
      const existing = await prisma.watchlist.findUnique({
        where: {
          profileId_tvShowId: { profileId, tvShowId },
        },
      });

      if (existing) {
        await prisma.watchlist.delete({
          where: { id: existing.id },
        });
        return NextResponse.json({ action: "removed", id: existing.id });
      }

      const created = await prisma.watchlist.create({
        data: { profileId, tvShowId },
      });
      return NextResponse.json({ action: "added", item: created }, { status: 201 });
    }
  } catch (error) {
    console.error("Watchlist POST error:", error);
    return NextResponse.json({ error: "Failed to update watchlist" }, { status: 500 });
  }
}

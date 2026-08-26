import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ratingSchema = z.object({
  profileId: z.string().min(1),
  movieId: z.string().optional().nullable(),
  tvShowId: z.string().optional().nullable(),
  rating: z.number().min(1).max(5),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");
    const movieId = searchParams.get("movieId");
    const tvShowId = searchParams.get("tvShowId");

    if (!profileId) {
      return NextResponse.json({ error: "profileId is required" }, { status: 400 });
    }

    if (movieId) {
      const existing = await prisma.rating.findUnique({
        where: {
          profileId_movieId: { profileId, movieId },
        },
      });
      return NextResponse.json({ rating: existing ? existing.rating : 0 });
    }

    if (tvShowId) {
      const existing = await prisma.rating.findUnique({
        where: {
          profileId_tvShowId: { profileId, tvShowId },
        },
      });
      return NextResponse.json({ rating: existing ? existing.rating : 0 });
    }

    return NextResponse.json({ rating: 0 });
  } catch (error) {
    console.error("Rating GET error:", error);
    return NextResponse.json({ error: "Failed to fetch rating" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = ratingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { profileId, movieId, tvShowId, rating } = result.data;

    if (movieId) {
      const saved = await prisma.rating.upsert({
        where: {
          profileId_movieId: { profileId, movieId },
        },
        update: { rating },
        create: { profileId, movieId, rating },
      });
      return NextResponse.json(saved);
    }

    if (tvShowId) {
      const saved = await prisma.rating.upsert({
        where: {
          profileId_tvShowId: { profileId, tvShowId },
        },
        update: { rating },
        create: { profileId, tvShowId, rating },
      });
      return NextResponse.json(saved);
    }

    return NextResponse.json({ error: "Missing movieId or tvShowId" }, { status: 400 });
  } catch (error) {
    console.error("Rating POST error:", error);
    return NextResponse.json({ error: "Failed to save rating" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateHistorySchema = z.object({
  profileId: z.string().min(1),
  movieId: z.string().optional().nullable(),
  episodeId: z.string().optional().nullable(),
  progress: z.number().min(0),
  duration: z.number().min(0),
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

    const history = await prisma.watchHistory.findMany({
      where: {
        profileId,
        progress: { gt: 0 },
        completed: false,
      },
      include: {
        movie: true,
        episode: {
          include: {
            season: {
              include: {
                tvShow: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 12,
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Watch history GET error:", error);
    return NextResponse.json({ error: "Failed to fetch watch history" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = updateHistorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { profileId, movieId, episodeId, progress, duration } = result.data;
    const completed = duration > 0 ? progress / duration >= 0.92 : false;

    if (movieId) {
      const history = await prisma.watchHistory.upsert({
        where: {
          profileId_movieId: { profileId, movieId },
        },
        update: {
          progress: Math.floor(progress),
          duration: Math.floor(duration),
          completed,
        },
        create: {
          profileId,
          movieId,
          progress: Math.floor(progress),
          duration: Math.floor(duration),
          completed,
        },
      });

      return NextResponse.json(history);
    }

    if (episodeId) {
      const history = await prisma.watchHistory.upsert({
        where: {
          profileId_episodeId: { profileId, episodeId },
        },
        update: {
          progress: Math.floor(progress),
          duration: Math.floor(duration),
          completed,
        },
        create: {
          profileId,
          episodeId,
          progress: Math.floor(progress),
          duration: Math.floor(duration),
          completed,
        },
      });

      return NextResponse.json(history);
    }

    return NextResponse.json({ error: "Missing movieId or episodeId" }, { status: 400 });
  } catch (error) {
    console.error("Watch history POST error:", error);
    return NextResponse.json({ error: "Failed to save watch history" }, { status: 500 });
  }
}

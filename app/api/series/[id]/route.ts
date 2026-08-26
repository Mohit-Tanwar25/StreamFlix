import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const show = await prisma.tvShow.findUnique({
      where: { id: params.id },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        seasons: {
          orderBy: { seasonNumber: "asc" },
          include: {
            episodes: {
              orderBy: { episodeNumber: "asc" },
            },
          },
        },
      },
    });

    if (!show) {
      return NextResponse.json({ error: "TV show not found" }, { status: 404 });
    }

    const genreIds = show.genres.map((g) => g.genreId);
    const similarShows = await prisma.tvShow.findMany({
      where: {
        id: { not: show.id },
        genres: {
          some: {
            genreId: { in: genreIds },
          },
        },
      },
      take: 6,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    return NextResponse.json({ ...show, similar: similarShows });
  } catch (error) {
    console.error("TV Show detail GET error:", error);
    return NextResponse.json({ error: "Failed to fetch TV show details" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    await prisma.tvShow.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "TV Show deleted successfully" });
  } catch (error) {
    console.error("TV Show DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete TV show" }, { status: 500 });
  }
}

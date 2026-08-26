import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MediaItem } from "@/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");

    let preferredGenreIds: string[] = [];

    if (profileId) {
      // Find watched movies & highly rated items
      const watched = await prisma.watchHistory.findMany({
        where: { profileId },
        include: {
          movie: {
            include: { genres: true },
          },
        },
        take: 10,
      });

      const genreFrequency: Record<string, number> = {};
      for (const item of watched) {
        if (item.movie?.genres) {
          for (const g of item.movie.genres) {
            genreFrequency[g.genreId] = (genreFrequency[g.genreId] || 0) + 1;
          }
        }
      }

      preferredGenreIds = Object.keys(genreFrequency).sort(
        (a, b) => genreFrequency[b] - genreFrequency[a]
      );
    }

    // Query movies matching preferred genres, or top rated if no history
    const recommendedMovies = await prisma.movie.findMany({
      where: preferredGenreIds.length > 0
        ? {
            genres: {
              some: {
                genreId: { in: preferredGenreIds.slice(0, 3) },
              },
            },
          }
        : { rating: { gte: 8.0 } },
      take: 10,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    const items: MediaItem[] = recommendedMovies.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      poster: m.poster,
      backdrop: m.backdrop,
      mediaType: "movie" as const,
      rating: m.rating,
      releaseDate: m.releaseDate,
      duration: m.duration,
      maturityRating: m.maturityRating,
      videoUrl: m.videoUrl,
      trailerUrl: m.trailerUrl,
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error("Recommendations GET error:", error);
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}

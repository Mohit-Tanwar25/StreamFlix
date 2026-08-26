import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MediaItem } from "@/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const movies = await prisma.movie.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          {
            genres: {
              some: {
                genre: {
                  name: { contains: query },
                },
              },
            },
          },
        ],
      },
      take: 20,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    const shows = await prisma.tvShow.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          {
            genres: {
              some: {
                genre: {
                  name: { contains: query },
                },
              },
            },
          },
        ],
      },
      take: 20,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    const unifiedResults: MediaItem[] = [
      ...movies.map((m) => ({
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
      })),
      ...shows.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        poster: s.poster,
        backdrop: s.backdrop,
        mediaType: "tv" as const,
        rating: s.rating,
        releaseDate: s.releaseDate,
        maturityRating: s.maturityRating,
        trailerUrl: s.trailerUrl,
      })),
    ];

    return NextResponse.json({ results: unifiedResults });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Failed to search content" }, { status: 500 });
  }
}

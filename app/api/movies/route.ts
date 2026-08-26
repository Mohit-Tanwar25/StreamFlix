import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  poster: z.string().min(1, "Poster URL is required"),
  backdrop: z.string().min(1, "Backdrop URL is required"),
  trailerUrl: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  releaseDate: z.string().optional().nullable(),
  duration: z.number().optional().nullable(),
  rating: z.number().optional().nullable(),
  maturityRating: z.string().optional().nullable(),
  type: z.string().optional(),
  featured: z.boolean().optional(),
  trending: z.boolean().optional(),
  genreIds: z.array(z.string()).optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const trending = searchParams.get("trending");
    const genre = searchParams.get("genre");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const where: any = {};

    if (featured === "true") where.featured = true;
    if (trending === "true") where.trending = true;
    if (genre) {
      where.genres = {
        some: {
          genre: {
            name: {
              equals: genre,
            },
          },
        },
      };
    }

    const movies = await prisma.movie.findMany({
      where,
      take: limit,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Movies GET error:", error);
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const result = movieSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { genreIds, releaseDate, ...data } = result.data;

    const movie = await prisma.movie.create({
      data: {
        ...data,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        genres: genreIds?.length
          ? {
              create: genreIds.map((id) => ({
                genreId: id,
              })),
            }
          : undefined,
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error("Movie POST error:", error);
    return NextResponse.json({ error: "Failed to create movie" }, { status: 500 });
  }
}

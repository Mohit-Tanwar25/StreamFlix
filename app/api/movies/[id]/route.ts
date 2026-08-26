import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: params.id },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    // Find similar movies sharing same genres
    const genreIds = movie.genres.map((g) => g.genreId);
    const similarMovies = await prisma.movie.findMany({
      where: {
        id: { not: movie.id },
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

    return NextResponse.json({ ...movie, similar: similarMovies });
  } catch (error) {
    console.error("Movie detail GET error:", error);
    return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { genreIds, releaseDate, ...updateData } = body;

    const movie = await prisma.movie.update({
      where: { id: params.id },
      data: {
        ...updateData,
        releaseDate: releaseDate ? new Date(releaseDate) : undefined,
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    return NextResponse.json(movie);
  } catch (error) {
    console.error("Movie PATCH error:", error);
    return NextResponse.json({ error: "Failed to update movie" }, { status: 500 });
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

    await prisma.movie.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Movie DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 });
  }
}

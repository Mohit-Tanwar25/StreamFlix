import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/rating/rating-stars";
import { MovieGrid } from "@/components/movie-grid/movie-grid";
import { Play, ArrowLeft, Star, Film, Clock, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDuration } from "@/lib/utils";

interface MoviePageProps {
  params: { id: string };
}

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const movie = await prisma.movie.findUnique({
    where: { id: params.id },
    include: {
      genres: {
        include: { genre: true },
      },
    },
  });

  if (!movie) {
    notFound();
  }

  // Fetch similar movies
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
        include: { genre: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-cinema-black text-white selection:bg-brand selection:text-white pb-20">
      <Navbar />

      {/* Hero Backdrop Presentation */}
      <div className="relative h-[65vh] sm:h-[75vh] w-full flex items-end">
        <Image
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          fill
          priority
          className="object-cover object-center brightness-[0.75]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-black/95 via-cinema-black/40 to-transparent w-full md:w-2/3" />

        <div className="relative z-10 px-6 sm:px-12 md:px-20 pb-12 max-w-3xl space-y-4">
          <Link
            href="/movies"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Movies
          </Link>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {movie.rating && (
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                {movie.rating.toFixed(1)} / 10
              </span>
            )}
            {movie.releaseDate && (
              <span className="text-cinema-muted flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(movie.releaseDate).getFullYear()}
              </span>
            )}
            {movie.duration && (
              <span className="text-cinema-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(movie.duration)}
              </span>
            )}
            {movie.maturityRating && (
              <Badge variant="outline">{movie.maturityRating}</Badge>
            )}
            <Badge variant="hd">4K Ultra HD</Badge>
          </div>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed line-clamp-4">
            {movie.description}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <Link href={`/watch/${movie.id}`}>
              <Button variant="secondary" size="lg" className="font-bold text-black px-8">
                <Play className="w-5 h-5 fill-black mr-2" />
                Watch Movie
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Details & Additional Info */}
      <main className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Synopsis */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-white border-b border-cinema-border/50 pb-2">
              Storyline
            </h3>
            <p className="text-base text-zinc-300 leading-relaxed">
              {movie.description}
            </p>

            {/* Genres */}
            <div className="pt-4 space-y-2">
              <h4 className="text-xs font-semibold text-cinema-muted uppercase tracking-wider">
                Genres
              </h4>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 bg-cinema-surface rounded-md text-xs font-medium border border-cinema-border/60 text-white"
                  >
                    {g.genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info & Rating widget */}
          <div className="p-6 rounded-xl bg-cinema-card border border-cinema-border/60 space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-cinema-muted uppercase tracking-wider mb-2">
                Rate this movie
              </h4>
              <RatingStars movieId={movie.id} size="lg" />
            </div>

            <div className="space-y-3 text-xs text-cinema-muted border-t border-cinema-border/50 pt-4">
              <div>
                <span className="font-semibold text-white">Audio Quality:</span> Dolby Atmos / 5.1
              </div>
              <div>
                <span className="font-semibold text-white">Subtitles:</span> English, Spanish, French, German
              </div>
              <div>
                <span className="font-semibold text-white">Maturity Rating:</span> {movie.maturityRating || "PG-13"}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Recommendations */}
        {similarMovies.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-cinema-border/50">
            <h3 className="text-xl font-bold text-white">More Like This</h3>
            <MovieGrid items={similarMovies} />
          </div>
        )}
      </main>
    </div>
  );
}

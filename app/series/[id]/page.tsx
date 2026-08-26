import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/rating/rating-stars";
import { Play, ArrowLeft, Star, Clock, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDuration } from "@/lib/utils";

interface SeriesDetailPageProps {
  params: { id: string };
}

export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
  const show = await prisma.tvShow.findUnique({
    where: { id: params.id },
    include: {
      genres: {
        include: { genre: true },
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
    notFound();
  }

  const firstEpisode = show.seasons[0]?.episodes[0];

  return (
    <div className="min-h-screen bg-cinema-black text-white selection:bg-brand selection:text-white pb-20">
      <Navbar />

      {/* Hero Backdrop */}
      <div className="relative h-[65vh] sm:h-[75vh] w-full flex items-end">
        <Image
          src={show.backdrop || show.poster}
          alt={show.title}
          fill
          priority
          className="object-cover object-center brightness-[0.75]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-black/95 via-cinema-black/40 to-transparent w-full md:w-2/3" />

        <div className="relative z-10 px-6 sm:px-12 md:px-20 pb-12 max-w-3xl space-y-4">
          <Link
            href="/series"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to TV Shows
          </Link>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            {show.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {show.rating && (
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                {show.rating.toFixed(1)} / 10
              </span>
            )}
            <span className="text-cinema-muted">
              {show.seasons.length} Season{show.seasons.length > 1 ? "s" : ""}
            </span>
            {show.maturityRating && (
              <Badge variant="outline">{show.maturityRating}</Badge>
            )}
            <Badge variant="hd">Ultra HD 4K</Badge>
          </div>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed line-clamp-3">
            {show.description}
          </p>

          {firstEpisode && (
            <div className="flex items-center gap-4 pt-2">
              <Link href={`/watch/${show.id}?type=tv&episodeId=${firstEpisode.id}`}>
                <Button variant="secondary" size="lg" className="font-bold text-black px-8">
                  <Play className="w-5 h-5 fill-black mr-2" />
                  Play S1:E1
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Seasons & Episodes */}
      <main className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto py-12 space-y-12">
        {/* Episodes Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-cinema-border/50 pb-4">
            <h2 className="text-2xl font-bold text-white tracking-wide">Episodes</h2>
          </div>

          {show.seasons.map((season) => (
            <div key={season.id} className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-brand-glow">
                {season.title} ({season.episodes.length} Episodes)
              </h3>

              <div className="space-y-3">
                {season.episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-cinema-card border border-cinema-border/50 hover:border-brand/40 transition-all"
                  >
                    {/* Episode Number */}
                    <span className="text-2xl font-black text-zinc-500 group-hover:text-white transition-colors w-8 text-center hidden sm:block">
                      {episode.episodeNumber}
                    </span>

                    {/* Thumbnail with Play Hover */}
                    <div className="relative aspect-video w-full sm:w-48 rounded-lg overflow-hidden flex-shrink-0 bg-cinema-surface">
                      <Image
                        src={episode.thumbnail || show.backdrop}
                        alt={episode.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Link
                        href={`/watch/${show.id}?type=tv&episodeId=${episode.id}`}
                        className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/90 group-hover:bg-brand flex items-center justify-center text-black group-hover:text-white shadow-xl transition-all">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </Link>
                    </div>

                    {/* Episode Details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-white group-hover:text-brand transition-colors">
                          {episode.episodeNumber}. {episode.title}
                        </h4>
                        <span className="text-xs font-semibold text-cinema-muted">
                          {episode.duration}m
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2">
                        {episode.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Rating widget */}
        <div className="p-6 rounded-xl bg-cinema-card border border-cinema-border/50 max-w-md space-y-3">
          <h4 className="text-sm font-semibold text-white">Rate this series</h4>
          <RatingStars tvShowId={show.id} size="lg" />
        </div>
      </main>
    </div>
  );
}

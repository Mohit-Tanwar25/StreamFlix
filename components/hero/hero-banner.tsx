"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Play, Info, Star, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MediaItem, MovieType, TVShowType } from "@/types";
import { useProfileStore } from "@/store/useProfileStore";
import { formatDuration } from "@/lib/utils";

interface HeroBannerProps {
  movie: MediaItem | MovieType | TVShowType;
  onOpenDetail?: (movie: any) => void;
}

export function HeroBanner({ movie, onOpenDetail }: HeroBannerProps) {
  const router = useRouter();
  const { activeProfile } = useProfileStore();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const isShow = "seasons" in movie || (movie as MediaItem).mediaType === "tv";

  const handlePlay = () => {
    router.push(`/watch/${movie.id}${isShow ? "?type=tv" : ""}`);
  };

  const handleToggleWatchlist = async () => {
    if (!activeProfile?.id || isUpdating) return;
    setIsUpdating(true);
    const nextState = !isInWatchlist;
    setIsInWatchlist(nextState);

    try {
      await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: activeProfile.id,
          movieId: !isShow ? movie.id : undefined,
          tvShowId: isShow ? movie.id : undefined,
        }),
      });
    } catch (err) {
      console.error("Failed to toggle watchlist", err);
      setIsInWatchlist(!nextState);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative w-full min-h-[75vh] sm:min-h-[82vh] md:min-h-[88vh] flex items-end select-none">
      {/* High-Resolution Backdrop */}
      <div className="absolute inset-0 bg-cinema-black">
        <Image
          src={
            movie.backdrop ||
            movie.poster ||
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop&q=80"
          }
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.85]"
        />

        {/* Netflix-style Multi-Layer Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-black/95 via-cinema-black/40 to-transparent w-full md:w-3/4" />
      </div>

      {/* Content details inside Hero */}
      <div className="relative z-10 px-4 sm:px-8 md:px-16 pb-20 sm:pb-24 md:pb-28 max-w-2xl space-y-4 animate-fade-in">
        {/* Badges / Brand Tag */}
        <div className="flex items-center gap-2.5">
          <span className="bg-brand text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded tracking-widest uppercase shadow-md shadow-brand/40">
            STREAMFLIX ORIGINAL
          </span>
          {movie.maturityRating && (
            <Badge variant="outline">{movie.maturityRating}</Badge>
          )}
          {movie.rating && (
            <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {movie.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-lg">
          {movie.title}
        </h1>

        {/* Overview Synopsis */}
        <p className="text-sm sm:text-base text-zinc-300 line-clamp-3 leading-relaxed drop-shadow-md">
          {movie.description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3.5 pt-2">
          <Button
            variant="secondary"
            size="lg"
            onClick={handlePlay}
            className="font-bold text-black px-6 sm:px-8 hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            <Play className="w-5 h-5 fill-black mr-2" />
            Play
          </Button>

          <Button
            variant="glass"
            size="lg"
            onClick={() => (onOpenDetail ? onOpenDetail(movie) : router.push(isShow ? `/series/${movie.id}` : `/movies/${movie.id}`))}
            className="font-semibold px-5 sm:px-6 hover:scale-105 active:scale-95 transition-all"
          >
            <Info className="w-5 h-5 mr-2" />
            More Info
          </Button>

          <button
            onClick={handleToggleWatchlist}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
            aria-label={isInWatchlist ? "In My List" : "Add to My List"}
          >
            {isInWatchlist ? (
              <Check className="w-5 h-5 text-emerald-400" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

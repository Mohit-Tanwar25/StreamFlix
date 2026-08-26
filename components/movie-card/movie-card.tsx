"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Play, Plus, Check, Info, Star } from "lucide-react";
import { MediaItem, MovieType, TVShowType } from "@/types";
import { useProfileStore } from "@/store/useProfileStore";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";

interface MovieCardProps {
  item: MediaItem | MovieType | TVShowType;
  isWatchlist?: boolean;
  progress?: number;
  duration?: number;
  onOpenDetail?: (item: any) => void;
  onWatchlistChanged?: () => void;
}

export function MovieCard({
  item,
  isWatchlist: initialWatchlist = false,
  progress,
  duration,
  onOpenDetail,
  onWatchlistChanged,
}: MovieCardProps) {
  const router = useRouter();
  const { activeProfile } = useProfileStore();
  const [isInWatchlist, setIsInWatchlist] = useState(
    (item as any).isWatchlisted ?? initialWatchlist
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const isShow = "seasons" in item || (item as MediaItem).mediaType === "tv";
  const mediaId = item.id;
  const matchScore = Math.min(99, Math.round(((item.rating || 7.5) / 10) * 100));

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/watch/${mediaId}${isShow ? "?type=tv" : ""}`);
  };

  const handleToggleWatchlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
          movieId: !isShow ? mediaId : undefined,
          tvShowId: isShow ? mediaId : undefined,
        }),
      });
      if (onWatchlistChanged) onWatchlistChanged();
    } catch (err) {
      console.error("Failed to toggle watchlist", err);
      setIsInWatchlist(!nextState);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenDetail) {
      onOpenDetail(item);
    } else {
      router.push(isShow ? `/series/${mediaId}` : `/movies/${mediaId}`);
    }
  };

  const percentProgress =
    progress && duration && duration > 0
      ? Math.min(100, Math.round((progress / duration) * 100))
      : 0;

  return (
    <div
      className="group relative flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] cursor-pointer select-none transition-all duration-300 transform md:hover:scale-105 md:hover:z-30 rounded-lg overflow-hidden bg-cinema-card border border-cinema-border/50 hover:border-brand/40 shadow-lg hover:shadow-2xl hover:shadow-black/80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleOpenDetail}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-cinema-surface">
        <Image
          src={item.poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80"}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, 240px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {item.maturityRating && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/20 text-white">
              {item.maturityRating}
            </span>
          )}
          {item.rating && item.rating > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 bg-black/70 backdrop-blur-md rounded text-amber-400 border border-amber-400/30">
              <Star className="w-3 h-3 fill-amber-400" />
              {item.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Quick Hover Controls Overlay (Desktop) */}
        <div className="absolute inset-0 flex flex-col justify-end p-3.5 transition-opacity duration-200">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handlePlay}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white hover:bg-white/90 text-black shadow-lg transition-transform hover:scale-110 active:scale-95"
              aria-label={`Play ${item.title}`}
            >
              <Play className="w-4 h-4 fill-black ml-0.5" />
            </button>
            <button
              onClick={handleToggleWatchlist}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-black/60 hover:bg-white/20 text-white border border-white/40 backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
              aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              {isInWatchlist ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleOpenDetail}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-black/60 hover:bg-white/20 text-white border border-white/40 backdrop-blur-md transition-transform hover:scale-110 active:scale-95 ml-auto"
              aria-label={`More information about ${item.title}`}
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Metadata */}
          <h4 className="text-sm font-bold text-white line-clamp-1 drop-shadow-md">
            {item.title}
          </h4>

          <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-medium mt-1">
            <span className="text-emerald-400 font-bold">{matchScore}% Match</span>
            <span className="text-zinc-500">•</span>
            <span>
              {"duration" in item && item.duration
                ? formatDuration(item.duration)
                : isShow
                ? "Series"
                : "Movie"}
            </span>
          </div>
        </div>

        {/* Continue Watching Progress Bar */}
        {percentProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-800">
            <div
              className="h-full bg-brand rounded-r transition-all duration-300"
              style={{ width: `${percentProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

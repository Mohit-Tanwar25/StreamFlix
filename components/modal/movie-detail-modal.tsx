"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Play, Plus, Check, Star, X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/rating/rating-stars";
import { MediaItem, MovieType, TVShowType } from "@/types";
import { useProfileStore } from "@/store/useProfileStore";
import { formatDuration } from "@/lib/utils";

interface MovieDetailModalProps {
  item: MediaItem | MovieType | TVShowType | null;
  isOpen: boolean;
  onClose: () => void;
  onWatchlistChanged?: () => void;
}

export function MovieDetailModal({
  item,
  isOpen,
  onClose,
  onWatchlistChanged,
}: MovieDetailModalProps) {
  const router = useRouter();
  const { activeProfile } = useProfileStore();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [detailedData, setDetailedData] = useState<any>(null);

  const isShow = item ? "seasons" in item || (item as MediaItem).mediaType === "tv" : false;

  useEffect(() => {
    if (!isOpen || !item) {
      setDetailedData(null);
      return;
    }

    const endpoint = isShow ? `/api/series/${item.id}` : `/api/movies/${item.id}`;
    fetch(endpoint)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setDetailedData(data);
      })
      .catch((err) => console.error("Error fetching detail:", err));

    // Check if in watchlist
    if (activeProfile?.id) {
      fetch(`/api/watchlist?profileId=${activeProfile.id}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((list) => {
          const matched = list.some(
            (w: any) =>
              (w.movieId && w.movieId === item.id) ||
              (w.tvShowId && w.tvShowId === item.id)
          );
          setIsInWatchlist(matched);
        })
        .catch((err) => console.error("Error fetching watchlist status", err));
    }
  }, [isOpen, item, isShow, activeProfile?.id]);

  if (!isOpen || !item) return null;

  const currentItem = detailedData || item;
  const matchScore = Math.min(99, Math.round(((currentItem.rating || 7.8) / 10) * 100));

  const handlePlay = () => {
    onClose();
    router.push(`/watch/${currentItem.id}${isShow ? "?type=tv" : ""}`);
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
          movieId: !isShow ? currentItem.id : undefined,
          tvShowId: isShow ? currentItem.id : undefined,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Dark Overlay */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-cinema-card border border-cinema-border/70 rounded-2xl shadow-2xl overflow-hidden z-10 animate-slide-up max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-transform hover:scale-110"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop Preview */}
        <div className="relative h-[300px] sm:h-[380px] md:h-[440px] w-full flex-shrink-0 bg-cinema-surface">
          <Image
            src={
              currentItem.backdrop ||
              currentItem.poster ||
              "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop&q=80"
            }
            alt={currentItem.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-card via-cinema-card/40 to-transparent" />

          {/* Hero details overlay */}
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide drop-shadow-md">
              {currentItem.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={handlePlay}
                className="font-bold text-black px-8 shadow-xl"
              >
                <Play className="w-5 h-5 fill-black mr-2" />
                Play Now
              </Button>

              <button
                onClick={handleToggleWatchlist}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-black/60 hover:bg-white/20 text-white border border-white/40 backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
                title={isInWatchlist ? "Remove from My List" : "Add to My List"}
              >
                {isInWatchlist ? (
                  <Check className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Plus className="w-6 h-6" />
                )}
              </button>

              <div className="ml-auto flex items-center bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <RatingStars
                  movieId={!isShow ? currentItem.id : undefined}
                  tvShowId={isShow ? currentItem.id : undefined}
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-emerald-400 font-bold text-base">
              {matchScore}% Match
            </span>
            {currentItem.releaseDate && (
              <span className="text-cinema-muted">
                {new Date(currentItem.releaseDate).getFullYear()}
              </span>
            )}
            {currentItem.maturityRating && (
              <Badge variant="outline">{currentItem.maturityRating}</Badge>
            )}
            <Badge variant="hd">Ultra HD 4K</Badge>
            <span className="text-cinema-muted">
              {"duration" in currentItem && currentItem.duration
                ? formatDuration(currentItem.duration)
                : isShow
                ? `${currentItem.seasons?.length || 1} Season${
                    (currentItem.seasons?.length || 1) > 1 ? "s" : ""
                  }`
                : "Feature"}
            </span>
          </div>

          {/* Description */}
          <p className="text-base text-zinc-300 leading-relaxed max-w-3xl">
            {currentItem.description}
          </p>

          {/* Genres */}
          {currentItem.genres && currentItem.genres.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-cinema-muted font-semibold uppercase tracking-wider">
                Genres:
              </span>
              {currentItem.genres.map((g: any) => (
                <span
                  key={g.genre?.id || g.name || g}
                  className="px-2.5 py-1 rounded-md bg-cinema-surface text-xs text-cinema-text font-medium border border-cinema-border/50"
                >
                  {g.genre?.name || g.name || g}
                </span>
              ))}
            </div>
          )}

          {/* Similar Content recommendations inside modal */}
          {detailedData?.similar && detailedData.similar.length > 0 && (
            <div className="pt-6 border-t border-cinema-border/50 space-y-4">
              <h4 className="text-lg font-bold text-white tracking-wide">
                More Like This
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {detailedData.similar.map((sim: any) => (
                  <div
                    key={sim.id}
                    onClick={() => {
                      setDetailedData(null);
                      router.push(
                        isShow ? `/series/${sim.id}` : `/movies/${sim.id}`
                      );
                      onClose();
                    }}
                    className="group/item cursor-pointer rounded-lg overflow-hidden bg-cinema-surface border border-cinema-border/50 hover:border-brand/50 transition-all duration-200"
                  >
                    <div className="relative aspect-video w-full">
                      <Image
                        src={sim.backdrop || sim.poster}
                        alt={sim.title}
                        fill
                        className="object-cover group-hover/item:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h5 className="text-xs font-bold text-white line-clamp-1 group-hover/item:text-brand transition-colors">
                        {sim.title}
                      </h5>
                      <p className="text-[11px] text-cinema-muted line-clamp-2 mt-1">
                        {sim.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

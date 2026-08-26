"use client";

import React from "react";
import { MovieCard } from "@/components/movie-card/movie-card";
import { MediaItem, MovieType, TVShowType } from "@/types";

interface MovieGridProps {
  items: (MediaItem | MovieType | TVShowType)[];
  onOpenDetail?: (item: any) => void;
  onWatchlistChanged?: () => void;
  emptyMessage?: string;
}

export function MovieGrid({
  items,
  onOpenDetail,
  onWatchlistChanged,
  emptyMessage = "No content found.",
}: MovieGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-cinema-surface flex items-center justify-center mb-4 text-cinema-muted">
          🎬
        </div>
        <h4 className="text-lg font-medium text-white mb-1">Nothing here yet</h4>
        <p className="text-sm text-cinema-muted max-w-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 py-4">
      {items.map((item) => (
        <div key={`${item.id}-${item.title}`} className="flex justify-center">
          <MovieCard
            item={item}
            onOpenDetail={onOpenDetail}
            onWatchlistChanged={onWatchlistChanged}
          />
        </div>
      ))}
    </div>
  );
}

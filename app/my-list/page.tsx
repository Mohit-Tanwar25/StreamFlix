"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/navbar";
import { MovieGrid } from "@/components/movie-grid/movie-grid";
import { MovieDetailModal } from "@/components/modal/movie-detail-modal";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/useProfileStore";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaItem } from "@/types";

export default function MyListPage() {
  const { activeProfile } = useProfileStore();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    if (!activeProfile?.id) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/watchlist?profileId=${activeProfile.id}`);
      if (res.ok) {
        const data = await res.json();
        const formatted: MediaItem[] = data.map((w: any) => {
          if (w.movie) {
            return {
              ...w.movie,
              mediaType: "movie" as const,
              isWatchlisted: true,
            };
          }
          return {
            ...w.tvShow,
            mediaType: "tv" as const,
            isWatchlisted: true,
          };
        });
        setItems(formatted);
      }
    } catch (err) {
      console.error("Error fetching watchlist:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeProfile?.id]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const filteredItems = items.filter((item) => {
    if (filter === "movie") return item.mediaType === "movie";
    if (filter === "tv") return item.mediaType === "tv";
    return true;
  });

  return (
    <div className="min-h-screen bg-cinema-black text-white pb-20 selection:bg-brand selection:text-white">
      <Navbar />

      <main className="pt-24 sm:pt-28 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cinema-border/40 pb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              My List
            </h1>
            <p className="text-xs sm:text-sm text-cinema-muted mt-1">
              Saved titles for {activeProfile?.name || "your profile"}.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {(["all", "movie", "tv"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  filter === f
                    ? "bg-brand text-white shadow-md shadow-brand/30"
                    : "bg-cinema-surface hover:bg-cinema-surfaceLight text-zinc-400 hover:text-white border border-cinema-border/50"
                }`}
              >
                {f === "all" ? "All" : f === "movie" ? "Movies" : "TV Series"}
              </button>
            ))}
          </div>
        </div>

        {/* Watchlist Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <MovieGrid
            items={filteredItems}
            onOpenDetail={(item) => {
              setSelectedItem(item);
              setIsModalOpen(true);
            }}
            onWatchlistChanged={fetchWatchlist}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-cinema-surface flex items-center justify-center mb-4 text-2xl">
              ⭐
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Your list is empty</h3>
            <p className="text-xs sm:text-sm text-cinema-muted max-w-sm mb-6">
              Add movies and TV shows to your list to easily watch them later.
            </p>
            <Link href="/browse">
              <Button variant="primary" size="md">
                Browse Content
              </Button>
            </Link>
          </div>
        )}
      </main>

      <MovieDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        onWatchlistChanged={fetchWatchlist}
      />
    </div>
  );
}

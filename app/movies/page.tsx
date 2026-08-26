"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar/navbar";
import { MovieGrid } from "@/components/movie-grid/movie-grid";
import { MovieDetailModal } from "@/components/modal/movie-detail-modal";
import { MovieType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function MoviesPage() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const genres = ["All", "Action", "Sci-Fi", "Drama", "Thriller", "Adventure", "Crime", "Horror"];

  useEffect(() => {
    setIsLoading(true);
    const url = selectedGenre === "All" ? "/api/movies" : `/api/movies?genre=${selectedGenre}`;
    fetch(url)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setMovies(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [selectedGenre]);

  return (
    <div className="min-h-screen bg-cinema-black text-white pb-20 selection:bg-brand selection:text-white">
      <Navbar />

      <main className="pt-24 sm:pt-28 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto space-y-6">
        {/* Page Header & Genre Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cinema-border/40 pb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Movies
            </h1>
            <p className="text-xs sm:text-sm text-cinema-muted mt-1">
              Explore blockbuster films, Hollywood masterpieces, and cult classics.
            </p>
          </div>

          {/* Genre Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedGenre === g
                    ? "bg-brand text-white shadow-md shadow-brand/30"
                    : "bg-cinema-surface hover:bg-cinema-surfaceLight text-zinc-400 hover:text-white border border-cinema-border/50"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <MovieGrid
            items={movies}
            onOpenDetail={(m) => {
              setSelectedItem(m);
              setIsModalOpen(true);
            }}
            emptyMessage={`No movies found for genre "${selectedGenre}".`}
          />
        )}
      </main>

      <MovieDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}

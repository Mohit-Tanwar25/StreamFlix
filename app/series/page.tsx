"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar/navbar";
import { MovieGrid } from "@/components/movie-grid/movie-grid";
import { MovieDetailModal } from "@/components/modal/movie-detail-modal";
import { TVShowType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function SeriesPage() {
  const [series, setSeries] = useState<TVShowType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/series")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setSeries(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-cinema-black text-white pb-20 selection:bg-brand selection:text-white">
      <Navbar />

      <main className="pt-24 sm:pt-28 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto space-y-6">
        <div className="border-b border-cinema-border/40 pb-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            TV Series
          </h1>
          <p className="text-xs sm:text-sm text-cinema-muted mt-1">
            Immersive serial dramas, sci-fi sagas, and binge-worthy mysteries.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <MovieGrid
            items={series}
            onOpenDetail={(s) => {
              setSelectedItem(s);
              setIsModalOpen(true);
            }}
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

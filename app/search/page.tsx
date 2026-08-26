"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar/navbar";
import { MovieGrid } from "@/components/movie-grid/movie-grid";
import { MovieDetailModal } from "@/components/modal/movie-detail-modal";
import { Input } from "@/components/ui/input";
import { Search, Loader2, X } from "lucide-react";
import { MediaItem } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        router.replace(`/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
        performSearch(query);
      } else {
        router.replace("/search", { scroll: false });
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch, router]);

  return (
    <div className="min-h-screen bg-cinema-black text-white pb-20 selection:bg-brand selection:text-white">
      <Navbar />

      <main className="pt-24 sm:pt-28 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto space-y-8">
        {/* Search Header & Search Input */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Search StreamFlix
          </h1>
          <p className="text-xs sm:text-sm text-cinema-muted">
            Find your next favorite film, series, anime, or genre.
          </p>

          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, genre, actor..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full bg-cinema-surface/90 text-white placeholder-zinc-500 rounded-full border border-cinema-border px-6 py-4 pl-12 pr-12 text-sm sm:text-base focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/40 shadow-2xl transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Area */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-brand mb-2" />
              <p className="text-xs text-cinema-muted">Searching streaming catalog...</p>
            </div>
          ) : query.trim() ? (
            <div>
              <div className="flex items-center justify-between border-b border-cinema-border/40 pb-3 mb-6">
                <h3 className="text-sm font-semibold text-cinema-muted uppercase tracking-wider">
                  Found {results.length} result{results.length === 1 ? "" : "s"} for &quot;
                  <span className="text-white">{query}</span>&quot;
                </h3>
              </div>
              <MovieGrid
                items={results}
                onOpenDetail={(item) => {
                  setSelectedItem(item);
                  setIsModalOpen(true);
                }}
                emptyMessage={`No titles found matching "${query}". Try searching for another keyword or genre.`}
              />
            </div>
          ) : (
            <div className="text-center py-20 text-cinema-muted">
              <div className="w-16 h-16 rounded-full bg-cinema-surface flex items-center justify-center mx-auto mb-4 text-2xl">
                🔍
              </div>
              <p className="text-sm">Type a search term above to explore movies and TV shows.</p>
            </div>
          )}
        </div>
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

export default function SearchPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-cinema-black" />}>
      <SearchContent />
    </React.Suspense>
  );
}

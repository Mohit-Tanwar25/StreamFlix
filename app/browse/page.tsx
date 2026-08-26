"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar/navbar";
import { HeroBanner } from "@/components/hero/hero-banner";
import { MovieRow } from "@/components/movie-row/movie-row";
import { MovieDetailModal } from "@/components/modal/movie-detail-modal";
import { HeroSkeleton, MovieRowSkeleton } from "@/components/ui/skeleton";
import { useProfileStore } from "@/store/useProfileStore";
import { MediaItem, MovieType, TVShowType } from "@/types";

export default function BrowsePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { activeProfile, fetchProfiles } = useProfileStore();

  const [heroMovie, setHeroMovie] = useState<MediaItem | MovieType | null>(null);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MovieType[]>([]);
  const [topRated, setTopRated] = useState<MovieType[]>([]);
  const [tvShows, setTvShows] = useState<TVShowType[]>([]);
  const [scifiMovies, setScifiMovies] = useState<MovieType[]>([]);
  const [actionMovies, setActionMovies] = useState<MovieType[]>([]);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // Load streaming catalog
  const loadData = async () => {
    try {
      const [
        moviesRes,
        showsRes,
        scifiRes,
        actionRes,
      ] = await Promise.all([
        fetch("/api/movies"),
        fetch("/api/series"),
        fetch("/api/movies?genre=Sci-Fi"),
        fetch("/api/movies?genre=Action"),
      ]);

      const movies: MovieType[] = await moviesRes.json();
      const shows: TVShowType[] = await showsRes.json();
      const scifi: MovieType[] = await scifiRes.json();
      const action: MovieType[] = await actionRes.json();

      setPopularMovies(movies);
      setTvShows(shows);
      setScifiMovies(scifi);
      setActionMovies(action);
      setTopRated([...movies].sort((a, b) => (b.rating || 0) - (a.rating || 0)));

      // Trending unified
      const unifiedTrending: MediaItem[] = [
        ...movies.filter((m) => m.trending).map((m) => ({
          ...m,
          mediaType: "movie" as const,
        })),
        ...shows.filter((s) => s.trending).map((s) => ({
          ...s,
          mediaType: "tv" as const,
        })),
      ];
      setTrending(unifiedTrending);

      // Hero banner item: either featured movie or first movie
      const featured = movies.find((m) => m.featured) || movies[0];
      if (featured) {
        setHeroMovie(featured);
      }
    } catch (error) {
      console.error("Error loading browse content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Load continue watching & recommendations for active profile
  useEffect(() => {
    if (!activeProfile?.id) return;

    fetch(`/api/history?profileId=${activeProfile.id}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((history) => {
        const formatted = history.map((h: any) => ({
          ...(h.movie || h.episode),
          id: h.movieId || h.episodeId,
          progress: h.progress,
          duration: h.duration,
          mediaType: h.movieId ? "movie" : "tv",
        }));
        setContinueWatching(formatted);
      })
      .catch((e) => console.error("Error loading continue watching:", e));

    fetch(`/api/recommendations?profileId=${activeProfile.id}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((recs) => setRecommendations(recs))
      .catch((e) => console.error("Error loading recommendations:", e));
  }, [activeProfile?.id]);

  const handleOpenDetail = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen bg-cinema-black text-white">
        <Navbar />
        <HeroSkeleton />
        <div className="-mt-16 space-y-6">
          <MovieRowSkeleton />
          <MovieRowSkeleton />
          <MovieRowSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cinema-black text-white pb-20 overflow-x-hidden selection:bg-brand selection:text-white">
      <Navbar />

      {/* Hero Banner */}
      {heroMovie && (
        <HeroBanner movie={heroMovie} onOpenDetail={handleOpenDetail} />
      )}

      {/* Main Content Rows */}
      <main className="relative z-20 -mt-6 sm:-mt-10 md:-mt-14 space-y-6">
        {/* Continue Watching Row (Only if active items exist) */}
        {continueWatching.length > 0 && (
          <MovieRow
            title={`Continue Watching for ${activeProfile?.name || "You"}`}
            items={continueWatching}
            onOpenDetail={handleOpenDetail}
          />
        )}

        {/* Trending Now */}
        {trending.length > 0 && (
          <MovieRow
            title="Trending Now"
            items={trending}
            onOpenDetail={handleOpenDetail}
          />
        )}

        {/* Recommended for You */}
        {recommendations.length > 0 && (
          <MovieRow
            title="Recommended For You"
            items={recommendations}
            onOpenDetail={handleOpenDetail}
          />
        )}

        {/* Popular Movies */}
        {popularMovies.length > 0 && (
          <MovieRow
            title="Popular Movies"
            items={popularMovies}
            onOpenDetail={handleOpenDetail}
          />
        )}

        {/* TV Series */}
        {tvShows.length > 0 && (
          <MovieRow
            title="Binge-Worthy TV Series"
            items={tvShows}
            onOpenDetail={handleOpenDetail}
          />
        )}

        {/* Top Rated */}
        {topRated.length > 0 && (
          <MovieRow
            title="Critically Acclaimed & Top Rated"
            items={topRated}
            onOpenDetail={handleOpenDetail}
          />
        )}

        {/* Sci-Fi & Fantasy */}
        {scifiMovies.length > 0 && (
          <MovieRow
            title="Sci-Fi & Cyberpunk Adventures"
            items={scifiMovies}
            onOpenDetail={handleOpenDetail}
          />
        )}

        {/* Action & Thriller */}
        {actionMovies.length > 0 && (
          <MovieRow
            title="High Octane Action"
            items={actionMovies}
            onOpenDetail={handleOpenDetail}
          />
        )}
      </main>

      {/* Movie / Series Quick Details Modal */}
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

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, ArrowLeft, Star, Film, Loader2 } from "lucide-react";
import { MovieType } from "@/types";

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    poster: "",
    backdrop: "",
    videoUrl: "",
    trailerUrl: "",
    duration: 120,
    rating: 8.0,
    maturityRating: "PG-13",
    featured: false,
    trending: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/movies");
      if (res.ok) {
        const data = await res.json();
        setMovies(data);
      }
    } catch (err) {
      console.error("Failed to fetch movies", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      title: "",
      description: "",
      poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
      backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
      duration: 125,
      rating: 8.5,
      maturityRating: "PG-13",
      featured: false,
      trending: true,
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (movie: MovieType) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      poster: movie.poster,
      backdrop: movie.backdrop,
      videoUrl: movie.videoUrl || "",
      trailerUrl: movie.trailerUrl || "",
      duration: movie.duration || 120,
      rating: movie.rating || 8.0,
      maturityRating: movie.maturityRating || "PG-13",
      featured: Boolean(movie.featured),
      trending: Boolean(movie.trending),
    });
    setFormError(null);
    setIsEditModalOpen(true);
  };

  const handleCreateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.poster || !formData.backdrop) {
      setFormError("Please fill in all required movie fields.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create movie");
      }

      await fetchMovies();
      setIsAddModalOpen(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovie) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch(`/api/movies/${selectedMovie.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update movie");
      }

      await fetchMovies();
      setIsEditModalOpen(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMovie = async () => {
    if (!selectedMovie) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/movies/${selectedMovie.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete movie");
      }

      await fetchMovies();
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cinema-black text-white selection:bg-brand selection:text-white pb-20">
      <Navbar />

      <main className="pt-24 sm:pt-28 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cinema-border/50 pb-6">
          <div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-cinema-muted hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Manage Movie Library
            </h1>
            <p className="text-xs sm:text-sm text-cinema-muted mt-1">
              Add new titles, update streaming links, and curate featured rows.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={handleOpenAddModal}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Movie
          </Button>
        </div>

        {/* Movies Table */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : (
          <div className="rounded-2xl border border-cinema-border/60 bg-cinema-card overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-zinc-300">
                <thead className="bg-cinema-surface text-[11px] font-bold text-cinema-muted uppercase tracking-wider border-b border-cinema-border/50">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-4 py-4">Rating</th>
                    <th className="px-4 py-4">Duration</th>
                    <th className="px-4 py-4">Maturity</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cinema-border/40 font-medium">
                  {movies.map((m) => (
                    <tr key={m.id} className="hover:bg-cinema-surface/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="relative w-10 h-14 rounded overflow-hidden bg-cinema-surface flex-shrink-0">
                          <Image
                            src={m.poster}
                            alt={m.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{m.title}</p>
                          <p className="text-xs text-cinema-muted line-clamp-1 max-w-xs">
                            {m.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="flex items-center gap-1 font-bold text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {m.rating?.toFixed(1) || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-4">{m.duration ? `${m.duration} min` : "N/A"}</td>
                      <td className="px-4 py-4">
                        <Badge variant="outline">{m.maturityRating || "PG-13"}</Badge>
                      </td>
                      <td className="px-4 py-4 space-x-1">
                        {m.featured && <Badge variant="brand">Featured</Badge>}
                        {m.trending && <Badge variant="success">Trending</Badge>}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(m)}
                          className="p-1.5 rounded bg-cinema-surface hover:bg-cinema-surfaceLight text-zinc-300 hover:text-white"
                          title="Edit movie"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMovie(m);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                          title="Delete movie"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add Movie Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Movie"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateMovie} className="space-y-4">
          {formError && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Movie Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Input
              label="Duration (minutes)"
              type="number"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })
              }
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-cinema-muted uppercase tracking-wider mb-1.5">
              Description / Synopsis
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-cinema-surface text-white placeholder-zinc-500 rounded-md border border-cinema-border p-3 text-sm focus:outline-none focus:border-brand"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Poster URL"
              value={formData.poster}
              onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
              required
            />
            <Input
              label="Backdrop URL"
              value={formData.backdrop}
              onChange={(e) => setFormData({ ...formData, backdrop: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Video Stream URL"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://.../video.mp4"
            />
            <Input
              label="Trailer URL"
              value={formData.trailerUrl}
              onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
              placeholder="https://youtube.com/..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Rating (0 - 10)"
              type="number"
              step="0.1"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })
              }
            />
            <Input
              label="Maturity Rating"
              value={formData.maturityRating}
              onChange={(e) => setFormData({ ...formData, maturityRating: e.target.value })}
              placeholder="PG-13, R, etc."
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 accent-brand rounded"
              />
              Featured Hero
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
              <input
                type="checkbox"
                checked={formData.trending}
                onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                className="w-4 h-4 accent-brand rounded"
              />
              Trending Now
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cinema-border/50">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Save Movie
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Movie Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Movie"
        maxWidth="2xl"
      >
        <form onSubmit={handleUpdateMovie} className="space-y-4">
          <Input
            label="Movie Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-medium text-cinema-muted uppercase tracking-wider mb-1.5">
              Description / Synopsis
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-cinema-surface text-white placeholder-zinc-500 rounded-md border border-cinema-border p-3 text-sm focus:outline-none focus:border-brand"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Poster URL"
              value={formData.poster}
              onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
              required
            />
            <Input
              label="Backdrop URL"
              value={formData.backdrop}
              onChange={(e) => setFormData({ ...formData, backdrop: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Video Stream URL"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            />
            <Input
              label="Trailer URL"
              value={formData.trailerUrl}
              onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 accent-brand rounded"
              />
              Featured Hero
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
              <input
                type="checkbox"
                checked={formData.trending}
                onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                className="w-4 h-4 accent-brand rounded"
              />
              Trending Now
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cinema-border/50">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Update Movie
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteMovie}
        title="Delete Movie?"
        description={`Are you sure you want to remove "${selectedMovie?.title}" from the catalog? This will delete all associated ratings and watch histories.`}
        confirmText="Delete Movie"
        isLoading={isSubmitting}
      />
    </div>
  );
}

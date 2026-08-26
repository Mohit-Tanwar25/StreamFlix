"use client";

import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/store/useProfileStore";

interface RatingStarsProps {
  movieId?: string;
  tvShowId?: string;
  initialRating?: number;
  onRatingChanged?: (newRating: number) => void;
  size?: "sm" | "md" | "lg";
}

export function RatingStars({
  movieId,
  tvShowId,
  initialRating = 0,
  onRatingChanged,
  size = "md",
}: RatingStarsProps) {
  const { activeProfile } = useProfileStore();
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialRating) {
      setRating(initialRating);
    } else if (activeProfile?.id && (movieId || tvShowId)) {
      const fetchRating = async () => {
        try {
          const params = new URLSearchParams({
            profileId: activeProfile.id,
            ...(movieId ? { movieId } : {}),
            ...(tvShowId ? { tvShowId } : {}),
          });
          const res = await fetch(`/api/ratings?${params.toString()}`);
          if (res.ok) {
            const data = await res.json();
            setRating(data.rating || 0);
          }
        } catch (e) {
          console.error("Failed to fetch rating", e);
        }
      };
      fetchRating();
    }
  }, [activeProfile?.id, movieId, tvShowId, initialRating]);

  const handleRate = async (value: number) => {
    if (!activeProfile?.id || isSubmitting) return;

    setRating(value);
    setIsSubmitting(true);
    if (onRatingChanged) onRatingChanged(value);

    try {
      await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: activeProfile.id,
          movieId: movieId || undefined,
          tvShowId: tvShowId || undefined,
          rating: value,
        }),
      });
    } catch (e) {
      console.error("Failed to save rating", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const starSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isFilled = (hoverRating || rating) >= starValue;
        return (
          <button
            key={starValue}
            type="button"
            disabled={!activeProfile || isSubmitting}
            onClick={() => handleRate(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1 text-zinc-500 hover:text-amber-400 focus:outline-none transition-transform hover:scale-110 disabled:cursor-not-allowed"
            aria-label={`Rate ${starValue} stars out of 5`}
          >
            <Star
              className={cn(
                starSizes[size],
                "transition-colors duration-150",
                isFilled
                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                  : "text-zinc-600 hover:text-zinc-400"
              )}
            />
          </button>
        );
      })}
      {rating > 0 && (
        <span className="text-xs text-amber-400 font-semibold ml-1.5">
          {rating}/5
        </span>
      )}
    </div>
  );
}

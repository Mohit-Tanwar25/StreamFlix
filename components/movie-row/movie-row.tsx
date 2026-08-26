"use client";

import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "@/components/movie-card/movie-card";
import { MediaItem, MovieType, TVShowType } from "@/types";
import { cn } from "@/lib/utils";

interface MovieRowProps {
  title: string;
  items: (MediaItem | MovieType | TVShowType)[];
  onOpenDetail?: (item: any) => void;
  onWatchlistChanged?: () => void;
  className?: string;
}

export function MovieRow({
  title,
  items,
  onOpenDetail,
  onWatchlistChanged,
  className,
}: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  if (!items || items.length === 0) return null;

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      const newScrollLeft =
        direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;

      rowRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const onScrollEvent = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  return (
    <div className={cn("group/row relative space-y-3 py-3 my-2", className)}>
      {/* Row Title */}
      <div className="px-4 md:px-12 flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          {title}
        </h3>
      </div>

      {/* Horizontal Carousel Container */}
      <div className="relative group">
        {/* Left Scroll Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-0 bottom-0 z-40 hidden md:flex items-center justify-center w-12 bg-black/60 hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-8 h-8 transition-transform hover:scale-125" />
          </button>
        )}

        {/* Scrollable track */}
        <div
          ref={rowRef}
          onScroll={onScrollEvent}
          className="flex items-center gap-3 md:gap-4 overflow-x-auto scrollbar-none px-4 md:px-12 py-3 scroll-smooth"
        >
          {items.map((item) => {
            const progress = (item as any).progress;
            const duration = (item as any).duration || (item as any).totalDuration;
            return (
              <MovieCard
                key={`${item.id}-${item.title}`}
                item={item}
                progress={progress}
                duration={duration}
                onOpenDetail={onOpenDetail}
                onWatchlistChanged={onWatchlistChanged}
              />
            );
          })}
        </div>

        {/* Right Scroll Arrow */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 top-0 bottom-0 z-40 hidden md:flex items-center justify-center w-12 bg-black/60 hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-8 h-8 transition-transform hover:scale-125" />
          </button>
        )}
      </div>
    </div>
  );
}

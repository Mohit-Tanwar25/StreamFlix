"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { VideoPlayer } from "@/components/video-player/video-player";
import { useProfileStore } from "@/store/useProfileStore";
import { Loader2 } from "lucide-react";

interface WatchPageProps {
  params: { id: string };
}

function WatchContent({ params }: WatchPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type");
  const episodeId = searchParams.get("episodeId");
  const { activeProfile } = useProfileStore();

  const [media, setMedia] = useState<any | null>(null);
  const [initialProgress, setInitialProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        if (type === "tv") {
          const res = await fetch(`/api/series/${params.id}`);
          if (res.ok) {
            const show = await res.json();

            // Find episode
            let targetEpisode = null;
            if (episodeId) {
              for (const s of show.seasons || []) {
                const ep = s.episodes?.find((e: any) => e.id === episodeId);
                if (ep) {
                  targetEpisode = ep;
                  break;
                }
              }
            }
            if (!targetEpisode && show.seasons?.[0]?.episodes?.[0]) {
              targetEpisode = show.seasons[0].episodes[0];
            }

            setMedia({
              title: `${show.title} - ${targetEpisode?.title || "Episode 1"}`,
              videoUrl:
                targetEpisode?.videoUrl ||
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              episodeId: targetEpisode?.id,
              showId: show.id,
            });
          } else {
            setMedia({
              title: "StreamFlix Series Episode",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              showId: params.id,
            });
          }
        } else {
          const res = await fetch(`/api/movies/${params.id}`);
          if (res.ok) {
            const movie = await res.json();
            setMedia({
              title: movie.title,
              videoUrl:
                movie.videoUrl ||
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              movieId: movie.id,
            });
          } else {
            setMedia({
              title: "StreamFlix Feature Movie",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              movieId: params.id,
            });
          }
        }

        // Fetch watch history resume progress
        if (activeProfile?.id) {
          const histRes = await fetch(`/api/history?profileId=${activeProfile.id}`);
          if (histRes.ok) {
            const history = await histRes.json();
            const matched = history.find(
              (h: any) =>
                (h.movieId && h.movieId === params.id) ||
                (h.episodeId && h.episodeId === episodeId)
            );
            if (matched && matched.progress > 0) {
              setInitialProgress(matched.progress);
            }
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load video");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, [params.id, type, episodeId, activeProfile?.id]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-brand mb-4" />
        <p className="text-sm font-medium text-zinc-400">Loading StreamFlix Player...</p>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-xl font-bold text-red-500 mb-2">Unable to Play Video</h2>
        <p className="text-sm text-zinc-400 mb-6">{error || "Media source unavailable"}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-white text-black font-semibold rounded-md hover:bg-zinc-200 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <VideoPlayer
      src={media.videoUrl}
      title={media.title}
      movieId={media.movieId}
      episodeId={media.episodeId}
      initialProgress={initialProgress}
      onBack={() => router.back()}
    />
  );
}

export default function WatchPage({ params }: WatchPageProps) {
  return (
    <React.Suspense fallback={<div className="w-screen h-screen bg-black" />}>
      <WatchContent params={params} />
    </React.Suspense>
  );
}

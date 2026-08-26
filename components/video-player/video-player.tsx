"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ArrowLeft,
  Tv,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { formatTimeSeconds, cn } from "@/lib/utils";
import { useProfileStore } from "@/store/useProfileStore";

interface VideoPlayerProps {
  src: string;
  title: string;
  movieId?: string;
  episodeId?: string;
  initialProgress?: number;
  onBack?: () => void;
}

const FALLBACK_STREAM_URLS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
];

export function VideoPlayer({
  src,
  title,
  movieId,
  episodeId,
  initialProgress = 0,
  onBack,
}: VideoPlayerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeProfile } = useProfileStore();

  const [currentSrc, setCurrentSrc] = useState(src || FALLBACK_STREAM_URLS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [resumeNotification, setResumeNotification] = useState<string | null>(null);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync watch progress to database
  const saveProgress = useCallback(
    async (time: number, totalDuration: number) => {
      if (!activeProfile?.id || (!movieId && !episodeId) || totalDuration <= 0) return;

      try {
        await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profileId: activeProfile.id,
            movieId: movieId || undefined,
            episodeId: episodeId || undefined,
            progress: Math.floor(time),
            duration: Math.floor(totalDuration),
          }),
        });
      } catch (err) {
        console.error("Failed to sync progress:", err);
      }
    },
    [activeProfile?.id, movieId, episodeId]
  );

  // Auto-play attempt on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryAutoplay = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (err) {
        console.log("Unmuted autoplay restricted, attempting muted play...", err);
        try {
          video.muted = true;
          setIsMuted(true);
          await video.play();
          setIsPlaying(true);
        } catch (e) {
          console.log("Autoplay paused, awaiting user interaction.");
          setIsPlaying(false);
        }
      }
    };

    tryAutoplay();
  }, [currentSrc]);

  // Handle resume position on metadata loaded
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    setDuration(video.duration);
    setIsBuffering(false);

    if (initialProgress > 0 && initialProgress < video.duration - 10) {
      video.currentTime = initialProgress;
      setCurrentTime(initialProgress);
      setResumeNotification(`Resuming playback from ${formatTimeSeconds(initialProgress)}`);
      setTimeout(() => setResumeNotification(null), 4000);
    }
  };

  // Periodic progress saving (every 5 seconds)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (videoRef.current) {
        saveProgress(videoRef.current.currentTime, videoRef.current.duration);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, saveProgress]);

  // Save progress on unmount / navigation
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        saveProgress(videoRef.current.currentTime, videoRef.current.duration);
      }
    };
  }, [saveProgress]);

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Play error:", err);
          video.muted = true;
          setIsMuted(true);
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch((e) => console.error("Playback failed completely:", e));
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const skipSeconds = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds)
      );
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    videoRef.current.muted = nextMute;
    setIsMuted(nextMute);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleSpeedSelect = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled) {
      await videoRef.current.requestPictureInPicture();
    }
  };

  const handleExit = () => {
    if (videoRef.current) {
      saveProgress(videoRef.current.currentTime, videoRef.current.duration);
    }
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleVideoError = () => {
    console.warn("Video stream encountered an error, switching to fallback mirror...");
    const nextIndex = (FALLBACK_STREAM_URLS.indexOf(currentSrc) + 1) % FALLBACK_STREAM_URLS.length;
    setCurrentSrc(FALLBACK_STREAM_URLS[nextIndex]);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowLeft" || e.key === "j") {
        e.preventDefault();
        skipSeconds(-10);
      } else if (e.key === "ArrowRight" || e.key === "l") {
        e.preventDefault();
        skipSeconds(10);
      } else if (e.key === "f") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "m") {
        e.preventDefault();
        toggleMute();
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center select-none"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={currentSrc}
        preload="auto"
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={() => {
          if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
        }}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false);
          setIsPlaying(true);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={handleVideoError}
        onEnded={() => {
          setIsPlaying(false);
          if (videoRef.current) {
            saveProgress(videoRef.current.duration, videoRef.current.duration);
          }
        }}
        playsInline
      />

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <Loader2 className="w-16 h-16 animate-spin text-brand drop-shadow-2xl" />
        </div>
      )}

      {/* Big Central Play Button when Paused */}
      {!isPlaying && !isBuffering && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-20 bg-black/30"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-brand/90 hover:bg-brand text-white flex items-center justify-center shadow-2xl shadow-brand/50 transition-transform hover:scale-110 active:scale-95">
            <Play className="w-10 h-10 sm:w-12 sm:h-12 fill-white ml-1.5" />
          </div>
        </div>
      )}

      {/* Resume Notification Banner */}
      {resumeNotification && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/85 border border-brand/40 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in z-40">
          <div className="w-2 h-2 rounded-full bg-brand animate-ping" />
          {resumeNotification}
        </div>
      )}

      {/* Overlay UI Controls */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-between p-4 sm:p-8 bg-gradient-to-t from-black/90 via-transparent to-black/80 transition-opacity duration-300 pointer-events-none z-30",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Top bar: Back button & Media Title */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <button
            onClick={handleExit}
            className="p-2.5 rounded-full bg-black/60 hover:bg-white/20 text-white transition-colors border border-white/20"
            aria-label="Back to browse"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-base sm:text-xl font-bold text-white tracking-wide drop-shadow-md">
              {title}
            </h2>
          </div>
        </div>

        {/* Bottom bar: Timeline, Playback controls */}
        <div className="space-y-3 pointer-events-auto max-w-5xl mx-auto w-full">
          {/* Progress Timeline Scrubber */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-zinc-300 w-12 text-right">
              {formatTimeSeconds(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-brand"
            />
            <span className="text-xs font-semibold text-zinc-300 w-12">
              {formatTimeSeconds(duration)}
            </span>
          </div>

          {/* Main Controls Row */}
          <div className="flex items-center justify-between">
            {/* Left Controls: Play, Skip 10s, Volume */}
            <div className="flex items-center gap-3 sm:gap-5">
              <button
                onClick={togglePlay}
                className="p-2 text-white hover:text-brand transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-white" />
                ) : (
                  <Play className="w-7 h-7 fill-white" />
                )}
              </button>

              <button
                onClick={() => skipSeconds(-10)}
                className="p-2 text-white hover:text-brand transition-colors"
                aria-label="Skip back 10 seconds"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => skipSeconds(10)}
                className="p-2 text-white hover:text-brand transition-colors"
                aria-label="Skip forward 10 seconds"
              >
                <RotateCw className="w-5 h-5" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 group/vol">
                <button
                  onClick={toggleMute}
                  className="p-2 text-white hover:text-brand transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-24 h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>

            {/* Right Controls: Playback speed, PiP, Fullscreen */}
            <div className="flex items-center gap-3 sm:gap-5 relative">
              {/* Playback speed selector */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="px-2.5 py-1 text-xs font-bold text-zinc-300 hover:text-white border border-white/20 rounded hover:bg-white/10 transition-colors"
                >
                  {playbackRate}x
                </button>

                {showSpeedMenu && (
                  <div className="absolute bottom-10 right-0 bg-cinema-card border border-cinema-border rounded-lg shadow-xl p-1.5 space-y-1 z-50">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => handleSpeedSelect(rate)}
                        className={cn(
                          "block w-full text-left px-3 py-1 text-xs rounded hover:bg-white/10 transition-colors",
                          playbackRate === rate ? "text-brand font-bold" : "text-white"
                        )}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Picture in Picture */}
              <button
                onClick={togglePiP}
                className="p-2 text-white hover:text-brand transition-colors hidden sm:block"
                aria-label="Picture in Picture"
              >
                <Tv className="w-5 h-5" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-white hover:text-brand transition-colors"
                aria-label="Fullscreen"
              >
                {isFullscreen ? (
                  <Minimize className="w-6 h-6" />
                ) : (
                  <Maximize className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

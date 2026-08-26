import { create } from "zustand";

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  showControls: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (isMuted: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  setShowControls: (show: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  playbackRate: 1,
  isFullscreen: false,
  showControls: true,

  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setIsMuted: (isMuted) => set({ isMuted }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
  setShowControls: (showControls) => set({ showControls }),
}));

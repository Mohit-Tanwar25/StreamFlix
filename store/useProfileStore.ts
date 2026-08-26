import { create } from "zustand";
import { ProfileType } from "@/types";

interface ProfileState {
  activeProfile: ProfileType | null;
  profiles: ProfileType[];
  isLoading: boolean;
  setActiveProfile: (profile: ProfileType) => void;
  setProfiles: (profiles: ProfileType[]) => void;
  fetchProfiles: () => Promise<void>;
  clearActiveProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  activeProfile: null,
  profiles: [],
  isLoading: false,

  setActiveProfile: (profile: ProfileType) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("streamflix_active_profile", JSON.stringify(profile));
      document.cookie = `streamflix_profile_id=${profile.id}; path=/; max-age=2592000; SameSite=Lax`;
    }
    set({ activeProfile: profile });
  },

  setProfiles: (profiles: ProfileType[]) => {
    set({ profiles });
  },

  fetchProfiles: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/profiles");
      if (res.ok) {
        const data: ProfileType[] = await res.json();
        set({ profiles: data });

        const currentActive = get().activeProfile;
        if (!currentActive && data.length > 0) {
          // Check local storage
          const stored = typeof window !== "undefined" ? localStorage.getItem("streamflix_active_profile") : null;
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              const matched = data.find((p) => p.id === parsed.id);
              if (matched) {
                set({ activeProfile: matched });
                return;
              }
            } catch (e) {
              console.error("Failed to parse stored profile", e);
            }
          }
          // Default to first profile
          get().setActiveProfile(data[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch profiles", error);
    } finally {
      set({ isLoading: false });
    }
  },

  clearActiveProfile: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("streamflix_active_profile");
      document.cookie = "streamflix_profile_id=; path=/; max-age=0";
    }
    set({ activeProfile: null });
  },
}));

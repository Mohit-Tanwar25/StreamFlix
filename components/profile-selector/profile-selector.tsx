"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Check, Lock } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { ProfileType } from "@/types";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { AVATAR_OPTIONS, cn } from "@/lib/utils";

export function ProfileSelector() {
  const router = useRouter();
  const { profiles, setActiveProfile, fetchProfiles } = useProfileStore();

  const [isManaging, setIsManaging] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>(null);
  const [profileName, setProfileName] = useState("");
  const [profileAvatar, setProfileAvatar] = useState(AVATAR_OPTIONS[0].src);
  const [isKids, setIsKids] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (profile: ProfileType) => {
    if (isManaging) {
      setSelectedProfile(profile);
      setProfileName(profile.name);
      setProfileAvatar(profile.avatar);
      setIsKids(profile.isKids);
      setIsEditModalOpen(true);
    } else {
      setActiveProfile(profile);
      router.push("/browse");
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      setError("Please enter a profile name");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileName.trim(),
          avatar: profileAvatar,
          isKids,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create profile");
      }

      await fetchProfiles();
      setIsAddModalOpen(false);
      setProfileName("");
      setIsKids(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile || !profileName.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/profiles/${selectedProfile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileName.trim(),
          avatar: profileAvatar,
          isKids,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      await fetchProfiles();
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!selectedProfile) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/profiles/${selectedProfile.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete profile");
      }

      await fetchProfiles();
      setIsDeleteModalOpen(false);
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 select-none animate-fade-in">
      <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-8 sm:mb-12 tracking-wide text-center">
        {isManaging ? "Manage Profiles" : "Who's watching?"}
      </h1>

      {/* Profiles Grid */}
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 max-w-4xl">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            onClick={() => handleSelect(profile)}
            className="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105"
          >
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden ring-4 ring-transparent group-hover:ring-brand shadow-2xl transition-all">
              <Image
                src={profile.avatar}
                alt={profile.name}
                fill
                className="object-cover"
              />
              {/* Manage Overlay */}
              {isManaging && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Edit2 className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <span className="mt-3 text-sm sm:text-base font-medium text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1.5">
              {profile.name}
              {profile.isKids && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold">
                  Kids
                </span>
              )}
            </span>
          </div>
        ))}

        {/* Add Profile Card (Max 5) */}
        {profiles.length < 5 && !isManaging && (
          <div
            onClick={() => {
              setProfileName("");
              setProfileAvatar(AVATAR_OPTIONS[0].src);
              setIsKids(false);
              setError(null);
              setIsAddModalOpen(true);
            }}
            className="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105"
          >
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl border-2 border-dashed border-zinc-600 group-hover:border-white flex items-center justify-center bg-cinema-surface/50 group-hover:bg-cinema-surface transition-all">
              <Plus className="w-12 h-12 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
            <span className="mt-3 text-sm sm:text-base font-medium text-zinc-400 group-hover:text-white transition-colors">
              Add Profile
            </span>
          </div>
        )}
      </div>

      {/* Toggle Manage Profiles Button */}
      <div className="mt-12 sm:mt-16">
        <Button
          variant={isManaging ? "primary" : "outline"}
          size="lg"
          onClick={() => setIsManaging(!isManaging)}
          className="px-8 tracking-wider uppercase font-semibold text-sm"
        >
          {isManaging ? "Done" : "Manage Profiles"}
        </Button>
      </div>

      {/* Add Profile Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Profile"
        maxWidth="md"
      >
        <form onSubmit={handleCreateProfile} className="space-y-6">
          <Input
            label="Profile Name"
            placeholder="e.g. Alex"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            error={error || undefined}
            autoFocus
          />

          {/* Avatar Picker */}
          <div>
            <label className="block text-xs font-medium text-cinema-muted uppercase tracking-wider mb-2">
              Choose Avatar
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setProfileAvatar(av.src)}
                  className={cn(
                    "relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 ring-2 transition-all",
                    profileAvatar === av.src ? "ring-brand scale-105" : "ring-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image src={av.src} alt={av.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Kids Mode Toggle */}
          <label className="flex items-center gap-3 p-3 rounded-lg bg-cinema-surface border border-cinema-border cursor-pointer">
            <input
              type="checkbox"
              checked={isKids}
              onChange={(e) => setIsKids(e.target.checked)}
              className="w-4 h-4 accent-brand rounded cursor-pointer"
            />
            <div>
              <p className="text-sm font-semibold text-white">Kids Profile?</p>
              <p className="text-xs text-cinema-muted">
                Only show movies and TV shows rated for kids and families.
              </p>
            </div>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Create Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        maxWidth="md"
      >
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <Input
            label="Profile Name"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            error={error || undefined}
          />

          <div>
            <label className="block text-xs font-medium text-cinema-muted uppercase tracking-wider mb-2">
              Choose Avatar
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setProfileAvatar(av.src)}
                  className={cn(
                    "relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 ring-2 transition-all",
                    profileAvatar === av.src ? "ring-brand scale-105" : "ring-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image src={av.src} alt={av.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 p-3 rounded-lg bg-cinema-surface border border-cinema-border cursor-pointer">
            <input
              type="checkbox"
              checked={isKids}
              onChange={(e) => setIsKids(e.target.checked)}
              className="w-4 h-4 accent-brand rounded cursor-pointer"
            />
            <div>
              <p className="text-sm font-semibold text-white">Kids Profile</p>
              <p className="text-xs text-cinema-muted">
                Filter out mature content automatically.
              </p>
            </div>
          </label>

          <div className="flex items-center justify-between pt-2 border-t border-cinema-border/50">
            {profiles.length > 1 && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete Profile
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProfile}
        title="Delete Profile?"
        description={`This will permanently delete profile "${selectedProfile?.name}" and all its watch history, watchlist, and ratings.`}
        confirmText="Delete Profile"
        isLoading={isLoading}
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Bell,
  ChevronDown,
  User as UserIcon,
  Film,
  Tv,
  ListPlus,
  Flame,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  CreditCard,
} from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { activeProfile, profiles, fetchProfiles } = useProfileStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: "Home", href: "/browse" },
    { name: "TV Shows", href: "/series" },
    { name: "Movies", href: "/movies" },
    { name: "New & Popular", href: "/browse?filter=popular" },
    { name: "My List", href: "/my-list" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-colors duration-300 select-none",
        isScrolled
          ? "bg-cinema-black/95 backdrop-blur-md shadow-lg border-b border-cinema-border/40"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      )}
    >
      <div className="flex items-center justify-between px-4 sm:px-8 md:px-12 h-16 md:h-20">
        {/* Left: Brand Logo & Desktop Nav Links */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/browse" className="flex items-center gap-1.5 group">
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-brand drop-shadow-[0_0_12px_rgba(229,9,20,0.6)] group-hover:scale-105 transition-transform">
              STREAMFLIX
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-5 text-sm font-medium text-zinc-300">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "hover:text-white transition-colors duration-200",
                    isActive ? "text-white font-bold" : "text-zinc-400"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Search, Notifications & Profile Avatar */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Search Trigger / Input */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-black/80 border border-white/40 rounded-full px-3 py-1.5 animate-fade-in"
              >
                <Search className="w-4 h-4 text-zinc-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Titles, people, genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-transparent text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none w-36 sm:w-56"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-zinc-400 hover:text-white ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-zinc-300 hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-zinc-300 hover:text-white transition-colors rounded-full hover:bg-white/10 relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand" />
            </button>

            {isNotificationsOpen && (
              <div
                className="absolute right-0 mt-3 w-80 bg-cinema-card border border-cinema-border rounded-xl shadow-2xl p-4 space-y-3 z-50 animate-slide-up"
                onMouseLeave={() => setIsNotificationsOpen(false)}
              >
                <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-cinema-border/50 pb-2">
                  Notifications
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-cinema-surface hover:bg-cinema-surfaceLight transition-colors">
                    <p className="font-semibold text-white">🔥 New Release</p>
                    <p className="text-cinema-muted mt-0.5">
                      Dune: Part Two is now available to stream in 4K HDR!
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-cinema-surface hover:bg-cinema-surfaceLight transition-colors">
                    <p className="font-semibold text-white">🎬 Recommended For You</p>
                    <p className="text-cinema-muted mt-0.5">
                      Based on your watch history: Interstellar & Stranger Echoes.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Switcher & Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            >
              <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-md overflow-hidden ring-2 ring-transparent group-hover:ring-brand transition-all">
                <Image
                  src={
                    activeProfile?.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  }
                  alt={activeProfile?.name || "Profile"}
                  fill
                  className="object-cover"
                />
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-zinc-400 transition-transform duration-200",
                  isProfileMenuOpen && "rotate-180"
                )}
              />
            </button>

            {isProfileMenuOpen && (
              <div
                className="absolute right-0 mt-3 w-60 bg-cinema-card border border-cinema-border rounded-xl shadow-2xl py-2 z-50 animate-slide-up text-sm"
                onMouseLeave={() => setIsProfileMenuOpen(false)}
              >
                {/* Profiles List */}
                <div className="px-4 py-2 border-b border-cinema-border/50">
                  <p className="text-[11px] font-semibold text-cinema-muted uppercase tracking-wider mb-2">
                    Profiles
                  </p>
                  <div className="space-y-1.5">
                    {profiles.map((p) => (
                      <Link
                        key={p.id}
                        href="/browse"
                        onClick={() => {
                          useProfileStore.getState().setActiveProfile(p);
                          setIsProfileMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors",
                          activeProfile?.id === p.id && "bg-white/5 font-semibold text-brand-glow"
                        )}
                      >
                        <div className="relative w-6 h-6 rounded overflow-hidden">
                          <Image
                            src={p.avatar}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-white text-xs">{p.name}</span>
                        {p.isKids && (
                          <span className="ml-auto text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded">
                            Kids
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Switch Profiles */}
                <Link
                  href="/profiles"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  Manage Profiles
                </Link>

                {/* Account & Subscriptions */}
                <Link
                  href="/account"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  Account
                </Link>

                <Link
                  href="/subscription"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  Subscription Plan
                </Link>

                {/* Admin Portal if role is ADMIN */}
                {session?.user?.role === "ADMIN" && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-amber-400 hover:bg-amber-400/10 transition-colors font-medium"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}

                <div className="border-t border-cinema-border/50 mt-1 pt-1">
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out of StreamFlix
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 md:hidden text-zinc-300 hover:text-white"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-cinema-black/95 backdrop-blur-xl border-b border-cinema-border px-6 py-6 space-y-4 animate-fade-in">
          <div className="space-y-3 font-medium text-base">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-zinc-300 hover:text-white py-1"
              >
                {link.name}
              </Link>
            ))}
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-amber-400 font-bold py-1"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

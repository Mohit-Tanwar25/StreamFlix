import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Film, ShieldCheck, Tv, Smartphone, Award, ArrowRight, Play } from "lucide-react";
import { PLANS } from "@/lib/stripe";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/browse");
  }

  return (
    <div className="relative min-h-screen bg-cinema-black text-white flex flex-col justify-between overflow-x-hidden selection:bg-brand selection:text-white">
      {/* Background Hero Layer with Opacity */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&auto=format&fit=crop&q=80"
          alt="StreamFlix Cinema"
          fill
          priority
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/70 to-cinema-black/90" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-12 md:px-20 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-3xl sm:text-4xl font-black tracking-tighter text-brand drop-shadow-[0_0_15px_rgba(229,9,20,0.6)]">
            STREAMFLIX
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="primary" size="md" className="font-semibold shadow-lg">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-4xl mx-auto my-auto py-16 sm:py-24 space-y-6">
        <span className="bg-brand/20 text-brand-glow border border-brand/40 px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase">
          Cinematic Entertainment Awaits
        </span>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight">
          Unlimited movies, TV shows, and more.
        </h1>

        <p className="text-lg sm:text-2xl text-zinc-300 font-medium">
          Starts at $8.99. Cancel anytime.
        </p>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl">
          Ready to watch? Enter your email to create or restart your membership.
        </p>

        {/* Action Call to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full max-w-md">
          <Link href="/register" className="w-full sm:w-auto flex-1">
            <Button
              variant="primary"
              size="lg"
              className="w-full text-base font-bold flex items-center justify-center gap-2 py-4"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full text-base font-medium py-4 px-6"
            >
              Try Demo User
            </Button>
          </Link>
        </div>
      </main>

      {/* Feature Highlights */}
      <section className="relative z-10 border-t border-cinema-border/60 bg-cinema-card/70 backdrop-blur-md py-16 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-cinema-surface border border-cinema-border/50 flex flex-col items-center text-center space-y-3">
            <div className="p-3.5 rounded-full bg-brand/10 text-brand border border-brand/20">
              <Tv className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Enjoy on your TV</h3>
            <p className="text-sm text-cinema-muted">
              Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-cinema-surface border border-cinema-border/50 flex flex-col items-center text-center space-y-3">
            <div className="p-3.5 rounded-full bg-brand/10 text-brand border border-brand/20">
              <Smartphone className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Watch everywhere</h3>
            <p className="text-sm text-cinema-muted">
              Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-cinema-surface border border-cinema-border/50 flex flex-col items-center text-center space-y-3">
            <div className="p-3.5 rounded-full bg-brand/10 text-brand border border-brand/20">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Profiles for kids</h3>
            <p className="text-sm text-cinema-muted">
              Send kids on adventures with their favorite characters in a space made just for them.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cinema-border/40 py-8 px-6 text-center text-xs text-cinema-muted">
        <p>© {new Date().getFullYear()} StreamFlix, Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

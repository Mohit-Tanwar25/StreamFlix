import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProfileSelector } from "@/components/profile-selector/profile-selector";

export default async function ProfilesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen bg-cinema-black text-white flex flex-col justify-between p-6 sm:p-12">
      {/* Top Navbar Brand */}
      <header className="flex items-center justify-between">
        <Link href="/browse" className="text-2xl sm:text-3xl font-black text-brand tracking-tighter drop-shadow-md">
          STREAMFLIX
        </Link>
      </header>

      {/* Main Profile Selector Card Grid */}
      <main className="my-auto">
        <ProfileSelector />
      </main>

      <footer className="text-center text-xs text-cinema-muted">
        © {new Date().getFullYear()} StreamFlix. Select your profile to start streaming.
      </footer>
    </div>
  );
}

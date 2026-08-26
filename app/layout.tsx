import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "StreamFlix - Watch Movies & TV Shows Online",
  description:
    "Stream your favorite blockbusters, original series, and documentaries on StreamFlix. Unlimited entertainment on any device.",
  keywords: ["streaming", "movies", "tv shows", "streamflix", "cinema", "watch online"],
  authors: [{ name: "StreamFlix Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-cinema-black text-cinema-text min-h-screen antialiased selection:bg-brand selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

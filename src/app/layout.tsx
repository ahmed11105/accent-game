import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AccentIQ — Voice Accent Training for Actors",
  description:
    "Train your ear and voice to master accents. Practice with real-time feedback, phonetic breakdowns, and audio demos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl">
              <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <a href="/" className="flex items-center gap-2.5 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-sm shadow-lg shadow-violet-500/20">
                    <span className="text-white font-bold text-xs">A</span>
                  </div>
                  <span className="font-semibold text-sm tracking-tight text-zinc-200 group-hover:text-white transition-colors">
                    AccentIQ
                  </span>
                </a>
                <nav className="flex items-center gap-1">
                  <a href="/" className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">
                    Accents
                  </a>
                  <a href="/games/guess-the-accent" className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">
                    Games
                  </a>
                </nav>
              </div>
            </header>
            {children}
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}

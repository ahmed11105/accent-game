import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
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
        className={`${jakarta.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <TooltipProvider>
          <div className="min-h-screen bg-[#0a0a0c]">
            <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0c]/90 backdrop-blur-xl">
              <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <a href="/" className="flex items-center gap-3 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/15">
                    <span className="text-[#0a0a0c] font-bold text-xs">A</span>
                  </div>
                  <span className="font-display text-lg text-zinc-200 group-hover:text-amber-300 transition-colors">
                    AccentIQ
                  </span>
                </a>
                <nav className="flex items-center gap-1">
                  <a href="/" className="px-3 py-1.5 rounded-lg text-[13px] font-medium text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] transition-all">
                    Accents
                  </a>
                  <a href="/games/guess-the-accent" className="px-3 py-1.5 rounded-lg text-[13px] font-medium text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] transition-all">
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

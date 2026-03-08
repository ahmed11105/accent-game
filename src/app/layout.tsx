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
            <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
              <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <a href="/" className="flex items-center gap-2">
                  <span className="text-2xl">🎭</span>
                  <span className="font-bold text-lg tracking-tight">
                    Accent<span className="text-primary">IQ</span>
                  </span>
                </a>
                <nav className="flex items-center gap-4 text-sm text-muted-foreground">
                  <a href="/" className="hover:text-foreground transition-colors">
                    Accents
                  </a>
                </nav>
              </div>
            </header>
            <main>{children}</main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}

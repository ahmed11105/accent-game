import { accents, type AccentData } from "@/data/accents"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, ChevronRight, Ear } from "lucide-react"

function getDifficultyColor(difficulty: AccentData["difficulty"]) {
  switch (difficulty) {
    case "beginner":
      return "border-green-500 text-green-400"
    case "intermediate":
      return "border-yellow-500 text-yellow-400"
    case "advanced":
      return "border-red-500 text-red-400"
  }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-zinc-950 to-indigo-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="flex items-center gap-2 text-violet-400 mb-6">
            <Globe className="h-5 w-5" />
            <span className="text-sm font-medium tracking-wide uppercase">AccentIQ</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Master Any Accent
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Train your voice with real-time feedback, phonetic breakdowns, and audio demos.
            Built for actors who want to expand their range.
          </p>
        </div>
      </section>

      {/* Games Section */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8">
        <a
          href="/games/guess-the-accent"
          className="group block rounded-xl transition-transform duration-300 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-violet-950/60 via-zinc-900/80 to-indigo-950/60 p-6 sm:p-8 transition-all duration-300 group-hover:border-violet-500/50 group-hover:shadow-lg group-hover:shadow-violet-500/10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-400">
                <Ear className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-zinc-100">Guess the Accent</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Listen to a phrase and guess which accent it is. Test your ear across 10 rounds!
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-600 transition-all duration-300 group-hover:text-violet-400 group-hover:translate-x-1" />
            </div>
          </div>
        </a>
      </section>

      {/* Accent Cards Grid */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accents.map((accent) => (
            <a
              key={accent.slug}
              href={`/accent/${accent.slug}`}
              className="group block transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-xl"
            >
              <Card className="h-full border-zinc-800 bg-zinc-900/60 backdrop-blur-sm transition-all duration-300 group-hover:border-violet-500/50 group-hover:shadow-lg group-hover:shadow-violet-500/10">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{accent.emoji}</span>
                    <Badge
                      variant="outline"
                      className={getDifficultyColor(accent.difficulty)}
                    >
                      {accent.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="mt-3 text-lg text-zinc-100">
                    {accent.name}
                  </CardTitle>
                  <CardDescription className="text-zinc-500">
                    {accent.region}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="line-clamp-2 text-sm leading-relaxed text-zinc-400">
                    {accent.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="font-medium text-violet-400">
                      {accent.lessons.length} {accent.lessons.length === 1 ? "lesson" : "lessons"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {accent.keyFeatures.slice(0, 3).map((feature) => (
                      <span
                        key={feature}
                        className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[11px] leading-4 text-zinc-400"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center gap-1 text-xs font-medium text-violet-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Start training
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

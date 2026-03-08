import { accents, type AccentData } from "@/data/accents"
import { ChevronRight, Ear, Sparkles } from "lucide-react"

function getDifficultyStyle(difficulty: AccentData["difficulty"]) {
  switch (difficulty) {
    case "beginner":
      return "bg-emerald-500/15 text-emerald-400"
    case "intermediate":
      return "bg-amber-500/15 text-amber-400"
    case "advanced":
      return "bg-rose-500/15 text-rose-400"
  }
}

const totalLessons = accents.reduce((sum, a) => sum + a.lessons.length, 0)
const totalWords = accents.reduce(
  (sum, a) => sum + a.lessons.reduce((s, l) => s + l.practiceWords.length, 0),
  0
)

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Gradient mesh background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(120,60,200,0.15),_transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_80%_50%,_rgba(60,20,120,0.08),_transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_20%_80%,_rgba(80,40,160,0.06),_transparent)]" />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-24 pb-12 sm:px-6 sm:pt-32 sm:pb-16 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Master Any Accent
          </span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-400">
          Train your voice with phonetic breakdowns and audio demos.
          Built for actors who want to expand their range.
        </p>
        <div className="mt-6 flex items-center gap-3 text-sm text-zinc-500">
          <span>{accents.length} Accents</span>
          <span className="text-zinc-700">•</span>
          <span>{totalLessons} Lessons</span>
          <span className="text-zinc-700">•</span>
          <span>{totalWords}+ Words</span>
        </div>
      </section>

      {/* Game Banner */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <a
          href="/games/guess-the-accent"
          className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm transition-all duration-300 group-hover:border-white/[0.12] group-hover:shadow-[0_0_40px_-12px_rgba(139,92,246,0.15)]">
            {/* Gradient left border */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-violet-500 to-indigo-500" />
            <div className="flex items-center gap-4 p-5 pl-6 sm:p-6 sm:pl-7">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
                <Ear className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-zinc-100">Guess the Accent</h2>
                <p className="mt-0.5 text-sm text-zinc-500">
                  Listen to a phrase and guess which accent it is. Test your ear across 10 rounds.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-zinc-600 transition-all duration-300 group-hover:text-violet-400 group-hover:translate-x-1" />
            </div>
          </div>
        </a>
      </section>

      {/* Accent Grid */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accents.map((accent) => (
            <a
              key={accent.slug}
              href={`/accent/${accent.slug}`}
              className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <div className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-white/[0.12] group-hover:shadow-[0_0_40px_-12px_rgba(139,92,246,0.12)]">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{accent.emoji}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyStyle(accent.difficulty)}`}
                  >
                    {accent.difficulty}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-zinc-100">
                  {accent.name}
                </h3>
                <p className="text-sm text-zinc-500">{accent.region}</p>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                  {accent.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-sm text-violet-400">
                    {accent.lessons.length} {accent.lessons.length === 1 ? "lesson" : "lessons"}
                  </span>
                  <ChevronRight className="h-4 w-4 text-zinc-600 transition-all duration-300 group-hover:text-violet-400 group-hover:translate-x-0.5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

import { accents, type AccentData } from "@/data/accents"
import { ChevronRight, Ear } from "lucide-react"

function getDifficultyStyle(difficulty: AccentData["difficulty"]) {
  switch (difficulty) {
    case "beginner":
      return "text-emerald-400/80"
    case "intermediate":
      return "text-amber-400/80"
    case "advanced":
      return "text-rose-400/80"
  }
}

const totalLessons = accents.reduce((sum, a) => sum + a.lessons.length, 0)
const totalWords = accents.reduce(
  (sum, a) => sum + a.lessons.reduce((s, l) => s + l.practiceWords.length, 0),
  0
)

export default function Home() {
  return (
    <div className="min-h-screen text-zinc-100">
      {/* Warm gradient background */}
      <div className="fixed inset-0 -z-10 bg-[#0a0a0c]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_-10%,_rgba(245,158,11,0.06),_transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_80%_50%,_rgba(180,100,20,0.03),_transparent)]" />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-amber-400/70 mb-4">
          Voice Training for Actors
        </p>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-zinc-100 leading-[1.1]">
          Master Any<br />Accent
        </h1>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-zinc-500">
          Train your voice with phonetic breakdowns, IPA transcriptions,
          and real-time feedback. Built for performers.
        </p>
        <div className="mt-8 flex items-center gap-6 text-[13px] text-zinc-600">
          <span>{accents.length} accents</span>
          <span className="w-px h-3 bg-zinc-800" />
          <span>{totalLessons} lessons</span>
          <span className="w-px h-3 bg-zinc-800" />
          <span>{totalWords}+ words</span>
        </div>
      </section>

      {/* Game Banner */}
      <section className="mx-auto max-w-6xl px-6">
        <a
          href="/games/guess-the-accent"
          className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 rounded-xl"
        >
          <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all duration-300 group-hover:border-amber-400/20 group-hover:bg-white/[0.04]">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-400 to-orange-500" />
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/10">
                <Ear className="h-5 w-5 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-[15px] font-semibold text-zinc-200">Guess the Accent</h2>
                <p className="mt-0.5 text-[13px] text-zinc-500">
                  Listen to a phrase and identify the accent. 10 rounds to test your ear.
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-zinc-700 transition-all duration-300 group-hover:text-amber-400 group-hover:translate-x-0.5" />
            </div>
          </div>
        </a>
      </section>

      {/* Accent Grid */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {accents.map((accent) => (
            <a
              key={accent.slug}
              href={`/accent/${accent.slug}`}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 rounded-xl"
            >
              <div className="flex h-full flex-col rounded-xl border border-white/[0.05] bg-white/[0.02] p-5 transition-all duration-300 group-hover:border-white/[0.1] group-hover:bg-white/[0.04]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{accent.emoji}</span>
                  <span className={`text-[11px] font-medium uppercase tracking-wider ${getDifficultyStyle(accent.difficulty)}`}>
                    {accent.difficulty}
                  </span>
                </div>
                <h3 className="text-[15px] font-semibold text-zinc-200">
                  {accent.name}
                </h3>
                <p className="text-[13px] text-zinc-600 mt-0.5">{accent.region}</p>
                <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-zinc-500">
                  {accent.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-5 border-t border-white/[0.04] mt-4">
                  <span className="text-[12px] text-amber-400/70 font-medium">
                    {accent.lessons.length} {accent.lessons.length === 1 ? "lesson" : "lessons"}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-700 transition-all duration-300 group-hover:text-amber-400 group-hover:translate-x-0.5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

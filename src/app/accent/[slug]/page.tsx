import Link from "next/link"
import { accents } from "@/data/accents"
import { ArrowLeft, BookOpen, ChevronRight, Mic } from "lucide-react"

const categoryColors: Record<string, string> = {
  vowels: "text-blue-400/80 bg-blue-400/8",
  consonants: "text-purple-400/80 bg-purple-400/8",
  rhythm: "text-orange-400/80 bg-orange-400/8",
  intonation: "text-pink-400/80 bg-pink-400/8",
  phrases: "text-emerald-400/80 bg-emerald-400/8",
}

const difficultyConfig: Record<string, { color: string; label: string }> = {
  beginner: { color: "text-emerald-400/80", label: "Beginner" },
  intermediate: { color: "text-amber-400/80", label: "Intermediate" },
  advanced: { color: "text-rose-400/80", label: "Advanced" },
}

export default async function AccentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const accent = accents.find((a) => a.slug === slug)

  if (!accent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-semibold">Accent not found</h1>
        <p className="mt-2 text-zinc-500">
          The accent you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Accents
        </Link>
      </div>
    )
  }

  const difficulty = difficultyConfig[accent.difficulty]

  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-zinc-600 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Accents
        </Link>

        {/* Accent Header */}
        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-3xl">{accent.emoji}</span>
          </div>

          <div className="flex-1">
            <h1 className="font-display text-3xl sm:text-4xl text-white">{accent.name}</h1>

            <div className="mt-2 flex items-center gap-3">
              <span className="text-[13px] text-zinc-600">{accent.region}</span>
              <span className="w-px h-3 bg-zinc-800" />
              <span className={`text-[12px] font-medium uppercase tracking-wider ${difficulty.color}`}>
                {difficulty.label}
              </span>
            </div>

            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-500">
              {accent.description}
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-14">
          <h2 className="text-[13px] font-medium uppercase tracking-[0.15em] text-zinc-500 mb-5">Key Features</h2>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {accent.keyFeatures.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-[14px] text-zinc-400"
              >
                <span className="mt-1 h-1 w-1 rounded-full bg-amber-400/60 shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Lessons */}
        <div className="mt-16">
          <div className="flex items-center gap-2.5 mb-6">
            <BookOpen className="h-4 w-4 text-zinc-600" />
            <h2 className="text-[13px] font-medium uppercase tracking-[0.15em] text-zinc-500">
              Lessons
            </h2>
            <span className="text-[12px] text-zinc-700">
              {accent.lessons.length}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {accent.lessons
              .sort((a, b) => a.lessonOrder - b.lessonOrder)
              .map((lesson) => (
                <Link
                  key={lesson.slug}
                  href={`/accent/${slug}/practice/${lesson.slug}`}
                  className="group"
                >
                  <div className="h-full rounded-xl bg-white/[0.02] border border-white/[0.05] p-5 transition-all duration-200 group-hover:border-white/[0.1] group-hover:bg-white/[0.04]">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-400/10 text-[11px] font-semibold text-amber-400/80 mt-0.5">
                        {lesson.lessonOrder}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[14px] font-semibold text-zinc-200">{lesson.title}</span>
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-800 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-500" />
                        </div>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
                          {lesson.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3 pl-9">
                      <span className={`${categoryColors[lesson.category]} rounded-md px-2 py-0.5 text-[11px] font-medium capitalize`}>
                        {lesson.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-zinc-700">
                        <Mic className="h-3 w-3" />
                        {lesson.practiceWords.length} words
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

      </div>
    </div>
  )
}

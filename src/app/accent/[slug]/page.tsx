import Link from "next/link"
import { accents } from "@/data/accents"
import { ArrowLeft, BookOpen, ChevronRight, Mic } from "lucide-react"

const categoryColors: Record<string, string> = {
  vowels: "bg-blue-500/15 text-blue-400",
  consonants: "bg-purple-500/15 text-purple-400",
  rhythm: "bg-orange-500/15 text-orange-400",
  intonation: "bg-pink-500/15 text-pink-400",
  phrases: "bg-emerald-500/15 text-emerald-400",
}

const difficultyConfig: Record<string, { colors: string; label: string }> = {
  beginner: { colors: "bg-emerald-500/15 text-emerald-400", label: "Beginner" },
  intermediate: { colors: "bg-amber-500/15 text-amber-400", label: "Intermediate" },
  advanced: { colors: "bg-rose-500/15 text-rose-400", label: "Advanced" },
}

export default async function AccentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const accent = accents.find((a) => a.slug === slug)

  if (!accent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
        <h1 className="text-2xl font-semibold">Accent not found</h1>
        <p className="mt-2 text-zinc-400">
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
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Accents
        </Link>

        {/* Accent Header */}
        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-4xl">{accent.emoji}</span>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{accent.name}</h1>

            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm text-zinc-500">{accent.region}</span>
              <span className={`${difficulty.colors} rounded-full px-3 py-1 text-xs font-medium`}>
                {difficulty.label}
              </span>
            </div>

            <p className="mt-4 max-w-2xl leading-relaxed text-zinc-400">
              {accent.description}
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-white">Key Features</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {accent.keyFeatures.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 text-sm text-zinc-300"
              >
                <span className="mt-0.5 text-violet-400">&#10003;</span>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Lessons */}
        <div className="mt-14">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-zinc-500" />
            <h2 className="text-lg font-semibold text-white">Lessons</h2>
            <span className="text-sm text-zinc-600">
              ({accent.lessons.length})
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {accent.lessons
              .sort((a, b) => a.lessonOrder - b.lessonOrder)
              .map((lesson) => (
                <Link
                  key={lesson.slug}
                  href={`/accent/${slug}/practice/${lesson.slug}`}
                  className="group"
                >
                  <div className="h-full rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 transition-all duration-200 group-hover:border-white/[0.12] group-hover:scale-[1.01]">
                    {/* Top row: number + title + chevron */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs font-semibold text-violet-400">
                        {lesson.lessonOrder}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-zinc-100">{lesson.title}</span>
                          <ChevronRight className="h-4 w-4 shrink-0 text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-400" />
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                          {lesson.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom row: category + word count */}
                    <div className="mt-4 flex items-center gap-3">
                      <span className={`${categoryColors[lesson.category]} rounded-full px-2.5 py-0.5 text-xs font-medium capitalize`}>
                        {lesson.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-600">
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

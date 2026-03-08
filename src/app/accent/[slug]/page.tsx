import Link from "next/link"
import { accents } from "@/data/accents"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, ChevronRight, Mic } from "lucide-react"

const categoryColors: Record<string, string> = {
  vowels: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  consonants: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  rhythm: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  intonation: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  phrases: "bg-green-500/20 text-green-400 border-green-500/30",
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  intermediate: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  advanced: "bg-red-500/20 text-red-400 border-red-500/30",
}

export default async function AccentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const accent = accents.find((a) => a.slug === slug)

  if (!accent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-zinc-50">
        <h1 className="text-2xl font-semibold">Accent not found</h1>
        <p className="mt-2 text-zinc-400">
          The accent you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Accents
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-zinc-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" />
          All Accents
        </Link>

        {/* Accent header */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <span className="text-6xl">{accent.emoji}</span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{accent.name}</h1>
              <Badge
                className={`${difficultyColors[accent.difficulty]} border text-xs capitalize`}
              >
                {accent.difficulty}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-zinc-400">{accent.region}</p>
            <p className="mt-4 max-w-2xl leading-relaxed text-zinc-300">
              {accent.description}
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold">Key Features</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {accent.keyFeatures.map((feature, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-zinc-300"
              >
                <span className="mt-0.5 text-emerald-400">&#10003;</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Lessons section */}
        <div className="mt-12">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-zinc-400" />
            <h2 className="text-lg font-semibold">Lessons</h2>
            <span className="text-sm text-zinc-500">
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
                  <Card className="h-full border-zinc-800 bg-zinc-900/60 transition-all duration-200 group-hover:border-zinc-600 group-hover:bg-zinc-900">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        {/* Lesson order circle */}
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-zinc-300 group-hover:bg-zinc-700">
                          {lesson.lessonOrder}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="flex items-center justify-between text-zinc-50">
                            <span>{lesson.title}</span>
                            <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-400" />
                          </CardTitle>
                          <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                            {lesson.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          className={`${categoryColors[lesson.category]} border text-xs capitalize`}
                        >
                          {lesson.category}
                        </Badge>
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                          <Mic className="h-3 w-3" />
                          {lesson.practiceWords.length} practice words
                        </span>
                      </div>

                      {/* Tips preview */}
                      {lesson.tips.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {lesson.tips.slice(0, 2).map((tip, i) => (
                            <li
                              key={i}
                              className="text-xs leading-relaxed text-zinc-500"
                            >
                              &bull; {tip}
                            </li>
                          ))}
                          {lesson.tips.length > 2 && (
                            <li className="text-xs text-zinc-600">
                              +{lesson.tips.length - 2} more tips
                            </li>
                          )}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

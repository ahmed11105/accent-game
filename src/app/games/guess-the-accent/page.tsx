"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { accents, type AccentData } from "@/data/accents"
import { speakText } from "@/lib/speech"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Volume2,
  RotateCcw,
  Trophy,
  ArrowRight,
  Check,
  X,
  Play,
  Ear,
} from "lucide-react"
import Link from "next/link"

// ---- Types & Constants ----

type GameState = "intro" | "listening" | "guessing" | "result" | "gameover"

interface RoundHistoryEntry {
  accent: string
  guess: string
  correct: boolean
}

const TOTAL_ROUNDS = 10
const CHOICES_PER_ROUND = 4

const voiceLangMap: Record<string, string> = {
  "british-rp": "en-GB",
  "cockney": "en-GB",
  "australian": "en-AU",
  "southern-us": "en-US",
  "irish": "en-IE",
  "scottish": "en-GB",
  "new-york": "en-US",
  "standard-american": "en-US",
}

// ---- Helpers ----

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Pick a random practice phrase (exampleSentence) from the accent's lessons.
 * Prefers "phrases" category lessons but falls back to any lesson.
 */
function pickPhraseForAccent(accent: AccentData): string {
  const phraseLessons = accent.lessons.filter((l) => l.category === "phrases")
  const pool = phraseLessons.length > 0 ? phraseLessons : accent.lessons
  const lesson = pickRandom(pool)
  const word = pickRandom(lesson.practiceWords)
  return word.exampleSentence
}

/**
 * Pick wrong-answer accents, preferring those with a different lang code
 * so the TTS voice actually sounds distinct.
 */
function pickWrongAnswers(
  correctAccent: AccentData,
  count: number
): AccentData[] {
  const correctLang = voiceLangMap[correctAccent.slug] ?? "en-US"

  // Separate candidates into distinct-sounding vs same-lang
  const others = accents.filter((a) => a.slug !== correctAccent.slug)
  const distinctLang = others.filter(
    (a) => (voiceLangMap[a.slug] ?? "en-US") !== correctLang
  )
  const sameLang = others.filter(
    (a) => (voiceLangMap[a.slug] ?? "en-US") === correctLang
  )

  const selected: AccentData[] = []
  const shuffledDistinct = shuffle(distinctLang)
  const shuffledSame = shuffle(sameLang)

  // Fill from distinct first, then same-lang as fallback
  for (const a of shuffledDistinct) {
    if (selected.length >= count) break
    selected.push(a)
  }
  for (const a of shuffledSame) {
    if (selected.length >= count) break
    selected.push(a)
  }

  return selected.slice(0, count)
}

function getPerformanceRating(score: number): string {
  if (score === 10) return "Perfect! You have an incredible ear!"
  if (score >= 8) return "Excellent! You really know your accents!"
  if (score >= 6) return "Great job! Keep practicing!"
  if (score >= 4) return "Not bad! Room for improvement."
  return "Keep listening! Practice makes perfect."
}

// ---- Component ----

export default function GuessTheAccentPage() {
  const [gameState, setGameState] = useState<GameState>("intro")
  const [currentRound, setCurrentRound] = useState(1)
  const [score, setScore] = useState(0)
  const [currentAccent, setCurrentAccent] = useState<AccentData | null>(null)
  const [currentPhrase, setCurrentPhrase] = useState("")
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [roundHistory, setRoundHistory] = useState<RoundHistoryEntry[]>([])
  const [choices, setChoices] = useState<AccentData[]>([])

  // Ref to prevent double-play on mount in strict mode
  const hasAutoPlayed = useRef(false)

  // ---- Core logic ----

  const playPhrase = useCallback(
    async (phrase?: string, accent?: AccentData) => {
      const text = phrase ?? currentPhrase
      const target = accent ?? currentAccent
      if (!text || !target) return

      const lang = voiceLangMap[target.slug] ?? "en-US"
      setIsPlaying(true)
      try {
        await speakText(text, lang, 0.9)
      } catch {
        // Silently handle TTS errors
      } finally {
        setIsPlaying(false)
      }
    },
    [currentPhrase, currentAccent]
  )

  const pickRound = useCallback(() => {
    const accent = pickRandom(accents)
    const phrase = pickPhraseForAccent(accent)
    const wrong = pickWrongAnswers(accent, CHOICES_PER_ROUND - 1)
    const shuffledChoices = shuffle([accent, ...wrong])

    setCurrentAccent(accent)
    setCurrentPhrase(phrase)
    setChoices(shuffledChoices)
    setSelectedAnswer(null)
    setGameState("listening")
    hasAutoPlayed.current = false
  }, [])

  // Auto-play phrase when entering "listening" state
  useEffect(() => {
    if (gameState === "listening" && currentAccent && currentPhrase && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true
      playPhrase(currentPhrase, currentAccent)
    }
  }, [gameState, currentAccent, currentPhrase, playPhrase])

  const startGame = useCallback(() => {
    setCurrentRound(1)
    setScore(0)
    setRoundHistory([])
    pickRound()
  }, [pickRound])

  const handleGuess = useCallback(
    (slug: string) => {
      if (gameState !== "listening" && gameState !== "guessing") return
      if (!currentAccent) return

      // Stop any playing audio
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }

      const correct = slug === currentAccent.slug
      setSelectedAnswer(slug)
      if (correct) setScore((s) => s + 1)
      setRoundHistory((h) => [
        ...h,
        {
          accent: currentAccent.name,
          guess: accents.find((a) => a.slug === slug)?.name ?? slug,
          correct,
        },
      ])
      setGameState("result")
    },
    [gameState, currentAccent]
  )

  const nextRound = useCallback(() => {
    if (currentRound >= TOTAL_ROUNDS) {
      setGameState("gameover")
    } else {
      setCurrentRound((r) => r + 1)
      pickRound()
    }
  }, [currentRound, pickRound])

  // ---- Render helpers ----

  const selectedAccent = selectedAnswer
    ? accents.find((a) => a.slug === selectedAnswer) ?? null
    : null
  const isCorrect = selectedAnswer === currentAccent?.slug

  // ---- Screens ----

  // Intro Screen
  if (gameState === "intro") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/10 ring-1 ring-violet-500/30">
              <Ear className="h-10 w-10 text-violet-400" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Guess the Accent
              </span>
            </h1>

            <p className="mt-4 text-lg text-zinc-400 leading-relaxed">
              Listen to a phrase and guess which accent it is.
              <br />
              Can you identify all 8 accents?
            </p>

            <div className="mt-10 space-y-3 text-sm text-zinc-500 text-left mx-auto max-w-xs">
              <div className="flex items-start gap-3">
                <Badge
                  variant="outline"
                  className="shrink-0 border-zinc-700 text-zinc-400"
                >
                  1
                </Badge>
                <span>Listen to a phrase spoken in a mystery accent</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge
                  variant="outline"
                  className="shrink-0 border-zinc-700 text-zinc-400"
                >
                  2
                </Badge>
                <span>Pick the correct accent from 4 choices</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge
                  variant="outline"
                  className="shrink-0 border-zinc-700 text-zinc-400"
                >
                  3
                </Badge>
                <span>Score points across 10 rounds</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="mt-12 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:bg-violet-500 hover:shadow-violet-500/40 hover:scale-105 active:scale-100"
            >
              <Play className="h-5 w-5" />
              Start Game
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Game Over Screen
  if (gameState === "gameover") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/30">
              <Trophy className="h-10 w-10 text-amber-400" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight">Game Over!</h1>

            <p className="mt-4 text-5xl font-bold text-violet-400">
              {score}
              <span className="text-2xl text-zinc-500"> / {TOTAL_ROUNDS}</span>
            </p>

            <p className="mt-3 text-lg text-zinc-400">
              {getPerformanceRating(score)}
            </p>
          </div>

          {/* Round History */}
          <div className="mt-10 space-y-2">
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-4">
              Round History
            </h2>
            {roundHistory.map((entry, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
                  entry.correct
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-red-500/30 bg-red-500/5"
                }`}
              >
                <span className="text-xs font-medium text-zinc-500 w-6">
                  {i + 1}.
                </span>
                {entry.correct ? (
                  <Check className="h-4 w-4 shrink-0 text-green-400" />
                ) : (
                  <X className="h-4 w-4 shrink-0 text-red-400" />
                )}
                <span className="text-sm text-zinc-300 flex-1">
                  {entry.accent}
                </span>
                {!entry.correct && (
                  <span className="text-xs text-zinc-500">
                    Guessed: {entry.guess}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:bg-violet-500 hover:shadow-violet-500/40 hover:scale-105 active:scale-100"
            >
              <RotateCcw className="h-5 w-5" />
              Play Again
            </button>
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Listening / Guessing / Result Screens
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Bar: Round + Score + Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-zinc-400">
              Round{" "}
              <span className="text-zinc-100">{currentRound}</span> of{" "}
              {TOTAL_ROUNDS}
            </span>
            <Badge
              variant="outline"
              className="border-violet-500/50 text-violet-400"
            >
              Score: {score}
            </Badge>
          </div>
          <Progress
            value={(currentRound / TOTAL_ROUNDS) * 100}
            className="h-2 bg-zinc-800"
          />
        </div>

        {/* Result Screen Overlay */}
        {gameState === "result" && currentAccent && (
          <div className="mb-8">
            <Card
              className={`border ${
                isCorrect
                  ? "border-green-500/40 bg-green-500/5"
                  : "border-red-500/40 bg-red-500/5"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {isCorrect ? (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                      <span className="text-xl font-bold text-green-400">
                        Correct!
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                      <span className="text-xl font-bold text-red-400">
                        Not quite!
                      </span>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-zinc-300">
                    <span className="text-zinc-500">The accent was: </span>
                    <span className="font-semibold">
                      {currentAccent.emoji} {currentAccent.name}
                    </span>
                    <span className="text-zinc-500">
                      {" "}
                      — {currentAccent.region}
                    </span>
                  </p>

                  {!isCorrect && selectedAccent && (
                    <p className="text-sm text-zinc-500">
                      You guessed:{" "}
                      <span className="text-zinc-400">
                        {selectedAccent.emoji} {selectedAccent.name}
                      </span>
                    </p>
                  )}

                  <p className="text-sm text-zinc-400 italic border-l-2 border-zinc-700 pl-3">
                    &ldquo;{currentPhrase}&rdquo;
                  </p>

                  {currentAccent.keyFeatures.length > 0 && (
                    <p className="text-sm text-zinc-500">
                      <span className="text-violet-400 font-medium">Tip: </span>
                      {currentAccent.keyFeatures[0]}
                    </p>
                  )}
                </div>

                <button
                  onClick={nextRound}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-violet-500 hover:scale-105 active:scale-100"
                >
                  {currentRound >= TOTAL_ROUNDS ? (
                    <>
                      See Results
                      <Trophy className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next Round
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Speaker / Play Button Area */}
        {(gameState === "listening" || gameState === "guessing") && (
          <div className="mb-10 text-center">
            <button
              onClick={() => {
                if (!isPlaying) {
                  playPhrase()
                  setGameState("guessing")
                }
              }}
              disabled={isPlaying}
              className="group relative mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-zinc-900 ring-2 ring-zinc-700 transition-all duration-300 hover:ring-violet-500/50 hover:bg-zinc-800 disabled:opacity-70"
            >
              {/* Pulse animation when playing */}
              {isPlaying && (
                <>
                  <span className="absolute inset-0 animate-ping rounded-full bg-violet-500/20" />
                  <span className="absolute inset-0 animate-pulse rounded-full bg-violet-500/10" />
                </>
              )}
              {isPlaying ? (
                <Volume2 className="h-12 w-12 text-violet-400 animate-pulse" />
              ) : (
                <Play className="h-12 w-12 text-zinc-300 transition-colors group-hover:text-violet-400" />
              )}
            </button>

            <p className="text-sm text-zinc-500">
              {isPlaying ? (
                <span className="text-violet-400">Listen carefully...</span>
              ) : gameState === "listening" ? (
                "Tap to play the accent"
              ) : (
                "What accent is this?"
              )}
            </p>

            {!isPlaying && gameState === "guessing" && (
              <button
                onClick={() => playPhrase()}
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-violet-400 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Play Again
              </button>
            )}
          </div>
        )}

        {/* Choices Grid — interactive during listening/guessing, static during result */}
        {(gameState === "listening" || gameState === "guessing") && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {choices.map((accent) => (
              <button
                key={accent.slug}
                onClick={() => handleGuess(accent.slug)}
                className="group text-left transition-all duration-200 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 hover:scale-[1.02] active:scale-[0.99]"
              >
                <Card className="h-full transition-all duration-200 border-zinc-800 bg-zinc-900/60 group-hover:border-violet-500/40 group-hover:bg-zinc-900">
                  <CardContent className="flex items-center gap-4 p-4">
                    <span className="text-3xl" role="img">
                      {accent.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-zinc-100 truncate">
                        {accent.name}
                      </p>
                      <p className="text-sm text-zinc-500 truncate">
                        {accent.region}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}

        {/* Choices shown in result state (dimmed, with correct/wrong indicators) */}
        {gameState === "result" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {choices.map((accent) => {
              const isSelected = selectedAnswer === accent.slug
              const isCorrectAnswer = accent.slug === currentAccent?.slug
              const isWrong = isSelected && !isCorrectAnswer

              return (
                <div key={accent.slug} className="rounded-xl">
                  <Card
                    className={`h-full transition-all duration-200 ${
                      isCorrectAnswer
                        ? "border-green-500/60 bg-green-500/10"
                        : isWrong
                          ? "border-red-500/60 bg-red-500/10"
                          : "border-zinc-800/50 bg-zinc-900/30 opacity-50"
                    }`}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <span className="text-3xl" role="img">
                        {accent.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-zinc-100 truncate">
                          {accent.name}
                        </p>
                        <p className="text-sm text-zinc-500 truncate">
                          {accent.region}
                        </p>
                      </div>
                      {isCorrectAnswer && (
                        <Check className="h-5 w-5 shrink-0 text-green-400" />
                      )}
                      {isWrong && (
                        <X className="h-5 w-5 shrink-0 text-red-400" />
                      )}
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

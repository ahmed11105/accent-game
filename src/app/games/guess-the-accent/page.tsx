"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { accents, type AccentData } from "@/data/accents"
import { speakText } from "@/lib/speech"
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
        <div className="mx-auto max-w-2xl px-6 py-28 sm:px-8 lg:px-10">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20">
              <Ear className="h-8 w-8 text-violet-400" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Guess the Accent
              </span>
            </h1>

            <p className="mt-4 text-lg text-zinc-400 leading-relaxed max-w-md">
              Listen to a phrase and guess which accent it is.
              <br />
              Can you identify all 8 accents?
            </p>

            <div className="mt-10 space-y-4 text-sm text-left max-w-xs">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs font-semibold text-violet-400">
                  1
                </span>
                <span className="text-zinc-500">Listen to a phrase spoken in a mystery accent</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs font-semibold text-violet-400">
                  2
                </span>
                <span className="text-zinc-500">Pick the correct accent from 4 choices</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs font-semibold text-violet-400">
                  3
                </span>
                <span className="text-zinc-500">Score points across 10 rounds</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="mt-12 inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl px-8 py-3.5 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-200 active:scale-100"
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
    const isPerfect = score === TOTAL_ROUNDS
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-2xl px-6 py-16 sm:px-8 lg:px-10">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20">
              <Trophy className="h-8 w-8 text-amber-400" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
              Game Over!
            </h1>

            <p className="mt-4">
              <span className={`text-5xl font-bold ${isPerfect ? "bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent" : "text-violet-400"}`}>
                {score}
              </span>
              <span className="text-2xl text-zinc-500"> / {TOTAL_ROUNDS}</span>
            </p>

            <p className="mt-3 text-lg text-zinc-400">
              {getPerformanceRating(score)}
            </p>
          </div>

          {/* Round History */}
          <div className="mt-10">
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-4">
              Round History
            </h2>
            <div className="space-y-1.5">
              {roundHistory.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 bg-white/[0.02]"
                >
                  <div
                    className={`w-0.5 h-6 rounded-full shrink-0 ${
                      entry.correct ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  <span className="text-xs font-medium text-zinc-600 w-5">
                    {i + 1}
                  </span>
                  {entry.correct ? (
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  ) : (
                    <X className="h-3.5 w-3.5 shrink-0 text-rose-400" />
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
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl px-8 py-3.5 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-200 active:scale-100"
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
      <div className="mx-auto max-w-3xl px-6 py-8 sm:px-8 lg:px-10">
        {/* Top Bar: Progress + Round + Score */}
        <div className="mb-8">
          <div className="h-1 bg-zinc-900 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentRound / TOTAL_ROUNDS) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">
              Round <span className="text-zinc-300 font-medium">{currentRound}</span> of {TOTAL_ROUNDS}
            </span>
            <span className="text-sm font-medium bg-violet-500/15 text-violet-400 rounded-full px-3 py-1">
              Score: {score}
            </span>
          </div>
        </div>

        {/* Result Screen Overlay */}
        {gameState === "result" && currentAccent && (
          <div className="mb-8">
            <div
              className={`rounded-2xl border bg-white/[0.03] backdrop-blur-sm p-6 ${
                isCorrect
                  ? "border-emerald-500/40"
                  : "border-rose-500/40"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                {isCorrect ? (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
                      <Check className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="text-xl font-bold text-emerald-400">
                      Correct!
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/20 border border-rose-500/30">
                      <X className="h-5 w-5 text-rose-400" />
                    </div>
                    <span className="text-xl font-bold text-rose-400">
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

                <p className="text-sm text-zinc-400 italic border-l-2 border-zinc-800 pl-3">
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
                className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-200 active:scale-100"
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
            </div>
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
              className="group relative mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white/[0.04] border-2 border-white/[0.08] transition-all duration-300 hover:border-violet-500/40 hover:bg-white/[0.06] disabled:opacity-70"
            >
              {/* Pulse animation when playing */}
              {isPlaying && (
                <>
                  <span className="absolute inset-0 animate-ping rounded-full bg-violet-500/20" />
                  <span className="absolute inset-0 animate-pulse rounded-full bg-violet-500/10" />
                </>
              )}
              {isPlaying ? (
                <Volume2 className="h-10 w-10 text-violet-400 animate-pulse" />
              ) : (
                <Play className="h-10 w-10 text-zinc-300 transition-colors group-hover:text-violet-400" />
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

        {/* Choices Grid — interactive during listening/guessing */}
        {(gameState === "listening" || gameState === "guessing") && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {choices.map((accent) => (
              <button
                key={accent.slug}
                onClick={() => handleGuess(accent.slug)}
                className="group text-left transition-all duration-200 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 hover:scale-[1.02] active:scale-[0.99]"
              >
                <div className="h-full flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] transition-all duration-200 group-hover:border-white/[0.12] group-hover:bg-white/[0.06]">
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
                </div>
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
                <div
                  key={accent.slug}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                    isCorrectAnswer
                      ? "border-emerald-500/50 bg-emerald-500/[0.08]"
                      : isWrong
                        ? "border-rose-500/50 bg-rose-500/[0.08]"
                        : "border-white/[0.04] bg-white/[0.02] opacity-40"
                  }`}
                >
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
                    <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                  )}
                  {isWrong && (
                    <X className="h-5 w-5 shrink-0 text-rose-400" />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

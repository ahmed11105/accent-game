"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { accents, type AccentData } from "@/data/accents"
import { speakSentence, stopAudio } from "@/lib/speech"
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

function pickPhraseForAccent(accent: AccentData): { word: string; sentence: string } {
  const phraseLessons = accent.lessons.filter((l) => l.category === "phrases")
  const pool = phraseLessons.length > 0 ? phraseLessons : accent.lessons
  const lesson = pickRandom(pool)
  const practiceWord = pickRandom(lesson.practiceWords)
  return { word: practiceWord.word, sentence: practiceWord.exampleSentence }
}

function pickWrongAnswers(
  correctAccent: AccentData,
  count: number
): AccentData[] {
  const correctLang = voiceLangMap[correctAccent.slug] ?? "en-US"

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
  const [currentWord, setCurrentWord] = useState("")
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [roundHistory, setRoundHistory] = useState<RoundHistoryEntry[]>([])
  const [choices, setChoices] = useState<AccentData[]>([])

  const hasAutoPlayed = useRef(false)

  // ---- Core logic ----

  const playPhrase = useCallback(
    async (phrase?: string, accent?: AccentData, word?: string) => {
      const text = phrase ?? currentPhrase
      const target = accent ?? currentAccent
      const sourceWord = word ?? currentWord
      if (!text || !target) return

      const lang = voiceLangMap[target.slug] ?? "en-US"
      setIsPlaying(true)
      try {
        await speakSentence(sourceWord, text, target.slug, lang, 0.9)
      } catch {
        // Silently handle TTS errors
      } finally {
        setIsPlaying(false)
      }
    },
    [currentPhrase, currentAccent, currentWord]
  )

  const pickRound = useCallback(() => {
    const accent = pickRandom(accents)
    const { word, sentence } = pickPhraseForAccent(accent)
    const wrong = pickWrongAnswers(accent, CHOICES_PER_ROUND - 1)
    const shuffledChoices = shuffle([accent, ...wrong])

    setCurrentAccent(accent)
    setCurrentPhrase(sentence)
    setCurrentWord(word)
    setChoices(shuffledChoices)
    setSelectedAnswer(null)
    setGameState("listening")
    hasAutoPlayed.current = false
  }, [])

  useEffect(() => {
    if (gameState === "listening" && currentAccent && currentPhrase && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true
      playPhrase(currentPhrase, currentAccent, currentWord)
    }
  }, [gameState, currentAccent, currentPhrase, currentWord, playPhrase])

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

      stopAudio()

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
      <div className="min-h-screen text-zinc-100">
        <div className="mx-auto max-w-2xl px-6 py-24 sm:py-32">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/10">
              <Ear className="h-7 w-7 text-amber-400" />
            </div>

            <h1 className="font-display text-4xl sm:text-5xl text-zinc-100 leading-tight">
              Guess the Accent
            </h1>

            <p className="mt-4 text-[15px] text-zinc-500 leading-relaxed max-w-md">
              Listen to a phrase and guess which accent it is.
              <br />
              Can you identify all 8 accents?
            </p>

            <div className="mt-12 space-y-4 text-[13px] text-left max-w-xs">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-400/10 text-[11px] font-semibold text-amber-400/80">
                  1
                </span>
                <span className="text-zinc-500">Listen to a phrase spoken in a mystery accent</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-400/10 text-[11px] font-semibold text-amber-400/80">
                  2
                </span>
                <span className="text-zinc-500">Pick the correct accent from 4 choices</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-400/10 text-[11px] font-semibold text-amber-400/80">
                  3
                </span>
                <span className="text-zinc-500">Score points across 10 rounds</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="mt-14 inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg px-8 py-3 text-[#0a0a0c] font-semibold shadow-lg shadow-amber-500/15 hover:brightness-110 hover:scale-[1.02] transition-all duration-200 active:scale-100 text-[14px]"
            >
              <Play className="h-4 w-4" />
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
      <div className="min-h-screen text-zinc-100">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/10">
              <Trophy className="h-7 w-7 text-amber-400" />
            </div>

            <h1 className="font-display text-3xl text-zinc-100">
              Game Over
            </h1>

            <p className="mt-6">
              <span className={`text-5xl font-bold ${isPerfect ? "text-amber-400" : "text-zinc-200"}`}>
                {score}
              </span>
              <span className="text-2xl text-zinc-600"> / {TOTAL_ROUNDS}</span>
            </p>

            <p className="mt-3 text-[15px] text-zinc-500">
              {getPerformanceRating(score)}
            </p>
          </div>

          {/* Round History */}
          <div className="mt-12">
            <h2 className="text-[11px] font-medium text-zinc-600 uppercase tracking-[0.15em] mb-4">
              Round History
            </h2>
            <div className="space-y-1">
              {roundHistory.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 bg-white/[0.02]"
                >
                  <span className="text-[11px] font-medium text-zinc-700 w-4">
                    {i + 1}
                  </span>
                  <div
                    className={`w-0.5 h-5 rounded-full shrink-0 ${
                      entry.correct ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  {entry.correct ? (
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  ) : (
                    <X className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                  )}
                  <span className="text-[13px] text-zinc-400 flex-1">
                    {entry.accent}
                  </span>
                  {!entry.correct && (
                    <span className="text-[11px] text-zinc-600">
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg px-8 py-3 text-[#0a0a0c] font-semibold shadow-lg shadow-amber-500/15 hover:brightness-110 hover:scale-[1.02] transition-all duration-200 active:scale-100 text-[14px]"
            >
              <RotateCcw className="h-4 w-4" />
              Play Again
            </button>
            <Link
              href="/"
              className="text-[13px] text-zinc-600 hover:text-zinc-400 transition-colors"
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
    <div className="min-h-screen text-zinc-100">
      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Top Bar */}
        <div className="mb-10">
          <div className="h-px bg-zinc-900 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-amber-400/60 transition-all duration-500 ease-out"
              style={{ width: `${(currentRound / TOTAL_ROUNDS) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-zinc-600">
              Round <span className="text-zinc-400 font-medium">{currentRound}</span> of {TOTAL_ROUNDS}
            </span>
            <span className="text-[12px] font-medium text-amber-400/70 bg-amber-400/8 rounded-md px-3 py-1">
              Score: {score}
            </span>
          </div>
        </div>

        {/* Result Banner */}
        {gameState === "result" && currentAccent && (
          <div className="mb-8">
            <div
              className={`rounded-xl border bg-white/[0.02] p-6 ${
                isCorrect
                  ? "border-emerald-500/30"
                  : "border-rose-500/30"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                {isCorrect ? (
                  <>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15">
                      <Check className="h-4 w-4 text-emerald-400" />
                    </div>
                    <span className="text-lg font-semibold text-emerald-400">
                      Correct!
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/15">
                      <X className="h-4 w-4 text-rose-400" />
                    </div>
                    <span className="text-lg font-semibold text-rose-400">
                      Not quite
                    </span>
                  </>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-zinc-300 text-[14px]">
                  <span className="text-zinc-600">The accent was: </span>
                  <span className="font-semibold">
                    {currentAccent.emoji} {currentAccent.name}
                  </span>
                  <span className="text-zinc-600">
                    {" "}— {currentAccent.region}
                  </span>
                </p>

                {!isCorrect && selectedAccent && (
                  <p className="text-[13px] text-zinc-600">
                    You guessed:{" "}
                    <span className="text-zinc-500">
                      {selectedAccent.emoji} {selectedAccent.name}
                    </span>
                  </p>
                )}

                <p className="text-[13px] text-zinc-500 italic border-l border-zinc-800 pl-3">
                  &ldquo;{currentPhrase}&rdquo;
                </p>

                {currentAccent.keyFeatures.length > 0 && (
                  <p className="text-[13px] text-zinc-600">
                    <span className="text-amber-400/80 font-medium">Tip: </span>
                    {currentAccent.keyFeatures[0]}
                  </p>
                )}
              </div>

              <button
                onClick={nextRound}
                className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg px-6 py-2.5 text-[13px] font-semibold text-[#0a0a0c] shadow-lg shadow-amber-500/15 hover:brightness-110 hover:scale-[1.02] transition-all duration-200 active:scale-100"
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

        {/* Speaker / Play Button */}
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
              className="group relative mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.06] transition-all duration-300 hover:border-amber-400/30 hover:bg-white/[0.05] disabled:opacity-70"
            >
              {isPlaying && (
                <>
                  <span className="absolute inset-0 animate-ping rounded-full bg-amber-400/10" />
                  <span className="absolute inset-0 animate-pulse rounded-full bg-amber-400/5" />
                </>
              )}
              {isPlaying ? (
                <Volume2 className="h-10 w-10 text-amber-400 animate-pulse" />
              ) : (
                <Play className="h-10 w-10 text-zinc-400 transition-colors group-hover:text-amber-400" />
              )}
            </button>

            <p className="text-[13px] text-zinc-600">
              {isPlaying ? (
                <span className="text-amber-400/80">Listen carefully...</span>
              ) : gameState === "listening" ? (
                "Tap to play the accent"
              ) : (
                "What accent is this?"
              )}
            </p>

            {!isPlaying && gameState === "guessing" && (
              <button
                onClick={() => playPhrase()}
                className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-zinc-600 hover:text-amber-400 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Play Again
              </button>
            )}
          </div>
        )}

        {/* Choices Grid */}
        {(gameState === "listening" || gameState === "guessing") && (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {choices.map((accent) => (
              <button
                key={accent.slug}
                onClick={() => handleGuess(accent.slug)}
                className="group text-left transition-all duration-200 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 hover:scale-[1.01] active:scale-[0.99]"
              >
                <div className="h-full flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] transition-all duration-200 group-hover:border-white/[0.1] group-hover:bg-white/[0.04]">
                  <span className="text-2xl" role="img">
                    {accent.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-zinc-200 truncate">
                      {accent.name}
                    </p>
                    <p className="text-[12px] text-zinc-600 truncate">
                      {accent.region}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Result choices */}
        {gameState === "result" && (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {choices.map((accent) => {
              const isSelected = selectedAnswer === accent.slug
              const isCorrectAnswer = accent.slug === currentAccent?.slug
              const isWrong = isSelected && !isCorrectAnswer

              return (
                <div
                  key={accent.slug}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                    isCorrectAnswer
                      ? "border-emerald-500/40 bg-emerald-500/[0.06]"
                      : isWrong
                        ? "border-rose-500/40 bg-rose-500/[0.06]"
                        : "border-white/[0.03] bg-white/[0.01] opacity-40"
                  }`}
                >
                  <span className="text-2xl" role="img">
                    {accent.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-zinc-200 truncate">
                      {accent.name}
                    </p>
                    <p className="text-[12px] text-zinc-600 truncate">
                      {accent.region}
                    </p>
                  </div>
                  {isCorrectAnswer && (
                    <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                  )}
                  {isWrong && (
                    <X className="h-4 w-4 shrink-0 text-rose-400" />
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

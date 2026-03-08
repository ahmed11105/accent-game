'use client'

import { use, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { accents, PracticeWordData } from '@/data/accents'
import { speakText, isSpeechRecognitionSupported, createSpeechRecognition } from '@/lib/speech'
import { generateFeedback, FeedbackResult } from '@/lib/feedback'
import {
  Volume2,
  Mic,
  MicOff,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Check,
  X,
  Info,
} from 'lucide-react'

// ---- Voice language mapping ----

function getVoiceLang(accentSlug: string): string {
  const map: Record<string, string> = {
    'british-rp': 'en-GB',
    cockney: 'en-GB',
    australian: 'en-AU',
    'southern-us': 'en-US',
    irish: 'en-IE',
    scottish: 'en-GB',
    'new-york': 'en-US',
    'standard-american': 'en-US',
  }
  return map[accentSlug] ?? 'en-US'
}

// ---- Score color helpers ----

function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 50) return 'text-amber-400'
  return 'text-rose-400'
}

function scoreBorderColor(score: number): string {
  if (score >= 80) return 'border-emerald-400'
  if (score >= 50) return 'border-amber-400'
  return 'border-rose-400'
}

function scoreBgColor(score: number): string {
  if (score >= 80) return 'bg-emerald-400'
  if (score >= 50) return 'bg-amber-400'
  return 'bg-rose-400'
}

// ---- Component ----

export default function PracticePage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>
}) {
  const { slug, lessonSlug } = use(params)

  // Find accent and lesson data
  const accent = accents.find((a) => a.slug === slug)
  const lesson = accent?.lessons.find((l) => l.slug === lessonSlug)
  const words: PracticeWordData[] = lesson?.practiceWords ?? []

  // ---- State ----
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showPhonetics, setShowPhonetics] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [scores, setScores] = useState<(number | null)[]>([])
  const [showDetailedNotes, setShowDetailedNotes] = useState(false)
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'listening' | 'processing'>('idle')

  const currentWord = words[currentWordIndex] ?? null

  // ---- Effects ----

  useEffect(() => {
    setSpeechSupported(isSpeechRecognitionSupported())
  }, [])

  useEffect(() => {
    setScores(new Array(words.length).fill(null))
  }, [words.length])

  // Reset feedback state when switching words
  useEffect(() => {
    setTranscript('')
    setFeedback(null)
    setShowDetail(false)
    setShowPhonetics(false)
    setShowDetailedNotes(false)
    setRecordingStatus('idle')
  }, [currentWordIndex])

  // ---- Handlers ----

  const handleSpeak = useCallback(async () => {
    if (!currentWord || isPlaying) return
    setIsPlaying(true)
    try {
      await speakText(currentWord.word, getVoiceLang(slug))
    } catch {
      // Silently handle speech errors
    } finally {
      setIsPlaying(false)
    }
  }, [currentWord, isPlaying, slug])

  const handleRecord = useCallback(async () => {
    if (!currentWord || isRecording) return

    const lang = getVoiceLang(slug)

    try {
      const recognition = createSpeechRecognition(lang)
      setIsRecording(true)
      setRecordingStatus('listening')
      setTranscript('')
      setFeedback(null)

      recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1]
        if (result) {
          const spokenText = result[0].transcript
          setTranscript(spokenText)
        }
      }

      recognition.onend = () => {
        setRecordingStatus('processing')

        // Small delay for visual feedback before showing results
        setTimeout(() => {
          setIsRecording(false)

          // Get the final transcript from the closure — use the DOM state
          const finalTranscript = document.querySelector<HTMLElement>('[data-transcript]')?.dataset.transcript ?? ''

          if (finalTranscript.trim()) {
            const result = generateFeedback(
              currentWord.word,
              finalTranscript,
              slug,
              undefined
            )
            setFeedback(result)

            // Update scores array
            setScores((prev) => {
              const next = [...prev]
              const existing = next[currentWordIndex]
              // Keep the best score
              if (existing === null || result.score > existing) {
                next[currentWordIndex] = result.score
              }
              return next
            })
          }
          setRecordingStatus('idle')
        }, 500)
      }

      recognition.onerror = () => {
        setIsRecording(false)
        setRecordingStatus('idle')
      }

      recognition.start()

      // Auto-stop after 5 seconds
      setTimeout(() => {
        try {
          recognition.stop()
        } catch {
          // Already stopped
        }
      }, 5000)
    } catch {
      setIsRecording(false)
      setRecordingStatus('idle')
    }
  }, [currentWord, isRecording, slug, currentWordIndex])

  const handleStopRecording = useCallback(() => {
    setIsRecording(false)
    setRecordingStatus('processing')
  }, [])

  const goToWord = useCallback(
    (index: number) => {
      if (index >= 0 && index < words.length) {
        setCurrentWordIndex(index)
      }
    },
    [words.length]
  )

  const handleTryAgain = useCallback(() => {
    setTranscript('')
    setFeedback(null)
    setShowDetailedNotes(false)
    setRecordingStatus('idle')
  }, [])

  const handleNextWord = useCallback(() => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex((i) => i + 1)
    }
  }, [currentWordIndex, words.length])

  // ---- 404 states ----

  if (!accent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 text-center">
          <p className="text-zinc-500 text-lg">Accent not found.</p>
          <Link href="/" className="text-amber-400 underline mt-4 inline-block">
            Go home
          </Link>
        </div>
      </div>
    )
  }

  if (!lesson || words.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 text-center">
          <p className="text-zinc-500 text-lg">Lesson not found or has no practice words.</p>
          <Link href={`/accent/${slug}`} className="text-amber-400 underline mt-4 inline-block">
            Back to {accent.name}
          </Link>
        </div>
      </div>
    )
  }

  // ---- Render ----

  return (
    <div className="min-h-screen text-white">
      {/* Hidden element to hold transcript for onend handler */}
      <span data-transcript={transcript} className="hidden" />

      {/* Browser compatibility warning */}
      {!speechSupported && (
        <div className="bg-amber-900/30 border-b border-amber-700/30 px-4 py-3 text-center">
          <p className="text-amber-200/80 text-[13px] flex items-center justify-center gap-2">
            <Info className="h-4 w-4" />
            Speech recognition requires Chrome or Edge browser
          </p>
        </div>
      )}

      {/* ===== Top Bar ===== */}
      <header className="sticky top-[57px] z-10 bg-[#0a0a0c]/90 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href={`/accent/${slug}`}
            className="flex items-center gap-1.5 text-[13px] text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{accent.name}</span>
          </Link>

          <div className="text-center flex-1 mx-4">
            <h1 className="text-[13px] font-medium text-zinc-300 truncate">{lesson.title}</h1>
          </div>

          <span className="text-amber-400/70 text-[12px] font-medium px-2.5 py-1 rounded-md bg-amber-400/8 whitespace-nowrap">
            {currentWordIndex + 1} of {words.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-px w-full bg-white/[0.04]">
          <div
            className="h-full bg-amber-400/60 transition-all duration-300"
            style={{ width: `${((currentWordIndex + 1) / words.length) * 100}%` }}
          />
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* ===== Word Display ===== */}
        {currentWord && (
          <section className="text-center space-y-5">
            {/* Word + Speaker */}
            <div className="flex items-center justify-center gap-3">
              <h2 className="font-display text-5xl sm:text-6xl text-white">
                {currentWord.word}
              </h2>
              <button
                onClick={handleSpeak}
                disabled={isPlaying}
                className="h-10 w-10 rounded-lg bg-white/[0.04] hover:bg-amber-400/10 hover:text-amber-400 transition-all flex items-center justify-center disabled:opacity-50"
                aria-label="Listen to pronunciation"
              >
                <Volume2
                  className={`h-5 w-5 ${isPlaying ? 'text-amber-400 animate-pulse' : 'text-zinc-500'}`}
                />
              </button>
            </div>

            {/* IPA Display */}
            <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-lg px-5 py-2.5">
              <span className="text-[11px] text-zinc-600 uppercase tracking-wider font-medium">
                IPA
              </span>
              <span className="text-lg font-mono text-amber-300/90">
                {currentWord.accentIPA}
              </span>
            </div>

            {/* Show phonetic detail toggle */}
            <button
              onClick={() => setShowPhonetics(!showPhonetics)}
              className="flex items-center gap-1 mx-auto text-[12px] text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {showPhonetics ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {showPhonetics ? 'Hide' : 'Show'} phonetic detail
            </button>
          </section>
        )}

        {/* ===== Expandable Detail Panel ===== */}
        {currentWord && showPhonetics && (
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 space-y-5 animate-in slide-in-from-top-2 duration-200">
            {currentWord.pronunciationNotes && (
              <p className="text-[14px] text-zinc-400 leading-relaxed">
                {currentWord.pronunciationNotes}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentWord.mouthPosition && (
                <div className="bg-white/[0.02] rounded-lg p-4 space-y-1.5">
                  <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                    Mouth Position
                  </p>
                  <p className="text-[13px] text-zinc-300">{currentWord.mouthPosition}</p>
                </div>
              )}

              {currentWord.tonguePlacement && (
                <div className="bg-white/[0.02] rounded-lg p-4 space-y-1.5">
                  <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                    Tongue Placement
                  </p>
                  <p className="text-[13px] text-zinc-300">{currentWord.tonguePlacement}</p>
                </div>
              )}
            </div>

            {currentWord.commonMistakes.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                  Common Mistakes
                </p>
                <ul className="space-y-1.5">
                  {currentWord.commonMistakes.map((mistake, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-zinc-400">
                      <X className="h-3.5 w-3.5 text-rose-400/70 mt-0.5 shrink-0" />
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {currentWord.exampleSentence && (
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                  Example
                </p>
                <p className="text-[13px] italic text-zinc-500">
                  &ldquo;{currentWord.exampleSentence}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===== Recording Section ===== */}
        <section className="flex flex-col items-center space-y-4 py-2">
          <div className="relative">
            {isRecording && (
              <>
                <span className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
                <span className="absolute -inset-2 rounded-full bg-rose-500/10 animate-pulse" />
              </>
            )}

            <button
              onClick={isRecording ? handleStopRecording : handleRecord}
              disabled={!speechSupported || recordingStatus === 'processing'}
              className={`relative z-10 h-20 w-20 rounded-full flex items-center justify-center transition-all duration-200 ${
                isRecording
                  ? 'bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/20 hover:scale-105'
                  : recordingStatus === 'processing'
                    ? 'bg-zinc-800 opacity-60 cursor-wait'
                    : 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20 hover:scale-105'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? (
                <MicOff className="h-8 w-8 text-white" />
              ) : (
                <Mic className="h-8 w-8 text-[#0a0a0c]" />
              )}
            </button>
          </div>

          <p className="text-[13px] text-zinc-600">
            {recordingStatus === 'idle' && !feedback && 'Tap to record'}
            {recordingStatus === 'listening' && (
              <span className="text-rose-400 animate-pulse">Listening...</span>
            )}
            {recordingStatus === 'processing' && (
              <span className="text-amber-400">Processing...</span>
            )}
            {recordingStatus === 'idle' && feedback && 'Recording complete'}
          </p>

          {transcript && !feedback && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2 max-w-sm text-center">
              <p className="text-[11px] text-zinc-600">You said:</p>
              <p className="text-zinc-200 font-medium">&ldquo;{transcript}&rdquo;</p>
            </div>
          )}
        </section>

        {/* ===== Feedback Panel ===== */}
        {feedback && (
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-zinc-200">Results</h3>

                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-white/[0.05]"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeWidth="3"
                      strokeDasharray={`${feedback.score}, 100`}
                      strokeLinecap="round"
                      className={scoreColor(feedback.score)}
                      stroke="currentColor"
                    />
                  </svg>
                  <span className={`text-2xl font-bold ${scoreColor(feedback.score)}`}>
                    {feedback.score}
                  </span>
                </div>
              </div>

              <p className="text-[14px] text-zinc-400 mt-2">{feedback.overallFeedback}</p>
            </div>

            <div className="px-6 pb-6 space-y-5">
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-lg px-4 py-3">
                <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider mb-1">
                  What you said
                </p>
                <p className="text-zinc-300">&ldquo;{transcript}&rdquo;</p>
              </div>

              {feedback.strengths.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                    Strengths
                  </p>
                  <ul className="space-y-1.5">
                    {feedback.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px]">
                        <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span className="text-zinc-400">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.improvements.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                    Areas to Improve
                  </p>
                  <ul className="space-y-1.5">
                    {feedback.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px]">
                        <ArrowRight className="h-3.5 w-3.5 text-orange-400 mt-0.5 shrink-0" />
                        <span className="text-zinc-400">{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.detailedNotes.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowDetailedNotes(!showDetailedNotes)}
                    className="flex items-center gap-1 text-[13px] text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    {showDetailedNotes ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    Detailed notes ({feedback.detailedNotes.length})
                  </button>

                  {showDetailedNotes && (
                    <ul className="mt-2 space-y-1.5 pl-5">
                      {feedback.detailedNotes.map((note, i) => (
                        <li key={i} className="text-[13px] text-zinc-600 list-disc">
                          {note}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleTryAgain}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/[0.06] hover:bg-white/[0.04] transition-colors text-[13px] font-medium text-zinc-400"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Try Again
                </button>

                {currentWordIndex < words.length - 1 && (
                  <button
                    onClick={handleNextWord}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-[#0a0a0c] font-semibold hover:brightness-110 transition-all text-[13px]"
                  >
                    Next Word
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}

                {currentWordIndex === words.length - 1 && (
                  <Link
                    href={`/accent/${slug}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-[#0a0a0c] font-semibold hover:brightness-110 transition-all text-[13px]"
                  >
                    Finish Lesson
                    <Check className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== Lesson Tips ===== */}
        {!feedback && lesson.tips.length > 0 && (
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden">
            <button
              onClick={() => setShowDetail(!showDetail)}
              className="flex items-center justify-between w-full px-5 py-4"
            >
              <span className="text-[13px] font-medium text-zinc-300 flex items-center gap-2">
                <Info className="h-4 w-4 text-zinc-600" />
                Lesson Tips
              </span>
              {showDetail ? (
                <ChevronUp className="h-4 w-4 text-zinc-600" />
              ) : (
                <ChevronDown className="h-4 w-4 text-zinc-600" />
              )}
            </button>
            {showDetail && (
              <div className="px-5 pb-4">
                <ul className="space-y-1.5">
                  {lesson.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-zinc-500">
                      <span className="text-amber-400/60 mt-0.5">&#x2022;</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ===== Bottom Navigation ===== */}
      <footer className="sticky bottom-0 bg-[#0a0a0c]/90 backdrop-blur-xl border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {words.map((_, i) => {
              const wordScore = scores[i]
              let dotClass = 'bg-zinc-800'
              if (i === currentWordIndex) {
                dotClass = 'bg-amber-400 ring-2 ring-amber-400/20'
              } else if (wordScore !== null && wordScore >= 80) {
                dotClass = 'bg-emerald-400'
              } else if (wordScore !== null && wordScore >= 50) {
                dotClass = 'bg-amber-400'
              } else if (wordScore !== null) {
                dotClass = 'bg-rose-400'
              }

              return (
                <button
                  key={i}
                  onClick={() => goToWord(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${dotClass} hover:scale-150`}
                  aria-label={`Go to word ${i + 1}`}
                />
              )
            })}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => goToWord(currentWordIndex - 1)}
              disabled={currentWordIndex === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-[13px] text-zinc-600 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Previous
            </button>

            <span className="text-[11px] text-zinc-700">
              {scores.filter((s) => s !== null).length} / {words.length} attempted
            </span>

            <button
              onClick={() => goToWord(currentWordIndex + 1)}
              disabled={currentWordIndex === words.length - 1}
              className="flex items-center gap-1.5 px-3 py-2 text-[13px] text-zinc-600 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

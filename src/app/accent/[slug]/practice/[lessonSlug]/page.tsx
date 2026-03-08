'use client'

import { use, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
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
  if (score >= 80) return 'text-green-400'
  if (score >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

function scoreBorderColor(score: number): string {
  if (score >= 80) return 'border-green-400'
  if (score >= 50) return 'border-yellow-400'
  return 'border-red-400'
}

function scoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-400'
  if (score >= 50) return 'bg-yellow-400'
  return 'bg-red-400'
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
    // The recognition will fire onend automatically after stop
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground text-lg">Accent not found.</p>
            <Link href="/" className="text-primary underline mt-4 inline-block">
              Go home
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!lesson || words.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground text-lg">Lesson not found or has no practice words.</p>
            <Link href={`/accent/${slug}`} className="text-primary underline mt-4 inline-block">
              Back to {accent.name}
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ---- Render ----

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hidden element to hold transcript for onend handler */}
      <span data-transcript={transcript} className="hidden" />

      {/* Browser compatibility warning */}
      {!speechSupported && (
        <div className="bg-yellow-900/50 border-b border-yellow-700 px-4 py-3 text-center">
          <p className="text-yellow-200 text-sm flex items-center justify-center gap-2">
            <Info className="h-4 w-4" />
            Speech recognition requires Chrome or Edge browser
          </p>
        </div>
      )}

      {/* ===== Top Bar ===== */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href={`/accent/${slug}`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{accent.name}</span>
          </Link>

          <div className="text-center flex-1 mx-4">
            <h1 className="text-sm font-semibold truncate">{lesson.title}</h1>
          </div>

          <Badge variant="secondary" className="text-xs whitespace-nowrap">
            {currentWordIndex + 1} of {words.length}
          </Badge>
        </div>

        {/* Progress bar */}
        <Progress
          value={((currentWordIndex + 1) / words.length) * 100}
          className="h-1 rounded-none"
        />
      </header>

      {/* ===== Main Content ===== */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* ===== Word Display ===== */}
        {currentWord && (
          <section className="text-center space-y-4">
            {/* Word + Speaker */}
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {currentWord.word}
              </h2>
              <button
                onClick={handleSpeak}
                disabled={isPlaying}
                className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-50"
                aria-label="Listen to pronunciation"
              >
                <Volume2
                  className={`h-6 w-6 ${isPlaying ? 'text-primary animate-pulse' : 'text-muted-foreground'}`}
                />
              </button>
            </div>

            {/* IPA Display */}
            <div className="inline-flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-4 py-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                IPA
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-lg font-mono text-primary">
                {currentWord.accentIPA}
              </span>
            </div>

            {/* Show phonetic detail toggle */}
            <button
              onClick={() => setShowPhonetics(!showPhonetics)}
              className="flex items-center gap-1 mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPhonetics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showPhonetics ? 'Hide' : 'Show'} phonetic detail
            </button>
          </section>
        )}

        {/* ===== Expandable Detail Panel ===== */}
        {currentWord && showPhonetics && (
          <Card className="overflow-hidden animate-in slide-in-from-top-2 duration-200">
            <CardContent className="pt-5 space-y-4">
              {/* Pronunciation notes */}
              {currentWord.pronunciationNotes && (
                <div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {currentWord.pronunciationNotes}
                  </p>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mouth position */}
                {currentWord.mouthPosition && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Mouth Position
                    </p>
                    <p className="text-sm text-foreground">{currentWord.mouthPosition}</p>
                  </div>
                )}

                {/* Tongue placement */}
                {currentWord.tonguePlacement && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Tongue Placement
                    </p>
                    <p className="text-sm text-foreground">{currentWord.tonguePlacement}</p>
                  </div>
                )}
              </div>

              {/* Common mistakes */}
              {currentWord.commonMistakes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Common Mistakes
                  </p>
                  <ul className="space-y-1.5">
                    {currentWord.commonMistakes.map((mistake, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <X className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Example sentence */}
              {currentWord.exampleSentence && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Example
                  </p>
                  <p className="text-sm italic text-muted-foreground">
                    &ldquo;{currentWord.exampleSentence}&rdquo;
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ===== Recording Section ===== */}
        <section className="flex flex-col items-center space-y-4 py-4">
          {/* Microphone button */}
          <div className="relative">
            {/* Pulse rings when recording */}
            {isRecording && (
              <>
                <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                <span className="absolute -inset-2 rounded-full bg-red-500/10 animate-pulse" />
              </>
            )}

            <button
              onClick={isRecording ? handleStopRecording : handleRecord}
              disabled={!speechSupported || recordingStatus === 'processing'}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25'
                  : recordingStatus === 'processing'
                    ? 'bg-muted cursor-wait'
                    : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? (
                <MicOff className="h-8 w-8 text-white" />
              ) : (
                <Mic className="h-8 w-8 text-white" />
              )}
            </button>
          </div>

          {/* Status text */}
          <p className="text-sm text-muted-foreground">
            {recordingStatus === 'idle' && !feedback && 'Tap to record'}
            {recordingStatus === 'listening' && (
              <span className="text-red-400 animate-pulse">Listening...</span>
            )}
            {recordingStatus === 'processing' && (
              <span className="text-yellow-400">Processing...</span>
            )}
            {recordingStatus === 'idle' && feedback && 'Recording complete'}
          </p>

          {/* Transcript display */}
          {transcript && !feedback && (
            <div className="bg-muted/50 border border-border rounded-lg px-4 py-2 max-w-sm text-center">
              <p className="text-sm text-muted-foreground">You said:</p>
              <p className="text-foreground font-medium">&ldquo;{transcript}&rdquo;</p>
            </div>
          )}
        </section>

        {/* ===== Feedback Panel ===== */}
        {feedback && (
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Results</CardTitle>

                {/* Score circle */}
                <div className={`relative w-16 h-16 flex items-center justify-center`}>
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-muted"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeWidth="2.5"
                      strokeDasharray={`${feedback.score}, 100`}
                      strokeLinecap="round"
                      className={scoreColor(feedback.score)}
                      stroke="currentColor"
                    />
                  </svg>
                  <span className={`text-xl font-bold ${scoreColor(feedback.score)}`}>
                    {feedback.score}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-1">{feedback.overallFeedback}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* What you said */}
              <div className="bg-muted/30 border border-border rounded-lg px-4 py-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  What you said
                </p>
                <p className="text-foreground">&ldquo;{transcript}&rdquo;</p>
              </div>

              {/* Strengths */}
              {feedback.strengths.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Strengths
                  </p>
                  <ul className="space-y-1.5">
                    {feedback.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                        <span className="text-foreground">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {feedback.improvements.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Areas to Improve
                  </p>
                  <ul className="space-y-1.5">
                    {feedback.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="h-4 w-4 text-orange-400 mt-0.5 shrink-0" />
                        <span className="text-foreground">{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Detailed notes (collapsible) */}
              {feedback.detailedNotes.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowDetailedNotes(!showDetailedNotes)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                        <li key={i} className="text-sm text-muted-foreground list-disc">
                          {note}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <Separator />

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTryAgain}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </button>

                {currentWordIndex < words.length - 1 && (
                  <button
                    onClick={handleNextWord}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    Next Word
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}

                {currentWordIndex === words.length - 1 && (
                  <Link
                    href={`/accent/${slug}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    Finish Lesson
                    <Check className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ===== Lesson Tips (shown when no feedback) ===== */}
        {!feedback && lesson.tips.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <button
                onClick={() => setShowDetail(!showDetail)}
                className="flex items-center justify-between w-full"
              >
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  Lesson Tips
                </CardTitle>
                {showDetail ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </CardHeader>
            {showDetail && (
              <CardContent>
                <ul className="space-y-1.5">
                  {lesson.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">&#x2022;</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
        )}
      </main>

      {/* ===== Bottom Navigation ===== */}
      <footer className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {/* Word dots */}
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {words.map((_, i) => {
              const wordScore = scores[i]
              let dotClass = 'bg-muted'
              if (i === currentWordIndex) {
                dotClass = 'bg-primary ring-2 ring-primary/30'
              } else if (wordScore !== null && wordScore >= 80) {
                dotClass = 'bg-green-400'
              } else if (wordScore !== null && wordScore >= 50) {
                dotClass = 'bg-yellow-400'
              } else if (wordScore !== null) {
                dotClass = 'bg-red-400'
              }

              return (
                <button
                  key={i}
                  onClick={() => goToWord(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${dotClass} hover:scale-125`}
                  aria-label={`Go to word ${i + 1}`}
                />
              )
            })}
          </div>

          {/* Prev / Next buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => goToWord(currentWordIndex - 1)}
              disabled={currentWordIndex === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            <span className="text-xs text-muted-foreground">
              {scores.filter((s) => s !== null).length} / {words.length} attempted
            </span>

            <button
              onClick={() => goToWord(currentWordIndex + 1)}
              disabled={currentWordIndex === words.length - 1}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

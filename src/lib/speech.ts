/**
 * Web Speech API helpers for speech recognition, synthesis, and audio recording.
 *
 * TTS uses pre-generated Microsoft Neural voice audio files when available,
 * falling back to browser SpeechSynthesis only as a last resort.
 */

// ---- Type declarations for cross-browser SpeechRecognition ----

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string
  readonly message: string
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
  onspeechend: (() => void) | null
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

// ---- Accent → lang mapping (used by fallback TTS) ----

const accentLangMap: Record<string, string> = {
  'british-rp': 'en-GB',
  cockney: 'en-GB',
  australian: 'en-AU',
  'southern-us': 'en-US',
  irish: 'en-IE',
  scottish: 'en-GB',
  'new-york': 'en-US',
  'standard-american': 'en-US',
}

// ---- Audio file helpers ----

function sanitizeFilename(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)
}

/**
 * Current audio element — tracked so we can stop previous audio before
 * playing a new one.
 */
let currentAudio: HTMLAudioElement | null = null

/**
 * Play a pre-generated audio file. Returns true if the file existed and
 * played successfully, false otherwise.
 */
function playAudioFile(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      currentAudio = null
    }

    const audio = new Audio(src)
    currentAudio = audio

    audio.onended = () => {
      currentAudio = null
      resolve(true)
    }
    audio.onerror = () => {
      currentAudio = null
      resolve(false)
    }

    audio.play().catch(() => {
      currentAudio = null
      resolve(false)
    })
  })
}

// ---- Public API ----

/**
 * Check whether the browser supports the Web Speech Recognition API.
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition)
}

/**
 * Create a configured SpeechRecognition instance.
 */
export function createSpeechRecognition(lang: string): SpeechRecognitionInstance {
  const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SpeechRecognitionCtor) {
    throw new Error(
      'SpeechRecognition is not supported in this browser. Please use Chrome or Edge.'
    )
  }

  const recognition = new SpeechRecognitionCtor()
  recognition.continuous = false
  recognition.interimResults = true
  recognition.lang = lang
  recognition.maxAlternatives = 3

  return recognition
}

/**
 * Speak the given text using pre-generated neural voice audio files.
 * Falls back to browser SpeechSynthesis if no audio file is available.
 *
 * @param text - The text to speak
 * @param lang - BCP-47 language tag OR accent slug (e.g. "british-rp")
 * @param rate - Speech rate multiplier (only used for fallback TTS)
 * @param accentSlug - Accent slug for audio file lookup (optional, inferred from lang if omitted)
 */
export async function speakText(
  text: string,
  lang: string,
  rate: number = 1.0,
  accentSlug?: string
): Promise<void> {
  if (typeof window === 'undefined') return

  // Determine accent slug for file lookup
  const slug = accentSlug || Object.entries(accentLangMap).find(([, v]) => v === lang)?.[0]

  if (slug) {
    // Try pre-generated audio file
    const filename = sanitizeFilename(text)
    const audioPath = `/audio/${slug}/${filename}.mp3`

    const played = await playAudioFile(audioPath)
    if (played) return
  }

  // Fallback to browser SpeechSynthesis
  return speakWithBrowserTTS(text, lang, rate)
}

/**
 * Speak a sentence audio file for a word in a specific accent.
 * The sentence files are named {word}-sentence.mp3.
 */
export async function speakSentence(
  word: string,
  sentence: string,
  accentSlug: string,
  lang: string,
  rate: number = 1.0
): Promise<void> {
  if (typeof window === 'undefined') return

  const filename = sanitizeFilename(word)
  const audioPath = `/audio/${accentSlug}/${filename}-sentence.mp3`

  const played = await playAudioFile(audioPath)
  if (played) return

  // Fallback: try the full sentence text as a filename
  const sentenceFilename = sanitizeFilename(sentence)
  const sentencePath = `/audio/${accentSlug}/${sentenceFilename}.mp3`
  const played2 = await playAudioFile(sentencePath)
  if (played2) return

  // Last resort: browser TTS
  return speakWithBrowserTTS(sentence, lang, rate)
}

/**
 * Stop any currently playing audio.
 */
export function stopAudio(): void {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

/**
 * Return all synthesis voices currently available in the browser.
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return []
  }
  return window.speechSynthesis.getVoices()
}

/**
 * Record audio from the user's microphone via the MediaRecorder API.
 */
export async function startRecording(): Promise<{
  stop: () => Promise<Blob>
  mediaRecorder: MediaRecorder
}> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

  const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
    ? 'audio/webm;codecs=opus'
    : MediaRecorder.isTypeSupported('audio/webm')
      ? 'audio/webm'
      : ''

  const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
  const chunks: Blob[] = []

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data)
    }
  }

  mediaRecorder.start()

  const stop = (): Promise<Blob> =>
    new Promise((resolve) => {
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        const blob = new Blob(chunks, {
          type: mediaRecorder.mimeType || 'audio/webm',
        })
        resolve(blob)
      }
      mediaRecorder.stop()
    })

  return { stop, mediaRecorder }
}

// ---- Internal helpers ----

/**
 * Fallback: use browser SpeechSynthesis (robotic but universal).
 */
function speakWithBrowserTTS(text: string, lang: string, rate: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('SpeechSynthesis is not available.'))
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.lang = lang

    const voices = window.speechSynthesis.getVoices()
    const matchingVoice = findBestVoice(voices, lang)
    if (matchingVoice) {
      utterance.voice = matchingVoice
    }

    utterance.onend = () => resolve()
    utterance.onerror = (event) => {
      if (event.error === 'canceled' || event.error === 'interrupted') {
        resolve()
      } else {
        reject(new Error(`Speech synthesis error: ${event.error}`))
      }
    }

    window.speechSynthesis.speak(utterance)
  })
}

function findBestVoice(
  voices: SpeechSynthesisVoice[],
  lang: string
): SpeechSynthesisVoice | null {
  const normalised = lang.toLowerCase()
  const exact = voices.find((v) => v.lang.toLowerCase() === normalised)
  if (exact) return exact

  const prefix = normalised.split('-')[0]
  const prefixMatch = voices.find((v) => v.lang.toLowerCase().startsWith(prefix))
  if (prefixMatch) return prefixMatch

  return null
}

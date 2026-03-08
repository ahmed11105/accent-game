/**
 * Web Speech API helpers for speech recognition, synthesis, and audio recording.
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
 *
 * @param lang - BCP-47 language tag (e.g. "en-US", "en-GB", "en-AU")
 * @returns A SpeechRecognition instance ready to call `.start()` on
 * @throws If the browser does not support SpeechRecognition
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
 * Speak the given text using the Web Speech Synthesis API.
 *
 * Attempts to find a voice whose `lang` property matches the provided
 * language code. Falls back to the browser default if none is found.
 *
 * @param text - The text to speak
 * @param lang - BCP-47 language tag for voice selection
 * @param rate - Speech rate multiplier (default 1.0)
 * @returns A promise that resolves when the utterance finishes
 */
export function speakText(text: string, lang: string, rate: number = 1.0): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      reject(new Error('SpeechSynthesis is not available in this environment.'))
      return
    }

    // Cancel any currently-speaking utterance
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.lang = lang

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices()
    const matchingVoice = findBestVoice(voices, lang)
    if (matchingVoice) {
      utterance.voice = matchingVoice
    }

    utterance.onend = () => resolve()
    utterance.onerror = (event) => {
      // 'canceled' / 'interrupted' are non-fatal
      if (event.error === 'canceled' || event.error === 'interrupted') {
        resolve()
      } else {
        reject(new Error(`Speech synthesis error: ${event.error}`))
      }
    }

    window.speechSynthesis.speak(utterance)
  })
}

/**
 * Return all synthesis voices currently available in the browser.
 *
 * Note: voices may load asynchronously. If the list is empty on first call,
 * wait for the `voiceschanged` event and call again.
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return []
  }
  return window.speechSynthesis.getVoices()
}

/**
 * Record audio from the user's microphone via the MediaRecorder API.
 *
 * @returns An object with:
 *  - `stop()` - call to stop recording and receive the audio Blob
 *  - `mediaRecorder` - the underlying MediaRecorder instance
 */
export async function startRecording(): Promise<{
  stop: () => Promise<Blob>
  mediaRecorder: MediaRecorder
}> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

  // Prefer webm/opus, fall back to whatever the browser supports
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
        // Release microphone access
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
 * Find the best matching voice for the given language code.
 * Prefers exact match, then prefix match, then any English voice.
 */
function findBestVoice(
  voices: SpeechSynthesisVoice[],
  lang: string
): SpeechSynthesisVoice | null {
  const normalised = lang.toLowerCase()

  // Exact match (e.g. "en-GB" === "en-GB")
  const exact = voices.find((v) => v.lang.toLowerCase() === normalised)
  if (exact) return exact

  // Prefix match (e.g. "en-GB" starts with "en")
  const prefix = normalised.split('-')[0]
  const prefixMatch = voices.find((v) => v.lang.toLowerCase().startsWith(prefix))
  if (prefixMatch) return prefixMatch

  return null
}

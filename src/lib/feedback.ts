/**
 * Pronunciation feedback engine.
 *
 * Compares a user's spoken transcript against expected text, applies
 * accent-specific rules, and produces structured feedback with a
 * score, strengths, and improvement suggestions.
 */

import { getIPA, getPronunciationNote, phoneticDictionary } from './phonetics'

// ---- Types ----

export interface FeedbackResult {
  /** Overall score from 0 (no match) to 100 (perfect) */
  score: number
  /** A one- or two-sentence summary */
  overallFeedback: string
  /** Things the user did well */
  strengths: string[]
  /** Specific areas to work on */
  improvements: string[]
  /** Detailed per-word or per-pattern notes */
  detailedNotes: string[]
}

// ---- Accent-specific tips bank ----

const ACCENT_TIPS: Record<string, string[]> = {
  'british-rp': [
    "Try dropping the 'r' sound at the end of words like 'water' and 'car' — RP is non-rhotic.",
    "For words like 'bath', 'dance', and 'ask', use the broad /ɑː/ vowel instead of /æ/.",
    "Keep your vowels crisp and avoid over-pronouncing. RP favours clarity over drawl.",
    "The GOAT vowel starts with a schwa: say /əʊ/ not /oʊ/ for words like 'go' and 'no'.",
    "Pronounce /t/ clearly — no flapping. 'Better' should have a distinct /t/, not a /d/.",
  ],
  cockney: [
    "Replace 'th' sounds with 'f' or 'v': 'think' → 'fink', 'brother' → 'bruvver'.",
    "Use a glottal stop for /t/ in the middle or end of words: 'bottle' → 'bo'l'.",
    "Drop your H's at the start of words: 'happy' → 'appy', 'here' → 'ere'.",
    "The MOUTH diphthong /aʊ/ becomes more like /æː/: 'house' → 'ahse'.",
    "L-vocalisation: the /l/ before a consonant becomes a vowel — 'milk' sounds like 'miok'.",
    "The FACE diphthong starts lower: /eɪ/ → /æɪ/. 'Rain' sounds like 'rine'.",
  ],
  australian: [
    "Raise your TRAP vowel: 'cat' should sound closer to 'ket'.",
    "The FACE and GOAT diphthongs start lower: /æɪ/ and /ɐʊ/ respectively.",
    "Australian English is non-rhotic — drop the /r/ at the end of syllables.",
    "Use a flapped /ɾ/ for /t/ between vowels: 'water' has a quick tap, not a hard /t/.",
    "The GOOSE vowel is fronted: /ʉː/ instead of /uː/.",
    "Keep your intonation rising at the end of statements (Australian Question Intonation).",
  ],
  'southern-us': [
    "Monophthongise the PRICE vowel before voiced consonants: 'time' → /tɑːm/.",
    "Draw out your vowels — Southern US English uses longer, more relaxed vowels.",
    "You can keep the /r/ — Southern US is rhotic, but it's softer than standard American.",
    "The TRAP vowel is often lengthened: 'can' → /kæːn/.",
    "Try a slower speech rate with a melodic quality — the 'Southern drawl'.",
    "Pin/pen merger: /ɪ/ and /ɛ/ merge before nasals, so 'pin' and 'pen' sound the same.",
  ],
  irish: [
    "Irish English is fully rhotic — always pronounce the /r/ clearly.",
    "Replace /θ/ and /ð/ with dental /t/ and /d/: 'think' → 'tink', 'the' → 'de'.",
    "There's no FOOT-STRUT split: words like 'strut' and 'love' use /ʊ/ not /ʌ/.",
    "Some words gain an extra syllable: 'film' → 'fillum' (/fɪləm/).",
    "The FACE vowel is often a monophthong /eː/ rather than a diphthong.",
    "Keep a musical, lilting quality to your intonation.",
  ],
  scottish: [
    "Scottish English is rhotic — always pronounce your /r/ sounds.",
    "Use short vowels where other accents use long ones: 'fleece' has a short /i/, not /iː/.",
    "The GOOSE vowel is fronted to /ʉ/.",
    "Monophthongise FACE and GOAT: /e/ and /o/ instead of /eɪ/ and /oʊ/.",
    "The NURSE vowel is split: /ɪɹ/ after labials, /ʌɹ/ after velars and /w/.",
    "'Film' may have an epenthetic vowel: 'fillum'.",
    "Use /a/ (open front) where other accents use /æ/: 'trap' → /tɹap/.",
  ],
  'new-york': [
    "Traditional New York English is non-rhotic: drop /r/ after vowels.",
    "Tense the TRAP vowel before nasals: 'can' → /kæən/ with a raised, diphthongised vowel.",
    "The THOUGHT vowel /ɔː/ is distinct and rounded — 'coffee', 'dog', 'talk' all use it.",
    "Avoid intrusive /r/ — this is more of a Boston/RP feature.",
    "Try a brisk, direct speech rhythm characteristic of NYC speech.",
  ],
  'standard-american': [
    "Use a clear rhotic /ɹ/ after vowels: 'car', 'water', 'letter' all end with /ɹ/.",
    "Flap the /t/ between vowels: 'butter' and 'better' have a quick /ɾ/ tap.",
    "Keep the TRAP vowel /æ/ for 'bath', 'dance', 'ask' — no broadening.",
    "The LOT vowel /ɑː/ is unrounded (unlike British /ɒ/).",
    "Maintain relatively even, flat intonation patterns.",
  ],
}

/**
 * Common phonetic substitutions that indicate the user IS correctly
 * performing the target accent. Maps accent slug to an array of
 * { expected, acceptable[] } objects. The `expected` is the standard
 * word and `acceptable` contains transcript variants that would be
 * correct for the accent.
 */
const ACCENT_CORRECT_SUBSTITUTIONS: Record<string, Array<{ expected: string; acceptable: string[] }>> = {
  cockney: [
    { expected: 'water', acceptable: ['wotah', 'woah', 'waw-ah', 'wota'] },
    { expected: 'bottle', acceptable: ['bo-ul', 'boh-ul', 'botl'] },
    { expected: 'butter', acceptable: ['bu-ah', 'buh-ah', 'butta'] },
    { expected: 'better', acceptable: ['be-ah', 'beh-ah', 'betta'] },
    { expected: 'thing', acceptable: ['fing', 'fink'] },
    { expected: 'think', acceptable: ['fink'] },
    { expected: 'three', acceptable: ['free'] },
    { expected: 'brother', acceptable: ['bruvver', 'bruvva', 'bruv-ah'] },
    { expected: 'mother', acceptable: ['muvver', 'muvva'] },
    { expected: 'happy', acceptable: ['appy'] },
    { expected: 'here', acceptable: ['ere', 'ear'] },
    { expected: 'house', acceptable: ['ause', 'ahse'] },
    { expected: 'thought', acceptable: ['fought', 'fawt'] },
    { expected: 'mouth', acceptable: ['mauf'] },
    { expected: 'little', acceptable: ['li-ul', 'liw-ul'] },
    { expected: 'milk', acceptable: ['miok', 'miwk'] },
  ],
  'british-rp': [
    { expected: 'water', acceptable: ['waw-tah', 'wawta', 'wor-tah'] },
    { expected: 'car', acceptable: ['cah', 'kah'] },
    { expected: 'park', acceptable: ['pahk'] },
    { expected: 'bath', acceptable: ['bahth'] },
    { expected: 'dance', acceptable: ['dahns', 'dahnce'] },
    { expected: 'grass', acceptable: ['grahs'] },
    { expected: 'ask', acceptable: ['ahsk'] },
    { expected: 'class', acceptable: ['clahs'] },
    { expected: 'castle', acceptable: ['cahstle', 'cahsl'] },
    { expected: 'letter', acceptable: ['lettah', 'letta'] },
    { expected: 'better', acceptable: ['bettah', 'betta'] },
    { expected: 'butter', acceptable: ['buttah', 'butta'] },
    { expected: 'north', acceptable: ['nawth'] },
  ],
  australian: [
    { expected: 'day', acceptable: ['die'] },
    { expected: 'mate', acceptable: ['mite'] },
    { expected: 'no', acceptable: ['naow', 'nao'] },
    { expected: 'water', acceptable: ['wawda', 'waw-da'] },
    { expected: 'letter', acceptable: ['ledda', 'leda'] },
    { expected: 'better', acceptable: ['bedda', 'beda'] },
    { expected: 'car', acceptable: ['cah', 'kah'] },
  ],
  'southern-us': [
    { expected: 'time', acceptable: ['tahm'] },
    { expected: 'right', acceptable: ['raht'] },
    { expected: 'fire', acceptable: ['fahr', 'far'] },
    { expected: 'my', acceptable: ['mah'] },
    { expected: 'I', acceptable: ['ah'] },
    { expected: 'nice', acceptable: ['nahs'] },
    { expected: 'price', acceptable: ['prahs'] },
  ],
  irish: [
    { expected: 'thing', acceptable: ['ting'] },
    { expected: 'think', acceptable: ['tink'] },
    { expected: 'three', acceptable: ['tree'] },
    { expected: 'thought', acceptable: ['taught', 'taut'] },
    { expected: 'the', acceptable: ['de'] },
    { expected: 'that', acceptable: ['dat'] },
    { expected: 'this', acceptable: ['dis'] },
    { expected: 'film', acceptable: ['fillum', 'filum'] },
    { expected: 'brother', acceptable: ['brudder', 'brudda'] },
    { expected: 'mother', acceptable: ['mudder', 'mudda'] },
  ],
  scottish: [
    { expected: 'film', acceptable: ['fillum', 'filum'] },
    { expected: 'house', acceptable: ['hoose'] },
    { expected: 'goose', acceptable: ['guse'] },
    { expected: 'face', acceptable: ['fess', 'fes'] },
    { expected: 'goat', acceptable: ['got'] },
  ],
  'new-york': [
    { expected: 'car', acceptable: ['cah', 'kah'] },
    { expected: 'park', acceptable: ['pahk'] },
    { expected: 'water', acceptable: ['waw-tah', 'wawta'] },
    { expected: 'coffee', acceptable: ['caw-fee', 'cawfee'] },
  ],
  'standard-american': [],
}

// ---- Core feedback function ----

/**
 * Generate pronunciation feedback by comparing a spoken transcript
 * against the expected text with accent-specific rules.
 *
 * @param expected - The text the user was asked to say
 * @param transcript - What the speech recogniser heard
 * @param accentSlug - The target accent the user is practising
 * @param confidenceScore - Optional recognition confidence (0-1)
 * @returns A structured FeedbackResult
 */
export function generateFeedback(
  expected: string,
  transcript: string,
  accentSlug: string,
  confidenceScore?: number
): FeedbackResult {
  const expectedWords = normaliseWords(expected)
  const transcriptWords = normaliseWords(transcript)

  const strengths: string[] = []
  const improvements: string[] = []
  const detailedNotes: string[] = []

  // ---- Word-level comparison ----
  let matchCount = 0
  let accentBonusCount = 0
  const unmatchedExpected: string[] = []

  for (const expWord of expectedWords) {
    const directMatch = transcriptWords.includes(expWord)
    const accentMatch = isAccentCorrectSubstitution(expWord, transcriptWords, accentSlug)

    if (directMatch) {
      matchCount++
    } else if (accentMatch) {
      matchCount++
      accentBonusCount++
    } else {
      unmatchedExpected.push(expWord)
    }
  }

  // ---- Score calculation ----
  const wordAccuracy = expectedWords.length > 0 ? matchCount / expectedWords.length : 0
  let score = Math.round(wordAccuracy * 85) // base: up to 85 points for word accuracy

  // Bonus for accent-correct substitutions (up to 10 pts)
  if (accentBonusCount > 0) {
    const accentBonus = Math.min(accentBonusCount * 3, 10)
    score += accentBonus
    strengths.push(
      `Great accent work! ${accentBonusCount} word(s) matched accent-specific pronunciation.`
    )
  }

  // Bonus from speech recognition confidence (up to 5 pts)
  if (confidenceScore !== undefined && confidenceScore > 0) {
    score += Math.round(confidenceScore * 5)
  }

  score = Math.min(100, Math.max(0, score))

  // ---- Strengths ----
  if (wordAccuracy >= 0.9) {
    strengths.push('Excellent word accuracy — nearly every word was recognised correctly.')
  } else if (wordAccuracy >= 0.7) {
    strengths.push('Good word accuracy — most words came through clearly.')
  }

  if (transcriptWords.length > 0 && expectedWords.length > 0) {
    const lengthRatio = transcriptWords.length / expectedWords.length
    if (lengthRatio >= 0.9 && lengthRatio <= 1.1) {
      strengths.push('Good pacing — your speech length matched the expected phrase well.')
    }
  }

  // ---- Improvements based on unmatched words ----
  if (unmatchedExpected.length > 0) {
    // Look up phonetic notes for missed words
    for (const missedWord of unmatchedExpected.slice(0, 5)) {
      const note = getPronunciationNote(missedWord, accentSlug)
      if (note) {
        const ipa = getIPA(missedWord, accentSlug)
        detailedNotes.push(`"${missedWord}" ${ipa ? ipa + ' — ' : ''}${note}`)
      }
    }

    if (unmatchedExpected.length <= 3) {
      improvements.push(
        `Focus on these words: ${unmatchedExpected.map((w) => `"${w}"`).join(', ')}.`
      )
    } else {
      improvements.push(
        `${unmatchedExpected.length} words were not recognised. Try speaking more slowly and clearly.`
      )
    }
  }

  // ---- Accent-specific tips ----
  const tips = ACCENT_TIPS[accentSlug] ?? []
  if (tips.length > 0) {
    // Pick relevant tips based on missed words, or random tips if all matched
    const relevantTips = pickRelevantTips(unmatchedExpected, tips, accentSlug)
    for (const tip of relevantTips) {
      if (!improvements.includes(tip)) {
        improvements.push(tip)
      }
    }
  }

  // ---- Key words with known accent variations ----
  const accentKeyWords = expectedWords.filter(
    (w) => phoneticDictionary[w] && phoneticDictionary[w].accentVariations[accentSlug]
  )
  if (accentKeyWords.length > 0) {
    const sample = accentKeyWords.slice(0, 3)
    const ipaExamples = sample
      .map((w) => {
        const ipa = getIPA(w, accentSlug)
        return ipa ? `"${w}" → ${ipa}` : null
      })
      .filter(Boolean)
    if (ipaExamples.length > 0) {
      detailedNotes.push(`Key accent words: ${ipaExamples.join(', ')}`)
    }
  }

  // ---- Overall feedback message ----
  let overallFeedback: string
  if (score >= 90) {
    overallFeedback = `Outstanding! Your pronunciation is very close to a native ${formatAccentName(accentSlug)} speaker.`
  } else if (score >= 75) {
    overallFeedback = `Great effort! You're capturing the key features of the ${formatAccentName(accentSlug)} accent well. A few refinements will make it even better.`
  } else if (score >= 55) {
    overallFeedback = `Good start with the ${formatAccentName(accentSlug)} accent. Focus on the specific tips below to improve your pronunciation.`
  } else if (score >= 30) {
    overallFeedback = `Keep practising! The ${formatAccentName(accentSlug)} accent takes time. Try slowing down and focusing on one feature at a time.`
  } else {
    overallFeedback = `It looks like the speech wasn't fully captured. Make sure you're speaking clearly into the microphone and try again.`
  }

  // Ensure we always have at least one item in each array
  if (strengths.length === 0) {
    strengths.push('You gave it a try — keep practising!')
  }
  if (improvements.length === 0 && score < 100) {
    improvements.push('Keep refining your accent — listen to native speakers and mimic their patterns.')
  }

  return {
    score,
    overallFeedback,
    strengths,
    improvements,
    detailedNotes,
  }
}

// ---- Internal helpers ----

/** Normalise a string into an array of lowercase words */
function normaliseWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 0)
}

/**
 * Check whether any word in the transcript is an accent-correct
 * substitution for the expected word.
 */
function isAccentCorrectSubstitution(
  expectedWord: string,
  transcriptWords: string[],
  accentSlug: string
): boolean {
  const subs = ACCENT_CORRECT_SUBSTITUTIONS[accentSlug]
  if (!subs) return false

  const entry = subs.find((s) => s.expected === expectedWord)
  if (!entry) return false

  return entry.acceptable.some((acceptable) => {
    const normAcceptable = acceptable.toLowerCase().replace(/[^a-z]/g, '')
    return transcriptWords.some((tw) => {
      const normTw = tw.replace(/[^a-z]/g, '')
      return normTw === normAcceptable
    })
  })
}

/**
 * Pick 1-2 accent tips that are most relevant to the user's
 * missed words. Falls back to random tips if nothing specific matches.
 */
function pickRelevantTips(
  missedWords: string[],
  tips: string[],
  accentSlug: string
): string[] {
  if (tips.length === 0) return []

  const selected: string[] = []

  // Try to match tips to missed words
  for (const word of missedWords) {
    for (const tip of tips) {
      if (
        tip.toLowerCase().includes(word) ||
        tipMatchesWordPattern(tip, word, accentSlug)
      ) {
        if (!selected.includes(tip) && selected.length < 2) {
          selected.push(tip)
        }
      }
    }
    if (selected.length >= 2) break
  }

  // If nothing matched, pick a general tip
  if (selected.length === 0) {
    const randomIndex = Math.floor(Math.random() * tips.length)
    selected.push(tips[randomIndex])
  }

  return selected
}

/**
 * Check if a tip is relevant to a particular word based on known
 * phonetic patterns.
 */
function tipMatchesWordPattern(tip: string, word: string, accentSlug: string): boolean {
  const tipLower = tip.toLowerCase()
  const entry = phoneticDictionary[word]
  if (!entry) return false

  const note = entry.notes[accentSlug]
  if (!note) return false

  // Check for shared keywords between the note and the tip
  const noteKeywords = ['rhotic', 'non-rhotic', 'th-fronting', 'glottal', 'bath', 'trap', 'strut', 'foot', 'goat', 'face', 'price', 'mouth', 'nurse', 'goose', 'monophthong', 'diphthong', 'h-dropping', 'l-vocalisation']
  for (const keyword of noteKeywords) {
    if (note.toLowerCase().includes(keyword) && tipLower.includes(keyword)) {
      return true
    }
  }

  return false
}

/** Format an accent slug into a readable name */
function formatAccentName(accentSlug: string): string {
  const names: Record<string, string> = {
    'british-rp': 'British RP',
    cockney: 'Cockney',
    australian: 'Australian',
    'southern-us': 'Southern American',
    irish: 'Irish',
    scottish: 'Scottish',
    'new-york': 'New York',
    'standard-american': 'Standard American',
  }
  return names[accentSlug] ?? accentSlug
}

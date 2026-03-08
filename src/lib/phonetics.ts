/**
 * IPA phonetics system with accent-specific variations.
 *
 * Provides a dictionary of common English words mapped to their IPA
 * transcriptions and per-accent variants, along with helpers for
 * looking up and comparing pronunciations.
 */

// ---- Types ----

export interface PhoneticEntry {
  /** The word in standard English spelling */
  word: string
  /** IPA transcription in General American (GenAm) */
  standardIPA: string
  /** Accent slug -> IPA transcription in that accent */
  accentVariations: Record<string, string>
  /** Accent slug -> human-readable pronunciation note */
  notes: Record<string, string>
}

/** Supported accent slugs */
export type AccentSlug =
  | 'british-rp'
  | 'cockney'
  | 'australian'
  | 'southern-us'
  | 'irish'
  | 'scottish'
  | 'new-york'
  | 'standard-american'

// ---- Dictionary ----

export const phoneticDictionary: Record<string, PhoneticEntry> = {
  bath: {
    word: 'bath',
    standardIPA: '/bæθ/',
    accentVariations: {
      'british-rp': '/bɑːθ/',
      cockney: '/bɑːf/',
      australian: '/bɐːθ/',
      'southern-us': '/bæːθ/',
      irish: '/bæθ/',
      scottish: '/baθ/',
      'new-york': '/bæθ/',
      'standard-american': '/bæθ/',
    },
    notes: {
      'british-rp': 'Uses the broad "ah" vowel /ɑː/ (BATH broadening).',
      cockney: 'TH-fronting turns /θ/ to /f/, and uses broad /ɑː/.',
      australian: 'Uses a near-open central vowel /ɐː/.',
      'southern-us': 'Keeps the TRAP vowel but lengthens it.',
      irish: 'Retains the short TRAP vowel like GenAm.',
      scottish: 'Uses an open front /a/ vowel.',
    },
  },
  water: {
    word: 'water',
    standardIPA: '/ˈwɔːtɚ/',
    accentVariations: {
      'british-rp': '/ˈwɔːtə/',
      cockney: '/ˈwɔːʔə/',
      australian: '/ˈwoːɾə/',
      'southern-us': '/ˈwɑːɾɚ/',
      irish: '/ˈwɑːtəɹ/',
      scottish: '/ˈwɔtɛɹ/',
      'new-york': '/ˈwɔːtə/',
      'standard-american': '/ˈwɔːtɚ/',
    },
    notes: {
      'british-rp': 'Non-rhotic: the final /r/ is dropped.',
      cockney: 'Glottal stop replaces the /t/, and final /r/ is dropped.',
      australian: 'Flapped /t/ and non-rhotic final syllable.',
      'southern-us': 'Flapped /t/ with rhotic ending.',
      irish: 'Fully rhotic with a clear final /ɹ/.',
      scottish: 'Short vowel, rhotic, and clear /t/.',
      'new-york': 'Non-rhotic; final /r/ dropped.',
    },
  },
  car: {
    word: 'car',
    standardIPA: '/kɑːɹ/',
    accentVariations: {
      'british-rp': '/kɑː/',
      cockney: '/kɑː/',
      australian: '/kɐː/',
      'southern-us': '/kɑːɹ/',
      irish: '/kɑːɹ/',
      scottish: '/kaɹ/',
      'new-york': '/kɑː/',
      'standard-american': '/kɑːɹ/',
    },
    notes: {
      'british-rp': 'Non-rhotic: /r/ is silent after the vowel.',
      cockney: 'Non-rhotic like RP.',
      australian: 'Non-rhotic with a centralised vowel.',
      'southern-us': 'Fully rhotic.',
      irish: 'Strongly rhotic.',
      scottish: 'Rhotic with a short open vowel.',
      'new-york': 'Traditionally non-rhotic, though this is shifting.',
    },
  },
  dance: {
    word: 'dance',
    standardIPA: '/dæns/',
    accentVariations: {
      'british-rp': '/dɑːns/',
      cockney: '/dɑːns/',
      australian: '/dɐːns/',
      'southern-us': '/dæːns/',
      irish: '/dæns/',
      scottish: '/dans/',
      'new-york': '/dæns/',
      'standard-american': '/dæns/',
    },
    notes: {
      'british-rp': 'BATH broadening applies: /æ/ becomes /ɑː/.',
      cockney: 'Same broad vowel as RP.',
      australian: 'Centralised long vowel.',
      'southern-us': 'TRAP vowel retained but drawn out.',
      scottish: 'Short open /a/ vowel.',
    },
  },
  bottle: {
    word: 'bottle',
    standardIPA: '/ˈbɑːtəl/',
    accentVariations: {
      'british-rp': '/ˈbɒtəl/',
      cockney: '/ˈbɒʔəl/',
      australian: '/ˈbɔɾəl/',
      'southern-us': '/ˈbɑːɾəl/',
      irish: '/ˈbɑtəl/',
      scottish: '/ˈbɔtəl/',
      'new-york': '/ˈbɑːtəl/',
      'standard-american': '/ˈbɑːtəl/',
    },
    notes: {
      'british-rp': 'Uses the rounded LOT vowel /ɒ/.',
      cockney: 'Glottal stop for medial /t/.',
      australian: 'Flapped /t/ with rounded vowel.',
      'southern-us': 'Flapped /t/.',
    },
  },
  butter: {
    word: 'butter',
    standardIPA: '/ˈbʌtɚ/',
    accentVariations: {
      'british-rp': '/ˈbʌtə/',
      cockney: '/ˈbɐʔə/',
      australian: '/ˈbaɾə/',
      'southern-us': '/ˈbʌɾɚ/',
      irish: '/ˈbʊtəɹ/',
      scottish: '/ˈbʌtɛɹ/',
      'new-york': '/ˈbʌtə/',
      'standard-american': '/ˈbʌtɚ/',
    },
    notes: {
      'british-rp': 'Non-rhotic ending.',
      cockney: 'Glottal stop and lowered STRUT vowel.',
      australian: 'Flapped /t/ and fronted vowel.',
      irish: 'Uses /ʊ/ for the STRUT vowel (no FOOT-STRUT split).',
      scottish: 'Rhotic with clear /t/.',
    },
  },
  park: {
    word: 'park',
    standardIPA: '/pɑːɹk/',
    accentVariations: {
      'british-rp': '/pɑːk/',
      cockney: '/pɑːk/',
      australian: '/pɐːk/',
      'southern-us': '/pɑːɹk/',
      irish: '/pɑːɹk/',
      scottish: '/paɹk/',
      'new-york': '/pɑːk/',
      'standard-american': '/pɑːɹk/',
    },
    notes: {
      'british-rp': 'Non-rhotic: /r/ silent before consonant.',
      cockney: 'Non-rhotic like RP.',
      australian: 'Non-rhotic with centralised vowel.',
      scottish: 'Rhotic with short vowel.',
      'new-york': 'Traditionally non-rhotic.',
    },
  },
  grass: {
    word: 'grass',
    standardIPA: '/ɡɹæs/',
    accentVariations: {
      'british-rp': '/ɡɹɑːs/',
      cockney: '/ɡɹɑːs/',
      australian: '/ɡɹɐːs/',
      'southern-us': '/ɡɹæːs/',
      irish: '/ɡɹæs/',
      scottish: '/ɡɹas/',
      'new-york': '/ɡɹæs/',
      'standard-american': '/ɡɹæs/',
    },
    notes: {
      'british-rp': 'BATH broadening: uses /ɑː/.',
      cockney: 'Same as RP.',
      australian: 'Centralised long vowel.',
    },
  },
  ask: {
    word: 'ask',
    standardIPA: '/æsk/',
    accentVariations: {
      'british-rp': '/ɑːsk/',
      cockney: '/ɑːsk/',
      australian: '/ɐːsk/',
      'southern-us': '/æːsk/',
      irish: '/æsk/',
      scottish: '/ask/',
      'new-york': '/æsk/',
      'standard-american': '/æsk/',
    },
    notes: {
      'british-rp': 'BATH broadening applies.',
      cockney: 'Same as RP for this vowel.',
      scottish: 'Uses a short open /a/.',
    },
  },
  castle: {
    word: 'castle',
    standardIPA: '/ˈkæsəl/',
    accentVariations: {
      'british-rp': '/ˈkɑːsəl/',
      cockney: '/ˈkɑːsəl/',
      australian: '/ˈkɐːsəl/',
      'southern-us': '/ˈkæːsəl/',
      irish: '/ˈkæsəl/',
      scottish: '/ˈkasəl/',
      'new-york': '/ˈkæsəl/',
      'standard-american': '/ˈkæsəl/',
    },
    notes: {
      'british-rp': 'BATH broadening on the first vowel.',
    },
  },
  thought: {
    word: 'thought',
    standardIPA: '/θɔːt/',
    accentVariations: {
      'british-rp': '/θɔːt/',
      cockney: '/fɔːʔ/',
      australian: '/θoːt/',
      'southern-us': '/θɔːt/',
      irish: '/tɔːt/',
      scottish: '/θɔt/',
      'new-york': '/θɔːt/',
      'standard-american': '/θɔːt/',
    },
    notes: {
      cockney: 'TH-fronting (/θ/→/f/) and glottal stop for final /t/.',
      irish: 'TH often realised as a dental /t/.',
      scottish: 'Shorter vowel than RP or GenAm.',
    },
  },
  lot: {
    word: 'lot',
    standardIPA: '/lɑːt/',
    accentVariations: {
      'british-rp': '/lɒt/',
      cockney: '/lɒʔ/',
      australian: '/lɔt/',
      'southern-us': '/lɑːt/',
      irish: '/lɑt/',
      scottish: '/lɔt/',
      'new-york': '/lɑːt/',
      'standard-american': '/lɑːt/',
    },
    notes: {
      'british-rp': 'Uses the rounded short /ɒ/ vowel.',
      cockney: 'Rounded /ɒ/ with glottal stop for final /t/.',
      scottish: 'Uses rounded /ɔ/.',
    },
  },
  strut: {
    word: 'strut',
    standardIPA: '/stɹʌt/',
    accentVariations: {
      'british-rp': '/stɹʌt/',
      cockney: '/stɹɐʔ/',
      australian: '/stɹɐt/',
      'southern-us': '/stɹʌt/',
      irish: '/stɹʊt/',
      scottish: '/stɹʌt/',
      'new-york': '/stɹʌt/',
      'standard-american': '/stɹʌt/',
    },
    notes: {
      cockney: 'STRUT vowel lowered to /ɐ/ and glottal stop on final /t/.',
      irish: 'No FOOT-STRUT split: uses /ʊ/ instead of /ʌ/.',
    },
  },
  trap: {
    word: 'trap',
    standardIPA: '/tɹæp/',
    accentVariations: {
      'british-rp': '/tɹæp/',
      cockney: '/tɹæp/',
      australian: '/tɹɛp/',
      'southern-us': '/tɹæːp/',
      irish: '/tɹæp/',
      scottish: '/tɹap/',
      'new-york': '/tɹeəp/',
      'standard-american': '/tɹæp/',
    },
    notes: {
      australian: 'TRAP vowel is raised toward /ɛ/.',
      'southern-us': 'TRAP vowel is lengthened.',
      'new-york': 'TRAP vowel can be raised and tensed to /eə/.',
      scottish: 'Uses open /a/ instead of /æ/.',
    },
  },
  face: {
    word: 'face',
    standardIPA: '/feɪs/',
    accentVariations: {
      'british-rp': '/feɪs/',
      cockney: '/fæɪs/',
      australian: '/fæɪs/',
      'southern-us': '/feɪs/',
      irish: '/feːs/',
      scottish: '/fes/',
      'new-york': '/feɪs/',
      'standard-american': '/feɪs/',
    },
    notes: {
      cockney: 'FACE diphthong starts lower: /æɪ/.',
      australian: 'FACE diphthong starts lower, similar to Cockney.',
      irish: 'Often monophthongised to /eː/.',
      scottish: 'Monophthongised to /e/.',
    },
  },
  goat: {
    word: 'goat',
    standardIPA: '/ɡoʊt/',
    accentVariations: {
      'british-rp': '/ɡəʊt/',
      cockney: '/ɡɐʊʔ/',
      australian: '/ɡɐʊt/',
      'southern-us': '/ɡoʊt/',
      irish: '/ɡoːt/',
      scottish: '/ɡot/',
      'new-york': '/ɡoʊt/',
      'standard-american': '/ɡoʊt/',
    },
    notes: {
      'british-rp': 'GOAT diphthong starts with schwa: /əʊ/.',
      cockney: 'Starts even lower /ɐʊ/ and glottal stop on /t/.',
      australian: 'Similar fronted start /ɐʊ/.',
      scottish: 'Monophthongised to /o/.',
      irish: 'Monophthongised to /oː/.',
    },
  },
  price: {
    word: 'price',
    standardIPA: '/pɹaɪs/',
    accentVariations: {
      'british-rp': '/pɹaɪs/',
      cockney: '/pɹɑɪs/',
      australian: '/pɹɑɪs/',
      'southern-us': '/pɹɑːs/',
      irish: '/pɹaɪs/',
      scottish: '/pɹəɪs/',
      'new-york': '/pɹaɪs/',
      'standard-american': '/pɹaɪs/',
    },
    notes: {
      cockney: 'PRICE diphthong has a retracted onset.',
      'southern-us': 'Monophthongised to /ɑː/ before voiced consonants or word-finally.',
      scottish: 'Raised onset to /əɪ/ (Scottish vowel length rule).',
    },
  },
  mouth: {
    word: 'mouth',
    standardIPA: '/maʊθ/',
    accentVariations: {
      'british-rp': '/maʊθ/',
      cockney: '/mæːf/',
      australian: '/mæʊθ/',
      'southern-us': '/maʊθ/',
      irish: '/maʊθ/',
      scottish: '/mʌʊθ/',
      'new-york': '/maʊθ/',
      'standard-american': '/maʊθ/',
    },
    notes: {
      cockney: 'MOUTH diphthong monophthongised and TH-fronted.',
      australian: 'Fronted onset /æʊ/.',
      scottish: 'Raised onset /ʌʊ/.',
    },
  },
  near: {
    word: 'near',
    standardIPA: '/nɪɹ/',
    accentVariations: {
      'british-rp': '/nɪə/',
      cockney: '/nɪə/',
      australian: '/nɪə/',
      'southern-us': '/nɪɹ/',
      irish: '/nɪɹ/',
      scottish: '/niɹ/',
      'new-york': '/nɪə/',
      'standard-american': '/nɪɹ/',
    },
    notes: {
      'british-rp': 'Non-rhotic: /r/ becomes a centering diphthong /ɪə/.',
      cockney: 'Same as RP.',
      australian: 'Non-rhotic like RP.',
      scottish: 'Rhotic with a tenser /i/ vowel.',
      'new-york': 'Non-rhotic.',
    },
  },
  square: {
    word: 'square',
    standardIPA: '/skwɛɹ/',
    accentVariations: {
      'british-rp': '/skwɛə/',
      cockney: '/skwɛə/',
      australian: '/skwɛə/',
      'southern-us': '/skwɛɹ/',
      irish: '/skwɛɹ/',
      scottish: '/skwɛɹ/',
      'new-york': '/skwɛə/',
      'standard-american': '/skwɛɹ/',
    },
    notes: {
      'british-rp': 'Non-rhotic centering diphthong.',
    },
  },
  start: {
    word: 'start',
    standardIPA: '/stɑːɹt/',
    accentVariations: {
      'british-rp': '/stɑːt/',
      cockney: '/stɑːʔ/',
      australian: '/stɐːt/',
      'southern-us': '/stɑːɹt/',
      irish: '/stɑːɹt/',
      scottish: '/staɹt/',
      'new-york': '/stɑːt/',
      'standard-american': '/stɑːɹt/',
    },
    notes: {
      'british-rp': 'Non-rhotic.',
      cockney: 'Non-rhotic and glottal stop on final /t/.',
      scottish: 'Rhotic with short vowel.',
      'new-york': 'Traditionally non-rhotic.',
    },
  },
  north: {
    word: 'north',
    standardIPA: '/nɔːɹθ/',
    accentVariations: {
      'british-rp': '/nɔːθ/',
      cockney: '/nɔːf/',
      australian: '/noːθ/',
      'southern-us': '/nɔːɹθ/',
      irish: '/nɔːɹθ/',
      scottish: '/nɔɹθ/',
      'new-york': '/nɔːθ/',
      'standard-american': '/nɔːɹθ/',
    },
    notes: {
      'british-rp': 'Non-rhotic.',
      cockney: 'TH-fronting and non-rhotic.',
      scottish: 'Rhotic with shorter vowel.',
    },
  },
  force: {
    word: 'force',
    standardIPA: '/fɔːɹs/',
    accentVariations: {
      'british-rp': '/fɔːs/',
      cockney: '/fɔːs/',
      australian: '/foːs/',
      'southern-us': '/fɔːɹs/',
      irish: '/fɔːɹs/',
      scottish: '/foɹs/',
      'new-york': '/fɔːs/',
      'standard-american': '/fɔːɹs/',
    },
    notes: {
      'british-rp': 'Non-rhotic.',
      scottish: 'Rhotic with a closer vowel.',
    },
  },
  cure: {
    word: 'cure',
    standardIPA: '/kjʊɹ/',
    accentVariations: {
      'british-rp': '/kjʊə/',
      cockney: '/kjɔː/',
      australian: '/kjʊə/',
      'southern-us': '/kjʊɹ/',
      irish: '/kjʊɹ/',
      scottish: '/kjuɹ/',
      'new-york': '/kjʊə/',
      'standard-american': '/kjʊɹ/',
    },
    notes: {
      'british-rp': 'Non-rhotic centering diphthong /ʊə/.',
      cockney: 'CURE vowel often merged with THOUGHT to /ɔː/.',
      scottish: 'Rhotic with a tenser /u/ vowel.',
    },
  },
  letter: {
    word: 'letter',
    standardIPA: '/ˈlɛtɚ/',
    accentVariations: {
      'british-rp': '/ˈlɛtə/',
      cockney: '/ˈlɛʔə/',
      australian: '/ˈlɛɾə/',
      'southern-us': '/ˈlɛɾɚ/',
      irish: '/ˈlɛtəɹ/',
      scottish: '/ˈlɛtɛɹ/',
      'new-york': '/ˈlɛtə/',
      'standard-american': '/ˈlɛtɚ/',
    },
    notes: {
      'british-rp': 'Non-rhotic final syllable.',
      cockney: 'Glottal stop for /t/ and non-rhotic.',
      australian: 'Flapped /t/ and non-rhotic.',
      scottish: 'Full /ɛ/ in final syllable, not schwa, and rhotic.',
    },
  },
  happy: {
    word: 'happy',
    standardIPA: '/ˈhæpi/',
    accentVariations: {
      'british-rp': '/ˈhæpi/',
      cockney: '/ˈæpi/',
      australian: '/ˈhɛpi/',
      'southern-us': '/ˈhæːpi/',
      irish: '/ˈhæpi/',
      scottish: '/ˈhapi/',
      'new-york': '/ˈhæpi/',
      'standard-american': '/ˈhæpi/',
    },
    notes: {
      cockney: 'H-dropping: initial /h/ is silent.',
      australian: 'Raised TRAP vowel.',
      scottish: 'Open /a/ vowel.',
    },
  },
  comma: {
    word: 'comma',
    standardIPA: '/ˈkɑːmə/',
    accentVariations: {
      'british-rp': '/ˈkɒmə/',
      cockney: '/ˈkɒmə/',
      australian: '/ˈkɔmə/',
      'southern-us': '/ˈkɑːmə/',
      irish: '/ˈkɑmə/',
      scottish: '/ˈkɔmə/',
      'new-york': '/ˈkɑːmə/',
      'standard-american': '/ˈkɑːmə/',
    },
    notes: {
      'british-rp': 'Rounded LOT vowel /ɒ/.',
    },
  },
  nurse: {
    word: 'nurse',
    standardIPA: '/nɝːs/',
    accentVariations: {
      'british-rp': '/nɜːs/',
      cockney: '/nɜːs/',
      australian: '/nɜːs/',
      'southern-us': '/nɝːs/',
      irish: '/nɝːs/',
      scottish: '/nʌɹs/',
      'new-york': '/nɜːs/',
      'standard-american': '/nɝːs/',
    },
    notes: {
      'british-rp': 'Non-rhotic NURSE vowel /ɜː/.',
      scottish: 'Uses /ʌɹ/ instead of a merged NURSE vowel.',
      'new-york': 'Non-rhotic; historically merged with /ɔɪ/.',
    },
  },
  fleece: {
    word: 'fleece',
    standardIPA: '/fliːs/',
    accentVariations: {
      'british-rp': '/fliːs/',
      cockney: '/fliːs/',
      australian: '/fliːs/',
      'southern-us': '/fliːs/',
      irish: '/fliːs/',
      scottish: '/flis/',
      'new-york': '/fliːs/',
      'standard-american': '/fliːs/',
    },
    notes: {
      scottish: 'Shorter vowel due to Scottish vowel length rule.',
    },
  },
  kit: {
    word: 'kit',
    standardIPA: '/kɪt/',
    accentVariations: {
      'british-rp': '/kɪt/',
      cockney: '/kɪʔ/',
      australian: '/kɪt/',
      'southern-us': '/kɪt/',
      irish: '/kɪt/',
      scottish: '/kɪt/',
      'new-york': '/kɪt/',
      'standard-american': '/kɪt/',
    },
    notes: {
      cockney: 'Glottal stop for word-final /t/.',
    },
  },
  dress: {
    word: 'dress',
    standardIPA: '/dɹɛs/',
    accentVariations: {
      'british-rp': '/dɹɛs/',
      cockney: '/dɹɛs/',
      australian: '/dɹes/',
      'southern-us': '/dɹɛs/',
      irish: '/dɹɛs/',
      scottish: '/dɹɛs/',
      'new-york': '/dɹɛs/',
      'standard-american': '/dɹɛs/',
    },
    notes: {
      australian: 'DRESS vowel is raised closer to /e/.',
    },
  },
  foot: {
    word: 'foot',
    standardIPA: '/fʊt/',
    accentVariations: {
      'british-rp': '/fʊt/',
      cockney: '/fʊʔ/',
      australian: '/fʊt/',
      'southern-us': '/fʊt/',
      irish: '/fʊt/',
      scottish: '/fʉt/',
      'new-york': '/fʊt/',
      'standard-american': '/fʊt/',
    },
    notes: {
      cockney: 'Glottal stop on final /t/.',
      scottish: 'Centralised /ʉ/ vowel.',
    },
  },
  goose: {
    word: 'goose',
    standardIPA: '/ɡuːs/',
    accentVariations: {
      'british-rp': '/ɡuːs/',
      cockney: '/ɡʉːs/',
      australian: '/ɡʉːs/',
      'southern-us': '/ɡuːs/',
      irish: '/ɡuːs/',
      scottish: '/ɡʉs/',
      'new-york': '/ɡuːs/',
      'standard-american': '/ɡuːs/',
    },
    notes: {
      cockney: 'GOOSE vowel fronted to /ʉː/.',
      australian: 'GOOSE vowel fronted similarly.',
      scottish: 'Fronted and short.',
    },
  },
  choice: {
    word: 'choice',
    standardIPA: '/tʃɔɪs/',
    accentVariations: {
      'british-rp': '/tʃɔɪs/',
      cockney: '/tʃɔɪs/',
      australian: '/tʃɔɪs/',
      'southern-us': '/tʃɔɪs/',
      irish: '/tʃɔɪs/',
      scottish: '/tʃɔɪs/',
      'new-york': '/tʃɔɪs/',
      'standard-american': '/tʃɔɪs/',
    },
    notes: {},
  },
  thing: {
    word: 'thing',
    standardIPA: '/θɪŋ/',
    accentVariations: {
      'british-rp': '/θɪŋ/',
      cockney: '/fɪŋ/',
      australian: '/θɪŋ/',
      'southern-us': '/θɪŋ/',
      irish: '/tɪŋ/',
      scottish: '/θɪŋ/',
      'new-york': '/θɪŋ/',
      'standard-american': '/θɪŋ/',
    },
    notes: {
      cockney: 'TH-fronting: /θ/ becomes /f/.',
      irish: 'TH often realised as dental /t/.',
    },
  },
  brother: {
    word: 'brother',
    standardIPA: '/ˈbɹʌðɚ/',
    accentVariations: {
      'british-rp': '/ˈbɹʌðə/',
      cockney: '/ˈbɹɐvə/',
      australian: '/ˈbɹɐðə/',
      'southern-us': '/ˈbɹʌðɚ/',
      irish: '/ˈbɹʊdəɹ/',
      scottish: '/ˈbɹʌðɛɹ/',
      'new-york': '/ˈbɹʌðə/',
      'standard-american': '/ˈbɹʌðɚ/',
    },
    notes: {
      cockney: 'TH-fronting on voiced /ð/ → /v/, lowered STRUT vowel.',
      irish: 'No FOOT-STRUT split; /ð/ → dental /d/.',
      scottish: 'Full vowel in final syllable and rhotic.',
    },
  },
  three: {
    word: 'three',
    standardIPA: '/θɹiː/',
    accentVariations: {
      'british-rp': '/θɹiː/',
      cockney: '/fɹiː/',
      australian: '/θɹiː/',
      'southern-us': '/θɹiː/',
      irish: '/tɹiː/',
      scottish: '/θɹi/',
      'new-york': '/θɹiː/',
      'standard-american': '/θɹiː/',
    },
    notes: {
      cockney: 'TH-fronting: /θ/ → /f/.',
      irish: 'TH → dental /t/.',
      scottish: 'Short vowel.',
    },
  },
  mother: {
    word: 'mother',
    standardIPA: '/ˈmʌðɚ/',
    accentVariations: {
      'british-rp': '/ˈmʌðə/',
      cockney: '/ˈmɐvə/',
      australian: '/ˈmɐðə/',
      'southern-us': '/ˈmʌðɚ/',
      irish: '/ˈmʊdəɹ/',
      scottish: '/ˈmʌðɛɹ/',
      'new-york': '/ˈmʌðə/',
      'standard-american': '/ˈmʌðɚ/',
    },
    notes: {
      cockney: 'Voiced TH-fronting /ð/ → /v/.',
      irish: 'No FOOT-STRUT split; dental stop for /ð/.',
    },
  },
  here: {
    word: 'here',
    standardIPA: '/hɪɹ/',
    accentVariations: {
      'british-rp': '/hɪə/',
      cockney: '/ɪə/',
      australian: '/hɪə/',
      'southern-us': '/hɪɹ/',
      irish: '/hɪɹ/',
      scottish: '/hiɹ/',
      'new-york': '/hɪə/',
      'standard-american': '/hɪɹ/',
    },
    notes: {
      'british-rp': 'Non-rhotic centering diphthong.',
      cockney: 'H-dropping and non-rhotic.',
      scottish: 'Rhotic with tense /i/.',
    },
  },
  house: {
    word: 'house',
    standardIPA: '/haʊs/',
    accentVariations: {
      'british-rp': '/haʊs/',
      cockney: '/æːs/',
      australian: '/hæʊs/',
      'southern-us': '/haʊs/',
      irish: '/haʊs/',
      scottish: '/hʌʊs/',
      'new-york': '/haʊs/',
      'standard-american': '/haʊs/',
    },
    notes: {
      cockney: 'H-dropping and MOUTH monophthongisation.',
      australian: 'Fronted onset of MOUTH diphthong.',
      scottish: 'Raised onset /ʌʊ/.',
    },
  },
  about: {
    word: 'about',
    standardIPA: '/əˈbaʊt/',
    accentVariations: {
      'british-rp': '/əˈbaʊt/',
      cockney: '/əˈbæːʔ/',
      australian: '/əˈbæʊt/',
      'southern-us': '/əˈbaʊt/',
      irish: '/əˈbaʊt/',
      scottish: '/əˈbʌʊt/',
      'new-york': '/əˈbaʊt/',
      'standard-american': '/əˈbaʊt/',
    },
    notes: {
      cockney: 'MOUTH monophthongised and glottal stop on final /t/.',
      australian: 'Fronted onset.',
    },
  },
  right: {
    word: 'right',
    standardIPA: '/ɹaɪt/',
    accentVariations: {
      'british-rp': '/ɹaɪt/',
      cockney: '/ɹɑɪʔ/',
      australian: '/ɹɑɪt/',
      'southern-us': '/ɹɑːt/',
      irish: '/ɹaɪt/',
      scottish: '/ɹəɪt/',
      'new-york': '/ɹaɪt/',
      'standard-american': '/ɹaɪt/',
    },
    notes: {
      cockney: 'Retracted PRICE onset, glottal stop on /t/.',
      'southern-us': 'PRICE often monophthongised to /ɑː/.',
      scottish: 'Raised onset due to Scottish vowel length rule.',
    },
  },
  time: {
    word: 'time',
    standardIPA: '/taɪm/',
    accentVariations: {
      'british-rp': '/taɪm/',
      cockney: '/tɑɪm/',
      australian: '/tɑɪm/',
      'southern-us': '/tɑːm/',
      irish: '/taɪm/',
      scottish: '/taɪm/',
      'new-york': '/taɪm/',
      'standard-american': '/taɪm/',
    },
    notes: {
      'southern-us': 'Monophthongisation of PRICE before voiced sounds.',
    },
  },
  fire: {
    word: 'fire',
    standardIPA: '/faɪɹ/',
    accentVariations: {
      'british-rp': '/faɪə/',
      cockney: '/fɑːə/',
      australian: '/fɑɪə/',
      'southern-us': '/fɑːɹ/',
      irish: '/faɪɹ/',
      scottish: '/faɪɹ/',
      'new-york': '/faɪə/',
      'standard-american': '/faɪɹ/',
    },
    notes: {
      'british-rp': 'Non-rhotic with centering glide.',
      'southern-us': 'Monophthongised and rhotic.',
      cockney: 'PRICE smoothed and non-rhotic.',
    },
  },
  tour: {
    word: 'tour',
    standardIPA: '/tʊɹ/',
    accentVariations: {
      'british-rp': '/tʊə/',
      cockney: '/tɔː/',
      australian: '/tʊə/',
      'southern-us': '/tʊɹ/',
      irish: '/tʊɹ/',
      scottish: '/tuɹ/',
      'new-york': '/tʊə/',
      'standard-american': '/tʊɹ/',
    },
    notes: {
      'british-rp': 'Non-rhotic CURE vowel.',
      cockney: 'Merged with THOUGHT vowel.',
      scottish: 'Rhotic with tense /u/.',
    },
  },
  poor: {
    word: 'poor',
    standardIPA: '/pʊɹ/',
    accentVariations: {
      'british-rp': '/pɔː/',
      cockney: '/pɔː/',
      australian: '/pʊə/',
      'southern-us': '/pʊɹ/',
      irish: '/pʊɹ/',
      scottish: '/puɹ/',
      'new-york': '/pɔː/',
      'standard-american': '/pʊɹ/',
    },
    notes: {
      'british-rp': 'CURE-FORCE merger: merged with /ɔː/.',
      cockney: 'Same merger as RP.',
      scottish: 'Distinct CURE vowel, rhotic.',
    },
  },
  girl: {
    word: 'girl',
    standardIPA: '/ɡɝːl/',
    accentVariations: {
      'british-rp': '/ɡɜːl/',
      cockney: '/ɡɜːl/',
      australian: '/ɡɜːl/',
      'southern-us': '/ɡɝːl/',
      irish: '/ɡɝːl/',
      scottish: '/ɡʌɹl/',
      'new-york': '/ɡɜːl/',
      'standard-american': '/ɡɝːl/',
    },
    notes: {
      'british-rp': 'Non-rhotic NURSE vowel.',
      scottish: 'Split NURSE vowel: /ʌɹ/ after velars.',
      'new-york': 'Non-rhotic.',
    },
  },
  bird: {
    word: 'bird',
    standardIPA: '/bɝːd/',
    accentVariations: {
      'british-rp': '/bɜːd/',
      cockney: '/bɜːd/',
      australian: '/bɜːd/',
      'southern-us': '/bɝːd/',
      irish: '/bɝːd/',
      scottish: '/bɪɹd/',
      'new-york': '/bɜːd/',
      'standard-american': '/bɝːd/',
    },
    notes: {
      scottish: 'Split NURSE vowel: /ɪɹ/ after labials.',
      'new-york': 'Non-rhotic; historically could merge with /ɔɪ/.',
    },
  },
  world: {
    word: 'world',
    standardIPA: '/wɝːld/',
    accentVariations: {
      'british-rp': '/wɜːld/',
      cockney: '/wɜːld/',
      australian: '/wɜːld/',
      'southern-us': '/wɝːld/',
      irish: '/wɝːld/',
      scottish: '/wʌɹld/',
      'new-york': '/wɜːld/',
      'standard-american': '/wɝːld/',
    },
    notes: {
      'british-rp': 'Non-rhotic NURSE vowel.',
      scottish: 'NURSE split: /ʌɹ/ after /w/.',
    },
  },
  better: {
    word: 'better',
    standardIPA: '/ˈbɛtɚ/',
    accentVariations: {
      'british-rp': '/ˈbɛtə/',
      cockney: '/ˈbɛʔə/',
      australian: '/ˈbɛɾə/',
      'southern-us': '/ˈbɛɾɚ/',
      irish: '/ˈbɛtəɹ/',
      scottish: '/ˈbɛtɛɹ/',
      'new-york': '/ˈbɛtə/',
      'standard-american': '/ˈbɛtɚ/',
    },
    notes: {
      cockney: 'Glottal stop for intervocalic /t/.',
      australian: 'Flapped /t/.',
      scottish: 'Full vowel in final syllable, rhotic.',
    },
  },
  little: {
    word: 'little',
    standardIPA: '/ˈlɪtəl/',
    accentVariations: {
      'british-rp': '/ˈlɪtəl/',
      cockney: '/ˈlɪʔəl/',
      australian: '/ˈlɪɾəl/',
      'southern-us': '/ˈlɪɾəl/',
      irish: '/ˈlɪtəl/',
      scottish: '/ˈlɪtəl/',
      'new-york': '/ˈlɪtəl/',
      'standard-american': '/ˈlɪtəl/',
    },
    notes: {
      cockney: 'Glottal stop for /t/.',
      australian: 'Flapped /t/.',
      'southern-us': 'Flapped /t/.',
    },
  },
  film: {
    word: 'film',
    standardIPA: '/fɪlm/',
    accentVariations: {
      'british-rp': '/fɪlm/',
      cockney: '/fɪlm/',
      australian: '/fɪlm/',
      'southern-us': '/fɪlm/',
      irish: '/fɪləm/',
      scottish: '/fɪləm/',
      'new-york': '/fɪlm/',
      'standard-american': '/fɪlm/',
    },
    notes: {
      irish: 'Epenthetic schwa inserted: "fillum".',
      scottish: 'Same epenthesis as Irish.',
    },
  },
  milk: {
    word: 'milk',
    standardIPA: '/mɪlk/',
    accentVariations: {
      'british-rp': '/mɪlk/',
      cockney: '/mɪok/',
      australian: '/mɪlk/',
      'southern-us': '/mɪlk/',
      irish: '/mɪlk/',
      scottish: '/mɪlk/',
      'new-york': '/mɪlk/',
      'standard-american': '/mɪlk/',
    },
    notes: {
      cockney: 'L-vocalisation: /l/ becomes a vowel /o/ before consonant.',
    },
  },
  cold: {
    word: 'cold',
    standardIPA: '/koʊld/',
    accentVariations: {
      'british-rp': '/kəʊld/',
      cockney: '/kɐʊd/',
      australian: '/kɐʊld/',
      'southern-us': '/koʊld/',
      irish: '/koːld/',
      scottish: '/kold/',
      'new-york': '/koʊld/',
      'standard-american': '/koʊld/',
    },
    notes: {
      'british-rp': 'GOAT diphthong /əʊ/.',
      cockney: 'L-vocalisation (dark L dropped) and fronted GOAT.',
    },
  },
  talk: {
    word: 'talk',
    standardIPA: '/tɔːk/',
    accentVariations: {
      'british-rp': '/tɔːk/',
      cockney: '/tɔːk/',
      australian: '/toːk/',
      'southern-us': '/tɔːk/',
      irish: '/tɔːk/',
      scottish: '/tɔk/',
      'new-york': '/tɔːk/',
      'standard-american': '/tɔːk/',
    },
    notes: {
      scottish: 'Shorter THOUGHT vowel.',
    },
  },
  rain: {
    word: 'rain',
    standardIPA: '/ɹeɪn/',
    accentVariations: {
      'british-rp': '/ɹeɪn/',
      cockney: '/ɹæɪn/',
      australian: '/ɹæɪn/',
      'southern-us': '/ɹeɪn/',
      irish: '/ɹeːn/',
      scottish: '/ɹen/',
      'new-york': '/ɹeɪn/',
      'standard-american': '/ɹeɪn/',
    },
    notes: {
      cockney: 'FACE diphthong has lowered onset /æɪ/.',
      australian: 'Same lowered onset as Cockney.',
      irish: 'Monophthongised to /eː/.',
      scottish: 'Monophthongised to /e/.',
    },
  },
  love: {
    word: 'love',
    standardIPA: '/lʌv/',
    accentVariations: {
      'british-rp': '/lʌv/',
      cockney: '/lɐv/',
      australian: '/lɐv/',
      'southern-us': '/lʌv/',
      irish: '/lʊv/',
      scottish: '/lʌv/',
      'new-york': '/lʌv/',
      'standard-american': '/lʌv/',
    },
    notes: {
      cockney: 'STRUT vowel lowered to /ɐ/.',
      australian: 'STRUT vowel fronted/lowered.',
      irish: 'No FOOT-STRUT split: /ʊ/ used.',
    },
  },
  class: {
    word: 'class',
    standardIPA: '/klæs/',
    accentVariations: {
      'british-rp': '/klɑːs/',
      cockney: '/klɑːs/',
      australian: '/klɐːs/',
      'southern-us': '/klæːs/',
      irish: '/klæs/',
      scottish: '/klas/',
      'new-york': '/klæs/',
      'standard-american': '/klæs/',
    },
    notes: {
      'british-rp': 'BATH broadening.',
      australian: 'Centralised broad vowel.',
    },
  },
  can: {
    word: 'can',
    standardIPA: '/kæn/',
    accentVariations: {
      'british-rp': '/kæn/',
      cockney: '/kæn/',
      australian: '/kɛn/',
      'southern-us': '/kæːn/',
      irish: '/kæn/',
      scottish: '/kan/',
      'new-york': '/kæən/',
      'standard-american': '/kæn/',
    },
    notes: {
      australian: 'TRAP raising to /ɛ/.',
      'southern-us': 'Lengthened TRAP vowel.',
      'new-york': 'TRAP tensing before nasals.',
      scottish: 'Open /a/ vowel.',
    },
  },
  dog: {
    word: 'dog',
    standardIPA: '/dɔːɡ/',
    accentVariations: {
      'british-rp': '/dɒɡ/',
      cockney: '/dɒɡ/',
      australian: '/dɔɡ/',
      'southern-us': '/dɔːɡ/',
      irish: '/dɑɡ/',
      scottish: '/dɔɡ/',
      'new-york': '/dɔːɡ/',
      'standard-american': '/dɔːɡ/',
    },
    notes: {
      'british-rp': 'Rounded short LOT vowel /ɒ/.',
      'new-york': 'Distinct /ɔː/ (does not merge with /ɑː/).',
    },
  },
}

// ---- Helper functions ----

/**
 * Look up the IPA transcription for a word.
 *
 * @param word - The word to look up (case-insensitive)
 * @param accentSlug - Optional accent slug. If omitted, returns the standard (GenAm) IPA.
 * @returns The IPA string, or null if the word is not in the dictionary.
 */
export function getIPA(word: string, accentSlug?: string): string | null {
  const entry = phoneticDictionary[word.toLowerCase()]
  if (!entry) return null

  if (!accentSlug || accentSlug === 'standard-american') {
    return entry.standardIPA
  }

  return entry.accentVariations[accentSlug] ?? entry.standardIPA
}

/**
 * Get the pronunciation note for a word in a specific accent.
 *
 * @param word - The word to look up (case-insensitive)
 * @param accentSlug - The accent slug
 * @returns The note string, or null if not available.
 */
export function getPronunciationNote(word: string, accentSlug: string): string | null {
  const entry = phoneticDictionary[word.toLowerCase()]
  if (!entry) return null

  return entry.notes[accentSlug] ?? null
}

/**
 * Compare standard (GenAm) IPA with an accent-specific IPA and list
 * the differences.
 *
 * @param word - The word to look up (case-insensitive)
 * @param accentSlug - The accent slug to compare against
 * @returns An object with standard IPA, accent IPA, and a list of
 *          human-readable difference descriptions, or null if the word
 *          is not in the dictionary.
 */
export function getAccentDifferences(
  word: string,
  accentSlug: string
): { standard: string; accent: string; differences: string[] } | null {
  const entry = phoneticDictionary[word.toLowerCase()]
  if (!entry) return null

  const standard = entry.standardIPA
  const accent = entry.accentVariations[accentSlug] ?? entry.standardIPA
  const differences: string[] = []

  // If they are identical, note that
  if (standard === accent) {
    return { standard, accent, differences: ['No significant difference from General American.'] }
  }

  // Add the pronunciation note if one exists
  const note = entry.notes[accentSlug]
  if (note) {
    differences.push(note)
  }

  // Detect common phonetic patterns
  if (accent.includes('ʔ') && !standard.includes('ʔ')) {
    differences.push('Uses a glottal stop (replace /t/ with a brief catch in the throat).')
  }
  if (standard.includes('ɹ') && !accent.includes('ɹ') && !accent.includes('ɹ')) {
    differences.push('Non-rhotic: the /r/ sound is dropped or weakened.')
  }
  if (accent.includes('f') && standard.includes('θ')) {
    differences.push('TH-fronting: /θ/ is pronounced as /f/.')
  }
  if (accent.includes('v') && standard.includes('ð')) {
    differences.push('Voiced TH-fronting: /ð/ is pronounced as /v/.')
  }
  if (standard.includes('æ') && accent.includes('ɑː')) {
    differences.push('BATH broadening: the short /æ/ becomes a long /ɑː/.')
  }
  if (standard.includes('ʌ') && accent.includes('ʊ')) {
    differences.push('No FOOT-STRUT split: /ʌ/ is pronounced as /ʊ/.')
  }

  // If we only have the IPA difference but no specific notes, add a generic one
  if (differences.length === 0) {
    differences.push(`Pronounced ${accent} instead of ${standard}.`)
  }

  return { standard, accent, differences }
}

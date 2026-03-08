export interface AccentData {
  name: string
  slug: string
  region: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  keyFeatures: string[]
  emoji: string
  color: string
  lessons: LessonData[]
}

export interface LessonData {
  title: string
  slug: string
  description: string
  lessonOrder: number
  category: 'vowels' | 'consonants' | 'rhythm' | 'intonation' | 'phrases'
  tips: string[]
  practiceWords: PracticeWordData[]
}

export interface PracticeWordData {
  word: string
  ipaTranscription: string
  accentIPA: string
  wordOrder: number
  exampleSentence: string
  pronunciationNotes: string
  mouthPosition?: string
  tonguePlacement?: string
  commonMistakes: string[]
}

export const accents: AccentData[] = [
  {
    name: "British RP",
    slug: "british-rp",
    region: "England",
    description: "Received Pronunciation — the 'standard' British accent heard on the BBC. The prestige accent of Southern England.",
    difficulty: "beginner",
    keyFeatures: [
      "Non-rhotic (drop R after vowels)",
      "Broad A in BATH words (/ɑː/ not /æ/)",
      "Distinct TRAP-BATH split",
      "T is fully pronounced (no flapping)",
      "Long vowels in FLEECE, GOOSE words"
    ],
    emoji: "🇬🇧",
    color: "bg-blue-500",
    lessons: [
      {
        title: "Non-Rhotic R",
        slug: "non-rhotic-r",
        description: "Learn to drop the R sound after vowels — the hallmark of British RP.",
        lessonOrder: 1,
        category: "consonants",
        tips: [
          "In RP, R is only pronounced before a vowel sound",
          "Words like 'car', 'park', 'water' lose their final R",
          "The vowel before the dropped R gets lengthened instead",
          "Listen for linking R: 'car engine' gets an R, but 'car park' does not"
        ],
        practiceWords: [
          {
            word: "car",
            ipaTranscription: "/kɑːɹ/",
            accentIPA: "/kɑː/",
            wordOrder: 1,
            exampleSentence: "The car is parked outside.",
            pronunciationNotes: "Drop the R completely. Say 'kah' with a long 'ah' sound. The vowel should be open and back in your mouth.",
            mouthPosition: "Mouth open wide, jaw dropped. Lips relaxed and unrounded.",
            tonguePlacement: "Tongue low and back in the mouth. Do NOT curl the tongue tip up for R.",
            commonMistakes: ["Keeping the American R sound", "Making the vowel too short", "Adding an 'uh' sound at the end"]
          },
          {
            word: "park",
            ipaTranscription: "/pɑːɹk/",
            accentIPA: "/pɑːk/",
            wordOrder: 2,
            exampleSentence: "Let's take a walk in the park.",
            pronunciationNotes: "Say 'pahk' — long open 'ah' vowel, then straight to the K. No R sound.",
            mouthPosition: "Open mouth for the 'ah', then close for the K.",
            tonguePlacement: "Tongue low for vowel, then back of tongue rises for K.",
            commonMistakes: ["Pronouncing the R before K", "Shortening the vowel", "Using American flat A"]
          },
          {
            word: "water",
            ipaTranscription: "/ˈwɑːtɚ/",
            accentIPA: "/ˈwɔːtə/",
            wordOrder: 3,
            exampleSentence: "Could I have a glass of water?",
            pronunciationNotes: "Say 'WAW-tuh'. The first vowel is rounded like 'aw'. The final syllable is a soft 'uh' (schwa) — no R.",
            mouthPosition: "Lips slightly rounded for first syllable, then relax for the schwa.",
            tonguePlacement: "Tongue mid-back for 'aw' sound. Tongue taps alveolar ridge for T.",
            commonMistakes: ["Saying 'wah-ter' with American R", "Flapping the T like Americans do", "Not rounding the first vowel enough"]
          },
          {
            word: "letter",
            ipaTranscription: "/ˈlɛtɚ/",
            accentIPA: "/ˈlɛtə/",
            wordOrder: 4,
            exampleSentence: "I received a letter this morning.",
            pronunciationNotes: "Say 'LET-uh'. Clear T in the middle (not flapped). End on a schwa — no R.",
            mouthPosition: "Mouth slightly open for 'eh', closes briefly for T, relaxes for schwa.",
            tonguePlacement: "Tongue tip touches alveolar ridge firmly for T (no flap).",
            commonMistakes: ["Flapping the T (American habit)", "Adding R at the end", "Making the final vowel too strong"]
          },
          {
            word: "mother",
            ipaTranscription: "/ˈmʌðɚ/",
            accentIPA: "/ˈmʌðə/",
            wordOrder: 5,
            exampleSentence: "My mother lives in London.",
            pronunciationNotes: "Say 'MUH-thuh'. The TH is voiced (tongue between teeth). End on a schwa, no R.",
            mouthPosition: "Relaxed mouth. Tongue peeks between teeth for TH.",
            tonguePlacement: "Tongue between upper and lower teeth for voiced TH, then relaxes for schwa.",
            commonMistakes: ["Adding final R", "Using 'D' instead of voiced TH", "Stressing the second syllable"]
          }
        ]
      },
      {
        title: "The Broad A (BATH vowel)",
        slug: "broad-a",
        description: "Master the long 'ah' sound in words where Americans use a short 'a'.",
        lessonOrder: 2,
        category: "vowels",
        tips: [
          "In RP, words like BATH, DANCE, GRASS use /ɑː/ (like 'father')",
          "Americans use /æ/ (like 'cat') in these same words",
          "Think of saying 'ah' at the doctor's office",
          "This is one of the most recognizable features of British English"
        ],
        practiceWords: [
          {
            word: "bath",
            ipaTranscription: "/bæθ/",
            accentIPA: "/bɑːθ/",
            wordOrder: 1,
            exampleSentence: "I'm going to have a bath.",
            pronunciationNotes: "Say 'bahth' not 'bath'. Open your mouth wide for a long 'ah' sound, like saying 'father'.",
            mouthPosition: "Mouth wide open, jaw dropped low. Much more open than American 'bath'.",
            tonguePlacement: "Tongue low and back. Not the front-of-mouth 'a' Americans use.",
            commonMistakes: ["Using American short A (/æ/)", "Not holding the vowel long enough", "Forgetting the unvoiced TH at the end"]
          },
          {
            word: "dance",
            ipaTranscription: "/dæns/",
            accentIPA: "/dɑːns/",
            wordOrder: 2,
            exampleSentence: "Shall we dance?",
            pronunciationNotes: "Say 'dahns' with the same long open 'ah'. The vowel should feel like it comes from the back of your throat.",
            mouthPosition: "Mouth open wide for the long A, then closes for N-S.",
            tonguePlacement: "Tongue back and low for 'ah', then tip rises for N.",
            commonMistakes: ["Saying 'dance' with short A", "Not lengthening the vowel", "Nasalizing the vowel before N"]
          },
          {
            word: "grass",
            ipaTranscription: "/ɡɹæs/",
            accentIPA: "/ɡɹɑːs/",
            wordOrder: 3,
            exampleSentence: "The grass is always greener.",
            pronunciationNotes: "Say 'grahss'. Long 'ah' vowel. Note: the R before the vowel IS pronounced in RP.",
            mouthPosition: "Mouth opens wide after the initial GR cluster.",
            tonguePlacement: "Tongue back and low for the broad A.",
            commonMistakes: ["Using American short A", "Dropping the R before the vowel (R is only dropped after vowels)", "Making it too short"]
          },
          {
            word: "ask",
            ipaTranscription: "/æsk/",
            accentIPA: "/ɑːsk/",
            wordOrder: 4,
            exampleSentence: "May I ask you a question?",
            pronunciationNotes: "Say 'ahsk'. The long 'ah' followed directly by SK. This is one of the most distinctive RP sounds.",
            mouthPosition: "Mouth drops open for 'ah', then tongue rises for S-K.",
            tonguePlacement: "Tongue low and back for vowel.",
            commonMistakes: ["Saying 'ask' with American short A", "Over-elongating the vowel", "Adding a glottal stop"]
          },
          {
            word: "castle",
            ipaTranscription: "/ˈkæsəl/",
            accentIPA: "/ˈkɑːsəl/",
            wordOrder: 5,
            exampleSentence: "We visited a beautiful castle.",
            pronunciationNotes: "Say 'KAH-suhl'. Long 'ah' in the first syllable, then a soft schwa in the second.",
            mouthPosition: "Wide open for first syllable, relaxes for the unstressed second syllable.",
            tonguePlacement: "Tongue back for 'ah', then relaxes to center for schwa.",
            commonMistakes: ["American short A", "Stressing both syllables equally", "Pronouncing the T (it's silent: KAH-suhl)"]
          }
        ]
      },
      {
        title: "Classic RP Phrases",
        slug: "rp-phrases",
        description: "Put it all together with classic British phrases and sentences.",
        lessonOrder: 3,
        category: "phrases",
        tips: [
          "RP intonation tends to fall at the end of statements",
          "Stress patterns are very important — unstressed syllables are very weak",
          "Maintain the non-rhotic R and broad A throughout connected speech",
          "British understatement is conveyed through tone, not just words"
        ],
        practiceWords: [
          {
            word: "Would you like a cup of tea?",
            ipaTranscription: "/wʊd juː laɪk ə kʌp əv tiː/",
            accentIPA: "/wʊd jə laɪk ə kʌp əv tiː/",
            wordOrder: 1,
            exampleSentence: "Would you like a cup of tea? — The most British question possible.",
            pronunciationNotes: "Reduce 'you' to 'yuh'. Stress 'like', 'cup', and 'tea'. The sentence should flow smoothly with weak unstressed syllables.",
            commonMistakes: ["Stressing every word equally", "Not reducing 'you' and 'of'", "American R in any word"]
          },
          {
            word: "Rather good, isn't it?",
            ipaTranscription: "/ˈɹæðɚ ɡʊd ˈɪzənt ɪt/",
            accentIPA: "/ˈɹɑːðə ɡʊd ˈɪzənt ɪt/",
            wordOrder: 2,
            exampleSentence: "This cake is rather good, isn't it?",
            pronunciationNotes: "Broad A in 'rather' (RAH-thuh). Tag question 'isn't it' should rise slightly in pitch. This is classic British understatement.",
            commonMistakes: ["American A in 'rather'", "Not using rising intonation on the tag", "Pronouncing the R in 'rather'"]
          },
          {
            word: "I can't be bothered.",
            ipaTranscription: "/aɪ kænt biː ˈbɑːðɚd/",
            accentIPA: "/aɪ kɑːnt biː ˈbɒðəd/",
            wordOrder: 3,
            exampleSentence: "I can't be bothered to go out tonight.",
            pronunciationNotes: "Say 'kahnt' with broad A (careful with this one!). 'Bothered' is 'BOTH-uhd' — no R, rounded O.",
            commonMistakes: ["American short A in 'can't'", "Pronouncing R in 'bothered'", "Not rounding the O in 'bothered'"]
          },
          {
            word: "Lovely weather today.",
            ipaTranscription: "/ˈlʌvli ˈwɛðɚ təˈdeɪ/",
            accentIPA: "/ˈlʌvli ˈwɛðə təˈdeɪ/",
            wordOrder: 4,
            exampleSentence: "Lovely weather today, wouldn't you say?",
            pronunciationNotes: "No R in 'weather' (WETH-uh). Often said ironically when it's raining. Keep the tone pleasant and understated.",
            commonMistakes: ["Adding R to 'weather'", "Stressing 'today' too heavily", "Missing the ironic British tone"]
          }
        ]
      }
    ]
  },
  {
    name: "Cockney",
    slug: "cockney",
    region: "East London",
    description: "The working-class London accent famous for glottal stops, TH-fronting, and rhyming slang.",
    difficulty: "intermediate",
    keyFeatures: [
      "Glottal stop replaces T between vowels",
      "TH-fronting (th → f/v)",
      "H-dropping at start of words",
      "Diphthong shifts (face → /aɪ/, price → /ɒɪ/)",
      "Non-rhotic like RP"
    ],
    emoji: "🏙️",
    color: "bg-red-500",
    lessons: [
      {
        title: "The Glottal Stop",
        slug: "glottal-stop",
        description: "Replace T with a glottal stop — the signature Cockney sound.",
        lessonOrder: 1,
        category: "consonants",
        tips: [
          "A glottal stop is made by briefly closing the vocal cords",
          "It's the sound in the middle of 'uh-oh'",
          "In Cockney, T between vowels or at word-end becomes a glottal stop",
          "Practice saying 'uh-oh' and feel that catch in your throat"
        ],
        practiceWords: [
          {
            word: "bottle",
            ipaTranscription: "/ˈbɑːtəl/",
            accentIPA: "/ˈbɒʔəl/",
            wordOrder: 1,
            exampleSentence: "Pass me that bottle, will ya?",
            pronunciationNotes: "Say 'BO-uhl' with a glottal stop replacing the T. Your throat briefly closes where the T would be. Think of the catch in 'uh-oh'.",
            mouthPosition: "Mouth opens for 'bo', then the airflow stops in the throat (not at the tongue).",
            tonguePlacement: "Tongue does NOT touch the alveolar ridge. The stop happens in the glottis (throat).",
            commonMistakes: ["Still pronouncing the T", "Making it sound like a D", "Not cutting the airflow sharply enough"]
          },
          {
            word: "butter",
            ipaTranscription: "/ˈbʌtɚ/",
            accentIPA: "/ˈbʌʔə/",
            wordOrder: 2,
            exampleSentence: "Put some butter on it.",
            pronunciationNotes: "Say 'BUH-uh' — glottal stop where the T was, ending on schwa (no R).",
            mouthPosition: "Relaxed mouth throughout. The stop is purely in the throat.",
            tonguePlacement: "Tongue stays low. The closure is at the vocal cords.",
            commonMistakes: ["Pronouncing the T", "Adding an R at the end", "Not making the glottal stop sharp enough"]
          },
          {
            word: "water",
            ipaTranscription: "/ˈwɑːtɚ/",
            accentIPA: "/ˈwɔːʔə/",
            wordOrder: 3,
            exampleSentence: "Get us a glass of water.",
            pronunciationNotes: "Say 'WAW-uh' — rounded vowel, glottal stop, schwa. This is the iconic Cockney pronunciation.",
            mouthPosition: "Lips round for 'waw', relax for schwa.",
            tonguePlacement: "Tongue mid-back for rounded vowel.",
            commonMistakes: ["Saying the T", "Not rounding the first vowel", "Adding final R"]
          },
          {
            word: "better",
            ipaTranscription: "/ˈbɛtɚ/",
            accentIPA: "/ˈbɛʔə/",
            wordOrder: 4,
            exampleSentence: "That's much better, innit?",
            pronunciationNotes: "Say 'BEH-uh'. Glottal stop replaces T. Ends on schwa.",
            mouthPosition: "Mouth open for 'eh', briefly closes at throat, opens for schwa.",
            tonguePlacement: "Tongue front-mid for 'eh', relaxes for schwa.",
            commonMistakes: ["Pronouncing the T or flapping it", "Using American R at end", "Not enough glottal closure"]
          },
          {
            word: "little",
            ipaTranscription: "/ˈlɪtəl/",
            accentIPA: "/ˈlɪʔəl/",
            wordOrder: 5,
            exampleSentence: "Just a little bit more.",
            pronunciationNotes: "Say 'LI-uhl'. Glottal stop replaces the T. The final L is a dark L.",
            mouthPosition: "Quick 'li', throat catch, then dark L with tongue back.",
            tonguePlacement: "Tongue tip up for L, then drops. For dark L, back of tongue is raised.",
            commonMistakes: ["Keeping the T", "Making the L too light/clear", "Not enough glottal force"]
          }
        ]
      },
      {
        title: "TH-Fronting",
        slug: "th-fronting",
        description: "Learn to replace TH sounds with F and V — a core Cockney feature.",
        lessonOrder: 2,
        category: "consonants",
        tips: [
          "Voiceless TH (/θ/) becomes F: 'think' → 'fink'",
          "Voiced TH (/ð/) becomes V: 'brother' → 'bruvver'",
          "At the start of function words, TH can become D: 'the' → 'da'",
          "This is natural in Cockney — don't overthink it, just swap the sounds"
        ],
        practiceWords: [
          {
            word: "think",
            ipaTranscription: "/θɪŋk/",
            accentIPA: "/fɪŋk/",
            wordOrder: 1,
            exampleSentence: "I fink that's right.",
            pronunciationNotes: "Say 'FINK' instead of 'think'. Simply replace the TH with an F sound. Lips together, not tongue between teeth.",
            mouthPosition: "Lower lip touches upper teeth for F (not tongue between teeth for TH).",
            tonguePlacement: "Tongue stays behind teeth. Lower lip does the work.",
            commonMistakes: ["Accidentally saying the real TH", "Making it sound forced or exaggerated", "Forgetting to front the TH"]
          },
          {
            word: "brother",
            ipaTranscription: "/ˈbɹʌðɚ/",
            accentIPA: "/ˈbɹʌvə/",
            wordOrder: 2,
            exampleSentence: "He's me bruvver.",
            pronunciationNotes: "Say 'BRUV-uh'. Voiced TH becomes V. No R at the end.",
            mouthPosition: "Lower lip to upper teeth for V sound.",
            tonguePlacement: "Tongue stays back. V is made with lip-teeth contact.",
            commonMistakes: ["Using real TH sound", "Keeping the R at the end", "Saying 'brudder' instead of 'bruvvuh'"]
          },
          {
            word: "the",
            ipaTranscription: "/ðə/",
            accentIPA: "/də/",
            wordOrder: 3,
            exampleSentence: "Down da pub.",
            pronunciationNotes: "In quick speech, 'the' becomes 'da' or 'duh'. The voiced TH becomes a D.",
            mouthPosition: "Tongue taps behind upper teeth for D, not between teeth.",
            tonguePlacement: "Tongue tip touches alveolar ridge (behind teeth) for D.",
            commonMistakes: ["Overthinking it — this should feel natural", "Using full TH", "Stressing the word too much"]
          },
          {
            word: "three",
            ipaTranscription: "/θɹiː/",
            accentIPA: "/fɹiː/",
            wordOrder: 4,
            exampleSentence: "Give me free of 'em. (three)",
            pronunciationNotes: "Say 'FREE' — TH becomes F. This is why 'three' and 'free' sound identical in Cockney!",
            mouthPosition: "Lower lip to upper teeth for F, then wide for 'ee'.",
            tonguePlacement: "Tongue forward and high for the 'ee' vowel.",
            commonMistakes: ["Accidentally using TH", "Not committing fully to the F sound"]
          },
          {
            word: "with",
            ipaTranscription: "/wɪθ/",
            accentIPA: "/wɪf/",
            wordOrder: 5,
            exampleSentence: "Come wif me.",
            pronunciationNotes: "Say 'WIF'. Final voiceless TH becomes F. Quick and natural.",
            mouthPosition: "Lips come together at end for F sound.",
            tonguePlacement: "No tongue between teeth needed — just lip-teeth F.",
            commonMistakes: ["Using TH at the end", "Making the F too heavy", "Changing the vowel"]
          }
        ]
      },
      {
        title: "Cockney Phrases",
        slug: "cockney-phrases",
        description: "Practice putting the glottal stops and TH-fronting together in real phrases.",
        lessonOrder: 3,
        category: "phrases",
        tips: [
          "Cockney speech is fast and rhythmic",
          "Drop your H's at the start of words ('have' → 'av')",
          "Use glottal stops and TH-fronting together naturally",
          "The melody goes up and down energetically"
        ],
        practiceWords: [
          {
            word: "Nice day, innit?",
            ipaTranscription: "/naɪs deɪ ˈɪzənt ɪt/",
            accentIPA: "/nɑɪs dæɪ ˈɪnɪʔ/",
            wordOrder: 1,
            exampleSentence: "Lovely weather. Nice day, innit?",
            pronunciationNotes: "'Innit' is the Cockney 'isn't it' — said as one quick word with a glottal stop. Rising intonation at the end.",
            commonMistakes: ["Saying full 'isn't it'", "Missing the glottal stop in 'innit'", "Flat intonation"]
          },
          {
            word: "Go home, mate.",
            ipaTranscription: "/ɡoʊ hoʊm meɪt/",
            accentIPA: "/ɡəʊ əʊm mæɪʔ/",
            wordOrder: 2,
            exampleSentence: "You've had enough. Go 'ome, mate.",
            pronunciationNotes: "Drop the H in 'home' → 'ome'. 'Mate' has the Cockney diphthong shift and a glottal stop at the end.",
            commonMistakes: ["Keeping the H in 'home'", "American pronunciation of 'mate'", "Missing the glottal stop on 'mate'"]
          },
          {
            word: "Take a look at that.",
            ipaTranscription: "/teɪk ə lʊk æt ðæt/",
            accentIPA: "/tæɪk ə lʊk æʔ dæʔ/",
            wordOrder: 3,
            exampleSentence: "Oi, take a look at that!",
            pronunciationNotes: "Glottal stops on 'at' and 'that'. TH in 'that' becomes D. Quick, punchy delivery.",
            commonMistakes: ["Pronouncing all the T's and TH's", "Too slow — Cockney is fast", "Missing the energy"]
          },
          {
            word: "What are you doing?",
            ipaTranscription: "/wʌt ɑːɹ juː ˈduːɪŋ/",
            accentIPA: "/wɒʔ ə jə ˈduːɪn/",
            wordOrder: 4,
            exampleSentence: "Wot ah ya doin'?",
            pronunciationNotes: "Say 'WO-uh ya DOO-in'. Glottal stop in 'what', reduce 'are you' to 'ah ya', drop the G in 'doing'.",
            commonMistakes: ["Pronouncing every word clearly", "Keeping the G in 'doing'", "Not reducing 'are you'"]
          }
        ]
      }
    ]
  },
  {
    name: "Australian",
    slug: "australian",
    region: "Australia",
    description: "The broad Australian accent with distinctive vowel shifts and rising intonation.",
    difficulty: "beginner",
    keyFeatures: [
      "Rising intonation (upspeak) on statements",
      "FACE diphthong shifts toward /aɪ/",
      "Non-rhotic (like British)",
      "Shortened words and casual delivery",
      "PRICE vowel broadened"
    ],
    emoji: "🇦🇺",
    color: "bg-yellow-500",
    lessons: [
      {
        title: "Vowel Raising",
        slug: "vowel-raising",
        description: "Learn the signature Aussie vowel shifts that make 'day' sound like 'die'.",
        lessonOrder: 1,
        category: "vowels",
        tips: [
          "The FACE vowel /eɪ/ shifts toward /aɪ/ — 'mate' sounds closer to 'mite'",
          "Don't overdo it — it's a shift, not a complete replacement",
          "The PRICE vowel /aɪ/ broadens to /ɒɪ/ — 'price' has a rounder start",
          "Keep it relaxed and casual — Aussie accent is laid-back"
        ],
        practiceWords: [
          {
            word: "day",
            ipaTranscription: "/deɪ/",
            accentIPA: "/dæɪ/",
            wordOrder: 1,
            exampleSentence: "G'day, mate!",
            pronunciationNotes: "The 'ay' sound starts lower and more open. Say 'dye' but not quite — it's between 'day' and 'die'.",
            mouthPosition: "Mouth starts more open than standard English 'day'.",
            tonguePlacement: "Tongue starts low and front, rises to high front position.",
            commonMistakes: ["Making it exactly like 'die'", "Not shifting the vowel enough", "Being too tense — relax!"]
          },
          {
            word: "mate",
            ipaTranscription: "/meɪt/",
            accentIPA: "/mæɪt/",
            wordOrder: 2,
            exampleSentence: "How ya goin', mate?",
            pronunciationNotes: "Say something between 'mate' and 'mite'. Start the diphthong lower. This is THE Australian word.",
            mouthPosition: "Mouth opens wider at start than standard 'mate'.",
            tonguePlacement: "Tongue low-front, glides up.",
            commonMistakes: ["Not opening the mouth enough at the start", "Going full 'mite'", "Forgetting to be casual"]
          },
          {
            word: "face",
            ipaTranscription: "/feɪs/",
            accentIPA: "/fæɪs/",
            wordOrder: 3,
            exampleSentence: "Look at the look on his face.",
            pronunciationNotes: "The vowel starts more open. Between 'face' and 'fice'. Keep it subtle.",
            mouthPosition: "Jaw drops slightly more than standard English.",
            tonguePlacement: "Tongue starts lower than American English.",
            commonMistakes: ["Over-exaggerating the shift", "Not shifting at all", "Tensing up the jaw"]
          },
          {
            word: "say",
            ipaTranscription: "/seɪ/",
            accentIPA: "/sæɪ/",
            wordOrder: 4,
            exampleSentence: "What did you say?",
            pronunciationNotes: "Starts lower — between 'say' and 'sigh'. The diphthong glides up.",
            mouthPosition: "Mouth starts more open.",
            tonguePlacement: "Tongue low, glides to high front.",
            commonMistakes: ["No vowel shift", "Complete replacement with /aɪ/", "Rushing the diphthong"]
          },
          {
            word: "name",
            ipaTranscription: "/neɪm/",
            accentIPA: "/næɪm/",
            wordOrder: 5,
            exampleSentence: "What's your name?",
            pronunciationNotes: "Open the first part of the vowel more. Relaxed, casual delivery.",
            mouthPosition: "Mouth drops open for the starting vowel.",
            tonguePlacement: "Tongue low-front at start.",
            commonMistakes: ["Keeping standard American vowel", "Going too far toward 'nime'"]
          }
        ]
      },
      {
        title: "Rising Intonation",
        slug: "rising-intonation",
        description: "Master the Aussie upspeak — making statements sound like questions.",
        lessonOrder: 2,
        category: "intonation",
        tips: [
          "Australian English often rises in pitch at the end of statements",
          "This doesn't mean you're asking a question — it's just how Aussies talk",
          "The rise starts on the last stressed syllable",
          "Keep it natural — don't make every single sentence rise"
        ],
        practiceWords: [
          {
            word: "Going to the beach.",
            ipaTranscription: "/ˈɡoʊɪŋ tə ðə biːtʃ/",
            accentIPA: "/ˈɡəʉɪn tə ðə biːtʃ↗/",
            wordOrder: 1,
            exampleSentence: "Yeah, we're going to the beach.",
            pronunciationNotes: "Let your pitch rise on 'beach'. It's a statement, but the melody goes up. Drop the G in 'going'.",
            commonMistakes: ["Flat intonation", "Rising too early", "Making it sound like a question"]
          },
          {
            word: "It's really hot today.",
            ipaTranscription: "/ɪts ˈɹɪːli hɑːt təˈdeɪ/",
            accentIPA: "/ɪts ˈɹɪːli hɒt tədæɪ↗/",
            wordOrder: 2,
            exampleSentence: "Strewth, it's really hot today.",
            pronunciationNotes: "Rise on 'today' (with Aussie 'dæɪ'). Keep it casual and breezy.",
            commonMistakes: ["American flat statement intonation", "Over-rising making it sound unsure"]
          },
          {
            word: "No worries, mate.",
            ipaTranscription: "/noʊ ˈwɝːiz meɪt/",
            accentIPA: "/nəʉ ˈwʌɹiz mæɪt/",
            wordOrder: 3,
            exampleSentence: "No worries, mate. She'll be right.",
            pronunciationNotes: "The classic Aussie phrase. 'No' has a centered diphthong. 'Worries' is casual. 'Mate' with the Aussie diphthong.",
            commonMistakes: ["American pronunciation of 'no'", "Standard 'mate'", "Being too formal in delivery"]
          },
          {
            word: "Good on ya!",
            ipaTranscription: "/ɡʊd ɑːn jə/",
            accentIPA: "/ɡʊd ɒn jə/",
            wordOrder: 4,
            exampleSentence: "You passed the test? Good on ya!",
            pronunciationNotes: "Quick, enthusiastic. 'Ya' not 'you'. Natural rising tone. This means 'well done!'.",
            commonMistakes: ["Saying 'good on you'", "Flat delivery", "Not being enthusiastic enough"]
          }
        ]
      },
      {
        title: "Aussie Vowels",
        slug: "aussie-vowels",
        description: "Practice the broader Australian vowel sounds in BATH/DANCE words.",
        lessonOrder: 3,
        category: "vowels",
        tips: [
          "Australian English uses /aː/ in BATH words (similar to RP)",
          "The GOAT vowel is more centralized: /əʉ/ instead of /oʊ/",
          "FLEECE can sound like /əi/ in broad Australian",
          "Keep everything relaxed and slightly nasal"
        ],
        practiceWords: [
          {
            word: "dance",
            ipaTranscription: "/dæns/",
            accentIPA: "/dɑːns/",
            wordOrder: 1,
            exampleSentence: "Let's have a dance.",
            pronunciationNotes: "Like British RP, use the broad A — 'dahns'. Australian inherited this from British English.",
            commonMistakes: ["American short A", "Over-broadening"]
          },
          {
            word: "chance",
            ipaTranscription: "/tʃæns/",
            accentIPA: "/tʃɑːns/",
            wordOrder: 2,
            exampleSentence: "Give it a chance.",
            pronunciationNotes: "Broad A — 'chahns'. Same rule as British for BATH words.",
            commonMistakes: ["American short A", "Not lengthening the vowel"]
          },
          {
            word: "plant",
            ipaTranscription: "/plænt/",
            accentIPA: "/plɑːnt/",
            wordOrder: 3,
            exampleSentence: "That's a lovely plant.",
            pronunciationNotes: "'Plahnt' with the broad A. Hold the vowel a bit longer.",
            commonMistakes: ["American short A", "Rushing through"]
          },
          {
            word: "no",
            ipaTranscription: "/noʊ/",
            accentIPA: "/nəʉ/",
            wordOrder: 4,
            exampleSentence: "Nah, no way.",
            pronunciationNotes: "The GOAT vowel is centralized. Start with a schwa-like sound, glide to a rounded position. Not 'noh' but more like 'nuh-oo'.",
            mouthPosition: "Mouth starts neutral (not rounded), then rounds slightly.",
            tonguePlacement: "Tongue starts central, moves to high back.",
            commonMistakes: ["Standard American 'oh'", "Starting too rounded", "Not centralizing enough"]
          }
        ]
      }
    ]
  },
  {
    name: "Southern US",
    slug: "southern-us",
    region: "Southern United States",
    description: "The warm, drawn-out Southern American accent with distinctive vowel drawl and charm.",
    difficulty: "beginner",
    keyFeatures: [
      "Monophthongization of /aɪ/ ('I' sounds like 'ah')",
      "Pin-pen merger (/ɪ/ and /ɛ/ merge before nasals)",
      "Drawn-out vowels (the 'drawl')",
      "Y'all and other Southernisms",
      "Often rhotic (R is pronounced)"
    ],
    emoji: "🤠",
    color: "bg-amber-600",
    lessons: [
      {
        title: "The Southern Drawl",
        slug: "southern-drawl",
        description: "Learn to monophthongize /aɪ/ — making 'I' sound like 'ah'.",
        lessonOrder: 1,
        category: "vowels",
        tips: [
          "The diphthong /aɪ/ (as in 'I', 'my', 'time') becomes a monophthong /aː/",
          "Think of saying 'ah' instead of 'eye'",
          "This is most noticeable before voiced consonants and at word-end",
          "Slow your speech down — Southern is unhurried"
        ],
        practiceWords: [
          {
            word: "I",
            ipaTranscription: "/aɪ/",
            accentIPA: "/aː/",
            wordOrder: 1,
            exampleSentence: "Ah reckon so.",
            pronunciationNotes: "Say 'AH' instead of 'I'. Long, open vowel. No glide upward. This is the most fundamental Southern sound.",
            mouthPosition: "Mouth stays open. Does NOT close like in standard 'I'.",
            tonguePlacement: "Tongue stays low and back. No rising motion.",
            commonMistakes: ["Gliding up to /ɪ/", "Making it too short", "Rushing through it"]
          },
          {
            word: "my",
            ipaTranscription: "/maɪ/",
            accentIPA: "/maː/",
            wordOrder: 2,
            exampleSentence: "That's mah house right there.",
            pronunciationNotes: "Say 'MAH' — like 'ma' as in mother. The vowel stays open and long.",
            mouthPosition: "Opens for M, stays open for the long 'ah'.",
            tonguePlacement: "Tongue low throughout.",
            commonMistakes: ["Saying standard 'my'", "Not holding the vowel", "Adding the glide"]
          },
          {
            word: "time",
            ipaTranscription: "/taɪm/",
            accentIPA: "/taːm/",
            wordOrder: 3,
            exampleSentence: "Take your tahm, honey.",
            pronunciationNotes: "'TAHM' — long open vowel between T and M. Slow, drawn-out.",
            mouthPosition: "Mouth opens wide after T, stays open until M.",
            tonguePlacement: "Tongue low. Lips close for M.",
            commonMistakes: ["Standard diphthong", "Rushing", "Not opening mouth enough"]
          },
          {
            word: "nice",
            ipaTranscription: "/naɪs/",
            accentIPA: "/naːs/",
            wordOrder: 4,
            exampleSentence: "Well, isn't that nahs.",
            pronunciationNotes: "'NAHS' — the drawl is strong here. Long 'ah' sound. Slow and smooth.",
            commonMistakes: ["Keeping the diphthong", "Being too fast"]
          },
          {
            word: "ride",
            ipaTranscription: "/ɹaɪd/",
            accentIPA: "/ɹaːd/",
            wordOrder: 5,
            exampleSentence: "Let's go for a rahd.",
            pronunciationNotes: "'RAHD' — open vowel, no glide. The R at the start IS pronounced (Southern is rhotic).",
            commonMistakes: ["Dropping the R (that's British, not Southern)", "Using the diphthong"]
          }
        ]
      },
      {
        title: "Pin-Pen Merger",
        slug: "pin-pen-merger",
        description: "Learn the merger where 'pin' and 'pen' sound identical before nasal consonants.",
        lessonOrder: 2,
        category: "vowels",
        tips: [
          "Before M, N, NG — the vowels /ɪ/ and /ɛ/ merge to /ɪ/",
          "So 'pen' sounds like 'pin', 'hem' sounds like 'him'",
          "This ONLY happens before nasal consonants",
          "Context tells the listener which word you mean"
        ],
        practiceWords: [
          {
            word: "pen",
            ipaTranscription: "/pɛn/",
            accentIPA: "/pɪn/",
            wordOrder: 1,
            exampleSentence: "Hand me that pin. (pen)",
            pronunciationNotes: "Say 'PIN' for 'pen'. The vowel raises to /ɪ/ before the nasal N.",
            mouthPosition: "Mouth more closed than standard 'pen' — same position as 'pin'.",
            tonguePlacement: "Tongue higher and more forward — /ɪ/ position.",
            commonMistakes: ["Keeping the /ɛ/ vowel", "Doing it in non-nasal words", "Exaggerating it"]
          },
          {
            word: "ten",
            ipaTranscription: "/tɛn/",
            accentIPA: "/tɪn/",
            wordOrder: 2,
            exampleSentence: "I counted to tin. (ten)",
            pronunciationNotes: "'TIN' for 'ten'. Same merger before the nasal N.",
            commonMistakes: ["Standard /ɛ/ vowel", "Over-pronouncing"]
          },
          {
            word: "hem",
            ipaTranscription: "/hɛm/",
            accentIPA: "/hɪm/",
            wordOrder: 3,
            exampleSentence: "Fix the him of that dress. (hem)",
            pronunciationNotes: "'HIM' for 'hem'. The /ɛ/ → /ɪ/ merger before M.",
            commonMistakes: ["Not merging before M", "Over-nasalizing"]
          },
          {
            word: "sent",
            ipaTranscription: "/sɛnt/",
            accentIPA: "/sɪnt/",
            wordOrder: 4,
            exampleSentence: "I already sint it. (sent)",
            pronunciationNotes: "'SINT' for 'sent'. Before N, the vowel raises.",
            commonMistakes: ["Standard pronunciation", "Changing other vowels too"]
          }
        ]
      },
      {
        title: "Southern Phrases",
        slug: "southern-phrases",
        description: "Practice iconic Southern expressions with the full accent.",
        lessonOrder: 3,
        category: "phrases",
        tips: [
          "Southern speech is slower and more melodic",
          "Use the drawl on stressed syllables",
          "The warmth comes from the musicality of the accent",
          "Don't rush — Southern charm is in the pacing"
        ],
        practiceWords: [
          {
            word: "Y'all come back now.",
            ipaTranscription: "/juː ɑːl kʌm bæk naʊ/",
            accentIPA: "/jɑːl kʌm bæk naːw/",
            wordOrder: 1,
            exampleSentence: "It was great seein' ya. Y'all come back now, ya hear?",
            pronunciationNotes: "'Y'ALL' is one syllable. 'Now' gets the drawl with a monophthong. Warm, inviting tone.",
            commonMistakes: ["Saying 'you all'", "Being too fast", "Flat intonation"]
          },
          {
            word: "Fixin' to go.",
            ipaTranscription: "/ˈfɪksɪŋ tuː ɡoʊ/",
            accentIPA: "/ˈfɪksɪn tə ɡoʊ/",
            wordOrder: 2,
            exampleSentence: "I'm fixin' to go to the store.",
            pronunciationNotes: "'Fixin' to' means 'about to'. Drop the G. Casual and natural.",
            commonMistakes: ["Saying 'fixing'", "Not understanding the meaning", "Too formal"]
          },
          {
            word: "Bless your heart.",
            ipaTranscription: "/blɛs jɔːɹ hɑːɹt/",
            accentIPA: "/blɛs jɔːɹ hɑːɹt/",
            wordOrder: 3,
            exampleSentence: "Oh, bless your heart.",
            pronunciationNotes: "This can be sincere OR a polite way to say someone is foolish. Sweet tone, drawn out. 'Heart' gets a nice long 'ah'.",
            commonMistakes: ["Missing the Southern warmth", "Being too literal", "Rushing it"]
          },
          {
            word: "Well, I declare.",
            ipaTranscription: "/wɛl aɪ dɪˈklɛɹ/",
            accentIPA: "/wɛːl aː dɪˈklɛːɹ/",
            wordOrder: 4,
            exampleSentence: "Well, ah declare!",
            pronunciationNotes: "'Well' is elongated. 'I' becomes 'ah'. 'Declare' is drawn out. Expression of surprise.",
            commonMistakes: ["Standard diphthong on 'I'", "Not elongating enough", "Missing the melodic surprise"]
          }
        ]
      }
    ]
  },
  {
    name: "Irish",
    slug: "irish",
    region: "Ireland",
    description: "The melodic Irish accent with its lilting rhythm and distinctive consonant sounds.",
    difficulty: "intermediate",
    keyFeatures: [
      "TH becomes dental T/D (tongue on teeth)",
      "Rhotic (R is always pronounced)",
      "Musical, lilting intonation",
      "Distinctive vowel qualities",
      "Clear L in all positions"
    ],
    emoji: "🇮🇪",
    color: "bg-green-600",
    lessons: [
      {
        title: "Irish TH Sounds",
        slug: "irish-th",
        description: "Replace TH with dental stops — a signature Irish sound.",
        lessonOrder: 1,
        category: "consonants",
        tips: [
          "Voiceless TH (/θ/) becomes a dental T — tongue ON teeth, not between them",
          "Voiced TH (/ð/) becomes a dental D — same position",
          "It's NOT a regular T/D — your tongue touches your front teeth",
          "This gives Irish English its distinctive sharp consonant sound"
        ],
        practiceWords: [
          {
            word: "think",
            ipaTranscription: "/θɪŋk/",
            accentIPA: "/t̪ɪŋk/",
            wordOrder: 1,
            exampleSentence: "I tink that's a grand idea.",
            pronunciationNotes: "Say 'TINK' but with your tongue touching the back of your upper front teeth. It's a dental T, not a regular T.",
            mouthPosition: "Tongue tip touches the back of upper front teeth.",
            tonguePlacement: "Tongue on teeth (dental position) — further forward than regular T.",
            commonMistakes: ["Using a regular T (tongue on ridge)", "Using actual TH", "Not making it dental enough"]
          },
          {
            word: "that",
            ipaTranscription: "/ðæt/",
            accentIPA: "/d̪æt/",
            wordOrder: 2,
            exampleSentence: "Is dat your car?",
            pronunciationNotes: "Say 'DAT' with dental D — tongue on teeth. Quick and natural.",
            mouthPosition: "Tongue on back of upper teeth for initial D.",
            tonguePlacement: "Dental position — tongue further forward than normal D.",
            commonMistakes: ["Regular D (not dental)", "Keeping TH sound", "Exaggerating"]
          },
          {
            word: "three",
            ipaTranscription: "/θɹiː/",
            accentIPA: "/t̪ɹiː/",
            wordOrder: 3,
            exampleSentence: "Tree pints of Guinness, please.",
            pronunciationNotes: "'TREE' — dental T replaces TH. Classic Irish pronunciation.",
            commonMistakes: ["Regular T", "Keeping TH", "Not letting it flow naturally"]
          },
          {
            word: "the",
            ipaTranscription: "/ðə/",
            accentIPA: "/d̪ə/",
            wordOrder: 4,
            exampleSentence: "Down da road a bit.",
            pronunciationNotes: "'DA' — dental D. In quick speech it's very natural.",
            commonMistakes: ["Standard TH", "Over-thinking it"]
          },
          {
            word: "with",
            ipaTranscription: "/wɪθ/",
            accentIPA: "/wɪt̪/",
            wordOrder: 5,
            exampleSentence: "Come wit me.",
            pronunciationNotes: "'WIT' — dental T at end. Sharp, clean ending.",
            commonMistakes: ["Standard TH", "Regular T instead of dental"]
          }
        ]
      },
      {
        title: "Irish R & Vowels",
        slug: "irish-r-vowels",
        description: "Master the Irish rhotic R and distinctive vowel sounds.",
        lessonOrder: 2,
        category: "vowels",
        tips: [
          "Irish English is strongly rhotic — ALWAYS pronounce the R",
          "The R is often tapped or slightly rolled (not American retroflex)",
          "PRICE vowel can be more open: /ɑɪ/",
          "FACE vowel is often a monophthong: /eː/"
        ],
        practiceWords: [
          {
            word: "car",
            ipaTranscription: "/kɑːɹ/",
            accentIPA: "/kɑːɾ/",
            wordOrder: 1,
            exampleSentence: "The car is just down the road.",
            pronunciationNotes: "Pronounce the R! But it's a quick tap, not the heavy American R. Tongue briefly taps the ridge.",
            mouthPosition: "Open for 'ah', then tongue quickly taps for R.",
            tonguePlacement: "Tongue tip quickly taps the alveolar ridge (like a quick Spanish R).",
            commonMistakes: ["American heavy R", "Dropping the R (that's British)", "Rolling it too much (that's Scottish)"]
          },
          {
            word: "park",
            ipaTranscription: "/pɑːɹk/",
            accentIPA: "/pɑːɾk/",
            wordOrder: 2,
            exampleSentence: "We went to the park.",
            pronunciationNotes: "R is tapped before the K. Quick and light.",
            commonMistakes: ["Heavy American R", "Dropping R"]
          },
          {
            word: "thirty",
            ipaTranscription: "/ˈθɝːti/",
            accentIPA: "/ˈt̪ɜːɾti/",
            wordOrder: 3,
            exampleSentence: "Turty tree and a turd. (thirty three and a third)",
            pronunciationNotes: "Dental T for TH, then Irish R (tapped). 'TUR-tee'. The IR vowel is more open than American.",
            commonMistakes: ["American TH", "Heavy R", "Wrong vowel in first syllable"]
          },
          {
            word: "girl",
            ipaTranscription: "/ɡɝːl/",
            accentIPA: "/ɡɜːɾl/",
            wordOrder: 4,
            exampleSentence: "She's a lovely girl.",
            pronunciationNotes: "Open vowel, tapped R, clear L. More like 'GUR-ul' with a quick R tap.",
            commonMistakes: ["American bunched R", "Dropping R"]
          }
        ]
      },
      {
        title: "Irish Expressions",
        slug: "irish-expressions",
        description: "Practice classic Irish phrases with the right melody and rhythm.",
        lessonOrder: 3,
        category: "phrases",
        tips: [
          "Irish English has a musical, lilting quality",
          "Sentences often rise and fall in unexpected places",
          "The rhythm is syllable-timed (more even) rather than stress-timed",
          "Irish people often end sentences with confirming phrases"
        ],
        practiceWords: [
          {
            word: "To be sure, to be sure.",
            ipaTranscription: "/tə biː ʃʊɹ tə biː ʃʊɹ/",
            accentIPA: "/t̪ə biː ʃʊɾ t̪ə biː ʃʊɾ/",
            wordOrder: 1,
            exampleSentence: "He'll be grand, to be sure, to be sure.",
            pronunciationNotes: "Dental T in 'to'. Tapped R in 'sure'. Musical repetition — the second 'to be sure' drops in pitch.",
            commonMistakes: ["Standard American pronunciation", "Flat intonation", "Regular T and R sounds"]
          },
          {
            word: "It's grand.",
            ipaTranscription: "/ɪts ɡɹænd/",
            accentIPA: "/ɪt̪s ɡɾænd/",
            wordOrder: 2,
            exampleSentence: "Don't worry about it. It's grand.",
            pronunciationNotes: "'Grand' means 'fine/great' in Irish English. Quick tapped R. Said casually and warmly.",
            commonMistakes: ["Overemphasizing", "American R", "Being too dramatic"]
          },
          {
            word: "What's the craic?",
            ipaTranscription: "/wʌts ðə kɹæk/",
            accentIPA: "/wɒt̪s d̪ə kɾæk/",
            wordOrder: 3,
            exampleSentence: "Hey there! What's the craic?",
            pronunciationNotes: "'Craic' (pronounced 'crack') means 'fun/news'. Dental D in 'the'. This means 'What's going on?'",
            commonMistakes: ["Mispronouncing 'craic'", "Standard TH", "Not knowing it means 'what's happening?'"]
          },
          {
            word: "Ah, go on then.",
            ipaTranscription: "/ɑː ɡoʊ ɑːn ðɛn/",
            accentIPA: "/ɑː ɡoː ɒn d̪ɛn/",
            wordOrder: 4,
            exampleSentence: "Ah, go on then. Sure, why not?",
            pronunciationNotes: "Famous from Mrs. Doyle in Father Ted. Persuasive, musical. 'Go' is more of a monophthong 'goh'. Dental D in 'then'.",
            commonMistakes: ["Standard American sounds", "Missing the persuasive melody", "Regular TH"]
          }
        ]
      }
    ]
  },
  {
    name: "Scottish",
    slug: "scottish",
    region: "Scotland",
    description: "The rolling Scottish accent with guttural sounds and distinctive vowels.",
    difficulty: "advanced",
    keyFeatures: [
      "Rolled or trilled R",
      "Guttural /x/ sound (like 'loch')",
      "No FOOT-STRUT split (/ʊ/ for both)",
      "Monophthongal FACE and GOAT vowels",
      "Scottish Vowel Length Rule"
    ],
    emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    color: "bg-indigo-600",
    lessons: [
      {
        title: "The Scottish R",
        slug: "scottish-r",
        description: "Learn to roll and trill your R — the heart of Scottish accent.",
        lessonOrder: 1,
        category: "consonants",
        tips: [
          "Scottish R is rolled/trilled — tongue vibrates against the alveolar ridge",
          "Start by saying 'butter' quickly — feel the tongue tap",
          "Practice the 'drill' sound: put tongue behind teeth and blow",
          "Some Scots use a tap rather than a full trill — both work"
        ],
        practiceWords: [
          {
            word: "right",
            ipaTranscription: "/ɹaɪt/",
            accentIPA: "/rʌit/",
            wordOrder: 1,
            exampleSentence: "Aye, that's right.",
            pronunciationNotes: "Roll the R at the start. Tongue tip vibrates against the ridge behind your upper teeth. Then a slightly different diphthong.",
            mouthPosition: "Tongue tip near alveolar ridge, vibrating with airflow.",
            tonguePlacement: "Tongue tip curled up, vibrating against the alveolar ridge. Air pushes through.",
            commonMistakes: ["American R (tongue bunched back)", "Not rolling at all", "Using uvular R (that's French/German)"]
          },
          {
            word: "around",
            ipaTranscription: "/əˈɹaʊnd/",
            accentIPA: "/əˈrund/",
            wordOrder: 2,
            exampleSentence: "Come around for tea.",
            pronunciationNotes: "Rolled R. The 'ou' sound is more like 'oo' in Scottish. 'A-ROOND'.",
            commonMistakes: ["American R", "Standard diphthong in 'ound'"]
          },
          {
            word: "very",
            ipaTranscription: "/ˈvɛɹi/",
            accentIPA: "/ˈvɛri/",
            wordOrder: 3,
            exampleSentence: "It's very cold the day.",
            pronunciationNotes: "Clear rolled R between vowels. 'VE-rri'. Even a single tap is more Scottish than American R.",
            commonMistakes: ["American R", "Not rolling/tapping"]
          },
          {
            word: "great",
            ipaTranscription: "/ɡɹeɪt/",
            accentIPA: "/ɡret/",
            wordOrder: 4,
            exampleSentence: "That's great, pal.",
            pronunciationNotes: "Rolled R. The vowel is a monophthong /e/ — not a diphthong. 'GRET' not 'GRAYT'.",
            commonMistakes: ["Diphthong in vowel", "American R", "Saying 'GRAYT'"]
          },
          {
            word: "three",
            ipaTranscription: "/θɹiː/",
            accentIPA: "/θriː/",
            wordOrder: 5,
            exampleSentence: "Three of them came.",
            pronunciationNotes: "TH is kept in Scottish (unlike Irish/Cockney). But the R is rolled. 'THREE' with a trilled R.",
            commonMistakes: ["Not rolling the R", "Dropping the TH"]
          }
        ]
      },
      {
        title: "Scottish Vowels",
        slug: "scottish-vowels",
        description: "Master the distinctive Scottish vowel system — no FOOT-STRUT split.",
        lessonOrder: 2,
        category: "vowels",
        tips: [
          "Scottish English has no FOOT-STRUT split: 'put' and 'putt' rhyme",
          "Both use /ʊ/ — so 'strut' sounds like 'stroot'",
          "FACE is a monophthong /e/ — 'face' is 'fess' (long)",
          "GOAT is a monophthong /o/ — 'goat' is 'goht'"
        ],
        practiceWords: [
          {
            word: "house",
            ipaTranscription: "/haʊs/",
            accentIPA: "/hʉs/",
            wordOrder: 1,
            exampleSentence: "Come back to the hoose.",
            pronunciationNotes: "Say 'HOOSE' — the diphthong /aʊ/ becomes /ʉ/ (like 'oo' but centralized). Very distinctive.",
            mouthPosition: "Lips rounded, more closed than English 'house'.",
            tonguePlacement: "Tongue high and central for the /ʉ/ sound.",
            commonMistakes: ["Standard 'ow' diphthong", "Not centralizing enough", "Making it exactly like 'oo'"]
          },
          {
            word: "about",
            ipaTranscription: "/əˈbaʊt/",
            accentIPA: "/əˈbʉt/",
            wordOrder: 2,
            exampleSentence: "What's it all aboot?",
            pronunciationNotes: "A-BOOT — same /ʉ/ vowel. This is what people notice about Scottish accents.",
            commonMistakes: ["Standard diphthong", "Making it sound Canadian"]
          },
          {
            word: "out",
            ipaTranscription: "/aʊt/",
            accentIPA: "/ʉt/",
            wordOrder: 3,
            exampleSentence: "Get oot of here!",
            pronunciationNotes: "'OOT' — central rounded vowel. Quick and decisive.",
            commonMistakes: ["Standard 'ow' sound", "Not rounding enough"]
          },
          {
            word: "blood",
            ipaTranscription: "/blʌd/",
            accentIPA: "/blʊd/",
            wordOrder: 4,
            exampleSentence: "It's in the blood.",
            pronunciationNotes: "No STRUT vowel in Scottish — 'blood' rhymes with 'good'. Same /ʊ/ vowel.",
            mouthPosition: "Lips slightly rounded, mouth less open than American 'blood'.",
            tonguePlacement: "Tongue higher and further back than American /ʌ/.",
            commonMistakes: ["Using American /ʌ/ (the 'uh' sound)", "Not rounding the lips"]
          }
        ]
      },
      {
        title: "Scottish Phrases",
        slug: "scottish-phrases",
        description: "Practice Scottish expressions with proper accent features.",
        lessonOrder: 3,
        category: "phrases",
        tips: [
          "'Aye' means 'yes' and is used constantly",
          "'Wee' means 'small' and is used for everything",
          "Scottish speech can be very direct and rhythmic",
          "Use the guttural /x/ in words like 'loch'"
        ],
        practiceWords: [
          {
            word: "Aye, that's braw.",
            ipaTranscription: "/aɪ ðæts bɹɑː/",
            accentIPA: "/aɪ ðats brɑː/",
            wordOrder: 1,
            exampleSentence: "Aye, that's braw, so it is.",
            pronunciationNotes: "'Braw' means 'great/fine'. Rolled R. 'Aye' is the Scottish 'yes'. Direct and warm.",
            commonMistakes: ["Not rolling the R in 'braw'", "Standard pronunciation", "Not knowing 'braw' means great"]
          },
          {
            word: "Och, away ye go.",
            ipaTranscription: "/ɑːx əˈweɪ jiː ɡoʊ/",
            accentIPA: "/ɔx əˈwe jiː ɡo/",
            wordOrder: 2,
            exampleSentence: "Och, away ye go! Don't be daft.",
            pronunciationNotes: "'Och' has the guttural /x/ sound — like clearing your throat gently. Same as 'loch'. 'Go' is monophthong /o/.",
            mouthPosition: "For /x/: back of tongue raised toward soft palate, air pushes through.",
            tonguePlacement: "Back of tongue near velum for the /x/ friction sound.",
            commonMistakes: ["Saying 'ock' without the guttural", "Pronouncing 'go' with a diphthong", "Missing the dismissive tone"]
          },
          {
            word: "Wee bit of rain.",
            ipaTranscription: "/wiː bɪt əv ɹeɪn/",
            accentIPA: "/wiː bɪt əv ren/",
            wordOrder: 3,
            exampleSentence: "Just a wee bit of rain — nothing to worry about.",
            pronunciationNotes: "'Wee' is the quintessential Scottish word. 'Rain' is a monophthong /e/. Said with understatement even in a downpour.",
            commonMistakes: ["Diphthong in 'rain'", "Missing the understatement"]
          },
          {
            word: "It's pure dead brilliant.",
            ipaTranscription: "/ɪts pjʊɹ dɛd ˈbɹɪljənt/",
            accentIPA: "/ɪts pjʊr dɛd ˈbrɪljənt/",
            wordOrder: 4,
            exampleSentence: "That film? It's pure dead brilliant.",
            pronunciationNotes: "Glasgow slang for 'really excellent'. 'Pure dead' is an intensifier. Rolled R in 'pure' and 'brilliant'. Enthusiastic delivery.",
            commonMistakes: ["American R sounds", "Not enough enthusiasm", "Taking 'dead' literally"]
          }
        ]
      }
    ]
  },
  {
    name: "New York",
    slug: "new-york",
    region: "New York City",
    description: "The classic New York City accent with its non-rhotic R and raised vowels.",
    difficulty: "intermediate",
    keyFeatures: [
      "Non-rhotic (dropping R after vowels)",
      "Raised THOUGHT vowel (/ɔː/ is very round)",
      "Intrusive R between vowels",
      "TRAP tensing (raised /æ/ in certain words)",
      "Fast, assertive delivery"
    ],
    emoji: "🗽",
    color: "bg-orange-500",
    lessons: [
      {
        title: "New York R-dropping",
        slug: "ny-r-dropping",
        description: "Learn the New York non-rhotic R — similar to British but with NYC flavor.",
        lessonOrder: 1,
        category: "consonants",
        tips: [
          "Like British RP, NYC drops R after vowels",
          "But the surrounding vowels sound different from British",
          "R IS pronounced before vowels: 'very' keeps its R",
          "The dropped R often lengthens or changes the preceding vowel"
        ],
        practiceWords: [
          {
            word: "car",
            ipaTranscription: "/kɑːɹ/",
            accentIPA: "/kɑː/",
            wordOrder: 1,
            exampleSentence: "I pahked the cah.",
            pronunciationNotes: "Say 'KAH' — drop the R. Unlike British, the vowel is more open and fronted. Classic NYC.",
            mouthPosition: "Mouth open, slightly more front than British 'car'.",
            tonguePlacement: "Tongue low, slightly more front than RP.",
            commonMistakes: ["Keeping the R", "Making it sound British instead of NYC", "Not enough attitude"]
          },
          {
            word: "park",
            ipaTranscription: "/pɑːɹk/",
            accentIPA: "/pɑːk/",
            wordOrder: 2,
            exampleSentence: "Let's go to Central Pahk.",
            pronunciationNotes: "'PAHK' — drop the R. The vowel is long and open. Think of the stereotypical NYC taxi driver.",
            commonMistakes: ["Pronouncing the R", "Being too subtle — commit to it!"]
          },
          {
            word: "water",
            ipaTranscription: "/ˈwɑːtɚ/",
            accentIPA: "/ˈwɔːtə/",
            wordOrder: 3,
            exampleSentence: "Can I get a glass of waw-tah?",
            pronunciationNotes: "'WAW-tuh' — rounded first vowel, no R at end. The first vowel is more rounded than standard American.",
            commonMistakes: ["American R at end", "Not rounding the first vowel", "Sounding British"]
          },
          {
            word: "floor",
            ipaTranscription: "/flɔːɹ/",
            accentIPA: "/flɔː/",
            wordOrder: 4,
            exampleSentence: "It's on the flaw. (floor)",
            pronunciationNotes: "'FLAW' — R drops, vowel is raised and rounded. Very distinctive NYC sound.",
            commonMistakes: ["Keeping the R", "Not raising the vowel"]
          },
          {
            word: "more",
            ipaTranscription: "/mɔːɹ/",
            accentIPA: "/mɔː/",
            wordOrder: 5,
            exampleSentence: "Give me maw. (more)",
            pronunciationNotes: "'MAW' — drop R, round the vowel. In NYC, this is very open and round.",
            commonMistakes: ["Pronouncing R", "Not enough rounding"]
          }
        ]
      },
      {
        title: "The THOUGHT Vowel",
        slug: "thought-vowel",
        description: "Master the raised, rounded New York /ɔː/ in words like 'coffee' and 'talk'.",
        lessonOrder: 2,
        category: "vowels",
        tips: [
          "NYC /ɔː/ is very round and raised",
          "Words like 'coffee', 'dog', 'talk' have this distinctive sound",
          "It's more rounded than standard American",
          "Think of it as 'aw' but more intense and rounded"
        ],
        practiceWords: [
          {
            word: "coffee",
            ipaTranscription: "/ˈkɑːfi/",
            accentIPA: "/ˈkɔːfi/",
            wordOrder: 1,
            exampleSentence: "I need my cawfee.",
            pronunciationNotes: "'CAW-fee' — very rounded first vowel. This is the iconic NYC pronunciation. Lips purse forward.",
            mouthPosition: "Lips rounded and pushed forward for the 'aw' sound.",
            tonguePlacement: "Tongue mid-back, raised slightly.",
            commonMistakes: ["Standard American flat 'a'", "Not rounding enough", "Being too subtle"]
          },
          {
            word: "talk",
            ipaTranscription: "/tɑːk/",
            accentIPA: "/tɔːk/",
            wordOrder: 2,
            exampleSentence: "We need to tawk.",
            pronunciationNotes: "'TAWK' — rounded, raised vowel. The L is silent. Lips push forward.",
            commonMistakes: ["Pronouncing the L", "Not rounding the vowel"]
          },
          {
            word: "dog",
            ipaTranscription: "/dɑːɡ/",
            accentIPA: "/dɔːɡ/",
            wordOrder: 3,
            exampleSentence: "I'm walkin' the dawg.",
            pronunciationNotes: "'DAWG' — rounded vowel. Very New York.",
            commonMistakes: ["Flat American 'ah'", "Not rounding"]
          },
          {
            word: "all",
            ipaTranscription: "/ɑːl/",
            accentIPA: "/ɔːl/",
            wordOrder: 4,
            exampleSentence: "That's awl I got.",
            pronunciationNotes: "'AWL' — very round. The NYC THOUGHT vowel at its finest.",
            commonMistakes: ["Standard pronunciation", "Not enough rounding"]
          }
        ]
      },
      {
        title: "NYC Phrases",
        slug: "nyc-phrases",
        description: "Practice classic New York expressions with the full accent.",
        lessonOrder: 3,
        category: "phrases",
        tips: [
          "NYC speech is fast, direct, and assertive",
          "Don't be afraid to be loud and expressive",
          "Words often run together in rapid speech",
          "The attitude is as important as the sounds"
        ],
        practiceWords: [
          {
            word: "Forget about it!",
            ipaTranscription: "/fɔːɹˈɡɛt əˈbaʊt ɪt/",
            accentIPA: "/fəˈɡɛɾəˌbaʊɾɪt/",
            wordOrder: 1,
            exampleSentence: "The best pizza? Fuhgeddaboudit!",
            pronunciationNotes: "Run it all together: 'fuh-GED-uh-BOW-dit'. Fast, one breath. This one word can mean many things depending on context.",
            commonMistakes: ["Saying each word separately", "Being too slow", "Not enough attitude"]
          },
          {
            word: "I'm walking here!",
            ipaTranscription: "/aɪm ˈwɑːkɪŋ hɪɹ/",
            accentIPA: "/aɪm ˈwɔːkɪn hɪə/",
            wordOrder: 2,
            exampleSentence: "Hey! I'm wawkin' hee-ah!",
            pronunciationNotes: "'WAWK-in' with rounded vowel, drop the G. 'Here' becomes 'hee-uh' — no R. Angry, indignant delivery.",
            commonMistakes: ["Standard American pronunciation", "Being polite about it", "Keeping the R in 'here'"]
          },
          {
            word: "How you doin'?",
            ipaTranscription: "/haʊ juː ˈduːɪŋ/",
            accentIPA: "/haʊ jə ˈduːɪn/",
            wordOrder: 3,
            exampleSentence: "Hey, how you doin'?",
            pronunciationNotes: "Drop the G. Reduce 'you' to 'ya'. Can be a greeting or a pickup line. Smooth, confident delivery.",
            commonMistakes: ["Saying full 'doing'", "Not reducing 'you'", "Being too casual or too formal"]
          },
          {
            word: "Get outta here!",
            ipaTranscription: "/ɡɛt ˈaʊtə hɪɹ/",
            accentIPA: "/ɡɛɾ ˈaʊɾə hɪə/",
            wordOrder: 4,
            exampleSentence: "You won the lottery? Get outta hee-ah!",
            pronunciationNotes: "Run together: 'GED-oudda-HEE-uh'. Express disbelief. R dropped in 'here'. T's are flapped.",
            commonMistakes: ["Too slow", "Keeping R in 'here'", "Not expressing enough surprise"]
          }
        ]
      }
    ]
  },
  {
    name: "Standard American",
    slug: "standard-american",
    region: "United States",
    description: "General American English — the neutral baseline accent used in broadcast media.",
    difficulty: "beginner",
    keyFeatures: [
      "Fully rhotic (R always pronounced)",
      "Flapped T between vowels",
      "Cot-caught merger in many regions",
      "Dark L in codas",
      "Reduced vowels in unstressed syllables"
    ],
    emoji: "🇺🇸",
    color: "bg-slate-500",
    lessons: [
      {
        title: "The American R",
        slug: "american-r",
        description: "Master the distinctive American retroflex R sound.",
        lessonOrder: 1,
        category: "consonants",
        tips: [
          "American R is made by curling the tongue tip back OR bunching the tongue body",
          "It colors the vowel before it — 'bird' has an R-colored vowel throughout",
          "R is ALWAYS pronounced — after vowels, between vowels, everywhere",
          "This is what makes American English sound 'American' to other English speakers"
        ],
        practiceWords: [
          {
            word: "car",
            ipaTranscription: "/kɑːɹ/",
            accentIPA: "/kɑːɹ/",
            wordOrder: 1,
            exampleSentence: "I'll take the car.",
            pronunciationNotes: "Full R at the end. Tongue curls back or bunches up. You should feel the tongue pull back in your mouth.",
            mouthPosition: "Lips slightly spread, not rounded. Mouth partially open.",
            tonguePlacement: "Tongue tip curled back toward the palate (retroflex) OR tongue body bunched up.",
            commonMistakes: ["Dropping the R (British habit)", "Not enough tongue curl", "Over-pronouncing it"]
          },
          {
            word: "water",
            ipaTranscription: "/ˈwɑːtɚ/",
            accentIPA: "/ˈwɑːɾɚ/",
            wordOrder: 2,
            exampleSentence: "I'd like some water, please.",
            pronunciationNotes: "The T is flapped (sounds like a quick D) AND the final R is pronounced. 'WAH-der'.",
            commonMistakes: ["Not flapping the T", "Dropping the final R"]
          },
          {
            word: "letter",
            ipaTranscription: "/ˈlɛtɚ/",
            accentIPA: "/ˈlɛɾɚ/",
            wordOrder: 3,
            exampleSentence: "Did you get my letter?",
            pronunciationNotes: "'LED-er' — flapped T (sounds like D), full R at end. This is Standard American.",
            commonMistakes: ["Hard T (British)", "Dropping R"]
          },
          {
            word: "bird",
            ipaTranscription: "/bɝːd/",
            accentIPA: "/bɝːd/",
            wordOrder: 4,
            exampleSentence: "I saw a bird in the tree.",
            pronunciationNotes: "R-colored vowel throughout. The whole vowel is 'er' — tongue is curled back the entire time.",
            mouthPosition: "Mouth slightly open, lips neutral.",
            tonguePlacement: "Tongue bunched or retroflex throughout the vowel — the R colors everything.",
            commonMistakes: ["Not R-coloring the vowel", "British pronunciation 'buhd'"]
          },
          {
            word: "work",
            ipaTranscription: "/wɝːk/",
            accentIPA: "/wɝːk/",
            wordOrder: 5,
            exampleSentence: "I have to go to work.",
            pronunciationNotes: "Full R-colored vowel. Same as 'bird' — tongue pulled back throughout.",
            commonMistakes: ["Dropping the R color", "British 'wuhk'"]
          }
        ]
      },
      {
        title: "The Flapped T",
        slug: "flapped-t",
        description: "Learn the American habit of flapping T between vowels — 'butter' sounds like 'budder'.",
        lessonOrder: 2,
        category: "consonants",
        tips: [
          "When T comes between two vowels (and the second is unstressed), it becomes a quick D-like tap",
          "Your tongue quickly taps the ridge behind your teeth — just once",
          "This is the same sound as the Spanish R in 'pero'",
          "Americans do this unconsciously — it sounds wrong if you DON'T do it"
        ],
        practiceWords: [
          {
            word: "butter",
            ipaTranscription: "/ˈbʌtɚ/",
            accentIPA: "/ˈbʌɾɚ/",
            wordOrder: 1,
            exampleSentence: "Pass the butter.",
            pronunciationNotes: "'BUH-der' — the T becomes a quick tongue tap. Your tongue flicks the ridge once, like a quick D.",
            mouthPosition: "Mouth relaxed throughout.",
            tonguePlacement: "Tongue tip quickly taps the alveolar ridge — one fast motion.",
            commonMistakes: ["Pronouncing a full T (sounds British)", "Making it a full D (too heavy)", "Not making it quick enough"]
          },
          {
            word: "better",
            ipaTranscription: "/ˈbɛtɚ/",
            accentIPA: "/ˈbɛɾɚ/",
            wordOrder: 2,
            exampleSentence: "That's much better.",
            pronunciationNotes: "'BEH-der' — flapped T. Quick tap. Full R at the end.",
            commonMistakes: ["Full T", "No R at end"]
          },
          {
            word: "city",
            ipaTranscription: "/ˈsɪti/",
            accentIPA: "/ˈsɪɾi/",
            wordOrder: 3,
            exampleSentence: "New York is a big city.",
            pronunciationNotes: "'SI-dee' — the T flaps to sound like a quick D.",
            commonMistakes: ["Full T", "Making D too heavy"]
          },
          {
            word: "pretty",
            ipaTranscription: "/ˈpɹɪti/",
            accentIPA: "/ˈpɹɪɾi/",
            wordOrder: 4,
            exampleSentence: "That's pretty cool.",
            pronunciationNotes: "'PRIH-dee' — flapped T after the R. Quick and natural.",
            commonMistakes: ["Full T", "Over-pronouncing"]
          }
        ]
      },
      {
        title: "American Vowels",
        slug: "american-vowels",
        description: "Learn key American vowel features including the cot-caught merger.",
        lessonOrder: 3,
        category: "vowels",
        tips: [
          "Many Americans pronounce 'cot' and 'caught' the same way",
          "The FATHER vowel /ɑː/ and LOT vowel are merged",
          "American vowels tend to be more relaxed than British",
          "Unstressed syllables reduce to schwa (/ə/) — 'about' = 'uh-BOUT'"
        ],
        practiceWords: [
          {
            word: "lot",
            ipaTranscription: "/lɑːt/",
            accentIPA: "/lɑːt/",
            wordOrder: 1,
            exampleSentence: "There are a lot of people here.",
            pronunciationNotes: "Open 'ah' sound. In American English, this is the same vowel as 'father'. Mouth wide open, tongue low.",
            commonMistakes: ["British rounded /ɒ/", "Not opening the mouth enough"]
          },
          {
            word: "thought",
            ipaTranscription: "/θɔːt/",
            accentIPA: "/θɑːt/",
            wordOrder: 2,
            exampleSentence: "I thought so.",
            pronunciationNotes: "In most American dialects, this merges with LOT: 'THAHT'. Same open 'ah' vowel.",
            commonMistakes: ["British rounded vowel", "NYC raised vowel (that's regional)"]
          },
          {
            word: "cot",
            ipaTranscription: "/kɑːt/",
            accentIPA: "/kɑːt/",
            wordOrder: 3,
            exampleSentence: "The baby is sleeping in the cot.",
            pronunciationNotes: "Same vowel as 'caught' for most Americans. Open, unrounded 'ah'.",
            commonMistakes: ["Distinguishing from 'caught' (they're the same for most Americans)"]
          },
          {
            word: "father",
            ipaTranscription: "/ˈfɑːðɚ/",
            accentIPA: "/ˈfɑːðɚ/",
            wordOrder: 4,
            exampleSentence: "My father lives in Ohio.",
            pronunciationNotes: "Open 'ah' vowel, voiced TH, full R at end. 'FAH-ther'. This is the baseline American sound.",
            commonMistakes: ["Dropping the R", "Wrong vowel"]
          }
        ]
      }
    ]
  }
]

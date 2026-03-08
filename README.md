# AccentIQ — Voice Accent Training for Actors

Train your ear and voice to master accents with real-time speech recognition, phonetic IPA breakdowns, audio demos, and personalized feedback.

## Features

- **8 accents**: British RP, Cockney, Australian, Southern US, Irish, Scottish, New York, Standard American
- **24 structured lessons** covering vowels, consonants, rhythm, intonation, and phrases
- **100+ practice words** with IPA transcriptions and accent-specific pronunciations
- **Audio demos**: Click the speaker icon to hear how each word should sound
- **Real-time speech recognition**: Record yourself and get instant feedback
- **Pronunciation feedback engine**: Scores your attempt, highlights strengths, and suggests improvements
- **Expandable detail panels**: See mouth position, tongue placement, and common mistakes on demand
- **Dark theme**: Professional, distraction-free interface

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**
- **Supabase** (PostgreSQL, Auth, RLS)
- **Web Speech API** (SpeechRecognition + SpeechSynthesis)
- **MediaRecorder API** for audio capture

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase CLI (`npm install -g supabase`)
- Chrome or Edge browser (required for speech recognition)

### Clone & Install

```bash
git clone <repo-url>
cd accentGame
npm install
```

### Environment Variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Get your credentials from the [Supabase Dashboard](https://supabase.com/dashboard) or by running:

```bash
supabase projects api-keys --project-ref <your-project-ref>
```

### Database Setup

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

### Start Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in Chrome or Edge.

## Project Structure

```
src/
  app/
    page.tsx                                      — Dashboard (accent selection)
    accent/[slug]/page.tsx                        — Accent detail (lesson list)
    accent/[slug]/practice/[lessonSlug]/page.tsx  — Practice session (core gameplay)
  components/ui/          — shadcn/ui components
  data/
    accents.ts            — Full accent curriculum (8 accents, 24 lessons, 100+ words)
  lib/
    speech.ts             — Web Speech API helpers (recognition, synthesis, recording)
    phonetics.ts          — IPA dictionary with accent-specific variations
    feedback.ts           — Pronunciation feedback engine
    supabase.ts           — Supabase client
supabase/
  migrations/             — Database schema (PostgreSQL + RLS)
```

## How It Works

1. **Choose an accent** from the dashboard
2. **Pick a lesson** (e.g., "Non-Rhotic R" for British RP)
3. **See the word** displayed with its IPA transcription in the target accent
4. **Listen** by clicking the speaker icon to hear how it should sound
5. **Expand details** to see mouth position, tongue placement, and common mistakes
6. **Record yourself** by tapping the microphone button
7. **Get feedback** with a score, strengths, and specific improvement tips
8. **Move to the next word** and track your progress through the lesson

The feedback engine compares your spoken transcript against the expected text, applies accent-specific substitution rules (e.g., recognizing "wotah" as correct for Cockney "water"), and draws from a bank of accent-specific coaching tips.

## Browser Support

Speech recognition requires **Chrome** or **Edge** (Chromium-based browsers). The app shows a compatibility warning on unsupported browsers. Text-to-speech works on all modern browsers.

## Deployment

```bash
npm run build
vercel --prod
```

Set these environment variables on Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

After deploying, add your production URL to Supabase Dashboard > Auth > URL Configuration > Redirect URLs.

## License

MIT

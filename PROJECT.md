# AccentIQ — Voice Accent Training for Actors

## User Prompts

### Original Request (2026-03-08)
> I want to build a voice game where it trains the player to train themselves on accents. This is for actors who want to learn new accents. I want you to teach the player and then the player has to speak into the microphone, where you will dissect what they're doing well and what they could improve. Have breakdowns and let the player also hear what it should sound like by having a speaker icon next to the word. Also provide a phonetic breakdown. I want it to be a clear and easy visual, but allow the player to see more detail if they choose to do so.

## Project Overview

AccentIQ is a web-based voice training game for actors to learn and practice different accents. It provides structured lessons with phonetic breakdowns (IPA), audio demos via browser speech synthesis, real-time speech recognition for practice, and a feedback engine that evaluates pronunciation accuracy.

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **Language**: TypeScript
- **UI**: Tailwind CSS v4 + shadcn/ui components
- **Database**: Supabase (PostgreSQL with RLS)
- **Speech**: Web Speech API (SpeechRecognition + SpeechSynthesis)
- **Audio Recording**: MediaRecorder API
- **Deployment target**: Vercel

## Architecture

- **Frontend**: Next.js App Router with server components for data pages, client components for interactive practice
- **Database**: Supabase with tables for accents, lessons, practice words, user progress, practice sessions (all with RLS)
- **Speech Recognition**: Browser-native SpeechRecognition API (Chrome/Edge only)
- **Text-to-Speech**: Browser SpeechSynthesis API with accent-specific voice selection via BCP-47 language codes
- **Feedback Engine**: Client-side comparison of expected vs. spoken text with accent-specific substitution rules and tip banks
- **Phonetics**: Static IPA dictionary with accent-specific variations for 55+ common English words

## Database Schema

### accents
Core accent definitions (name, slug, region, description, difficulty, key_features, emoji)

### lessons
Structured lessons per accent (title, slug, description, lesson_order, category, tips)

### practice_words
Words/phrases with IPA transcription, accent IPA, pronunciation notes, mouth position, tongue placement, common mistakes

### user_progress
Per-user lesson completion tracking (user_id, lesson_id, completed, best_score, attempts)

### practice_sessions
Individual practice attempts (user_id, practice_word_id, transcript, score, feedback)

All tables have RLS enabled. Content tables (accents, lessons, practice_words) are readable by everyone. User data tables are scoped to auth.uid().

## Supabase Configuration

- **Project ref**: tldxsbokckyvscqdcasz
- **Region**: West EU (Ireland)
- **Features**: Database (Postgres), Auth, RLS
- **Migration**: `20260308165804_initial_schema.sql`

## Key Files & Folders

```
src/
  app/
    layout.tsx                    — Root layout with header nav and dark theme
    page.tsx                      — Dashboard with accent cards grid
    accent/[slug]/page.tsx        — Accent detail with lesson cards
    accent/[slug]/practice/[lessonSlug]/page.tsx — Practice session (main interaction)
  components/ui/                  — shadcn/ui components (card, badge, progress, etc.)
  data/
    accents.ts                    — Full accent curriculum data (8 accents, 24 lessons, 100+ words)
  lib/
    supabase.ts                   — Supabase client
    speech.ts                     — Web Speech API helpers (recognition, synthesis, recording)
    phonetics.ts                  — IPA dictionary with 55+ words and 8 accent variations
    feedback.ts                   — Pronunciation feedback engine
    utils.ts                      — shadcn utility (cn)
supabase/
  migrations/                     — Database schema SQL
  config.toml                     — Supabase project config
```

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key

## Design Decisions

- **Browser Speech APIs over paid services**: Keeps the app free to use with no API keys needed for core functionality. Trade-off: Chrome/Edge only for speech recognition.
- **Static curriculum data over DB-only**: Accent data is in TypeScript files for fast loading and type safety. Can be seeded to DB later for dynamic content management.
- **Expandable detail pattern**: Clean minimal view by default (word + IPA + speaker). Phonetic detail (mouth position, tongue placement, common mistakes) is one click away.
- **Dark theme**: Professional look suited for actors/performers, easier on the eyes during practice sessions.
- **Client-side feedback engine**: No server round-trip for pronunciation feedback. Instant results using word matching + accent-specific substitution dictionaries.

## Status

- All 8 accents with 3 lessons each (24 lessons total) are complete
- Dashboard, accent detail, and practice pages are functional
- Speech recognition and synthesis work in Chrome/Edge
- Feedback engine provides scores, strengths, and improvement suggestions
- Browser compatibility warning shown for unsupported browsers
- Build passes with zero TypeScript errors
- Zero console errors in browser

-- Accents table
CREATE TABLE accents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  region TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  key_features JSONB NOT NULL DEFAULT '[]',
  image_emoji TEXT NOT NULL DEFAULT '🎭',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE accents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Accents are viewable by everyone" ON accents FOR SELECT USING (true);

-- Lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accent_id UUID NOT NULL REFERENCES accents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL,
  lesson_order INT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('vowels', 'consonants', 'rhythm', 'intonation', 'phrases')),
  tips TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(accent_id, slug)
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lessons are viewable by everyone" ON lessons FOR SELECT USING (true);

-- Practice words/phrases
CREATE TABLE practice_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  ipa_transcription TEXT NOT NULL,
  accent_ipa TEXT NOT NULL,
  word_order INT NOT NULL,
  example_sentence TEXT,
  pronunciation_notes TEXT NOT NULL,
  mouth_position TEXT,
  tongue_placement TEXT,
  common_mistakes TEXT[] NOT NULL DEFAULT '{}',
  audio_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE practice_words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Practice words are viewable by everyone" ON practice_words FOR SELECT USING (true);

-- User progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  best_score INT DEFAULT 0,
  attempts INT NOT NULL DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Practice sessions
CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_word_id UUID NOT NULL REFERENCES practice_words(id) ON DELETE CASCADE,
  transcript TEXT,
  score INT NOT NULL DEFAULT 0,
  feedback JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own sessions" ON practice_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sessions" ON practice_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_lessons_accent_id ON lessons(accent_id);
CREATE INDEX idx_practice_words_lesson_id ON practice_words(lesson_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_practice_sessions_user_id ON practice_sessions(user_id);

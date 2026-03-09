/**
 * Generate high-quality audio files for all practice words and sentences
 * using Microsoft Edge's neural TTS voices.
 *
 * Usage: node scripts/generate-audio.mjs
 */

import { EdgeTTS } from "@andresaya/edge-tts";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Voice mapping — best neural voice for each accent
const ACCENT_VOICES = {
  "british-rp": { voice: "en-GB-SoniaNeural", rate: "-5%", pitch: "+0Hz" },
  cockney: { voice: "en-GB-RyanNeural", rate: "+0%", pitch: "+0Hz" },
  australian: { voice: "en-AU-NatashaNeural", rate: "+0%", pitch: "+0Hz" },
  "southern-us": { voice: "en-US-JennyNeural", rate: "-10%", pitch: "-2Hz" },
  irish: { voice: "en-IE-EmilyNeural", rate: "+0%", pitch: "+0Hz" },
  scottish: { voice: "en-GB-RyanNeural", rate: "-5%", pitch: "-3Hz" },
  "new-york": { voice: "en-US-GuyNeural", rate: "+5%", pitch: "+0Hz" },
  "standard-american": { voice: "en-US-AriaNeural", rate: "+0%", pitch: "+0Hz" },
};

// Parse accents data from the TS file
function parseAccentsData() {
  const src = fs.readFileSync(path.join(ROOT, "src/data/accents.ts"), "utf8");

  const accents = [];
  // Match each accent block
  const accentBlocks = src.split(/\n  \{[\s]*\n\s+name:/);

  for (let i = 1; i < accentBlocks.length; i++) {
    const block = "name:" + accentBlocks[i];
    const slugMatch = block.match(/slug:\s*"([^"]+)"/);
    if (!slugMatch) continue;
    const accentSlug = slugMatch[1];

    // Find all practice words in this accent block
    const words = [];
    const wordRegex = /word:\s*"([^"]+)"[\s\S]*?exampleSentence:\s*"([^"]+)"/g;
    let match;
    while ((match = wordRegex.exec(block)) !== null) {
      words.push({
        word: match[1],
        sentence: match[2],
      });
    }

    if (words.length > 0) {
      accents.push({ slug: accentSlug, words });
    }
  }

  return accents;
}

function sanitizeFilename(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

async function generateAudio(text, voice, rate, pitch, outputPath) {
  const tts = new EdgeTTS();
  await tts.synthesize(text, voice, { rate, pitch });
  // EdgeTTS.toFile appends the format extension automatically,
  // so strip .mp3 from our path to avoid double extension
  const pathWithoutExt = outputPath.replace(/\.mp3$/, '');
  await tts.toFile(pathWithoutExt);
}

async function main() {
  const accents = parseAccentsData();

  console.log(`Found ${accents.length} accents`);
  let totalFiles = 0;
  let skipped = 0;

  for (const accent of accents) {
    const config = ACCENT_VOICES[accent.slug];
    if (!config) {
      console.warn(`  No voice config for ${accent.slug}, skipping`);
      continue;
    }

    const audioDir = path.join(ROOT, "public/audio", accent.slug);
    fs.mkdirSync(audioDir, { recursive: true });

    console.log(`\n[${accent.slug}] ${accent.words.length} words — voice: ${config.voice}`);

    for (const { word, sentence } of accent.words) {
      // Generate word audio
      const wordFile = path.join(audioDir, `${sanitizeFilename(word)}.mp3`);
      if (fs.existsSync(wordFile)) {
        skipped++;
      } else {
        try {
          await generateAudio(word, config.voice, config.rate, config.pitch, wordFile);
          totalFiles++;
          process.stdout.write(`  ✓ ${word}\n`);
        } catch (err) {
          console.error(`  ✗ ${word}: ${err.message}`);
        }
      }

      // Generate sentence audio
      const sentenceFile = path.join(audioDir, `${sanitizeFilename(word)}-sentence.mp3`);
      if (fs.existsSync(sentenceFile)) {
        skipped++;
      } else {
        try {
          await generateAudio(sentence, config.voice, config.rate, config.pitch, sentenceFile);
          totalFiles++;
          process.stdout.write(`  ✓ "${sentence.slice(0, 40)}..."\n`);
        } catch (err) {
          console.error(`  ✗ sentence for ${word}: ${err.message}`);
        }
      }
    }
  }

  console.log(`\nDone! Generated ${totalFiles} files, skipped ${skipped} existing.`);
}

main().catch(console.error);

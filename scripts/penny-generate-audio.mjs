/**
 * penny-generate-audio.mjs
 *
 * Pre-bakes the encouragement phrases as MP3 files using Google Cloud TTS.
 * Only generates files that don't already exist — safe to re-run anytime.
 *
 * Output: public/santiago/audio/encouragement/{index}.mp3
 *
 * Usage:
 *   GOOGLE_TTS_API_KEY=your_key node scripts/penny-generate-audio.mjs
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import encouragement phrases
const { ENCOURAGEMENT } = await import(
  '../src/app/santiago-learns-english/chat-with-penny/_data/encouragement.js'
);

const OUTPUT_DIR = path.join(__dirname, '../public/santiago-learns-english/chat-with-penny/audio/encouragement');
const API_KEY    = process.env.GOOGLE_TTS_API_KEY;

if (!API_KEY) {
  console.error('Error: GOOGLE_TTS_API_KEY environment variable is not set.');
  process.exit(1);
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function generateAudio(text, outputPath) {
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input:       { text },
        voice:       { languageCode: 'en-US', name: 'en-US-Neural2-F' },
        audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95, pitch: 2.0 },
      }),
    }
  );

  if (!res.ok) throw new Error(`TTS API error: ${await res.text()}`);

  const { audioContent } = await res.json();
  fs.writeFileSync(outputPath, Buffer.from(audioContent, 'base64'));
}

console.log(`Generating ${ENCOURAGEMENT.length} encouragement phrases...\n`);

for (let i = 0; i < ENCOURAGEMENT.length; i++) {
  const text       = ENCOURAGEMENT[i];
  const outputPath = path.join(OUTPUT_DIR, `${i}.mp3`);

  if (fs.existsSync(outputPath)) {
    console.log(`  [skip] ${i}.mp3 — already exists`);
    continue;
  }

  try {
    await generateAudio(text, outputPath);
    console.log(`  [done] ${i}.mp3 — "${text}"`);
  } catch (err) {
    console.error(`  [fail] ${i}.mp3 — ${err.message}`);
  }
}

console.log('\nDone.');

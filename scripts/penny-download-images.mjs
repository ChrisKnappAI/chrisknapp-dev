/**
 * penny-download-images.mjs
 *
 * Downloads one photo per vocab word from Unsplash.
 * ALL images go inside: public/santiago-learns-english/chat-with-penny/images/{lesson.id}/
 *
 * Does NOT touch any other app folders (junk-food, body-parts, chess, etc.)
 * Junk food is skipped — it has an imageMap pointing to its existing folder.
 *
 * Only downloads images that don't already exist — safe to re-run anytime.
 *
 * Usage:
 *   UNSPLASH_ACCESS_KEY=your_key node scripts/penny-download-images.mjs
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envFile = path.join(__dirname, '../.env.local');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

const BASE_DIR   = path.join(__dirname, '../public/santiago-learns-english/chat-with-penny/images');
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const { LESSONS } = await import(
  '../src/app/santiago-learns-english/chat-with-penny/_data/lessons.js'
);

if (!ACCESS_KEY) {
  console.error('Error: UNSPLASH_ACCESS_KEY environment variable is not set.');
  process.exit(1);
}

async function unsplashSearch(searchTerm) {
  while (true) {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=1&orientation=squarish`,
      { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
    );

    if (res.status === 429 || (res.status !== 200 && (await res.text()).includes('Rate Limit'))) {
      const waitMins = 61;
      console.log(`\n  [rate limit] Unsplash limit hit — waiting ${waitMins} minutes before retrying...`);
      await new Promise(r => setTimeout(r, waitMins * 60 * 1000));
      continue;
    }

    if (!res.ok) throw new Error(`Unsplash search failed: ${res.status}`);
    return await res.json();
  }
}

async function downloadImage(word, searchTerm, outputDir) {
  const filename   = `${word.replace(/\s+/g, '-')}.jpg`;
  const outputPath = path.join(outputDir, filename);

  if (fs.existsSync(outputPath)) {
    console.log(`    [skip] ${filename} — already exists`);
    return;
  }

  const { results } = await unsplashSearch(searchTerm);

  if (!results.length) {
    console.warn(`    [warn] "${word}" — no Unsplash results for "${searchTerm}"`);
    return;
  }

  const imageRes = await fetch(results[0].urls.small);
  if (!imageRes.ok) throw new Error(`Image fetch failed`);

  fs.writeFileSync(outputPath, Buffer.from(await imageRes.arrayBuffer()));
  console.log(`    [done] ${filename}`);
}

for (const lesson of LESSONS) {
  if (lesson.imageMap) {
    console.log(`\n[${lesson.id}] skipped — uses existing imageMap`);
    continue;
  }

  const hasPhotoTemplate = lesson.templates.some(
    t => t.expects === 'photo-name' || t.expects === 'photo-pick'
  );
  if (!hasPhotoTemplate) continue;

  const outputDir = path.join(BASE_DIR, lesson.id);
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`\n[${lesson.id}] → public/santiago-learns-english/chat-with-penny/images/${lesson.id}/`);

  for (const word of lesson.vocab) {
    const query = lesson.searchQuery?.[word];

    if (query === null) {
      console.log(`    [manual] "${word}" — drop image in manually as ${word.replace(/\s+/g, '-')}.jpg`);
      continue;
    }

    try {
      await downloadImage(word, query ?? word, outputDir);
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(`    [fail] "${word}" — ${err.message}`);
    }
  }
}

console.log('\nDone. Review all images before deploying.');

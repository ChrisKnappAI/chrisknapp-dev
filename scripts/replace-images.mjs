/**
 * replace-images.mjs
 * Fetches replacement images for the 24 items that failed due to rate limiting.
 * Overwrites the existing file.
 */
import fs from 'fs';

const KEY  = 'ZZLqZ8tttGn9o25u4ncWMJ8gsR10wE7X1Juf35sMYmY';
const BASE = 'public/santiago-learns-english/chat-with-penny/images';

const REPLACEMENTS = [
  // ── Body parts ───────────────────────────────────────────────────────────
  { topic:'body-parts', word:'chest',   query:'person chest torso front',          idx:0 },
  { topic:'body-parts', word:'toe',     query:'bare toes close up foot',           idx:0 },
  { topic:'body-parts', word:'back',    query:'person back muscles stretch',        idx:0 },

  // ── Fruits ───────────────────────────────────────────────────────────────
  { topic:'fruits', word:'orange',      query:'orange fruit slice juicy',           idx:0 },
  { topic:'fruits', word:'grape',       query:'bunch of grapes purple red',         idx:0 },

  // ── Breakfast ────────────────────────────────────────────────────────────
  { topic:'breakfast', word:'water',        query:'glass of water clear fresh',     idx:0 },
  { topic:'breakfast', word:'orange juice', query:'orange juice glass breakfast',   idx:0 },
  { topic:'breakfast', word:'yogurt',       query:'yogurt bowl fresh fruit',        idx:0 },
  { topic:'breakfast', word:'bread',        query:'fresh bread loaf sliced',        idx:0 },
  { topic:'breakfast', word:'cereal',       query:'cereal bowl milk breakfast',     idx:0 },
  { topic:'breakfast', word:'coffee',       query:'hot coffee cup morning',         idx:0 },
  { topic:'breakfast', word:'milk',         query:'glass of milk white',            idx:0 },
  { topic:'breakfast', word:'sugar',        query:'sugar cubes white bowl',         idx:0 },
  { topic:'breakfast', word:'toast',        query:'toast bread breakfast plate',    idx:0 },
  { topic:'breakfast', word:'butter',       query:'butter on bread slice',          idx:0 },
  { topic:'breakfast', word:'jelly',        query:'strawberry jam jelly jar',       idx:0 },
  { topic:'breakfast', word:'avocado',      query:'avocado halved green ripe',      idx:0 },
  { topic:'breakfast', word:'cheese',       query:'cheese block yellow slice',      idx:0 },

  // ── Weather ──────────────────────────────────────────────────────────────
  { topic:'weather', word:'stormy',     query:'dark storm clouds lightning sky',    idx:0 },
  { topic:'weather', word:'windy',      query:'windy day leaves blowing autumn',    idx:0 },
  { topic:'weather', word:'snowy',      query:'snowy winter landscape white tree',  idx:0 },

  // ── Pets ─────────────────────────────────────────────────────────────────
  { topic:'pets', word:'parrot',        query:'colorful parrot bird tropical',      idx:0 },
  { topic:'pets', word:'fish',          query:'colorful tropical fish aquarium',    idx:0 },

  // ── Zoo animals ──────────────────────────────────────────────────────────
  { topic:'zoo-animals', word:'lion',   query:'lion pride savanna roar',            idx:0 },
];

async function fetchImage(query, resultIndex) {
  const url  = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${resultIndex + 2}`;
  const res  = await fetch(url, { headers: { Authorization: `Client-ID ${KEY}` } });
  const data = await res.json();
  const result = data.results?.[resultIndex] ?? data.results?.[0];
  if (!result) return null;
  const img = await fetch(result.urls.small);
  return img.ok ? Buffer.from(await img.arrayBuffer()) : null;
}

let ok = 0, fail = 0;
for (const { topic, word, query, idx } of REPLACEMENTS) {
  const filename = word.replace(/\s+/g, '-') + '.jpg';
  const outPath  = `${BASE}/${topic}/${filename}`;

  try {
    const buf = await fetchImage(query, idx);
    if (!buf) { console.log(`[warn] no result  — ${topic}/${word}`); fail++; continue; }
    fs.writeFileSync(outPath, buf);
    console.log(`[done] ${topic}/${word}`);
    ok++;
    await new Promise(r => setTimeout(r, 300));
  } catch (e) {
    console.error(`[fail] ${topic}/${word} — ${e.message}`);
    fail++;
  }
}

console.log(`\nDone. ${ok} replaced, ${fail} failed.`);

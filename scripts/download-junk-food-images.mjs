import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'santiago-learns-english', 'junk-food');

const UA = 'SantiagoLearnsEnglish/1.0 (chrisknappai@gmail.com) Node.js/20';

const FOODS = [
  { id: 'pizza',         wiki: 'Pizza' },
  { id: 'hamburger',     wiki: 'Hamburger' },
  { id: 'french-fries',  wiki: 'French_fries' },
  { id: 'fried-chicken', wiki: 'Fried_chicken' },
  { id: 'soda',          wiki: 'Soft_drink' },
  { id: 'chips',         wiki: 'Potato_chip' },
  { id: 'candy',         wiki: 'Candy' },
  { id: 'cupcake',       wiki: 'Cupcake' },
  { id: 'ice-cream',     wiki: 'Ice_cream' },
  { id: 'milkshake',     wiki: 'Milkshake' },
  { id: 'hot-dog',       wiki: 'Hot_dog' },
  { id: 'chocolate-bar', wiki: 'Chocolate_bar' },
  { id: 'donut',         wiki: 'Doughnut' },
  { id: 'popcorn',       wiki: 'Popcorn' },
  { id: 'cake',          wiki: 'Cake' },
  { id: 'nuggets',       wiki: 'Chicken_nugget' },
  { id: 'pancakes',      wiki: 'Pancake' },
  { id: 'cotton-candy',  wiki: 'Cotton_candy' },
  { id: 'gum',           wiki: 'Chewing_gum' },
  { id: 'lollipop',      wiki: 'Lollipop' },
  { id: 'gummy-bear',    wiki: 'Gummy_bear' },
  { id: 'marshmallow',   wiki: 'Marshmallow' },
  { id: 'popsicle',      wiki: 'Ice_pop' },
  { id: 'brownie',       wiki: 'Chocolate_brownie' },
  { id: 'onion-rings',   wiki: 'Onion_ring' },
  { id: 'corn-dog',      wiki: 'Corn_dog' },
  { id: 'cookies',       wiki: 'Cookie' },
  { id: 'pretzel',       wiki: 'Pretzel' },
  { id: 'syrup',         wiki: 'Maple_syrup' },
  { id: 'whipped-cream', wiki: 'Whipped_cream' },
];

function get(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': UA, 'Accept': 'application/json' } }, res => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects > 0) {
        return get(res.headers.location, redirects - 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
  });
}

function downloadBinary(url, dest, redirects = 10) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': UA } }, res => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects > 0) {
        return downloadBinary(res.headers.location, dest, redirects - 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const ws = fs.createWriteStream(dest);
      res.pipe(ws);
      ws.on('finish', resolve);
      ws.on('error', reject);
    });
    req.on('error', reject);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchImageUrl(wikiTitle) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
  const buf = await get(url);
  const data = JSON.parse(buf.toString('utf8'));
  const src = data?.thumbnail?.source || data?.originalimage?.source;
  if (!src) throw new Error(`No image in summary for ${wikiTitle}`);
  // Bump to 400px wide
  return src.replace(/\/\d+px-/, '/400px-');
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const failed = [];

  for (let i = 0; i < FOODS.length; i++) {
    const food = FOODS[i];
    const dest = path.join(OUT_DIR, `${food.id}.jpg`);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`[${i+1}/${FOODS.length}] SKIP  ${food.id} (already exists)`);
      continue;
    }

    try {
      process.stdout.write(`[${i+1}/${FOODS.length}] ${food.id} ... `);
      const imgUrl = await fetchImageUrl(food.wiki);
      // Normalize extension
      const ext = imgUrl.match(/\.(png|jpg|jpeg|webp|gif)/i)?.[1]?.toLowerCase() || 'jpg';
      const finalDest = path.join(OUT_DIR, `${food.id}.${ext}`);
      await downloadBinary(imgUrl, finalDest);
      console.log(`OK (${ext})`);
    } catch (err) {
      console.log(`FAIL — ${err.message}`);
      failed.push({ id: food.id, error: err.message });
    }

    // Polite delay — 1.5s between requests
    if (i < FOODS.length - 1) await sleep(1500);
  }

  console.log('\n=== Done ===');
  if (failed.length) {
    console.log('Failed:');
    failed.forEach(f => console.log(`  ${f.id}: ${f.error}`));
  } else {
    console.log('All images downloaded successfully.');
  }
}

main().catch(console.error);

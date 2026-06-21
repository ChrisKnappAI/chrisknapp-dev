// Seeds the catchphrases table from batch JSON files.
// - Runs backup first (CLAUDE.md hard rule)
// - Deduplicates within input
// - Uses upsert so re-running adds new phrases without erroring on existing

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://kkwafiscyshdailnourb.supabase.co'
const ENV_PATH = 'C:\\KnappFiles\\chrisknapp-dev\\.env'
const SEED_DIR = 'C:\\KnappFiles\\chrisknapp-dev\\scripts\\catchphrase-seed'

function readEnv(p) {
  return fs.readFileSync(p, 'utf-8').split('\n').reduce((acc, line) => {
    const m = line.match(/^([^=]+)=(.*)$/)
    if (m) acc[m[1].trim()] = m[2].trim()
    return acc
  }, {})
}

const env = readEnv(ENV_PATH)
const sb = createClient(SUPABASE_URL, env.SUPABASE_SERVICE_KEY)

async function main() {
  console.log('Step 1: Running Supabase backup...')
  try {
    execSync('node C:\\KnappFiles\\chrisknapp-dev\\scripts\\backup-db.js', { stdio: 'inherit' })
  } catch (e) {
    console.error('Backup failed — aborting.')
    process.exit(1)
  }

  console.log('\nStep 2: Loading batch files from', SEED_DIR)
  const files = fs.readdirSync(SEED_DIR)
    .filter(f => f.startsWith('batch-') && f.endsWith('.json'))
    .sort()

  const all = []
  for (const f of files) {
    const rows = JSON.parse(fs.readFileSync(path.join(SEED_DIR, f), 'utf8'))
    console.log(`  ${f} — ${rows.length} phrases`)
    all.push(...rows)
  }

  console.log('\nStep 3: Deduplicating...')
  const seen = new Set()
  const unique = []
  for (const r of all) {
    const key = r.english.trim() + '|' + r.spanish.trim()
    if (seen.has(key)) continue
    seen.add(key)
    unique.push({
      english: r.english.trim(),
      spanish: r.spanish.trim(),
      cefr_level: r.cefr_level,
    })
  }
  console.log(`  Input: ${all.length}, unique: ${unique.length}, dupes removed: ${all.length - unique.length}`)

  console.log('\nStep 4: Upserting into catchphrases (batches of 500)...')
  const BATCH = 500
  let inserted = 0
  for (let i = 0; i < unique.length; i += BATCH) {
    const batch = unique.slice(i, i + BATCH)
    const { error } = await sb
      .from('catchphrases')
      .upsert(batch, { onConflict: 'english,spanish', ignoreDuplicates: true })
    if (error) {
      console.error(`Batch ${Math.floor(i / BATCH) + 1} failed:`, error.message)
      process.exit(1)
    }
    inserted += batch.length
    process.stdout.write(`  ${inserted}/${unique.length}\r`)
  }

  console.log('\n\nStep 5: Verifying count in table...')
  const { count, error } = await sb
    .from('catchphrases')
    .select('*', { count: 'exact', head: true })
  if (error) {
    console.error('Count failed:', error.message)
  } else {
    console.log(`  catchphrases now contains ${count} rows`)
  }

  console.log('\nDone.')
}

main().catch(e => { console.error(e); process.exit(1) })

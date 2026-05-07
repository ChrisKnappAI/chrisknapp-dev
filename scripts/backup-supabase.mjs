// Back up all Supabase tables to a timestamped local folder.
// Run BEFORE any write operation: node scripts/backup-supabase.mjs
//
// Backups land in: C:\KnappFiles\chrisknapp-dev-data-to-import\backups\<timestamp>\

import { createClient } from '@supabase/supabase-js'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const supabase = createClient(
  'https://kkwafiscyshdailnourb.supabase.co',
  'sb_publishable_qRH4PzN7D0_lOOapNGIgqA_KCsOjI_w'
)

const TABLES = [
  'meal_ingredient_lookup',
  'food_log',
  'net_worth_snapshots',
  'health_body_stats',
  'health_sleep_daily',
  'health_workouts',
  'health_activity_daily',
  'care_log_chris',
  'goal_tracker_natalie',
]

const BACKUP_ROOT = 'C:/KnappFiles/chrisknapp-dev-data-to-import/backups'

// Build timestamp: 2026-05-06_14-30-00
const now  = new Date()
const pad  = n => String(n).padStart(2, '0')
const ts   = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
const dest = join(BACKUP_ROOT, ts)

mkdirSync(dest, { recursive: true })
console.log(`\nBacking up to: ${dest}\n`)

for (const table of TABLES) {
  // Paginate in case of large tables (food_log can be big)
  let rows = [], page = 0
  while (true) {
    const { data, error } = await supabase
      .from(table).select('*')
      .range(page * 1000, page * 1000 + 999)
    if (error) { console.log(`  ✗ ${table.padEnd(28)} ${error.message}`); break }
    rows = rows.concat(data)
    if (data.length < 1000) break
    page++
  }
  writeFileSync(join(dest, `${table}.json`), JSON.stringify(rows, null, 2))
  console.log(`  ✓ ${table.padEnd(28)} ${rows.length} rows`)
}

console.log(`\nDone. Backup: ${ts}`)

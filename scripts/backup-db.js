// Exports all Supabase tables to CSV, one dated folder per run.
// Run manually: node scripts/backup-db.js
// Scheduled: nightly via Windows Task Scheduler

const { createClient } = require('@supabase/supabase-js')
const fs   = require('fs')
const path = require('path')

const SUPABASE_URL = 'https://kkwafiscyshdailnourb.supabase.co'
const SUPABASE_KEY = 'sb_publishable_qRH4PzN7D0_lOOapNGIgqA_KCsOjI_w'
const BACKUP_ROOT  = 'C:\\Users\\CK092\\chrisknapp-dev-data-backup'

const TABLES = [
  'net_worth_snapshots',
  'meal_ingredient_lookup',
  'food_log',
  'goal_tracker_chris',
  'goal_tracker_natalie',
  'health_body_stats',
  'health_activity_daily',
  'health_sleep_daily',
  'health_workouts',
]

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

function toCSV(rows) {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const escape = v => {
    if (v == null) return ''
    const s = String(v)
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [
    headers.join(','),
    ...rows.map(r => headers.map(h => escape(r[h])).join(',')),
  ].join('\r\n')
}

async function fetchAll(tableName) {
  const PAGE_SIZE = 1000
  let all = []
  let offset = 0
  while (true) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .range(offset, offset + PAGE_SIZE - 1)
    if (error) throw new Error(`${tableName}: ${error.message}`)
    all = all.concat(data)
    if (data.length < PAGE_SIZE) break
    offset += PAGE_SIZE
  }
  return all
}

async function main() {
  const date = new Date().toISOString().slice(0, 10)
  const dir  = path.join(BACKUP_ROOT, date)
  fs.mkdirSync(dir, { recursive: true })

  console.log(`Backup → ${dir}\n`)

  for (const tableName of TABLES) {
    process.stdout.write(`  ${tableName}... `)
    const rows = await fetchAll(tableName)
    fs.writeFileSync(path.join(dir, `${tableName}.csv`), toCSV(rows), 'utf-8')
    console.log(`${rows.length} rows`)
  }

  console.log('\nDone.')
}

main().catch(e => { console.error('\nERROR:', e.message); process.exit(1) })

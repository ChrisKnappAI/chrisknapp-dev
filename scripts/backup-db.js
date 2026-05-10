// Exports all Supabase tables to CSV, one dated folder per run.
// Run manually: node scripts/backup-db.js
// Scheduled: nightly via Windows Task Scheduler

const { createClient } = require('@supabase/supabase-js')
const fs   = require('fs')
const path = require('path')

const SUPABASE_URL = 'https://kkwafiscyshdailnourb.supabase.co'
const SUPABASE_KEY = 'sb_publishable_qRH4PzN7D0_lOOapNGIgqA_KCsOjI_w'
const BACKUP_ROOT  = 'C:\\KnappFiles\\chrisknapp-dev-data-backup'
const ENV_PATH     = 'C:\\KnappFiles\\chrisknapp-dev-data-to-import\\.env'

function readEnvFile(p) {
  if (!fs.existsSync(p)) return {}
  return fs.readFileSync(p, 'utf-8').split('\n').reduce((acc, line) => {
    const m = line.match(/^([^=]+)=(.*)$/)
    if (m) acc[m[1].trim()] = m[2].trim()
    return acc
  }, {})
}

const env        = readEnvFile(ENV_PATH)
const SERVICE_KEY = env.SUPABASE_SERVICE_KEY || SUPABASE_KEY

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function getPublicTables() {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` }
  })
  if (!resp.ok) throw new Error(`Schema fetch failed: ${resp.statusText}`)
  const spec = await resp.json()
  return Object.keys(spec.definitions || {}).sort()
}

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
  const tables = await getPublicTables()

  const now = new Date()
  const pad = n => String(n).padStart(2, '0')
  const ts  = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
  const dir = path.join(BACKUP_ROOT, ts)
  fs.mkdirSync(dir, { recursive: true })

  console.log(`Backup → ${dir}`)
  console.log(`Tables: ${tables.join(', ')}\n`)

  for (const tableName of tables) {
    process.stdout.write(`  ${tableName}... `)
    const rows = await fetchAll(tableName)
    fs.writeFileSync(path.join(dir, `${tableName}.csv`), toCSV(rows), 'utf-8')
    console.log(`${rows.length} rows`)
  }

  console.log('\nDone.')
}

main().catch(e => { console.error('\nERROR:', e.message); process.exit(1) })

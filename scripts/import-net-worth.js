// Imports all net-worth EOM markdown snapshots into Supabase net_worth_snapshots table.
// Safe to re-run — upserts on period_date so no duplicates.
// Run with: node scripts/import-net-worth.js

const { createClient } = require('@supabase/supabase-js')
const fs   = require('fs')
const path = require('path')

const SUPABASE_URL = 'https://kkwafiscyshdailnourb.supabase.co'
const SUPABASE_KEY = 'sb_publishable_qRH4PzN7D0_lOOapNGIgqA_KCsOjI_w'
const supabase     = createClient(SUPABASE_URL, SUPABASE_KEY)

const SNAPSHOTS_DIR = 'C:\\AI Executive Assistants\\Personal EA\\finances\\net-worth-eom-snapshots'

const LABEL_MAP = {
  'Total Net Worth': 'total_net_worth',
  'Net Cash':        'net_cash',
  'Net Investments': 'net_investments',
  '— 401K (Fidelity)':    'fidelity_401k',
  '— Betterment':          'betterment',
  '— Roth IRA (Vanguard)': 'roth_ira',
  '— HSA':                 'hsa',
  '— KEL Savings':         'kel_savings',
  '— Debt (liability)':    'debt',
  'Home Equity':           'home_equity',
  '— Home Value':          'home_value',
  '— Mortgage Balance':    'mortgage_balance',
}

function parseMoney(str) {
  if (!str || !str.trim()) return null
  const negative = str.includes('(')
  const num = parseFloat(str.replace(/[$,() *]/g, ''))
  if (isNaN(num)) return null
  return negative ? -num : num
}

function eomDate(year, month) {
  const d = new Date(parseInt(year), parseInt(month), 0)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function parseSnapshot(filepath) {
  const filename = path.basename(filepath)
  const [year, month] = filename.split('-')

  const lines  = fs.readFileSync(filepath, 'utf-8').split('\n')
  const row    = { period_date: eomDate(year, month) }

  for (const line of lines) {
    const match = line.match(/^\|\s*\*{0,2}(.+?)\*{0,2}\s*\|\s*\*{0,2}(.+?)\*{0,2}\s*\|/)
    if (!match) continue
    const label = match[1].trim()
    const value = match[2].trim()
    const col   = LABEL_MAP[label]
    if (col) row[col] = parseMoney(value)
  }

  return row
}

async function main() {
  const files = fs.readdirSync(SNAPSHOTS_DIR)
    .filter(f => f.endsWith('-eom.md'))
    .sort()

  console.log(`Found ${files.length} snapshot files\n`)

  const rows = files.map(f => parseSnapshot(path.join(SNAPSHOTS_DIR, f)))

  // Preview first and last
  console.log('First:', rows[0])
  console.log('Last: ', rows[rows.length - 1])
  console.log()

  const { error } = await supabase
    .from('net_worth_snapshots')
    .upsert(rows, { onConflict: 'period_date' })

  if (error) { console.error('ERROR:', error.message); process.exit(1) }
  console.log(`✓ ${rows.length} snapshots upserted successfully.`)
}

main()

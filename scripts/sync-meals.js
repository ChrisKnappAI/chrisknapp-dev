// Syncs meal-ingredient-lookup.csv → Supabase meal_ingredient_lookup table.
// Upserts all rows — inserts new, updates existing (matched by meal + meal_version + ingredient).
// Run with: node scripts/sync-meals.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const SUPABASE_URL = 'https://kkwafiscyshdailnourb.supabase.co'
const SUPABASE_KEY = 'sb_publishable_qRH4PzN7D0_lOOapNGIgqA_KCsOjI_w'
const supabase    = createClient(SUPABASE_URL, SUPABASE_KEY)

const CSV_PATH = 'C:\\KnappFiles\\chrisknapp-dev-data-to-import\\data-drop\\meal_ingredient_lookup\\meal_ingredient_lookup.csv'

// Handles quoted fields containing commas (standard CSV spec).
function parseCSVLine(line) {
  const values = []
  let current  = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  values.push(current.trim())
  return values
}

function parseCSV(filepath) {
  const lines   = fs.readFileSync(filepath, 'utf-8').split('\n').filter(l => l.trim())
  const headers = parseCSVLine(lines[0]).filter(h => h)
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line)
    const row    = {}
    headers.forEach((h, i) => { row[h] = values[i] || '' })
    return row
  }).filter(r => r.meal && r.ingredient)
}

const NUMERIC_COLS = ['id', 'serving_size', 'serving_calories', 'serving_fat', 'serving_carbs', 'serving_protein', 'expected_amount', 'user_percent']

function validate(csvRows) {
  const errors = []
  csvRows.forEach((r, i) => {
    NUMERIC_COLS.forEach(col => {
      const val = r[col]
      if (val !== '' && isNaN(Number(val))) {
        errors.push(`Row ${i + 2} id=${r.id}: column "${col}" has non-numeric value "${val}" — likely a CSV parse error (quoted field with comma?)`)
      }
    })
  })
  return errors
}

async function main() {
  console.log('Reading CSV...')
  const csvRows = parseCSV(CSV_PATH)
  console.log(`  ${csvRows.length} rows in CSV`)

  const errors = validate(csvRows)
  if (errors.length) {
    console.error(`\nVALIDATION FAILED — ${errors.length} error(s). Nothing written to Supabase.\n`)
    errors.forEach(e => console.error(' ', e))
    process.exit(1)
  }

  const data = csvRows.map(r => ({
    id:               parseInt(r['id']),
    meal:             r['meal'],
    meal_version:     r['meal_version'] || 'V1',
    ingredient:       r['ingredient'],
    serving_metric:   r['serving_metric'],
    serving_size:     parseFloat(r['serving_size'])     || 1,
    serving_calories: parseFloat(r['serving_calories']) || 0,
    serving_fat:      parseFloat(r['serving_fat'])      || 0,
    serving_carbs:    parseFloat(r['serving_carbs'])    || 0,
    serving_protein:  parseFloat(r['serving_protein'])  || 0,
    expected_amount:  parseFloat(r['expected_amount'])  || 0,
    user_percent:     parseFloat(r['user_percent'])     || 1.0,
  }))

  const csvIds = new Set(data.map(r => r.id))

  const { data: existing, error: fetchErr } = await supabase
    .from('meal_ingredient_lookup')
    .select('id')
  if (fetchErr) { console.error('ERROR:', fetchErr.message); process.exit(1) }

  const existingIds = new Set(existing.map(r => r.id))
  const added    = data.filter(r => !existingIds.has(r.id)).length
  const updated  = data.filter(r => existingIds.has(r.id)).length
  const removed  = [...existingIds].filter(id => !csvIds.has(id)).length

  console.log('Upserting to Supabase...')
  const { error } = await supabase
    .from('meal_ingredient_lookup')
    .upsert(data, { onConflict: 'id' })
  if (error) { console.error('ERROR:', error.message); process.exit(1) }

  console.log(`  ${added} added, ${updated} updated, ${removed} in Supabase but not in CSV`)
  console.log(`✓ Done.`)
}

main()

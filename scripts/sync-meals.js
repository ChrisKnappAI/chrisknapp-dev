// Syncs meal-ingredient-lookup.csv → Supabase meal_ingredient_lookup table.
// Only inserts rows that don't already exist (matched by meal + meal_version + ingredient).
// Run with: node scripts/sync-meals.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const SUPABASE_URL = 'https://kkwafiscyshdailnourb.supabase.co'
const SUPABASE_KEY = 'sb_publishable_qRH4PzN7D0_lOOapNGIgqA_KCsOjI_w'
const supabase    = createClient(SUPABASE_URL, SUPABASE_KEY)

const CSV_PATH = 'C:\\Users\\CK092\\chrisknapp-dev-data-to-import\\data-drop\\meal_ingredient_lookup\\meal-ingredient-lookup.csv'

function parseCSV(filepath) {
  const lines   = fs.readFileSync(filepath, 'utf-8').split('\n').filter(l => l.trim())
  const headers = lines[0].split(',').map(h => h.trim()).filter(h => h)
  return lines.slice(1).map(line => {
    const values = line.split(',')
    const row    = {}
    headers.forEach((h, i) => { row[h] = (values[i] || '').trim() })
    return row
  }).filter(r => r.Meal && r.Ingredient)
}

async function main() {
  console.log('Reading CSV...')
  const csvRows = parseCSV(CSV_PATH)
  console.log(`  ${csvRows.length} rows found in CSV`)

  console.log('Fetching existing rows from Supabase...')
  const { data: existing, error: fetchErr } = await supabase
    .from('meal_ingredient_lookup')
    .select('meal, meal_version, ingredient')
  if (fetchErr) { console.error('  ERROR:', fetchErr.message); process.exit(1) }
  console.log(`  ${existing.length} rows already in Supabase`)

  const existingKeys = new Set(
    existing.map(r => `${r.meal}|${r.meal_version}|${r.ingredient}`)
  )

  const newRows = csvRows.filter(r => {
    const key = `${r['Meal']}|${r['Meal-Version'] || 'V1'}|${r['Ingredient']}`
    return !existingKeys.has(key)
  })

  if (newRows.length === 0) {
    console.log('\nNothing new — Supabase is already up to date.')
    return
  }

  console.log(`\n${newRows.length} new row(s) to insert:`)
  newRows.forEach(r =>
    console.log(`  + ${r['Meal']} (${r['Meal-Version'] || 'V1'}) — ${r['Ingredient']}`)
  )

  const data = newRows.map(r => ({
    meal:               r['Meal'],
    meal_version:       r['Meal-Version'] || 'V1',
    ingredient:         r['Ingredient'],
    serving_metric:     r['Serving-Metric'],
    serving_size:       parseFloat(r['Serving-Size'])           || 1,
    serving_calories:   parseFloat(r['Serving-Calories'])       || 0,
    serving_fat:        parseFloat(r['Serving-Fat'])            || 0,
    serving_carbs:      parseFloat(r['Serving-Carbs'])          || 0,
    serving_protein:    parseFloat(r['Serving-Protein'])        || 0,
    expected_amount:    parseFloat(r['Expected-Amount'])        || 0,
    user_percent: parseFloat(r['User-Percent']) || 1.0,
  }))

  const { error: insertErr } = await supabase.from('meal_ingredient_lookup').insert(data)
  if (insertErr) { console.error('\nERROR inserting:', insertErr.message); process.exit(1) }

  console.log(`\n✓ ${data.length} ingredient(s) inserted successfully.`)
}

main()

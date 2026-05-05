// One-time migration: loads existing CSV data into Supabase
// Run with: node scripts/migrate.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const SUPABASE_URL = 'https://kkwafiscyshdailnourb.supabase.co'
const SUPABASE_KEY = 'sb_publishable_qRH4PzN7D0_lOOapNGIgqA_KCsOjI_w'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const LOOKUP_PATH = 'C:\\AI Executive Assistants\\Personal EA\\projects\\food-tracker\\meal-ingredient-lookup.csv'
const LOG_PATH    = 'C:\\AI Executive Assistants\\Personal EA\\projects\\food-tracker\\logs\\ingredient_log.csv'

function parseCSV(filepath) {
  const lines = fs.readFileSync(filepath, 'utf-8').split('\n').filter(l => l.trim())
  const headers = lines[0].split(',').map(h => h.trim())
  return lines.slice(1).map(line => {
    const values = line.split(',')
    const row = {}
    headers.forEach((h, i) => { row[h] = (values[i] || '').trim() })
    return row
  })
}

function parseDate(str) {
  if (!str) return null
  if (str.includes('/')) {
    const [m, d, y] = str.split('/')
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`
  }
  return str.split('T')[0]
}

async function migrateLookup() {
  console.log('Migrating meal_ingredient_lookup...')
  const rows = parseCSV(LOOKUP_PATH).filter(r => r.Meal && r.Ingredient)

  const data = rows.map(r => ({
    meal:              r['Meal'],
    meal_version:      r['Meal-Version'] || 'V1',
    ingredient:        r['Ingredient'],
    serving_metric:    r['Serving-Metric'],
    serving_size:      parseFloat(r['Serving-Size'])      || 1,
    serving_calories:  parseFloat(r['Serving-Calories'])  || 0,
    serving_fat:       parseFloat(r['Serving-Fat'])       || 0,
    serving_carbs:     parseFloat(r['Serving-Carbs'])     || 0,
    serving_protein:   parseFloat(r['Serving-Protein'])   || 0,
    expected_amount:   parseFloat(r['Expected-Amount'])   || 0,
    expected_chris_pct: parseFloat(r['Expected-Chris-Percent']) || 1.0,
  }))

  const { error } = await supabase.from('meal_ingredient_lookup').insert(data)
  if (error) { console.error('  ERROR:', error.message); return }
  console.log(`  ✓ ${data.length} ingredients inserted`)
}

async function migrateFoodLog() {
  console.log('Migrating food_log (Chris)...')
  const logRows    = parseCSV(LOG_PATH).filter(r => r.Meal && r.Ingredient && r.Date)
  const lookupRows = parseCSV(LOOKUP_PATH).filter(r => r.Meal && r.Ingredient)

  // Build serving size lookup map
  const servingMap = {}
  lookupRows.forEach(r => {
    servingMap[`${r['Meal']}|${r['Meal-Version']}|${r['Ingredient']}`] = parseFloat(r['Serving-Size']) || 1
  })

  const data = logRows.map(r => {
    const key = `${r['Meal']}|${r['Meal-Version']}|${r['Ingredient']}`
    const logDate = parseDate(r['Date'])
    return {
      user_name:         'chris',
      log_date:          logDate,
      logged_at:         `${logDate}T${r['Time']}`,
      meal:              r['Meal'],
      meal_version:      r['Meal-Version'] || 'V1',
      ingredient:        r['Ingredient'],
      serving_metric:    r['Serving-Metric'],
      serving_size:      servingMap[key] || 1,
      actual_amount:     parseFloat(r['Actual-Amount'])      || 0,
      user_percent:      parseFloat(r['Chris-Percent'])      || 1.0,
      servings_consumed: parseFloat(r['Servings-Consumed'])  || 0,
      calories:          parseFloat(r['Calories'])           || 0,
      fat:               parseFloat(r['Fat'])                || 0,
      carbs:             parseFloat(r['Carbs'])              || 0,
      protein:           parseFloat(r['Protein'])            || 0,
      is_cheat:          r['Is-Cheat'] === '1',
    }
  })

  const { error } = await supabase.from('food_log').insert(data)
  if (error) { console.error('  ERROR:', error.message); return }
  console.log(`  ✓ ${data.length} log entries inserted (all tagged as chris)`)
}

async function main() {
  await migrateLookup()
  await migrateFoodLog()
  console.log('\nMigration complete.')
}

main()

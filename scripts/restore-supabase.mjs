// Restore Supabase tables from a local backup.
//
// Usage:
//   node scripts/restore-supabase.mjs                         — list all backups
//   node scripts/restore-supabase.mjs <timestamp>             — restore all tables
//   node scripts/restore-supabase.mjs <timestamp> <table>     — restore one table
//
// Timestamps can be partial: "2026-05-06" matches the first backup on that date.

import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

const supabase = createClient(
  'https://kkwafiscyshdailnourb.supabase.co',
  'sb_publishable_qRH4PzN7D0_lOOapNGIgqA_KCsOjI_w'
)

const BACKUP_ROOT = 'C:/Users/CK092/chrisknapp-dev-data-to-import/backups'

// Primary key for each table — used to delete all existing rows before restore
const TABLE_PK = {
  meal_ingredient_lookup: 'id',
  food_log:              'id',
  net_worth_snapshots:   'id',
  health_body_stats:     'date',
  health_sleep_daily:    'date',
  health_workouts:       'id',
  health_activity_daily: 'date',
}

// These tables have database-generated IDs — strip id on re-insert so
// Postgres auto-assigns new ones (avoids "cannot insert into generated column" errors)
const STRIP_ID = new Set(['health_workouts', 'food_log'])

const [,, targetTs, targetTable] = process.argv

// ── List mode ──────────────────────────────────────────────────
if (!targetTs) {
  const backups = readdirSync(BACKUP_ROOT)
    .filter(f => !f.startsWith('.'))
    .sort()
    .reverse()
  console.log(`\nAvailable backups (${backups.length}):\n`)
  backups.forEach(b => console.log(`  ${b}`))
  console.log('\nUsage: node scripts/restore-supabase.mjs <timestamp> [table]')
  process.exit(0)
}

// ── Find matching backup ───────────────────────────────────────
const backups = readdirSync(BACKUP_ROOT).filter(f => !f.startsWith('.')).sort().reverse()
const match   = backups.find(b => b === targetTs || b.startsWith(targetTs))
if (!match) {
  console.error(`\nNo backup found matching: "${targetTs}"`)
  console.log('Run without arguments to see all backups.')
  process.exit(1)
}

const backupDir  = join(BACKUP_ROOT, match)
const allFiles   = readdirSync(backupDir).filter(f => f.endsWith('.json'))
const toRestore  = targetTable
  ? [`${targetTable}.json`]
  : allFiles

console.log(`\nRestoring from: ${match}`)
if (targetTable) console.log(`Table:          ${targetTable}`)
console.log()

for (const file of toRestore) {
  const table = file.replace('.json', '')
  const path  = join(backupDir, file)

  if (!existsSync(path)) {
    console.log(`  ✗ ${table}: file not found in this backup`)
    continue
  }

  const rows = JSON.parse(readFileSync(path, 'utf-8'))
  const pk   = TABLE_PK[table] ?? 'id'
  process.stdout.write(`  ${table.padEnd(28)} ${rows.length} rows — `)

  // Delete all existing rows
  const { error: delErr } = await supabase
    .from(table)
    .delete()
    .not(pk, 'is', null)

  if (delErr) {
    console.log(`✗ delete failed: ${delErr.message}`)
    continue
  }

  // Re-insert in batches of 500
  if (rows.length > 0) {
    const payload = STRIP_ID.has(table)
      ? rows.map(({ id: _drop, ...rest }) => rest)
      : rows

    let ok = true
    for (let i = 0; i < payload.length; i += 500) {
      const { error: insErr } = await supabase
        .from(table)
        .insert(payload.slice(i, i + 500))
      if (insErr) { console.log(`✗ insert error: ${insErr.message}`); ok = false; break }
    }
    if (!ok) continue
  }

  console.log('✓')
}

console.log('\nRestore complete.')

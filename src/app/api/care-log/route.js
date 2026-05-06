import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function table(user) {
  return user === 'natalie' ? 'goal_tracker_natalie' : 'care_log_chris'
}

// GET /api/care-log?user=chris&date=2026-05-06
// Returns { checks: { item_name: true }, values: { item_name: number }, daysSince: { item_name: number } }
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const user = searchParams.get('user')
  const date = searchParams.get('date')

  const itemCol = user === 'chris' ? 'item_name' : 'goal_name'

  const { data, error } = await supabase
    .from(table(user))
    .select(`${itemCol}, checked, value, note`)
    .eq('log_date', date)
  if (error) return NextResponse.json({ error }, { status: 500 })

  let daysSince = {}
  if (user === 'chris') {
    const tracked = ['facial-treatment', 'spoke-dad', 'spoke-mom']
    const { data: recent } = await supabase
      .from('care_log_chris')
      .select('item_name, log_date')
      .in('item_name', tracked)
      .eq('checked', true)
      .lt('log_date', date)
      .order('log_date', { ascending: false })

    if (recent) {
      for (const g of tracked) {
        const last = recent.find(r => r.item_name === g)
        if (last) {
          const d1 = new Date(date)
          const d2 = new Date(last.log_date)
          daysSince[g] = Math.round((d1 - d2) / 86400000)
        } else {
          daysSince[g] = null
        }
      }
    }
  }

  const checks = {}
  const values = {}
  const notes  = {}
  for (const row of data) {
    const id = row[itemCol]
    if (row.checked)       checks[id] = true
    if (row.value != null) values[id] = row.value
    if (row.note  != null) notes[id]  = row.note
  }

  return NextResponse.json({ checks, values, daysSince, notes })
}

// POST /api/care-log
// Body: { user, date, item_name, category?, checked, value? }
export async function POST(request) {
  const { user, date, item_name, category, checked, value, note } = await request.json()

  const itemCol = user === 'chris' ? 'item_name' : 'goal_name'
  const base = { log_date: date, [itemCol]: item_name, checked, logged_at: new Date().toISOString() }
  if (value != null) base.value = value
  if (note  != null) base.note  = note
  const row = user === 'natalie' ? { ...base, category } : base

  const { error } = await supabase
    .from(table(user))
    .upsert(row, { onConflict: `log_date,${itemCol}` })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}

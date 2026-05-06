import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function table(user) {
  return user === 'natalie' ? 'goal_tracker_natalie' : 'goal_tracker_chris'
}

// GET /api/goals/log?user=chris&date=2026-05-06
// Returns { checks: { goal_name: true }, values: { goal_name: number }, daysSince: { goal_name: number } }
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const user = searchParams.get('user')
  const date = searchParams.get('date')

  // Load all rows for this date
  const { data, error } = await supabase
    .from(table(user))
    .select('goal_name, checked, value')
    .eq('log_date', date)
  if (error) return NextResponse.json({ error }, { status: 500 })

  // For chris: also compute days-since for weekly/social goals
  let daysSince = {}
  if (user === 'chris') {
    const tracked = ['facial-treatment', 'spoke-dad', 'spoke-mom']
    const { data: recent } = await supabase
      .from('goal_tracker_chris')
      .select('goal_name, log_date')
      .in('goal_name', tracked)
      .eq('checked', true)
      .lt('log_date', date)
      .order('log_date', { ascending: false })

    if (recent) {
      for (const g of tracked) {
        const last = recent.find(r => r.goal_name === g)
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
  for (const row of data) {
    if (row.checked) checks[row.goal_name] = true
    if (row.value != null) values[row.goal_name] = row.value
  }

  return NextResponse.json({ checks, values, daysSince })
}

// POST /api/goals/log
// Body: { user, date, goal_name, category?, checked, value? }
export async function POST(request) {
  const { user, date, goal_name, category, checked, value } = await request.json()

  const base = { log_date: date, goal_name, checked, logged_at: new Date().toISOString() }
  if (value != null) base.value = value
  const row = user === 'natalie' ? { ...base, category } : base

  const { error } = await supabase
    .from(table(user))
    .upsert(row, { onConflict: 'log_date,goal_name' })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}

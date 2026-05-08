import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/gym-log?user=chris&date=2026-05-08
// Returns { exercises: { [exercise_id]: { checked, sets, reps, lbs } } }
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  const { data, error } = await supabase
    .from('gym_log_chris')
    .select('exercise_id, checked, sets, reps, lbs')
    .eq('log_date', date)
  if (error) return NextResponse.json({ error }, { status: 500 })

  const exercises = {}
  for (const row of data) {
    exercises[row.exercise_id] = {
      checked: row.checked,
      sets:    row.sets,
      reps:    row.reps,
      lbs:     row.lbs,
    }
  }

  return NextResponse.json({ exercises })
}

// POST /api/gym-log
// Body: { user, date, exercise_id, checked, sets, reps, lbs }
export async function POST(request) {
  const { date, exercise_id, checked, sets, reps, lbs } = await request.json()

  const row = {
    log_date:    date,
    exercise_id,
    checked:     !!checked,
    sets:        sets  ?? null,
    reps:        reps  ?? null,
    lbs:         lbs   ?? null,
    logged_at:   new Date().toISOString(),
  }

  const { error } = await supabase
    .from('gym_log_chris')
    .upsert(row, { onConflict: 'log_date,exercise_id' })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}

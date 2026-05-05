import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function table(user) {
  return user === 'natalie' ? 'goal_tracker_natalie' : 'goal_tracker_chris'
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const user = searchParams.get('user')
  const date = searchParams.get('date')
  const { data, error } = await supabase
    .from(table(user))
    .select('goal_name')
    .eq('log_date', date)
    .eq('checked', true)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data.map(r => r.goal_name))
}

export async function POST(request) {
  const { user, date, goal_name, category, checked } = await request.json()
  const row = user === 'natalie'
    ? { log_date: date, category, goal_name, checked, logged_at: new Date().toISOString() }
    : { log_date: date, goal_name, checked, logged_at: new Date().toISOString() }
  const { error } = await supabase
    .from(table(user))
    .upsert(row, { onConflict: 'log_date,goal_name' })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const [bodyRes, workoutsRes, sleepRes] = await Promise.all([
    supabase.from('health_body_stats').select('*').order('date'),
    supabase.from('health_workouts').select('date, type, duration_min').order('date'),
    supabase.from('health_sleep_daily').select('*').order('date'),
  ])

  if (bodyRes.error || workoutsRes.error || sleepRes.error) {
    return NextResponse.json({ error: 'Failed to fetch health data' }, { status: 500 })
  }

  return NextResponse.json({
    bodyStats: bodyRes.data,
    workouts: workoutsRes.data,
    sleep: sleepRes.data,
  })
}

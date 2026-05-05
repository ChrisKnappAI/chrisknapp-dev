import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const user = searchParams.get('user')
  const date = searchParams.get('date')
  const { data, error } = await supabase
    .from('food_log')
    .select('*')
    .eq('user_name', user)
    .eq('log_date', date)
    .order('logged_at', { ascending: true })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  const { user, date, meal, meal_version, ingredients } = await request.json()
  const loggedAt = new Date().toISOString()
  const entries = []

  for (const ing of ingredients) {
    if (!ing.actual_amount || ing.actual_amount <= 0) continue
    const pct = ing.user_percent
    const servings = ing.serving_size > 0 ? (ing.actual_amount / ing.serving_size) * pct : 0
    entries.push({
      user_name: user,
      log_date: date,
      logged_at: loggedAt,
      meal,
      meal_version,
      ingredient: ing.ingredient,
      serving_metric: ing.serving_metric,
      serving_size: ing.serving_size,
      actual_amount: ing.actual_amount,
      user_percent: Math.round(pct * 1000) / 1000,
      servings_consumed: Math.round(servings * 1000) / 1000,
      calories: Math.round(servings * ing.serving_calories * 10) / 10,
      fat:      Math.round(servings * ing.serving_fat     * 10) / 10,
      carbs:    Math.round(servings * ing.serving_carbs   * 10) / 10,
      protein:  Math.round(servings * ing.serving_protein * 10) / 10,
      is_cheat: false,
    })
  }

  if (entries.length === 0) return NextResponse.json({ success: true, inserted: 0 })
  const { error } = await supabase.from('food_log').insert(entries)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true, inserted: entries.length })
}

export async function DELETE(request) {
  const { id } = await request.json()
  const { error } = await supabase.from('food_log').delete().eq('id', id)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}

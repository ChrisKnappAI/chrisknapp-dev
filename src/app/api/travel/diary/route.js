import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const tbl = () => supabase.schema('travel').from('diary')

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const person = searchParams.get('person')
  const date   = searchParams.get('date')
  const { data, error } = await tbl()
    .select('body, updated_at')
    .eq('person', person)
    .eq('entry_date', date)
    .maybeSingle()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ body: data?.body ?? '', updated_at: data?.updated_at ?? null })
}

export async function POST(request) {
  const { person, date, body } = await request.json()
  const { error } = await tbl()
    .upsert(
      { person, entry_date: date, body, updated_at: new Date().toISOString() },
      { onConflict: 'person,entry_date' }
    )
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}

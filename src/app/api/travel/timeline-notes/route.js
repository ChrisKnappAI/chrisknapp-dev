import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const tbl = () => supabase.schema('travel').from('timeline_notes')

export async function GET() {
  const { data, error } = await tbl().select('segment_id, body')
  if (error) return NextResponse.json({ error }, { status: 500 })
  const notes = {}
  for (const row of data || []) notes[row.segment_id] = row.body
  return NextResponse.json({ notes })
}

export async function POST(request) {
  const { segment_id, body } = await request.json()
  const { error } = await tbl()
    .upsert({ segment_id, body, updated_at: new Date().toISOString() }, { onConflict: 'segment_id' })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('story_answers')
    .select('*')
    .eq('member_id', 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  const body = await request.json()

  // Mark all unprocessed answers as ready for nightly processing
  if (body.action === 'done') {
    const { error } = await supabase
      .from('story_answers')
      .update({ ready_to_process: true })
      .eq('member_id', 1)
      .eq('processed', false)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  // Upsert answer for a question
  const { question_id, raw_text } = body
  if (!question_id) return NextResponse.json({ error: 'question_id required' }, { status: 400 })

  const { data: existing } = await supabase
    .from('story_answers')
    .select('id')
    .eq('question_id', question_id)
    .eq('member_id', 1)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('story_answers')
      .update({ raw_text, updated_at: new Date().toISOString() })
      .eq('id', existing.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    const { error } = await supabase
      .from('story_answers')
      .insert({ question_id, member_id: 1, raw_text })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

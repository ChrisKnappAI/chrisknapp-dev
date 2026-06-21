import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )
}

function sm2(card, rating) {
  let ef = card.ease_factor
  let interval = card.interval_days
  let reps = card.repetitions
  const now = new Date().toISOString()

  if (rating === 1) {
    // Miss — full reset
    reps = 0
    interval = 1
    ef = Math.max(1.3, ef - 0.2)
  } else {
    // Correct — advance
    if (reps === 0) interval = 1
    else if (reps === 1) interval = 6
    else interval = Math.round(interval * ef)
    reps += 1
  }

  const next = new Date()
  next.setDate(next.getDate() + interval)

  return {
    ease_factor: ef,
    interval_days: interval,
    repetitions: reps,
    next_review_at: next.toISOString().split('T')[0],
    last_reviewed_at: now,
    is_introduced: true,
    times_correct: rating === 1 ? card.times_correct : card.times_correct + 1,
    times_incorrect: rating === 1 ? card.times_incorrect + 1 : card.times_incorrect,
    last_incorrect_at: rating === 1 ? now : card.last_incorrect_at,
  }
}

export async function POST(req) {
  const { id, rating } = await req.json()
  const sb = getSb()

  const { data: card, error: fetchErr } = await sb
    .from('spanish_vocab').select('*').eq('id', id).single()

  if (fetchErr) return Response.json({ error: fetchErr.message }, { status: 500 })

  let updates

  if (rating === 99) {
    // "I know this" — skip ~4 months
    const interval = Math.floor(Math.random() * 101) + 100
    const next = new Date()
    next.setDate(next.getDate() + interval)
    updates = {
      is_introduced: true,
      is_learned: true,
      interval_days: interval,
      ease_factor: card.ease_factor,
      repetitions: card.repetitions + 1,
      next_review_at: next.toISOString().split('T')[0],
      last_reviewed_at: new Date().toISOString(),
      times_correct: card.times_correct + 1,
      times_incorrect: card.times_incorrect,
      last_incorrect_at: card.last_incorrect_at,
    }
  } else {
    updates = sm2(card, rating)
    if (updates.interval_days >= 21) updates.is_learned = true
  }

  const { error: updateErr } = await sb.from('spanish_vocab').update(updates).eq('id', id)
  if (updateErr) return Response.json({ error: updateErr.message }, { status: 500 })

  return Response.json({ ok: true })
}

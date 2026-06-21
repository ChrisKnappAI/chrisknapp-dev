import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )
}

// Toggles is_flagged on a card. Flagged cards can be reviewed/fixed in a later session.
export async function POST(req) {
  const { id } = await req.json()
  const sb = getSb()

  const { data: card, error: fetchErr } = await sb
    .from('spanish_vocab').select('is_flagged').eq('id', id).single()

  if (fetchErr) return Response.json({ error: fetchErr.message }, { status: 500 })

  const nowFlagged = !card.is_flagged
  const { error } = await sb
    .from('spanish_vocab')
    .update({
      is_flagged: nowFlagged,
      flagged_at: nowFlagged ? new Date().toISOString() : null,
    })
    .eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true, is_flagged: nowFlagged })
}

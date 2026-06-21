import { createClient } from '@supabase/supabase-js'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )
}

// POST /api/catchphrase/used
// Body: { ids: [uuid, uuid, ...] }
// Marks all provided phrase IDs as used.
export async function POST(req) {
  let body
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const ids = Array.isArray(body?.ids) ? body.ids.filter(Boolean) : []
  if (ids.length === 0) {
    return Response.json({ ok: true, updated: 0 })
  }

  const sb = getSb()
  const { error } = await sb
    .from('catchphrases')
    .update({ is_used: true, used_at: new Date().toISOString() })
    .in('id', ids)

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ ok: true, updated: ids.length })
}

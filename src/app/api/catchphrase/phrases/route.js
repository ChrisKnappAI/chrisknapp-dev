import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// GET /api/catchphrase/phrases?limit=200
// Returns up to `limit` unused phrases, shuffled.
export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') || '200', 10), 500)

  const sb = getSb()
  const { data, error } = await sb
    .from('catchphrases')
    .select('id, english, spanish, cefr_level')
    .eq('is_used', false)
    .limit(limit * 2)

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const shuffled = shuffle(data || []).slice(0, limit)
  return Response.json({ phrases: shuffled })
}

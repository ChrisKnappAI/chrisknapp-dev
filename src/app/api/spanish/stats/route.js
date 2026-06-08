import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function count(query) {
  const { count: c, error } = await query
  if (error) return 0
  return c ?? 0
}

export async function GET() {
  const today = new Date().toISOString().split('T')[0]
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [total, introduced, learned, due, newAvail, hard, misses] = await Promise.all([
    count(sb.from('spanish_vocab').select('id', { count: 'exact', head: true })),
    count(sb.from('spanish_vocab').select('id', { count: 'exact', head: true }).eq('is_introduced', true)),
    count(sb.from('spanish_vocab').select('id', { count: 'exact', head: true }).eq('is_learned', true)),
    count(sb.from('spanish_vocab').select('id', { count: 'exact', head: true })
      .eq('is_introduced', true).eq('is_learned', false).lte('next_review_at', today)),
    count(sb.from('spanish_vocab').select('id', { count: 'exact', head: true }).eq('is_introduced', false)),
    count(sb.from('spanish_vocab').select('id', { count: 'exact', head: true })
      .eq('is_introduced', true).lte('ease_factor', 1.8)),
    count(sb.from('spanish_vocab').select('id', { count: 'exact', head: true })
      .eq('is_introduced', true).gte('last_incorrect_at', sevenDaysAgo)),
  ])

  return Response.json({ total, introduced, learned, due, new_available: newAvail, hard, misses })
}

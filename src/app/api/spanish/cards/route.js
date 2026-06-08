import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('mode') || 'review'
  const today = new Date().toISOString().split('T')[0]
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  let data, error

  if (mode === 'learn') {
    ;({ data, error } = await sb
      .from('spanish_vocab')
      .select('*')
      .eq('is_introduced', false)
      .order('cefr_level', { ascending: true })
      .order('base_difficulty', { ascending: true })
      .limit(60))
    if (!error && data) {
      // Shuffle within each difficulty bucket so nouns/verbs/etc mix together
      shuffle(data)
      data = data.slice(0, 20)
    }
  } else if (mode === 'hard') {
    ;({ data, error } = await sb
      .from('spanish_vocab')
      .select('*')
      .eq('is_introduced', true)
      .lte('ease_factor', 1.8)
      .limit(50))
    if (!error && data) shuffle(data)
  } else if (mode === 'misses') {
    ;({ data, error } = await sb
      .from('spanish_vocab')
      .select('*')
      .eq('is_introduced', true)
      .gte('last_incorrect_at', sevenDaysAgo)
      .order('last_incorrect_at', { ascending: false })
      .limit(50))
  } else {
    // review: due cards
    ;({ data, error } = await sb
      .from('spanish_vocab')
      .select('*')
      .eq('is_introduced', true)
      .eq('is_learned', false)
      .lte('next_review_at', today)
      .order('next_review_at', { ascending: true })
      .limit(100))
    if (!error && data) shuffle(data)
  }

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ cards: data || [] })
}

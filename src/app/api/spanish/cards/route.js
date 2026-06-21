import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

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

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('mode') || 'review'
  const pos = searchParams.get('pos') || 'all'
  const today = new Date().toISOString().split('T')[0]

  const todayMidnight = new Date()
  todayMidnight.setHours(0, 0, 0, 0)
  const todayMidnightISO = todayMidnight.toISOString()

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const startOfWeek = new Date()
  const dow = startOfWeek.getDay()
  startOfWeek.setDate(startOfWeek.getDate() - (dow === 0 ? 6 : dow - 1))
  startOfWeek.setHours(0, 0, 0, 0)
  const startOfWeekISO = startOfWeek.toISOString()

  const sb = getSb()

  function base() {
    let q = sb.from('spanish_vocab').select('*')
    if (pos !== 'all') q = q.eq('part_of_speech', pos)
    return q
  }

  let data, error

  if (mode === 'learn') {
    ;({ data, error } = await base()
      .eq('is_introduced', false)
      .order('cefr_level', { ascending: true })
      .order('base_difficulty', { ascending: true })
      .limit(60))
    if (!error && data) { shuffle(data); data = data.slice(0, 20) }

  } else if (mode === 'today') {
    ;({ data, error } = await base()
      .gte('last_incorrect_at', todayMidnightISO)
      .or(`weekly_miss_dismissed_at.is.null,weekly_miss_dismissed_at.lt.${todayMidnightISO}`))
    if (!error && data) shuffle(data)

  } else if (mode === 'week') {
    ;({ data, error } = await base()
      .gte('last_incorrect_at', sevenDaysAgo)
      .or(`weekly_miss_dismissed_at.is.null,weekly_miss_dismissed_at.lt.${startOfWeekISO}`))
    if (!error && data) shuffle(data)

  } else {
    // review: due cards
    ;({ data, error } = await base()
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

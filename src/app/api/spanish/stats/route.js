import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )
}

export async function GET(req) {
  const sb = getSb()
  const { searchParams } = new URL(req.url)
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

  function base() {
    let q = sb.from('spanish_vocab').select('*', { count: 'exact', head: true })
    if (pos !== 'all') q = q.eq('part_of_speech', pos)
    return q
  }

  const [
    { count: total },
    { count: introduced },
    { count: learned },
    { count: due },
    { count: new_available },
    { count: today_misses },
    { count: week_misses },
    { count: flagged },
  ] = await Promise.all([
    base(),
    base().eq('is_introduced', true),
    base().eq('is_learned', true),
    base().eq('is_introduced', true).eq('is_learned', false).lte('next_review_at', today),
    base().eq('is_introduced', false),
    base()
      .gte('last_incorrect_at', todayMidnightISO)
      .or(`weekly_miss_dismissed_at.is.null,weekly_miss_dismissed_at.lt.${todayMidnightISO}`),
    base()
      .gte('last_incorrect_at', sevenDaysAgo)
      .or(`weekly_miss_dismissed_at.is.null,weekly_miss_dismissed_at.lt.${startOfWeekISO}`),
    sb.from('spanish_vocab').select('*', { count: 'exact', head: true }).eq('is_flagged', true),
  ])

  return Response.json({ total, introduced, learned, due, new_available, today_misses, week_misses, flagged })
}

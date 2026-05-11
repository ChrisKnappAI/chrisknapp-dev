import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const EXERCISE_GROUP_CHRIS = {
  'lat-pulldown-wide':                    'back',
  'lat-pulldown-narrow':                  'back',
  'lat-pulldown-neutral':                 'back',
  'lat-pulldown-chinup':                  'back',
  'straight-arm-pulldown':                'back',
  'seated-cable-row-close':               'back',
  'seated-cable-row-wide':                'back',
  'back-extension':                       'back',
  'face-pull':                            'back',
  'rear-delt-fly-dumbbell':               'back',
  'rear-delt-fly-cable':                  'back',
  'reverse-peck-machine':                 'back',
  'dumbbell-shrug':                       'back',
  'shoulder-press-dumbbells':             'shoulders',
  'shoulder-press-machine':               'shoulders',
  'arnold-press-dumbbells':               'shoulders',
  'upright-row-barbells':                 'shoulders',
  'side-raises-cable':                    'shoulders',
  'side-raises-dumbbells':               'shoulders',
  'bench-press-machine':                  'chest',
  'bench-press-dumbbells':                'chest',
  'bench-press-smith':                    'chest',
  'incline-press-dumbbells':              'chest',
  'incline-press-smith':                  'chest',
  'decline-press-dumbbells':              'chest',
  'decline-press-smith':                  'chest',
  'cable-flies':                          'chest',
  'curls-dumbbells-seated':               'biceps',
  'curls-dumbbells-standing':             'biceps',
  'preacher-curl-dumbbell-bench':         'biceps',
  'hammer-curls-dumbbells-seated':        'biceps',
  'hammer-curls-dumbbells-standing':      'biceps',
  'incline-curls-dumbbells-seated':       'biceps',
  'concentration-curls-dumbbells-seated': 'biceps',
  'reverse-curls-barbells-standing':      'biceps',
  'curl-machine-together':                'biceps',
  'curl-machine-separate':                'biceps',
  'rope-pulldown-1-arm':                  'triceps',
  'rope-pulldown-2-arms':                 'triceps',
  'rope-overhead-extension':              'triceps',
  'triceps-extensions-bench-dumbbells':   'triceps',
  'triceps-extensions-bench-barbell':     'triceps',
  'skull-crushers':                       'triceps',
  'machine-pushdown':                     'triceps',
  'dips':                                 'triceps',
  'close-grip-bench-dumbbell':            'triceps',
  'leg-press-machine':                    'legs',
  'calves-leg-press-machine':             'legs',
  'hamstring-machine':                    'legs',
  'quad-machine':                         'legs',
  'abs':                                  'abs',
}

const EXERCISE_GROUP_NATALIE = {
  'n-lat-pulldown':           'back',
  'n-seated-row':             'back',
  'n-leg-press':              'legs',
  'n-leg-extension':          'legs',
  'n-adductor-machine':       'legs',
  'n-seated-leg-curl':        'legs',
  'n-seated-calf-extension':  'legs',
  'n-shoulder-press-db':      'shoulders',
  'n-arnold-press-db':        'shoulders',
  'n-machine-lateral-raise':  'shoulders',
  'n-lateral-raise-db':       'shoulders',
  'n-rear-delt-fly-machine':  'shoulders',
  'n-chest-press-machine':    'chest',
  'n-push-ups':               'chest',
  'n-intense-abs':            'core',
  'n-isometric-core':         'core',
  'n-hit':                    'core',
  'n-curl-db-seated':         'biceps',
  'n-hammer-curl-db-seated':  'biceps',
  'n-preacher-curl-machine':  'biceps',
  'n-skull-crushers':         'triceps',
  'n-machine-pushdowns':      'triceps',
  'n-hip-abduction-machine':  'booty',
  'n-leg-press-high-foot':    'booty',
  'n-kickback-machine':       'booty',
  'n-glute-bridges-bands':    'booty',
  'n-donkey-kicks-bands':     'booty',
}

const ALL_GROUPS_CHRIS   = ['back', 'shoulders', 'chest', 'biceps', 'triceps', 'legs', 'abs']
const ALL_GROUPS_NATALIE = ['back', 'legs', 'shoulders', 'chest', 'core', 'biceps', 'triceps', 'booty']

// GET /api/gym-log?user=chris&date=2026-05-08
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const user = searchParams.get('user') || 'chris'

  const table         = user === 'natalie' ? 'gym_log_natalie' : 'gym_log_chris'
  const exerciseGroup = user === 'natalie' ? EXERCISE_GROUP_NATALIE : EXERCISE_GROUP_CHRIS
  const allGroups     = user === 'natalie' ? ALL_GROUPS_NATALIE : ALL_GROUPS_CHRIS

  const [{ data, error }, { data: recent }] = await Promise.all([
    supabase
      .from(table)
      .select('exercise_id, checked, sets, reps, lbs')
      .eq('log_date', date),
    supabase
      .from(table)
      .select('exercise_id, log_date')
      .eq('checked', true)
      .lte('log_date', date)
      .order('log_date', { ascending: false }),
  ])

  if (error) return NextResponse.json({ error }, { status: 500 })

  const exercises = {}
  for (const row of data) {
    exercises[row.exercise_id] = {
      checked: row.checked,
      sets:    row.sets,
      reps:    row.reps,
      lbs:     row.lbs,
    }
  }

  const groupLastDate = {}
  for (const row of (recent || [])) {
    const group = exerciseGroup[row.exercise_id]
    if (group && !groupLastDate[group]) groupLastDate[group] = row.log_date
  }

  const daysSince = {}
  for (const g of allGroups) {
    if (groupLastDate[g]) {
      const d1 = new Date(date)
      const d2 = new Date(groupLastDate[g])
      daysSince[g] = Math.round((d1 - d2) / 86400000)
    } else {
      daysSince[g] = null
    }
  }

  return NextResponse.json({ exercises, daysSince })
}

// POST /api/gym-log
// Body: { user, date, exercise_id, checked, sets, reps, lbs }
export async function POST(request) {
  const { user, date, exercise_id, checked, sets, reps, lbs } = await request.json()

  const table = user === 'natalie' ? 'gym_log_natalie' : 'gym_log_chris'

  const row = {
    log_date:    date,
    exercise_id,
    checked:     !!checked,
    sets:        sets  ?? null,
    reps:        reps  ?? null,
    lbs:         lbs   ?? null,
    logged_at:   new Date().toISOString(),
  }

  const { error } = await supabase
    .from(table)
    .upsert(row, { onConflict: 'log_date,exercise_id' })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}

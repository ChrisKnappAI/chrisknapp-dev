'use client'
import { useState, useEffect, useCallback } from 'react'

function getToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const MUSCLE_GROUPS = [
  {
    id: 'back',
    label: 'Back',
    subcategories: [
      {
        label: 'Lats',
        exercises: [
          { id: 'lat-pulldown-wide',    label: 'Lat Pulldown (Wide)'    },
          { id: 'lat-pulldown-narrow',  label: 'Lat Pulldown (Narrow)'  },
          { id: 'lat-pulldown-neutral', label: 'Lat Pulldown (Neutral)' },
          { id: 'lat-pulldown-chinup',  label: 'Lat Pulldown (Chin-up)' },
          { id: 'straight-arm-pulldown', label: 'Straight-Arm Pulldown' },
        ],
      },
      {
        label: 'Rhomboids',
        exercises: [
          { id: 'seated-cable-row-close', label: 'Seated Cable Row (close)' },
          { id: 'seated-cable-row-wide',  label: 'Seated Cable Row (wide)'  },
          { id: 'back-extension',         label: 'Back Extension'            },
        ],
      },
      {
        label: 'Back Delts',
        exercises: [
          { id: 'face-pull',              label: 'Face Pull'                    },
          { id: 'rear-delt-fly-dumbbell', label: 'Rear Delt Fly (Dumbbell)'     },
          { id: 'rear-delt-fly-cable',    label: 'Rear Delt Fly (Cable)'        },
          { id: 'reverse-peck-machine',   label: 'Reverse Peck Machine'         },
        ],
      },
      {
        label: 'Traps',
        exercises: [
          { id: 'dumbbell-shrug', label: 'Dumbbell Shrug' },
        ],
      },
    ],
  },
  {
    id: 'shoulders',
    label: 'Shoulders',
    exercises: [
      { id: 'shoulder-press-dumbbells', label: 'Shoulder Press (Dumbbells)' },
      { id: 'shoulder-press-machine',   label: 'Shoulder Press (Machine)'   },
      { id: 'arnold-press-dumbbells',   label: 'Arnold Press (Dumbbells)'   },
      { id: 'upright-row-barbells',     label: 'Upright Row (Barbells)'     },
      { id: 'side-raises-cable',        label: 'Side Raises (Cable)'        },
      { id: 'side-raises-dumbbells',    label: 'Side Raises (Dumbbells)'    },
    ],
  },
  {
    id: 'chest',
    label: 'Chest',
    exercises: [
      { id: 'bench-press-machine',    label: 'Bench Press (Machine)'    },
      { id: 'bench-press-dumbbells',  label: 'Bench Press (Dumbbells)'  },
      { id: 'bench-press-smith',      label: 'Bench Press (Smith)'      },
      { id: 'incline-press-dumbbells', label: 'Incline Press (Dumbbells)' },
      { id: 'incline-press-smith',    label: 'Incline Press (Smith)'    },
      { id: 'decline-press-dumbbells', label: 'Decline Press (Dumbbells)' },
      { id: 'decline-press-smith',    label: 'Decline Press (Smith)'    },
      { id: 'cable-flies',            label: 'Cable Flies'              },
    ],
  },
  {
    id: 'biceps',
    label: 'Biceps',
    exercises: [
      { id: 'curls-dumbbells-seated',              label: 'Curls (Dumbbells Seated)'              },
      { id: 'curls-dumbbells-standing',            label: 'Curls (Dumbbells Standing)'            },
      { id: 'preacher-curl-dumbbell-bench',        label: 'Preacher Curl (Dumbbell Bench)'        },
      { id: 'hammer-curls-dumbbells-seated',       label: 'Hammer Curls (Dumbbells Seated)'       },
      { id: 'hammer-curls-dumbbells-standing',     label: 'Hammer Curls (Dumbbells Standing)'     },
      { id: 'incline-curls-dumbbells-seated',      label: 'Incline Curls (Dumbbells Seated)'      },
      { id: 'concentration-curls-dumbbells-seated', label: 'Concentration Curls (Dumbbells Seated)' },
      { id: 'reverse-curls-barbells-standing',     label: 'Reverse Curls (Barbells Standing)'     },
      { id: 'curl-machine-together',               label: 'Curl Machine Together'                 },
      { id: 'curl-machine-separate',               label: 'Curl Machine Separate'                 },
    ],
  },
  {
    id: 'triceps',
    label: 'Triceps',
    exercises: [
      { id: 'rope-pulldown-1-arm',                  label: 'Rope Pulldown 1 arm'                    },
      { id: 'rope-pulldown-2-arms',                 label: 'Rope Pulldown 2 arms'                   },
      { id: 'rope-overhead-extension',              label: 'Rope Overhead Extension'                },
      { id: 'triceps-extensions-bench-dumbbells',   label: 'Triceps Extensions on Bench (Dumbbells)' },
      { id: 'triceps-extensions-bench-barbell',     label: 'Triceps Extensions on Bench (Barbell)'  },
      { id: 'skull-crushers',                       label: 'Skull Crushers'                         },
      { id: 'machine-pushdown',                     label: 'Machine Pushdown'                       },
      { id: 'dips',                                 label: 'Dips'                                   },
      { id: 'close-grip-bench-dumbbell',            label: 'Close Grip Bench (Dumbbell)'            },
    ],
  },
  {
    id: 'legs',
    label: 'Legs',
    exercises: [
      { id: 'leg-press-machine',          label: 'Leg Press Machine'              },
      { id: 'calves-leg-press-machine',   label: 'Calves on Leg Press Machine'    },
      { id: 'hamstring-machine',          label: 'Hamstring Machine'              },
      { id: 'quad-machine',              label: 'Quad Machine'                   },
    ],
  },
  {
    id: 'abs',
    label: 'Abs',
    absOnly: true,
    exercises: [
      { id: 'abs', label: 'Abs' },
    ],
  },
]

const ALL_EXERCISES = MUSCLE_GROUPS.flatMap(g =>
  g.subcategories
    ? g.subcategories.flatMap(sc => sc.exercises)
    : g.exercises
)

const c = {
  bg:        'var(--c-dark)',
  card:      'var(--c-dark-card)',
  border:    'var(--c-dark-border)',
  text:      '#F1F5F9',
  muted:     '#64748B',
  accent:    '#3B82F6',
  accentDim: 'rgba(37,99,235,0.08)',
  rowBorder: 'rgba(255,255,255,0.07)',
}

const cardStyle = {
  background: 'var(--c-dark-card)',
  border:     '1px solid var(--c-dark-border)',
  borderRadius: 12,
  padding: '0.45rem 0.75rem',
}

const NAV_BTN = {
  background: 'var(--c-dark-card)',
  border:     '1px solid var(--c-dark-border)',
  color:      '#64748B',
  borderRadius: 6,
  padding: '0.32rem 0.65rem',
  cursor: 'pointer',
  fontSize: '0.88rem',
  fontWeight: 600,
}

export default function GymLog() {
  const [date,    setDate]    = useState(getToday)
  const [gymData, setGymData] = useState({})

  const loadDay = useCallback(async () => {
    const res  = await fetch(`/api/gym-log?user=chris&date=${date}`)
    const data = await res.json()
    if (data.error) return
    setGymData(data.exercises || {})
  }, [date])

  useEffect(() => { loadDay() }, [loadDay])

  function shiftDate(days) {
    const [y, m, d] = date.split('-').map(Number)
    const next = new Date(y, m - 1, d + days)
    const iso  = `${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,'0')}-${String(next.getDate()).padStart(2,'0')}`
    if (iso <= getToday()) setDate(iso)
  }

  function friendlyDate(d) {
    const today = getToday()
    const [y, mo, dy] = today.split('-').map(Number)
    const yest = new Date(y, mo - 1, dy - 1)
    const yStr = `${yest.getFullYear()}-${String(yest.getMonth()+1).padStart(2,'0')}-${String(yest.getDate()).padStart(2,'0')}`
    if (d === today) return 'Today'
    if (d === yStr)  return 'Yesterday'
    return d
  }

  function toggleExercise(exerciseId) {
    const curr        = gymData[exerciseId] || {}
    const nextChecked = !curr.checked
    setGymData(prev => ({ ...prev, [exerciseId]: { ...curr, checked: nextChecked } }))
    saveToApi(exerciseId, { ...curr, checked: nextChecked })
  }

  function updateField(exerciseId, field, value) {
    setGymData(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value === '' ? null : (isNaN(Number(value)) ? null : Number(value)),
      },
    }))
  }

  function handleBlur(exerciseId) {
    saveToApi(exerciseId, gymData[exerciseId] || {})
  }

  function saveToApi(exerciseId, data) {
    fetch('/api/gym-log', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user:        'chris',
        date,
        exercise_id: exerciseId,
        checked:     !!data.checked,
        sets:        data.sets  ?? null,
        reps:        data.reps  ?? null,
        lbs:         data.lbs   ?? null,
      }),
    })
  }

  const doneCount = ALL_EXERCISES.filter(ex => gymData[ex.id]?.checked).length

  return (
    <div style={{ color: c.text, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        padding: '0.72rem 2rem',
        borderBottom: `1px solid ${c.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: c.bg, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Gym Log</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={() => shiftDate(-1)} style={NAV_BTN}>←</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: c.card, border: `1px solid ${c.border}`, borderRadius: 8, padding: '0.28rem 0.7rem' }}>
            <span style={{ fontSize: '0.83rem', fontWeight: 600, minWidth: 76, textAlign: 'center' }}>{friendlyDate(date)}</span>
            <input type="date" value={date} max={getToday()} onChange={e => setDate(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: c.muted, fontSize: '0.72rem', outline: 'none', cursor: 'pointer', padding: 0 }} />
          </div>
          <button onClick={() => shiftDate(1)} disabled={date >= getToday()}
            style={{ ...NAV_BTN, opacity: date >= getToday() ? 0.3 : 1 }}>→</button>
        </div>
      </div>

      {/* 3-column grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 1.2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.55rem',
          alignItems: 'start',
        }}>

          {/* Col 1: Back + Legs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[MUSCLE_GROUPS[0], MUSCLE_GROUPS[5]].map(g => (
              <MuscleCard key={g.id} group={g} gymData={gymData} onToggle={toggleExercise} onUpdateField={updateField} onBlur={handleBlur} />
            ))}
          </div>

          {/* Col 2: Shoulders + Chest + Abs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[MUSCLE_GROUPS[1], MUSCLE_GROUPS[2], MUSCLE_GROUPS[6]].map(g => (
              <MuscleCard key={g.id} group={g} gymData={gymData} onToggle={toggleExercise} onUpdateField={updateField} onBlur={handleBlur} />
            ))}
          </div>

          {/* Col 3: Biceps + Triceps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[MUSCLE_GROUPS[3], MUSCLE_GROUPS[4]].map(g => (
              <MuscleCard key={g.id} group={g} gymData={gymData} onToggle={toggleExercise} onUpdateField={updateField} onBlur={handleBlur} />
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

function MuscleCard({ group, gymData, onToggle, onUpdateField, onBlur }) {
  return (
    <div style={cardStyle}>
      <SectionHeader label={group.label} />

      {!group.absOnly && !group.subcategories && <ColumnLabels />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.08rem', marginTop: '0.22rem' }}>
        {group.subcategories ? (
          group.subcategories.map(sc => (
            <div key={sc.label}>
              <SubcatHeader label={sc.label} />
              {sc.exercises.map(ex => (
                <ExerciseRow
                  key={ex.id}
                  label={ex.label}
                  data={gymData[ex.id] || {}}
                  absOnly={false}
                  onToggle={() => onToggle(ex.id)}
                  onUpdateField={(field, val) => onUpdateField(ex.id, field, val)}
                  onBlur={() => onBlur(ex.id)}
                />
              ))}
            </div>
          ))
        ) : (
          group.exercises.map(ex => (
            <ExerciseRow
              key={ex.id}
              label={ex.label}
              data={gymData[ex.id] || {}}
              absOnly={!!group.absOnly}
              onToggle={() => onToggle(ex.id)}
              onUpdateField={(field, val) => onUpdateField(ex.id, field, val)}
              onBlur={() => onBlur(ex.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function SubcatHeader({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.15rem 0.35rem 0.06rem' }}>
      <div style={{ width: 15, flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: '0.6rem', fontWeight: 700, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {label}
      </span>
      {[{ label: 'Sets', w: 38 }, { label: 'Reps', w: 38 }, { label: 'Lbs', w: 48 }].map(({ label: l, w }) => (
        <div key={l} style={{ width: w, textAlign: 'center', fontSize: '0.6rem', color: c.muted, fontWeight: 600 }}>{l}</div>
      ))}
    </div>
  )
}

function ColumnLabels() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.08rem 0.4rem 0' }}>
      <div style={{ width: 15, flexShrink: 0 }} />
      <div style={{ flex: 1 }} />
      {[{ label: 'Sets', w: 38 }, { label: 'Reps', w: 38 }, { label: 'Lbs', w: 48 }].map(({ label, w }) => (
        <div key={label} style={{ width: w, textAlign: 'center', fontSize: '0.6rem', color: c.muted, fontWeight: 600 }}>
          {label}
        </div>
      ))}
    </div>
  )
}

function ExerciseRow({ label, data, absOnly, onToggle, onUpdateField, onBlur }) {
  const { checked = false, sets = null, reps = null, lbs = null } = data

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.4rem',
      padding: '0.12rem 0.35rem', borderRadius: 6,
      background:  checked ? c.accentDim : 'transparent',
      border:      `1px solid ${checked ? c.accent : c.rowBorder}`,
      transition:  'all 0.1s',
      marginBottom: 0,
    }}>
      {/* Checkbox */}
      <div onClick={onToggle} style={{
        width: 15, height: 15, borderRadius: 3, flexShrink: 0,
        border:     `2px solid ${checked ? c.accent : c.rowBorder}`,
        background: checked ? c.accent : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.1s', cursor: 'pointer',
      }}>
        {checked && <span style={{ color: 'white', fontSize: '0.55rem', fontWeight: 700, lineHeight: 1 }}>✓</span>}
      </div>

      {/* Label */}
      <span style={{
        flex: 1, fontSize: '0.76rem', minWidth: 0,
        fontWeight: checked ? 600 : 400,
        color:      checked ? c.text : c.muted,
        lineHeight: 1.3,
      }}>
        {label}
      </span>

      {/* Number inputs */}
      {!absOnly && [
        { field: 'sets', val: sets, w: 38 },
        { field: 'reps', val: reps, w: 38 },
        { field: 'lbs',  val: lbs,  w: 48 },
      ].map(({ field, val, w }) => (
        <input
          key={field}
          type="number"
          min="0"
          step={field === 'lbs' ? 'any' : '1'}
          value={val ?? ''}
          placeholder="—"
          onChange={e => onUpdateField(field, e.target.value)}
          onBlur={onBlur}
          onClick={e => e.stopPropagation()}
          style={{
            width: w, height: 24, borderRadius: 5,
            border:     `1px solid ${c.border}`,
            background: 'rgba(255,255,255,0.04)',
            color:      val != null ? c.text : c.muted,
            fontSize:   '0.72rem',
            fontWeight: val != null ? 600 : 400,
            textAlign:  'center',
            outline:    'none',
            padding:    '0 2px',
            MozAppearance:    'textfield',
            WebkitAppearance: 'none',
            appearance:       'textfield',
          }}
        />
      ))}
    </div>
  )
}

function SectionHeader({ label }) {
  return (
    <div style={{
      paddingBottom: '0.32rem',
      borderBottom:  `1px solid ${c.border}`,
    }}>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '-0.01em', color: c.text }}>
        {label}
      </span>
    </div>
  )
}

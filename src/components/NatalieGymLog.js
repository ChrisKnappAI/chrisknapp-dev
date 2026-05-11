'use client'
import { useState, useEffect, useCallback } from 'react'

function getToday() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
}

const MUSCLE_GROUPS = [
  {
    id: 'back',
    label: 'Back',
    exercises: [
      { id: 'n-lat-pulldown', label: 'Lat Pulldowns'      },
      { id: 'n-seated-row',   label: 'Seated Row Machine' },
    ],
  },
  {
    id: 'legs',
    label: 'Legs',
    exercises: [
      { id: 'n-leg-press',             label: 'Leg Press Machine'     },
      { id: 'n-leg-extension',         label: 'Leg Extension Machine' },
      { id: 'n-adductor-machine',      label: 'Adductor Machine'      },
      { id: 'n-seated-leg-curl',       label: 'Seated Leg Curl'       },
      { id: 'n-seated-calf-extension', label: 'Seated Calf Extension' },
    ],
  },
  {
    id: 'shoulders',
    label: 'Shoulders',
    exercises: [
      { id: 'n-shoulder-press-db',     label: 'Shoulder Press (DB)'   },
      { id: 'n-arnold-press-db',       label: 'Arnold Press (DB)'     },
      { id: 'n-machine-lateral-raise', label: 'Machine Lateral Raise' },
      { id: 'n-lateral-raise-db',      label: 'Lateral Raise (DB)'    },
      { id: 'n-rear-delt-fly-machine', label: 'Rear Delt Fly Machine' },
    ],
  },
  {
    id: 'chest',
    label: 'Chest',
    exercises: [
      { id: 'n-chest-press-machine', label: 'Chest Press Machine' },
      { id: 'n-push-ups',            label: 'Push Ups'            },
    ],
  },
  {
    id: 'core',
    label: '3D Core Integration',
    absOnly: true,
    exercises: [
      { id: 'n-intense-abs',    label: 'Intense Abs'    },
      { id: 'n-isometric-core', label: 'Isometric Core' },
      { id: 'n-hit',            label: 'HIT'            },
    ],
  },
  {
    id: 'biceps',
    label: 'Biceps',
    exercises: [
      { id: 'n-curl-db-seated',        label: 'Curl (DB Seated)'         },
      { id: 'n-hammer-curl-db-seated', label: 'Hammer Curls (DB Seated)' },
      { id: 'n-preacher-curl-machine', label: 'Preacher Curl (Machine)'  },
    ],
  },
  {
    id: 'triceps',
    label: 'Triceps',
    exercises: [
      { id: 'n-skull-crushers',    label: 'Skull Crushers'   },
      { id: 'n-machine-pushdowns', label: 'Machine Pushdowns' },
    ],
  },
  {
    id: 'booty',
    label: 'Booty',
    exercises: [
      { id: 'n-hip-abduction-machine', label: 'Hip Abduction Machine'           },
      { id: 'n-leg-press-high-foot',   label: 'Leg Press (High foot placement)' },
      { id: 'n-kickback-machine',      label: 'Kickback Machine'                },
      { id: 'n-glute-bridges-bands',   label: 'Glute Bridges (Bands at home)'   },
      { id: 'n-donkey-kicks-bands',    label: 'Donkey Kicks (Bands at home)'    },
    ],
  },
]

const ALL_EXERCISES = MUSCLE_GROUPS.flatMap(g => g.exercises)

const c = {
  bg:        'var(--c-beige)',
  card:      '#FFFFFF',
  border:    'var(--c-beige-border)',
  text:      '#1E2A38',
  muted:     '#A89A85',
  accent:    '#0EA5E9',
  accentDim: 'rgba(14,165,233,0.08)',
  rowBorder: 'rgba(0,0,0,0.07)',
}

const cardStyle = {
  background:   '#FFFFFF',
  border:       '1px solid var(--c-beige-border)',
  borderRadius: 12,
  padding:      '0.45rem 0.75rem',
}

const NAV_BTN = {
  background:   '#FFFFFF',
  border:       '1px solid var(--c-beige-border)',
  color:        '#A89A85',
  borderRadius: 6,
  padding:      '0.32rem 0.65rem',
  cursor:       'pointer',
  fontSize:     '0.88rem',
  fontWeight:   600,
}

export default function NatalieGymLog() {
  const [date,      setDate]      = useState(getToday)
  const [gymData,   setGymData]   = useState({})
  const [daysSince, setDaysSince] = useState({})

  const loadDay = useCallback(async () => {
    const res  = await fetch(`/api/gym-log?user=natalie&date=${date}`)
    const data = await res.json()
    if (data.error) return
    setGymData(data.exercises || {})
    setDaysSince(data.daysSince || {})
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
        user:        'natalie',
        date,
        exercise_id: exerciseId,
        checked:     !!data.checked,
        sets:        data.sets  ?? null,
        reps:        data.reps  ?? null,
        lbs:         data.lbs   ?? null,
      }),
    })
  }

  return (
    <div style={{ color: c.text, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div className="natalie-gym-header" style={{
        padding: '1.25rem 2rem',
        borderBottom: `1px solid ${c.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: c.bg, position: 'sticky', top: 0, zIndex: 10,
      }}>
        <span style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Gym Log</span>
        <div className="natalie-gym-header-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={() => shiftDate(-1)} style={NAV_BTN}>←</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#FFFFFF', border: `1px solid ${c.border}`, borderRadius: 8, padding: '0.28rem 0.7rem' }}>
            <span style={{ fontSize: '0.83rem', fontWeight: 600, minWidth: 76, textAlign: 'center' }}>{friendlyDate(date)}</span>
            <input type="date" value={date} max={getToday()} onChange={e => setDate(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: c.muted, fontSize: '0.72rem', outline: 'none', cursor: 'pointer', padding: 0 }} />
          </div>
          <button onClick={() => shiftDate(1)} disabled={date >= getToday()}
            style={{ ...NAV_BTN, opacity: date >= getToday() ? 0.3 : 1 }}>→</button>
        </div>
      </div>

      {/* 3-column grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.2rem' }}>
        <div className="gym-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.55rem',
          alignItems: 'start',
        }}>

          {/* Col 1: Back + Legs + Booty */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[MUSCLE_GROUPS[0], MUSCLE_GROUPS[1], MUSCLE_GROUPS[7]].map(g => (
              <MuscleCard key={g.id} group={g} gymData={gymData} daysSince={daysSince[g.id] ?? null} onToggle={toggleExercise} onUpdateField={updateField} onBlur={handleBlur} />
            ))}
          </div>

          {/* Col 2: Shoulders + Chest + 3D Core */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[MUSCLE_GROUPS[2], MUSCLE_GROUPS[3], MUSCLE_GROUPS[4]].map(g => (
              <MuscleCard key={g.id} group={g} gymData={gymData} daysSince={daysSince[g.id] ?? null} onToggle={toggleExercise} onUpdateField={updateField} onBlur={handleBlur} />
            ))}
          </div>

          {/* Col 3: Biceps + Triceps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[MUSCLE_GROUPS[5], MUSCLE_GROUPS[6]].map(g => (
              <MuscleCard key={g.id} group={g} gymData={gymData} daysSince={daysSince[g.id] ?? null} onToggle={toggleExercise} onUpdateField={updateField} onBlur={handleBlur} />
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

function MuscleCard({ group, gymData, daysSince, onToggle, onUpdateField, onBlur }) {
  return (
    <div style={cardStyle}>
      <SectionHeader label={group.label} daysSince={daysSince} />

      {!group.absOnly && <ColumnLabels />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.08rem', marginTop: '0.22rem' }}>
        {group.exercises.map(ex => (
          <ExerciseRow
            key={ex.id}
            label={ex.label}
            data={gymData[ex.id] || {}}
            absOnly={!!group.absOnly}
            onToggle={() => onToggle(ex.id)}
            onUpdateField={(field, val) => onUpdateField(ex.id, field, val)}
            onBlur={() => onBlur(ex.id)}
          />
        ))}
      </div>
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
    }}>
      {/* Checkbox */}
      <div onClick={onToggle} style={{
        width: 15, height: 15, borderRadius: 3, flexShrink: 0,
        border:     `2px solid ${checked ? c.accent : 'rgba(0,0,0,0.2)'}`,
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
          className="gym-input"
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
            border:     '1px solid rgba(0,0,0,0.12)',
            background: 'rgba(0,0,0,0.03)',
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

function lastWorkedColor(days) {
  if (days === null) return c.muted
  if (days <= 1)    return '#16A34A'
  if (days <= 3)    return c.muted
  return '#D97706'
}

function SectionHeader({ label, daysSince }) {
  const lastLabel = daysSince === null ? '—'
    : daysSince === 0 ? 'today'
    : daysSince === 1 ? 'yesterday'
    : `${daysSince}d ago`

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      paddingBottom: '0.32rem',
      borderBottom:  '1px solid var(--c-beige-border)',
    }}>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '-0.01em', color: c.text }}>
        {label}
      </span>
      <span style={{ fontSize: '0.62rem', fontWeight: 600, color: lastWorkedColor(daysSince) }}>
        {lastLabel}
      </span>
    </div>
  )
}

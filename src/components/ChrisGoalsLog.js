'use client'
import { useState, useEffect, useCallback } from 'react'

function getToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const BODY_CARE = [
  { id: 'face-am',          label: 'Face Routine AM',  type: 'check',   freq: 'daily'  },
  { id: 'face-pm',          label: 'Face Routine PM',  type: 'check',   freq: 'daily'  },
  { id: 'brush-teeth',      label: 'Brush Teeth',      type: 'counter', max: 3         },
  { id: 'floss',            label: 'Floss',            type: 'check',   freq: 'daily'  },
  { id: 'posture',          label: 'Posture Routine',  type: 'check',   freq: 'daily'  },
  { id: 'stretch',          label: 'Stretch Routine',  type: 'check',   freq: 'daily'  },
  { id: 'facial-treatment', label: 'Facial Treatment', type: 'check',   freq: 'weekly' },
]

const MARRIAGE_SCALES = [
  { id: 'treated-well',    label: 'Treated her well'              },
  { id: 'supported-goals', label: 'Supported her long-term goals' },
  { id: 'conflict',        label: 'Handled conflict / tension',   hint: true },
]

const MARRIAGE_CHECKS = [
  { id: 'quality-time',  label: 'Quality time beyond routine' },
  { id: 'sex',           label: 'Sex'                         },
  { id: 'appreciation',  label: 'Expressed appreciation'      },
  { id: 'thoughtful',    label: 'Did something thoughtful'    },
]

const FAMILY = [
  { id: 'spoke-dad', label: 'Dad'    },
  { id: 'spoke-mom', label: 'Mom'    },
  { id: 'friend',    label: 'Friend' },
]

const DAYS_SINCE_TRACKED = new Set(['facial-treatment', 'spoke-dad', 'spoke-mom'])
const COUNTER_ITEMS      = BODY_CARE.filter(i => i.type === 'counter')
const SCALE_IDS          = new Set(MARRIAGE_SCALES.map(i => i.id))
const COUNTER_IDS        = new Set(COUNTER_ITEMS.map(i => i.id))

const CHECK_IDS = [
  ...BODY_CARE.filter(i => i.type === 'check').map(i => i.id),
  ...MARRIAGE_CHECKS.map(i => i.id),
  ...FAMILY.map(i => i.id),
]
const TOTAL_ITEMS = CHECK_IDS.length + COUNTER_ITEMS.length

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

const card = {
  background: c.card,
  border: `1px solid ${c.border}`,
  borderRadius: 12,
  padding: '1rem 1.1rem',
}

export default function ChrisGoalsLog() {
  const [date,      setDate]      = useState(getToday)
  const [checks,    setChecks]    = useState({})
  const [scales,    setScales]    = useState({})
  const [counters,  setCounters]  = useState({})
  const [drinks,    setDrinks]    = useState(null)
  const [daysSince, setDaysSince] = useState({})

  const loadDay = useCallback(async () => {
    const res  = await fetch(`/api/goals/log?user=chris&date=${date}`)
    const data = await res.json()
    if (data.error) return

    const newChecks   = { ...data.checks }
    const newScales   = {}
    const newCounters = {}
    let   newDrinks   = null

    for (const [id, val] of Object.entries(data.values || {})) {
      if (id === 'drinks')       { newDrinks = val;      continue }
      if (SCALE_IDS.has(id))    { newScales[id]   = val; continue }
      if (COUNTER_IDS.has(id))  { newCounters[id] = val }
    }

    setChecks(newChecks)
    setScales(newScales)
    setCounters(newCounters)
    setDrinks(newDrinks)
    setDaysSince(data.daysSince || {})
  }, [date])

  useEffect(() => { loadDay() }, [loadDay])

  async function saveGoal(goal_name, checked, value = undefined) {
    await fetch('/api/goals/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'chris', date, goal_name, checked, value }),
    })
  }

  function shiftDate(days) {
    const [y, m, d] = date.split('-').map(Number)
    const next = new Date(y, m - 1, d + days)
    const iso = `${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,'0')}-${String(next.getDate()).padStart(2,'0')}`
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

  function toggleCheck(id) {
    const next = !checks[id]
    setChecks(p => ({ ...p, [id]: next }))
    saveGoal(id, next)
  }

  function pickScale(id, val) {
    const next = scales[id] === val ? null : val
    setScales(p => ({ ...p, [id]: next }))
    saveGoal(id, next !== null, next ?? undefined)
  }

  function incrementCounter(id, max) {
    const next = ((counters[id] || 0) + 1) % (max + 1)
    setCounters(p => ({ ...p, [id]: next }))
    saveGoal(id, next >= max, next)
  }

  function pickDrinks(n) {
    const next = drinks === n ? null : n
    setDrinks(next)
    saveGoal('drinks', next !== null, next ?? undefined)
  }

  const doneCount =
    CHECK_IDS.filter(id => checks[id]).length +
    COUNTER_ITEMS.filter(i => (counters[i.id] || 0) >= i.max).length

  const bodyCareDone = BODY_CARE.filter(i =>
    i.type === 'check' ? !!checks[i.id] : (counters[i.id] || 0) >= i.max
  ).length

  return (
    <div style={{ color: c.text, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        padding: '1.25rem 2rem',
        borderBottom: `1px solid ${c.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: c.bg, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Goals Log</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: doneCount === TOTAL_ITEMS ? '#22C55E' : c.muted }}>
            {doneCount} / {TOTAL_ITEMS}
          </span>
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
      <div style={{
        flex: 1,
        padding: '1.1rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1.4fr 1fr',
        gridTemplateRows: 'auto 1fr',
        gap: '0.9rem',
        minHeight: 0,
        overflow: 'hidden',
      }}>

        {/* Col 1: Body Care */}
        <div style={{ ...card, gridColumn: 1, gridRow: '1 / 3' }}>
          <SectionHeader label="Body Care" done={bodyCareDone} total={BODY_CARE.length} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.65rem' }}>
            {BODY_CARE.map(item =>
              item.type === 'counter' ? (
                <CounterRow
                  key={item.id}
                  label={item.label}
                  count={counters[item.id] || 0}
                  max={item.max}
                  onIncrement={() => incrementCounter(item.id, item.max)}
                />
              ) : (
                <CheckRow
                  key={item.id}
                  label={item.label}
                  checked={!!checks[item.id]}
                  onToggle={() => toggleCheck(item.id)}
                  daysSince={DAYS_SINCE_TRACKED.has(item.id) ? (daysSince[item.id] ?? null) : undefined}
                />
              )
            )}
          </div>
        </div>

        {/* Col 2: Marriage */}
        <div style={{ ...card, gridColumn: 2, gridRow: '1 / 3' }}>
          <SectionHeader label="Marriage — Natalie" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.65rem' }}>
            {MARRIAGE_SCALES.map(item => (
              <ScaleRow
                key={item.id}
                label={item.label}
                hint={item.hint}
                value={scales[item.id] ?? null}
                onPick={val => pickScale(item.id, val)}
              />
            ))}
            <div style={{ height: 1, background: c.border, margin: '0.25rem 0' }} />
            {MARRIAGE_CHECKS.map(item => (
              <CheckRow
                key={item.id}
                label={item.label}
                checked={!!checks[item.id]}
                onToggle={() => toggleCheck(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Col 3 top: Alcohol */}
        <div style={{ ...card, gridColumn: 3, gridRow: 1 }}>
          <SectionHeader label="Alcohol" />
          <div style={{ marginTop: '0.65rem' }}>
            <div style={{ fontSize: '0.72rem', color: c.muted, marginBottom: '0.45rem' }}>Drinks today</div>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {[0,1,2,3,4,5,6,7].map(n => (
                <button key={n} onClick={() => pickDrinks(n)} style={{
                  flex: 1, height: 34, borderRadius: 7,
                  border: `1px solid ${drinks === n ? drinkColor(n) : c.rowBorder}`,
                  background: drinks === n ? drinkColor(n) + '22' : 'transparent',
                  color: drinks === n ? drinkColor(n) : c.muted,
                  fontSize: n === 7 ? '0.6rem' : '0.8rem',
                  fontWeight: drinks === n ? 700 : 400,
                  cursor: 'pointer', transition: 'all 0.1s',
                }}>
                  {n === 7 ? '7+' : n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Col 3 bottom: Family / Social */}
        <div style={{ ...card, gridColumn: 3, gridRow: 2 }}>
          <SectionHeader label="Family / Social" done={FAMILY.filter(i => checks[i.id]).length} total={FAMILY.length} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.65rem' }}>
            {FAMILY.map(item => (
              <CheckRow
                key={item.id}
                label={item.label}
                checked={!!checks[item.id]}
                onToggle={() => toggleCheck(item.id)}
                daysSince={DAYS_SINCE_TRACKED.has(item.id) ? (daysSince[item.id] ?? null) : undefined}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

function SectionHeader({ label, done, total }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.65rem', borderBottom: `1px solid ${c.border}` }}>
      <span style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '-0.01em', color: c.text }}>
        {label}
      </span>
      {total != null && (
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: done === total ? '#22C55E' : c.muted }}>
          {done}/{total}
        </span>
      )}
    </div>
  )
}

function CheckRow({ label, checked, onToggle, daysSince }) {
  const hasDays = daysSince !== undefined
  return (
    <div onClick={onToggle} style={{
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.42rem 0.6rem', borderRadius: 7, cursor: 'pointer',
      background: checked ? c.accentDim : 'transparent',
      border: `1px solid ${checked ? c.accent : c.rowBorder}`,
      transition: 'all 0.1s',
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
        border: `2px solid ${checked ? c.accent : c.rowBorder}`,
        background: checked ? c.accent : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.1s',
      }}>
        {checked && <span style={{ color: 'white', fontSize: '0.6rem', fontWeight: 700, lineHeight: 1 }}>✓</span>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.8rem', fontWeight: checked ? 600 : 400, color: checked ? c.text : c.muted, lineHeight: 1.3 }}>
          {label}
        </div>
        {hasDays && (
          <div style={{ fontSize: '0.62rem', marginTop: '0.1rem', color: daysSinceColor(daysSince) }}>
            {daysSince === null ? '—' : daysSince === 0 ? 'today' : daysSince === 1 ? 'yesterday' : `${daysSince}d ago`}
          </div>
        )}
      </div>
    </div>
  )
}

function CounterRow({ label, count, max, onIncrement }) {
  const done = count >= max
  return (
    <div onClick={onIncrement} style={{
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.42rem 0.6rem', borderRadius: 7, cursor: 'pointer',
      background: done ? c.accentDim : 'transparent',
      border: `1px solid ${done ? c.accent : c.rowBorder}`,
      transition: 'all 0.1s',
    }}>
      <div style={{ display: 'flex', gap: '0.22rem', flexShrink: 0 }}>
        {Array.from({ length: max }, (_, i) => (
          <div key={i} style={{
            width: 9, height: 9, borderRadius: '50%',
            background: i < count ? c.accent : 'transparent',
            border: `1.5px solid ${i < count ? c.accent : c.rowBorder}`,
            transition: 'all 0.1s',
          }} />
        ))}
      </div>
      <span style={{ fontSize: '0.8rem', fontWeight: done ? 600 : 400, color: done ? c.text : c.muted, flex: 1 }}>
        {label}
      </span>
      <span style={{ fontSize: '0.68rem', fontWeight: 600, color: done ? '#22C55E' : count > 0 ? c.accent : c.muted }}>
        {count}/{max}
      </span>
    </div>
  )
}

function ScaleRow({ label, hint, value, onPick }) {
  return (
    <div style={{ padding: '0.45rem 0.6rem', borderRadius: 7, border: `1px solid ${c.rowBorder}`, background: 'rgba(255,255,255,0.015)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
        <span style={{ fontSize: '0.8rem', color: value ? c.text : c.muted, fontWeight: value ? 600 : 400 }}>
          {label}
        </span>
        <span style={{ fontSize: '0.65rem', fontStyle: 'italic', color: value ? scaleColor(value) : c.muted, fontWeight: value ? 700 : 400 }}>
          {value ? `${value}/10` : hint ? 'skip if none' : ''}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '0.2rem' }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <button key={n} onClick={() => onPick(n)} style={{
            flex: 1, padding: '0.22rem 0', borderRadius: 4,
            border: `1px solid ${value === n ? scaleColor(n) : c.rowBorder}`,
            background: value === n ? scaleColor(n) + '30' : 'transparent',
            color: value === n ? scaleColor(n) : c.muted,
            fontSize: '0.65rem', fontWeight: value === n ? 700 : 400,
            cursor: 'pointer', transition: 'all 0.1s',
          }}>
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

function daysSinceColor(days) {
  if (days === null) return c.muted
  if (days <= 3) return '#22C55E'
  if (days <= 5) return c.muted
  if (days <= 7) return '#F59E0B'
  return '#EF4444'
}

function scaleColor(v) {
  if (v <= 3) return '#EF4444'
  if (v <= 6) return '#F59E0B'
  return '#22C55E'
}

function drinkColor(n) {
  if (n === 0) return '#22C55E'
  if (n <= 2)  return '#F59E0B'
  return '#EF4444'
}

const NAV_BTN = {
  background: c.card, border: `1px solid ${c.border}`,
  color: c.muted, borderRadius: 6, padding: '0.32rem 0.65rem',
  cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600,
}

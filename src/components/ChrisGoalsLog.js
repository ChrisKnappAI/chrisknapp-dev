'use client'
import { useState, useEffect, useCallback } from 'react'

function getToday() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
}

// Morning Routine
const AM_ROUTINE = [
  { id: 'am-brush-teeth',  label: 'Brush Teeth'  },
  { id: 'am-face-routine', label: 'Facial Routine' },
]
const AM_VITAMINS = [
  { id: 'am-multivitamins', label: 'Multi-Vitamins'  },
  { id: 'am-vitamin-d3k',   label: 'Vitamin D3/K'   },
  { id: 'am-dhea',          label: 'DHEA'            },
  { id: 'am-super-omega3',  label: 'Super Omega-3'   },
]
const AM_BODY = [
  { id: 'am-stretch',  label: 'Stretch Body'    },
  { id: 'am-posture',  label: 'Posture Routine' },
]

// Night Routine
const PM_ROUTINE = [
  { id: 'pm-brush-teeth',  label: 'Brush Teeth'  },
  { id: 'pm-floss',        label: 'Floss'         },
  { id: 'pm-face-routine', label: 'Facial Routine' },
]
const PM_VITAMINS = [
  { id: 'pm-magnesium', label: 'Magnesium Glycinate' },
]
const PM_BODY = [
  { id: 'pm-stretch',          label: 'Stretch Body'     },
  { id: 'pm-posture',          label: 'Posture Routine'  },
  { id: 'pm-facial-treatment', label: 'Facial Treatment', weekly: true },
]

// Daily Summary
const DAILY_SCALES = [
  { id: 'stress-score',  label: 'Handled Stress Well?'  },
  { id: 'natalie-score', label: 'Treated Natalie Well?' },
]

const ALL_CHECK_IDS = [
  ...AM_ROUTINE.map(i => i.id),
  ...AM_VITAMINS.map(i => i.id),
  ...AM_BODY.map(i => i.id),
  ...PM_ROUTINE.map(i => i.id),
  ...PM_VITAMINS.map(i => i.id),
  ...PM_BODY.map(i => i.id),
  'had-sex',
]
const ALL_SCALE_IDS  = DAILY_SCALES.map(i => i.id)
const ALL_ITEM_IDS   = [...ALL_CHECK_IDS, ...ALL_SCALE_IDS]
const SCALE_ID_SET   = new Set(ALL_SCALE_IDS)

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
  background: c.card,
  border: `1px solid ${c.border}`,
  borderRadius: 12,
  padding: '1rem 1.1rem',
}

const NAV_BTN = {
  background: c.card, border: `1px solid ${c.border}`,
  color: c.muted, borderRadius: 6, padding: '0.32rem 0.65rem',
  cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600,
}

export default function ChrisGoalsLog() {
  const [date,      setDate]      = useState(getToday)
  const [checks,    setChecks]    = useState({})
  const [scales,    setScales]    = useState({})
  const [daysSince, setDaysSince] = useState({})
  const [note,      setNote]      = useState('')

  const loadDay = useCallback(async () => {
    const res  = await fetch(`/api/care-log?user=chris&date=${date}`)
    const data = await res.json()
    if (data.error) return

    const newChecks = { ...data.checks }
    const newScales = {}
    for (const [id, val] of Object.entries(data.values || {})) {
      if (SCALE_ID_SET.has(id)) newScales[id] = val
    }
    setChecks(newChecks)
    setScales(newScales)
    setDaysSince(data.daysSince || {})
    setNote(data.notes?.['daily-note'] || '')

    if (date === getToday()) {
      const existing = new Set([
        ...Object.keys(data.checks  || {}),
        ...Object.keys(data.values  || {}),
      ])
      const missing = ALL_ITEM_IDS.filter(id => !existing.has(id))
      if (missing.length > 0) {
        fetch('/api/care-log/seed', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ date, item_names: missing }),
        }).catch(() => {})
      }
    }
  }, [date])

  useEffect(() => { loadDay() }, [loadDay])

  async function saveItem(item_name, checked, value = undefined) {
    await fetch('/api/care-log', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'chris', date, item_name, checked, value }),
    })
  }

  function saveNote(text) {
    fetch('/api/care-log', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'chris', date, item_name: 'daily-note', checked: false, note: text || null }),
    })
  }

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

  function toggleCheck(id) {
    const next = !checks[id]
    setChecks(p => ({ ...p, [id]: next }))
    saveItem(id, next)
  }

  function pickScale(id, val) {
    const next = scales[id] === val ? null : val
    setScales(p => ({ ...p, [id]: next }))
    saveItem(id, next !== null, next ?? undefined)
  }

  const amAll   = [...AM_ROUTINE, ...AM_VITAMINS, ...AM_BODY]
  const amDone  = amAll.filter(i => checks[i.id]).length
  const amTotal = amAll.length

  const pmAll   = [...PM_ROUTINE, ...PM_VITAMINS, ...PM_BODY]
  const pmDone  = pmAll.filter(i => checks[i.id]).length
  const pmTotal = pmAll.length

  return (
    <div style={{ color: c.text, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div className="care-header" style={{
        padding: '1.25rem 2rem',
        borderBottom: `1px solid ${c.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: c.bg, flexShrink: 0,
      }}>
        <span style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Care Log</span>
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
      <div className="care-content" style={{
        flex: 1,
        padding: '1rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '0.9rem',
        minHeight: 0,
        overflowY: 'auto',
        alignItems: 'start',
      }}>

        {/* Col 1: Morning Routine */}
        <div style={cardStyle}>
          <SectionHeader label="Morning Routine" done={amDone} total={amTotal} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.65rem' }}>
            <SubLabel label="Face and Teeth" />
            {AM_ROUTINE.map(item => (
              <CheckRow key={item.id} label={item.label} checked={!!checks[item.id]} onToggle={() => toggleCheck(item.id)} />
            ))}
            <Divider />
            <SubLabel label="Vitamins" />
            {AM_VITAMINS.map(item => (
              <CheckRow key={item.id} label={item.label} checked={!!checks[item.id]} onToggle={() => toggleCheck(item.id)} />
            ))}
            <Divider />
            <SubLabel label="Body" />
            {AM_BODY.map(item => (
              <CheckRow key={item.id} label={item.label} checked={!!checks[item.id]} onToggle={() => toggleCheck(item.id)} />
            ))}
          </div>
        </div>

        {/* Col 2: Night Routine */}
        <div style={cardStyle}>
          <SectionHeader label="Night Routine" done={pmDone} total={pmTotal} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.65rem' }}>
            <SubLabel label="Face and Teeth" />
            {PM_ROUTINE.map(item => (
              <CheckRow key={item.id} label={item.label} checked={!!checks[item.id]} onToggle={() => toggleCheck(item.id)} />
            ))}
            <Divider />
            <SubLabel label="Vitamins" />
            {PM_VITAMINS.map(item => (
              <CheckRow key={item.id} label={item.label} checked={!!checks[item.id]} onToggle={() => toggleCheck(item.id)} />
            ))}
            <div style={{ fontSize: '0.68rem', fontStyle: 'italic', color: c.muted, padding: '0.15rem 0.6rem 0.3rem', lineHeight: 1.4 }}>
              If drank alcohol: Alcohol Pills (5) + Extra Magnesium (2 total)
            </div>
            <Divider />
            <SubLabel label="Body" />
            {PM_BODY.map(item => (
              <CheckRow
                key={item.id}
                label={item.label}
                checked={!!checks[item.id]}
                onToggle={() => toggleCheck(item.id)}
                daysSince={item.weekly ? (daysSince[item.id] ?? null) : undefined}
                colorFn={item.weekly ? facialDaysSinceColor : undefined}
              />
            ))}
          </div>
        </div>

        {/* Col 3: Daily Summary */}
        <div style={cardStyle}>
          <SectionHeader label="Daily Summary" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.65rem' }}>
            {DAILY_SCALES.map(item => (
              <ScaleRow
                key={item.id}
                label={item.label}
                value={scales[item.id] ?? null}
                onPick={val => pickScale(item.id, val)}
              />
            ))}
            <Divider />
            <CheckRow
              label="Had Sex"
              checked={!!checks['had-sex']}
              onToggle={() => toggleCheck('had-sex')}
              daysSince={daysSince['had-sex'] ?? null}
              colorFn={sexDaysSinceColor}
            />
            <Divider />
            <SubLabel label="Note" />
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              onBlur={e => saveNote(e.target.value)}
              placeholder="Notes for today..."
              rows={6}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${c.border}`, borderRadius: 7,
                color: c.text, fontSize: '0.78rem', lineHeight: 1.5,
                padding: '0.5rem 0.6rem', resize: 'none', outline: 'none',
                fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

function SubLabel({ label }) {
  return (
    <div style={{ fontSize: '0.62rem', fontWeight: 700, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0.1rem 0.2rem 0.02rem' }}>
      {label}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: c.border, margin: '0.2rem 0' }} />
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

function CheckRow({ label, checked, onToggle, daysSince, colorFn }) {
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
          <div style={{ fontSize: '0.62rem', marginTop: '0.1rem', color: (colorFn || defaultDaysSinceColor)(daysSince) }}>
            {daysSince === null ? '—' : daysSince === 0 ? 'today' : daysSince === 1 ? 'yesterday' : `${daysSince}d ago`}
          </div>
        )}
      </div>
    </div>
  )
}

function ScaleRow({ label, value, onPick }) {
  return (
    <div style={{ padding: '0.45rem 0.6rem', borderRadius: 7, border: `1px solid ${c.rowBorder}`, background: 'rgba(255,255,255,0.015)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
        <span style={{ fontSize: '0.8rem', color: value ? c.text : c.muted, fontWeight: value ? 600 : 400 }}>
          {label}
        </span>
        <span style={{ fontSize: '0.65rem', fontStyle: 'italic', color: value ? scaleColor(value) : c.muted, fontWeight: value ? 700 : 400 }}>
          {value ? `${value}/10` : ''}
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

function defaultDaysSinceColor(days) {
  if (days === null) return c.muted
  if (days <= 3)  return '#22C55E'
  if (days <= 5)  return c.muted
  if (days <= 7)  return '#F59E0B'
  return '#EF4444'
}

function sexDaysSinceColor(days) {
  if (days === null) return c.muted
  if (days <= 2)  return '#22C55E'
  if (days <= 3)  return '#F59E0B'
  return '#EF4444'
}

function facialDaysSinceColor(days) {
  if (days === null) return c.muted
  if (days <= 7)  return '#22C55E'
  if (days <= 10) return '#F59E0B'
  return '#EF4444'
}

function scaleColor(v) {
  if (v <= 3) return '#EF4444'
  if (v <= 6) return '#F59E0B'
  return '#22C55E'
}

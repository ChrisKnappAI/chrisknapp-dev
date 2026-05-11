'use client'
import { useState, useEffect, useCallback } from 'react'

function getToday() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
}

const GOALS = {
  chris: [
    'Stretch',
    'Posture',
  ],
  natalie: [
    { category: 'Mental Wellness',  items: ['Grateful Mantra', 'Yoga', 'Meditation', 'Personality Development by Reading'] },
    { category: 'Body Sculpting',   items: ['Weight Lifting', 'Targeted Abs', 'High Protein Nutrition'] },
    { category: 'Active Movement',  items: ['10,000 Steps'] },
    { category: 'Skill Mastery',    items: ['Pickleball', 'Rollerblading', 'Swimming'] },
    { category: 'Education',        items: ['English Improvement', 'Leisure Reading'] },
    { category: 'Beauty',           items: ['Face Routine', 'Body Routine'] },
    { category: 'Marriage',         items: ['Sex', 'Foot Massage', 'Head Massage', 'Speak Nicely', 'Support His Goals'] },
  ],
}

export default function GoalsLog({ user, theme = 'dark', label }) {
  const isDark   = theme === 'dark'
  const goals    = GOALS[user]
  const isGrouped = typeof goals[0] === 'object'

  const [date,    setDate]   = useState(getToday)
  const [checked, setChecked]= useState(new Set())
  const [saving,  setSaving] = useState(new Set())

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

  const fetchChecked = useCallback(async () => {
    const res  = await fetch(`/api/goals/log?user=${user}&date=${date}`)
    const data = await res.json()
    if (Array.isArray(data)) setChecked(new Set(data))
  }, [user, date])

  useEffect(() => { fetchChecked() }, [fetchChecked])

  async function toggle(goalName, category = null) {
    const isNowChecked = !checked.has(goalName)
    setChecked(prev => { const s = new Set(prev); isNowChecked ? s.add(goalName) : s.delete(goalName); return s })
    setSaving(prev => new Set(prev).add(goalName))
    await fetch('/api/goals/log', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ user, date, goal_name: goalName, category, checked: isNowChecked }),
    })
    setSaving(prev => { const s = new Set(prev); s.delete(goalName); return s })
  }

  const c = {
    bg:          isDark ? 'var(--c-dark)'        : 'var(--c-beige)',
    card:        isDark ? 'var(--c-dark-card)'   : '#FFFFFF',
    border:      isDark ? 'var(--c-dark-border)' : 'var(--c-beige-border)',
    text:        isDark ? '#F1F5F9'              : '#1E2A38',
    muted:       isDark ? '#64748B'              : '#A89A85',
    accent:      isDark ? 'var(--c-blue)'        : 'var(--c-sky)',
    accentBtn:   isDark ? '#2563EB'              : '#0EA5E9',
    checkBg:     isDark ? 'rgba(37,99,235,0.08)' : 'rgba(14,165,233,0.07)',
    checkBorder: isDark ? 'rgba(255,255,255,0.1)': 'rgba(0,0,0,0.1)',
  }

  const card = { background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: '1.5rem', marginBottom: '1rem' }

  const allGoals    = isGrouped ? goals.flatMap(g => g.items) : goals
  const checkedCount = allGoals.filter(g => checked.has(g)).length

  return (
    <div style={{ color: c.text }}>

      {/* ── Header + date nav ── */}
      <div style={{ padding: '1.25rem 2rem', borderBottom: `1px solid ${c.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: c.bg, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.025em' }}>{label}</div>
          <div style={{ fontSize: '0.78rem', color: checkedCount === allGoals.length ? '#22C55E' : c.muted, fontWeight: 600 }}>
            {checkedCount} / {allGoals.length} done
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={() => shiftDate(-1)} style={btnNav(c)}>←</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: c.card, border: `1px solid ${c.border}`, borderRadius: 8, padding: '0.35rem 0.75rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, minWidth: 80, textAlign: 'center' }}>{friendlyDate(date)}</span>
            <input type="date" value={date} max={getToday()} onChange={e => setDate(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: c.muted, fontSize: '0.78rem', outline: 'none', cursor: 'pointer', padding: 0 }} />
          </div>
          <button onClick={() => shiftDate(1)} disabled={date >= getToday()} style={{ ...btnNav(c), opacity: date >= getToday() ? 0.3 : 1 }}>→</button>
        </div>
      </div>

      <div style={{ padding: '1.5rem 2rem' }}>
        {isGrouped ? (
          goals.map(group => {
            const groupDone = group.items.filter(i => checked.has(i)).length
            return (
              <div key={group.category} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{group.category}</div>
                  <div style={{ fontSize: '0.72rem', color: groupDone === group.items.length ? '#22C55E' : c.muted, fontWeight: 600 }}>
                    {groupDone}/{group.items.length}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {group.items.map(item => (
                    <GoalRow key={item} label={item} checked={checked.has(item)} saving={saving.has(item)} onToggle={() => toggle(item, group.category)} c={c} />
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          <div style={card}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {goals.map(goal => (
                <GoalRow key={goal} label={goal} checked={checked.has(goal)} saving={saving.has(goal)} onToggle={() => toggle(goal)} c={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function GoalRow({ label, checked, saving, onToggle, c }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.85rem',
        padding: '0.7rem 0.9rem', borderRadius: 8,
        cursor: saving ? 'wait' : 'pointer',
        background: checked ? c.checkBg : 'transparent',
        border: `1px solid ${checked ? c.accentBtn : c.checkBorder}`,
        transition: 'all 0.12s ease',
        opacity: saving ? 0.6 : 1,
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: 5,
        border: `2px solid ${checked ? c.accentBtn : c.checkBorder}`,
        background: checked ? c.accentBtn : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all 0.12s ease',
      }}>
        {checked && <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>✓</span>}
      </div>
      <span style={{ fontSize: '0.875rem', fontWeight: checked ? 600 : 400, color: checked ? c.text : c.muted }}>
        {label}
      </span>
    </div>
  )
}

function btnNav(c) {
  return { background: c.card, border: `1px solid ${c.border}`, color: c.muted, borderRadius: 6, padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }
}

'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

function getToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function fmt(n) { return Math.round(n * 10) / 10 }

function calcMacros(ing) {
  const amount = parseFloat(ing.actual_amount) || 0
  const pct    = parseFloat(ing.user_percent)  || 0
  const s      = ing.serving_size > 0 ? (amount / ing.serving_size) * pct : 0
  return {
    cal:     fmt(s * ing.serving_calories),
    protein: fmt(s * ing.serving_protein),
    carbs:   fmt(s * ing.serving_carbs),
    fat:     fmt(s * ing.serving_fat),
  }
}

function sumMacros(list) {
  return list.reduce((a, ing) => {
    const m = calcMacros(ing)
    return { cal: a.cal + m.cal, protein: a.protein + m.protein, carbs: a.carbs + m.carbs, fat: a.fat + m.fat }
  }, { cal: 0, protein: 0, carbs: 0, fat: 0 })
}

// ── Nutrition goals per user ───────────────────────────────────
const USER_GOALS = {
  chris: {
    cal:     { goal: 2100, type: 'max' },
    protein: { goal: 160,  type: 'min' },
    carbs:   { goal: 210,  type: 'max' },
    fat:     { goal: 70,   type: 'max' },
  },
  natalie: {
    cal:     { goal: 1500, type: 'min' },
    protein: { goal: 100,  type: 'min' },
    carbs:   null,
    fat:     null,
  },
}

export default function FoodTracker({ user, theme = 'dark', label }) {
  const isDark = theme === 'dark'

  // ── date ──
  const [date, setDate]  = useState(getToday)

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
    const yesterdayStr = `${yest.getFullYear()}-${String(yest.getMonth()+1).padStart(2,'0')}-${String(yest.getDate()).padStart(2,'0')}`
    if (d === today)        return 'Today'
    if (d === yesterdayStr) return 'Yesterday'
    return d
  }

  // ── meal list ──
  const [mealList, setMealList] = useState([])
  useEffect(() => {
    supabase.from('meal_ingredient_lookup').select('meal, meal_version').then(({ data, error }) => {
      if (error || !data) return
      const map = {}
      data.forEach(r => { if (!map[r.meal]) map[r.meal] = new Set(); map[r.meal].add(r.meal_version) })
      setMealList(
        Object.entries(map).map(([meal, vs]) => ({
          meal,
          versions: [...vs].sort((a, b) => b.localeCompare(a, undefined, { numeric: true })),
        })).sort((a, b) => a.meal.localeCompare(b.meal))
      )
    })
  }, [])

  // ── meal logger ──
  const [selectedMeal,    setSelectedMeal]    = useState('')
  const [selectedVersion, setSelectedVersion] = useState('')
  const [ingredients,     setIngredients]     = useState([])
  const [submitting,      setSubmitting]       = useState(false)
  const [toast,           setToast]            = useState(null)

  // ── manual entry state ──
  const [isManual,     setIsManual]     = useState(false)
  const [manualName,   setManualName]   = useState('')
  const [manualCal,    setManualCal]    = useState('')
  const [manualProtein,setManualProtein]= useState('')
  const [manualCarbs,  setManualCarbs]  = useState('')
  const [manualFat,    setManualFat]    = useState('')

  function selectMeal(meal) {
    if (meal === '__MANUAL__') {
      setSelectedMeal('__MANUAL__')
      setSelectedVersion('MANUAL')
      setIsManual(true)
      setIngredients([])
      return
    }
    setIsManual(false)
    const found    = mealList.find(m => m.meal === meal)
    const versions = found?.versions || []
    setSelectedMeal(meal)
    setSelectedVersion(versions[0] || '') // auto-pick highest version
  }

  useEffect(() => {
    if (isManual || !selectedMeal || !selectedVersion) { setIngredients([]); return }
    supabase
      .from('meal_ingredient_lookup')
      .select('*')
      .eq('meal', selectedMeal)
      .eq('meal_version', selectedVersion)
      .then(({ data, error }) => {
        if (error || !data) return
        setIngredients(data.map(r => ({
          ...r,
          actual_amount: r.expected_amount,
          user_percent:  r.user_percent,
        })))
      })
  }, [selectedMeal, selectedVersion, isManual])

  function updateIng(idx, field, val) {
    setIngredients(prev => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r))
  }

  // ── day log ──
  const [dayLog,     setDayLog]     = useState([])
  const [logLoading, setLogLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  const fetchLog = useCallback(async () => {
    setLogLoading(true)
    setFetchError(null)
    try {
      const res  = await fetch(`/api/food/log?user=${user}&date=${date}`)
      const data = await res.json()
      if (!res.ok) { setFetchError(data?.error || 'Failed to load log'); setDayLog([]) }
      else setDayLog(Array.isArray(data) ? data : [])
    } catch (e) {
      setFetchError(e.message)
      setDayLog([])
    }
    setLogLoading(false)
  }, [user, date])

  useEffect(() => { fetchLog() }, [fetchLog])

  // ── submit ──
  async function handleLog() {
    setSubmitting(true)

    if (isManual) {
      if (!manualName || !manualCal) { setSubmitting(false); return }
      const res = await fetch('/api/food/log', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user, date,
          meal: manualName,
          meal_version: 'MANUAL',
          ingredients: [{
            ingredient:       manualName,
            serving_metric:   'serving',
            serving_size:     1,
            actual_amount:    1,
            user_percent:     1.0,
            serving_calories: parseFloat(manualCal)     || 0,
            serving_fat:      parseFloat(manualFat)     || 0,
            serving_carbs:    parseFloat(manualCarbs)   || 0,
            serving_protein:  parseFloat(manualProtein) || 0,
          }],
        }),
      })
      if (res.ok) {
        await fetchLog()
        setSelectedMeal('')
        setSelectedVersion('')
        setIsManual(false)
        setManualName(''); setManualCal(''); setManualFat(''); setManualCarbs(''); setManualProtein('')
        showToast('Meal logged!')
      }
      setSubmitting(false)
      return
    }

    if (!selectedMeal || !selectedVersion || ingredients.length === 0) { setSubmitting(false); return }
    const res = await fetch('/api/food/log', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user, date,
        meal: selectedMeal, meal_version: selectedVersion,
        ingredients: ingredients.map(ing => ({
          ingredient:       ing.ingredient,
          serving_metric:   ing.serving_metric,
          serving_size:     ing.serving_size,
          actual_amount:    parseFloat(ing.actual_amount) || 0,
          user_percent:     parseFloat(ing.user_percent)  || 0,
          serving_calories: ing.serving_calories,
          serving_fat:      ing.serving_fat,
          serving_carbs:    ing.serving_carbs,
          serving_protein:  ing.serving_protein,
        })),
      }),
    })
    if (res.ok) {
      await fetchLog()
      setSelectedMeal('')
      setSelectedVersion('')
      setIngredients([])
      showToast('Meal logged!')
    }
    setSubmitting(false)
  }

  // ── delete ──
  async function handleDeleteGroup(entries) {
    if (!window.confirm('Remove this meal entry?')) return
    await Promise.all(entries.map(e =>
      fetch('/api/food/log', {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id: e.id }),
      })
    ))
    await fetchLog()
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 3000) }

  // ── group log by meal + logged_at batch ──
  const groups = []
  const seen   = {}
  dayLog.forEach(e => {
    const key = `${e.meal}__${e.logged_at}`
    if (!seen[key]) { seen[key] = { meal: e.meal, entries: [] }; groups.push(seen[key]) }
    seen[key].entries.push(e)
  })

  const dayTotals  = dayLog.reduce((a, e) => ({ cal: a.cal + e.calories, protein: a.protein + e.protein, carbs: a.carbs + e.carbs, fat: a.fat + e.fat }), { cal: 0, protein: 0, carbs: 0, fat: 0 })
  const goals      = USER_GOALS[user] || {}
  const mealTotals = sumMacros(ingredients)

  // ── theme tokens ──
  const c = {
    bg:        isDark ? 'var(--c-dark)'        : 'var(--c-beige)',
    card:      isDark ? 'var(--c-dark-card)'   : '#FFFFFF',
    border:    isDark ? 'var(--c-dark-border)' : 'var(--c-beige-border)',
    text:      isDark ? '#F1F5F9'              : '#1E2A38',
    muted:     isDark ? '#64748B'              : '#A89A85',
    inputBg:   isDark ? '#0B1424'              : 'var(--c-beige)',
    inputBdr:  isDark ? 'rgba(255,255,255,0.1)': 'rgba(0,0,0,0.12)',
    accentBtn: isDark ? '#2563EB'              : '#0EA5E9',
    accent:    isDark ? 'var(--c-blue)'        : 'var(--c-sky)',
    calColor:  isDark ? '#93C5FD'              : '#0369A1',
    navBg:     isDark ? 'var(--c-dark-sidebar)': 'var(--c-beige-sidebar)',
  }

  const input = { background: c.inputBg, border: `1px solid ${c.inputBdr}`, borderRadius: 6, padding: '0.45rem 0.65rem', color: c.text, fontSize: '0.85rem', outline: 'none', width: '100%' }
  const card  = { background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: '1.5rem', marginBottom: '1rem' }
  const lbl   = { fontSize: '0.68rem', fontWeight: 600, color: c.muted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' }
  const thStyle = { padding: '0.45rem 0.6rem', fontSize: '0.65rem', fontWeight: 600, color: c.muted, letterSpacing: '0.05em', textTransform: 'uppercase' }

  const selectedVersions = mealList.find(m => m.meal === selectedMeal)?.versions || []

  const logBtnDisabled = submitting ||
    (isManual ? (!manualName || !manualCal) : (!selectedMeal || !selectedVersion))

  return (
    <div style={{ color: c.text }}>

      {/* ── Header + date nav ── */}
      <div style={{ padding: '1.25rem 2rem', borderBottom: `1px solid ${c.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: c.bg, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.025em' }}>{label}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={() => shiftDate(-1)} style={btnNav(c)}>←</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: c.card, border: `1px solid ${c.border}`, borderRadius: 8, padding: '0.28rem 0.7rem' }}>
            <span style={{ fontSize: '0.83rem', fontWeight: 600, minWidth: 76, textAlign: 'center' }}>
              {friendlyDate(date)}
            </span>
            <input
              type="date"
              value={date}
              max={getToday()}
              onChange={e => setDate(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: c.muted, fontSize: '0.72rem', outline: 'none', cursor: 'pointer', padding: 0 }}
            />
          </div>

          <button onClick={() => shiftDate(1)} disabled={date >= getToday()} style={{ ...btnNav(c), opacity: date >= getToday() ? 0.3 : 1 }}>→</button>
        </div>
      </div>

      <div style={{ padding: '1rem 2rem' }}>

        {toast && (
          <div style={{ background: '#22C55E', color: 'white', padding: '0.6rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.84rem', fontWeight: 600 }}>
            ✓ {toast}
          </div>
        )}

        {/* ── Meal logger ── */}
        <div style={card}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '1.25rem' }}>Log a Meal</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={lbl}>Meal</label>
              <select value={selectedMeal} onChange={e => selectMeal(e.target.value)} style={input}>
                <option value="">Select meal...</option>
                {mealList.map(m => <option key={m.meal} value={m.meal}>{m.meal}</option>)}
                <option value="__MANUAL__">— Add Manual Meal —</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Version</label>
              <select
                value={selectedVersion}
                onChange={e => setSelectedVersion(e.target.value)}
                disabled={!selectedMeal || isManual}
                style={{ ...input, opacity: (selectedMeal && !isManual) ? 1 : 0.4 }}
              >
                <option value="">Select version...</option>
                {selectedVersions.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          {/* ── Manual entry form ── */}
          {isManual && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={lbl}>Meal Name / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Chipotle burrito bowl"
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  style={input}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={lbl}>Calories</label>
                  <input type="number" min={0} placeholder="0" value={manualCal} onChange={e => setManualCal(e.target.value)} style={{ ...input, textAlign: 'right' }} />
                </div>
                <div>
                  <label style={{ ...lbl, color: '#22C55E' }}>Protein (g)</label>
                  <input type="number" min={0} placeholder="0" value={manualProtein} onChange={e => setManualProtein(e.target.value)} style={{ ...input, textAlign: 'right' }} />
                </div>
                <div>
                  <label style={{ ...lbl, color: '#F97316' }}>Carbs (g)</label>
                  <input type="number" min={0} placeholder="0" value={manualCarbs} onChange={e => setManualCarbs(e.target.value)} style={{ ...input, textAlign: 'right' }} />
                </div>
                <div>
                  <label style={lbl}>Fat (g)</label>
                  <input type="number" min={0} placeholder="0" value={manualFat} onChange={e => setManualFat(e.target.value)} style={{ ...input, textAlign: 'right' }} />
                </div>
              </div>
            </div>
          )}

          {/* ── Ingredient table ── */}
          {!isManual && ingredients.length > 0 && (
            <>
              <div style={{ overflowX: 'auto', marginBottom: '0.75rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                      <th style={{ ...thStyle, textAlign: 'left'   }}>Ingredient</th>
                      <th style={{ ...thStyle, textAlign: 'center' }}>Amount</th>
                      <th style={{ ...thStyle, textAlign: 'center' }}>Unit</th>
                      <th style={{ ...thStyle, textAlign: 'center' }}>% Eaten</th>
                      <th style={{ ...thStyle, textAlign: 'center', color: c.calColor }}>Cal</th>
                      <th style={{ ...thStyle, textAlign: 'center', color: '#22C55E'  }}>Protein</th>
                      <th style={{ ...thStyle, textAlign: 'center', color: '#F97316'  }}>Carbs</th>
                      <th style={{ ...thStyle, textAlign: 'center', color: c.muted   }}>Fat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ing, idx) => {
                      const m = calcMacros(ing)
                      return (
                        <tr key={idx} style={{ borderBottom: `1px solid ${c.border}` }}>
                          <td style={{ padding: '0.45rem 0.6rem', fontWeight: 500 }}>{ing.ingredient}</td>
                          <td style={{ padding: '0.45rem 0.6rem', textAlign: 'center' }}>
                            <input
                              type="number"
                              value={ing.actual_amount}
                              min={0}
                              onChange={e => updateIng(idx, 'actual_amount', e.target.value)}
                              style={{ ...input, width: 70, textAlign: 'right' }}
                            />
                          </td>
                          <td style={{ padding: '0.45rem 0.6rem', textAlign: 'center', color: c.muted }}>{ing.serving_metric}</td>
                          <td style={{ padding: '0.45rem 0.6rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                              <input
                                type="range" min={0} max={1} step={0.05}
                                value={parseFloat(ing.user_percent) || 0}
                                onChange={e => updateIng(idx, 'user_percent', parseFloat(e.target.value))}
                                style={{ width: 70, accentColor: c.accentBtn }}
                              />
                              <span style={{ fontSize: '0.75rem', color: c.muted, minWidth: 32, textAlign: 'right' }}>
                                {Math.round((parseFloat(ing.user_percent) || 0) * 100)}%
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '0.45rem 0.6rem', textAlign: 'center', color: c.calColor, fontWeight: 600 }}>{m.cal}</td>
                          <td style={{ padding: '0.45rem 0.6rem', textAlign: 'center', color: '#22C55E',  fontWeight: 600 }}>{m.protein}g</td>
                          <td style={{ padding: '0.45rem 0.6rem', textAlign: 'center', color: '#F97316',  fontWeight: 600 }}>{m.carbs}g</td>
                          <td style={{ padding: '0.45rem 0.6rem', textAlign: 'center', color: c.muted                    }}>{m.fat}g</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Meal total preview */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '0.65rem 0.6rem', borderTop: `1px solid ${c.border}`, marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: c.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Meal Total</span>
                <Chip label="Cal"     value={fmt(mealTotals.cal)}             color={c.calColor} />
                <Chip label="Protein" value={`${fmt(mealTotals.protein)}g`}   color="#22C55E"   />
                <Chip label="Carbs"   value={`${fmt(mealTotals.carbs)}g`}     color="#F97316"   />
                <Chip label="Fat"     value={`${fmt(mealTotals.fat)}g`}       color={c.muted}   />
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleLog}
              disabled={logBtnDisabled}
              style={{ background: c.accentBtn, color: 'white', border: 'none', borderRadius: 8, padding: '0.65rem 1.75rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', opacity: logBtnDisabled ? 0.4 : 1 }}
            >
              {submitting ? 'Logging…' : 'Log Meal'}
            </button>
          </div>
        </div>

        {/* ── Day log ── */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>
              {friendlyDate(date) === 'Today' ? "Today's Log" : friendlyDate(date) === 'Yesterday' ? "Yesterday's Log" : `Log — ${date}`}
            </div>
            <div style={{ display: 'flex', gap: '1.75rem' }}>
              <GoalChip label="Calories" actual={dayTotals.cal}     unit=""  goal={goals.cal}     defaultColor={c.calColor} />
              <GoalChip label="Protein"  actual={dayTotals.protein} unit="g" goal={goals.protein} defaultColor="#22C55E"   />
              <GoalChip label="Carbs"    actual={dayTotals.carbs}   unit="g" goal={goals.carbs}   defaultColor={goals.carbs ? "#F97316" : c.text} />
              <GoalChip label="Fat"      actual={dayTotals.fat}     unit="g" goal={goals.fat}     defaultColor={goals.fat  ? c.muted   : c.text} />
            </div>
          </div>

          {fetchError && (
            <div style={{ color: '#EF4444', fontSize: '0.82rem', marginBottom: '1rem' }}>Error loading log: {fetchError}</div>
          )}

          {logLoading && <div style={{ color: c.muted, fontSize: '0.85rem', padding: '1rem 0' }}>Loading…</div>}

          {!logLoading && !fetchError && groups.length === 0 && (
            <div style={{ color: c.muted, fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>
              Nothing logged {friendlyDate(date) === 'Today' ? 'today' : `for ${date}`} yet.
            </div>
          )}

          {groups.map((group, gi) => {
            const gt = group.entries.reduce((a, e) => ({
              cal: a.cal + e.calories, protein: a.protein + e.protein,
              carbs: a.carbs + e.carbs, fat: a.fat + e.fat,
            }), { cal: 0, protein: 0, carbs: 0, fat: 0 })

            return (
              <div key={gi} style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${c.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: c.accent }}>{group.meal}</span>
                    <span style={{ fontSize: '0.72rem', color: c.muted }}>
                      {fmt(gt.cal)} cal · {fmt(gt.protein)}g P · {fmt(gt.carbs)}g C · {fmt(gt.fat)}g F
                    </span>
                  </div>
                  <button onClick={() => handleDeleteGroup(group.entries)} style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: '0.2rem 0.5rem' }}>
                    Remove
                  </button>
                </div>
                {group.entries.map(e => {
                  const pct      = Math.round(e.user_percent * 100)
                  const unit     = e.serving_metric === 'grams' ? 'g' : ` ${e.serving_metric}`
                  const consumed = Math.round(e.actual_amount * e.user_percent)
                  return (
                    <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: c.muted, padding: '0.15rem 0.75rem' }}>
                      <span>{e.ingredient}</span>
                      <span>{pct}% eaten of {e.actual_amount}{unit} prepared → {consumed}{unit} → {fmt(e.calories)} cal / {fmt(e.protein)}g P</span>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Chip({ label, value, color, big }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: big ? '1rem' : '0.85rem', fontWeight: 700, color }}>{value}</div>
    </div>
  )
}

function GoalChip({ label, actual, unit, goal, defaultColor }) {
  let valueColor = defaultColor
  if (goal) {
    if (goal.type === 'max') valueColor = actual <= goal.goal ? '#4ADE80' : '#F87171'
    if (goal.type === 'min') valueColor = actual >= goal.goal ? '#4ADE80' : '#FACC15'
  }
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: valueColor, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
        {Math.round(actual)}{unit}
        {goal && (
          <span style={{ fontSize: '0.72rem', fontWeight: 500, color: '#475569' }}>
            {' '}/ {goal.goal}{unit}
          </span>
        )}
      </div>
    </div>
  )
}

function btnNav(c) {
  return { background: c.card, border: `1px solid ${c.border}`, color: c.muted, borderRadius: 6, padding: '0.32rem 0.65rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }
}

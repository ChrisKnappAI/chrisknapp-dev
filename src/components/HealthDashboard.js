'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { DashCard } from './ChrisDashboard'

// ── Colors ─────────────────────────────────────────────────────

const BODY_COLORS = {
  weight:   '#3b82f6',
  bodyFat:  '#f97316',
  leanMass: '#60a5fa',
  bmi:      '#fb923c',
}

// Stack order: Strength (bottom) → Walking → Pickleball → Swimming → others
const WORKOUT_STACK_ORDER = ['TraditionalStrengthTraining', 'Walking', 'Pickleball', 'Swimming']

const WORKOUT_COLORS = {
  TraditionalStrengthTraining: '#f97316',  // orange — matches body comp chart orange
  Walking:                     '#1d4ed8',  // dark blue
  Pickleball:                  '#3b82f6',  // medium blue
  Swimming:                    '#60a5fa',  // light blue
}
const FALLBACK_COLORS = ['#93c5fd', '#fdba74', '#a78bfa', '#4ade80']

const WORKOUT_LABELS = {
  TraditionalStrengthTraining: 'Strength',
  Walking:                     'Walking',
  Pickleball:                  'Pickleball',
  Swimming:                    'Swimming',
}

const SLEEP_COLORS = { deep: '#1d4ed8', rem: '#3b82f6', core: '#60a5fa' }

// ── Date helpers ───────────────────────────────────────────────

function getWeekStart(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const day = d.getDay()
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
  return d.toISOString().slice(0, 10)
}

function formatLabel(key, granularity) {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  if (granularity === 'monthly') {
    const [y, m] = key.split('-')
    return `${MONTHS[+m - 1]} '${y.slice(2)}`
  }
  const d = new Date(key + 'T12:00:00')
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`
}

function nextPeriod(period, granularity) {
  if (granularity === 'monthly') {
    const [y, m] = period.split('-').map(Number)
    const d = new Date(y, m, 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }
  const d = new Date(period + 'T12:00:00')
  d.setDate(d.getDate() + (granularity === 'weekly' ? 7 : 1))
  return d.toISOString().slice(0, 10)
}

function fillPeriods(data, periodKeys, granularity) {
  if (!data.length) return periodKeys.map(p => ({ period: p, label: formatLabel(p, granularity) }))
  const map = Object.fromEntries(data.map(d => [d.period, d]))
  const nullFields = Object.fromEntries(
    Object.keys(data[0]).filter(k => k !== 'period' && k !== 'label').map(k => [k, null])
  )
  return periodKeys.map(p => map[p] || { period: p, label: formatLabel(p, granularity), ...nullFields })
}

function monthBoundaryLabels(data) {
  const seen = new Set()
  const labels = []
  for (const row of data) {
    const month = row.period.slice(0, 7)
    if (!seen.has(month)) {
      seen.add(month)
      if (seen.size > 1) labels.push(row.label)
    }
  }
  return labels
}

// ── Aggregation ────────────────────────────────────────────────

function groupAverage(rows, granularity, fields) {
  if (granularity === 'daily') {
    return rows.map(r => ({ ...r, label: formatLabel(r.period, 'daily') }))
  }
  const sums = {}, counts = {}
  for (const row of rows) {
    const key = granularity === 'weekly' ? getWeekStart(row.period) : row.period.slice(0, 7)
    if (!sums[key]) { sums[key] = { period: key }; counts[key] = {} }
    for (const f of fields) {
      if (row[f] != null) {
        sums[key][f] = (sums[key][f] || 0) + row[f]
        counts[key][f] = (counts[key][f] || 0) + 1
      }
    }
  }
  return Object.values(sums).map(g => {
    const result = { period: g.period, label: formatLabel(g.period, granularity) }
    for (const f of fields) {
      const c = counts[g.period][f]
      result[f] = c ? Math.round(g[f] / c * 10) / 10 : null
    }
    return result
  }).sort((a, b) => a.period.localeCompare(b.period))
}

function groupWorkoutAverage(rows, granularity, types) {
  if (granularity === 'daily') {
    return rows.map(r => ({ ...r, label: formatLabel(r.period, 'daily') }))
  }
  const sums = {}, counts = {}
  for (const row of rows) {
    const key = granularity === 'weekly' ? getWeekStart(row.period) : row.period.slice(0, 7)
    if (!sums[key]) { sums[key] = { period: key }; counts[key] = 0 }
    counts[key]++
    for (const t of types) sums[key][t] = (sums[key][t] || 0) + (row[t] || 0)
  }
  return Object.values(sums).map(g => {
    const c = counts[g.period]
    const result = { period: g.period, label: formatLabel(g.period, granularity) }
    for (const t of types) result[t] = c ? Math.round(g[t] / c * 10) / 10 : 0
    return result
  }).sort((a, b) => a.period.localeCompare(b.period))
}

// ── Data processors ────────────────────────────────────────────

function processBodyStats(raw, granularity) {
  if (!raw?.length) return []
  return groupAverage(
    raw.map(r => ({ period: r.date, weight: r.weight_lbs, bodyFat: r.body_fat_pct, leanMass: r.lean_body_mass_lbs, bmi: r.bmi })),
    granularity, ['weight', 'bodyFat', 'leanMass', 'bmi']
  )
}

function processWorkouts(raw, granularity) {
  if (!raw?.length) return { data: [], types: [] }
  const allTypes = [...new Set(raw.map(r => r.type))]
  const types = [
    ...WORKOUT_STACK_ORDER.filter(t => allTypes.includes(t)),
    ...allTypes.filter(t => !WORKOUT_STACK_ORDER.includes(t)).sort(),
  ]

  const dailyMap = {}
  for (const r of raw) {
    if (!dailyMap[r.date]) { dailyMap[r.date] = { period: r.date }; types.forEach(t => { dailyMap[r.date][t] = 0 }) }
    dailyMap[r.date][r.type] = (dailyMap[r.date][r.type] || 0) + r.duration_min
  }

  const dates = Object.keys(dailyMap).sort()
  const start = new Date(dates[0] + 'T12:00:00')
  const end   = new Date(dates[dates.length - 1] + 'T12:00:00')
  const allRows = []
  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10)
    allRows.push(dailyMap[key] || { period: key, ...Object.fromEntries(types.map(t => [t, 0])) })
  }

  return { data: groupWorkoutAverage(allRows, granularity, types), types }
}

function processSleep(raw, granularity) {
  if (!raw?.length) return []
  return groupAverage(
    raw.map(r => ({ period: r.date, deep: r.deep_min, rem: r.rem_min, core: r.core_min, total: r.total_sleep_min })),
    granularity, ['deep', 'rem', 'core', 'total']
  )
}

// ── Shared chart config ────────────────────────────────────────

const TOOLTIP_STYLE = {
  background: '#0f172a', border: '1px solid #334155',
  borderRadius: 8, padding: '0.6rem 0.9rem',
  fontSize: '0.78rem', color: '#f1f5f9',
}
const GRID  = { stroke: '#1e293b', strokeDasharray: '3 3' }
const ATICK = { fontSize: 11, fill: '#475569' }

function fmtMins(v) {
  if (v == null || v === 0) return '—'
  const h = Math.floor(v / 60), m = Math.round(v % 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function makeMonthTick(data) {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return function MonthTick({ x, y, payload }) {
    const idx = payload.index
    const curr = data[idx]
    if (!curr) return null
    const prev = data[idx - 1]
    const isFirstInMonth = !prev || prev.period.slice(0, 7) !== curr.period.slice(0, 7)
    if (!isFirstInMonth) return null
    const [yr, mo] = curr.period.slice(0, 7).split('-')
    return (
      <g transform={`translate(${x},${y})`}>
        <text dy={14} textAnchor="middle" fill="#475569" fontSize={11}>
          {`${MONTHS[+mo - 1]} '${yr.slice(2)}`}
        </text>
      </g>
    )
  }
}

function dataDomain(data, keys, pad = 0.15) {
  const vals = data.flatMap(d => keys.map(k => d[k])).filter(v => v != null)
  if (!vals.length) return ['auto', 'auto']
  const min = Math.min(...vals), max = Math.max(...vals)
  const range = max - min || 1
  return [Math.floor(min - range * pad), Math.ceil(max + range * pad)]
}

function MonthLines({ data }) {
  return monthBoundaryLabels(data).map(label => (
    <ReferenceLine key={label} x={label} stroke="#334155" strokeWidth={1} />
  ))
}

// ── Body chart ─────────────────────────────────────────────────

function BodyChart({ data, showLeanMass, showBMI, granularity, chartHeight }) {
  const leftKeys  = ['weight', ...(showLeanMass ? ['leanMass'] : [])]
  const rightKeys = ['bodyFat', ...(showBMI ? ['bmi'] : [])]
  const leftDomain  = dataDomain(data, leftKeys)
  const rightDomain = dataDomain(data, rightKeys)

  const tooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const fmt = (key, v) => {
      if (v == null) return '—'
      if (key === 'weight' || key === 'leanMass') return `${v} lbs`
      if (key === 'bodyFat') return `${v}%`
      return `${v}`
    }
    const LABELS = { weight: 'Weight', bodyFat: 'Body Fat', leanMass: 'Lean Mass', bmi: 'BMI' }
    return (
      <div style={TOOLTIP_STYLE}>
        <div style={{ marginBottom: '0.4rem', color: '#94a3b8' }}>{label}</div>
        {payload.map(p => (
          <div key={p.dataKey} style={{ color: p.color, marginBottom: '0.15rem' }}>
            {LABELS[p.dataKey]}: {fmt(p.dataKey, p.value)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid {...GRID} vertical={false} />
          <XAxis dataKey="label" tick={makeMonthTick(data)} axisLine={false} tickLine={false} interval={0} />
          <YAxis yAxisId="left"  domain={leftDomain}  tick={ATICK} axisLine={false} tickLine={false} width={44} />
          <YAxis yAxisId="right" orientation="right" domain={rightDomain} tick={ATICK} axisLine={false} tickLine={false} width={36} />
          <Tooltip content={tooltip} />
          {monthBoundaryLabels(data).map(lbl => <ReferenceLine key={lbl} x={lbl} yAxisId="left" stroke="#334155" strokeWidth={1} />)}
          <Line yAxisId="left"  type="monotone" dataKey="weight"   stroke={BODY_COLORS.weight}   strokeWidth={2}   dot={false} connectNulls />
          <Line yAxisId="right" type="monotone" dataKey="bodyFat"  stroke={BODY_COLORS.bodyFat}  strokeWidth={2}   dot={false} connectNulls />
          {showLeanMass && <Line yAxisId="left"  type="monotone" dataKey="leanMass" stroke={BODY_COLORS.leanMass} strokeWidth={1.5} strokeDasharray="4 2" dot={false} connectNulls />}
          {showBMI      && <Line yAxisId="right" type="monotone" dataKey="bmi"      stroke={BODY_COLORS.bmi}      strokeWidth={1.5} strokeDasharray="4 2" dot={false} connectNulls />}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Workout chart ──────────────────────────────────────────────

function WorkoutChart({ data, types, granularity, chartHeight }) {
  const dataWithTotal = data.map(row => ({
    ...row,
    workoutTotal: types.every(t => row[t] == null) ? null : types.reduce((s, t) => s + (row[t] || 0), 0),
  }))

  const tooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const totalEntry = payload.find(p => p.dataKey === 'workoutTotal')
    return (
      <div style={TOOLTIP_STYLE}>
        <div style={{ marginBottom: '0.4rem', color: '#94a3b8' }}>{label}</div>
        {totalEntry && <div style={{ color: '#f1f5f9', marginBottom: '0.3rem', fontWeight: 600 }}>Avg: {fmtMins(totalEntry.value)}/day</div>}
        {payload.filter(p => p.dataKey !== 'workoutTotal' && p.value > 0).map(p => (
          <div key={p.dataKey} style={{ color: p.fill, marginBottom: '0.15rem' }}>
            {WORKOUT_LABELS[p.dataKey] || p.dataKey}: {fmtMins(p.value)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={dataWithTotal} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid {...GRID} vertical={false} />
            <XAxis dataKey="label" tick={makeMonthTick(dataWithTotal)} axisLine={false} tickLine={false} interval={0} />
            <YAxis tick={ATICK} axisLine={false} tickLine={false} width={44} tickFormatter={v => `${Math.round(v)}m`} />
            <YAxis yAxisId="phantom" orientation="right" width={36} tick={false} axisLine={false} tickLine={false} />
            <Tooltip content={tooltip} cursor={{ fill: '#ffffff08' }} />
            <MonthLines data={dataWithTotal} />
            {types.map((t, i) => (
              <Bar key={t} dataKey={t} stackId="w" fill={WORKOUT_COLORS[t] || FALLBACK_COLORS[i % FALLBACK_COLORS.length]} />
            ))}
            <Line type="monotone" dataKey="workoutTotal" stroke="#e2e8f0" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <ChartLegend items={[
        ...types.map((t, i) => ({ label: WORKOUT_LABELS[t] || t, color: WORKOUT_COLORS[t] || FALLBACK_COLORS[i % FALLBACK_COLORS.length] })),
        { label: 'Total', color: '#e2e8f0', line: true },
      ]} />
    </>
  )
}

// ── Sleep chart ────────────────────────────────────────────────

function SleepChart({ data, granularity, chartHeight }) {
  const tooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const totalEntry = payload.find(p => p.dataKey === 'total')
    return (
      <div style={TOOLTIP_STYLE}>
        <div style={{ marginBottom: '0.4rem', color: '#94a3b8' }}>{label}</div>
        {totalEntry && <div style={{ color: '#f1f5f9', marginBottom: '0.3rem', fontWeight: 600 }}>Avg: {fmtMins(totalEntry.value)}/night</div>}
        {payload.filter(p => p.dataKey !== 'total' && p.value > 0).map(p => (
          <div key={p.dataKey} style={{ color: p.color, marginBottom: '0.15rem' }}>
            {p.dataKey.charAt(0).toUpperCase() + p.dataKey.slice(1)}: {fmtMins(p.value)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid {...GRID} vertical={false} />
            <XAxis dataKey="label" tick={makeMonthTick(data)} axisLine={false} tickLine={false} interval={0} />
            <YAxis tick={ATICK} axisLine={false} tickLine={false} width={44} tickFormatter={fmtMins} />
            <YAxis yAxisId="phantom" orientation="right" width={36} tick={false} axisLine={false} tickLine={false} />
            <Tooltip content={tooltip} cursor={{ fill: '#ffffff08' }} />
            <MonthLines data={data} />
            <Bar dataKey="deep" stackId="s" fill={SLEEP_COLORS.deep} />
            <Bar dataKey="rem"  stackId="s" fill={SLEEP_COLORS.rem}  />
            <Bar dataKey="core" stackId="s" fill={SLEEP_COLORS.core} />
            <Line type="monotone" dataKey="total" stroke="#e2e8f0" strokeWidth={2} dot={false} connectNulls />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <ChartLegend items={[
        { label: 'Deep',  color: SLEEP_COLORS.deep },
        { label: 'REM',   color: SLEEP_COLORS.rem  },
        { label: 'Core',  color: SLEEP_COLORS.core },
        { label: 'Total', color: '#e2e8f0', line: true },
      ]} />
    </>
  )
}

// ── Shared UI ──────────────────────────────────────────────────

function ChartLegend({ items }) {
  return (
    <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
      {items.map(item => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: item.line ? 14 : 10, height: item.line ? 2 : 10, borderRadius: item.line ? 0 : 2, background: item.color }} />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function GranularityToggle({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.2rem', background: '#0f172a', borderRadius: 8, padding: '0.2rem' }}>
      {['daily', 'weekly', 'monthly'].map(opt => (
        <button key={opt} onClick={() => onChange(opt)} style={{
          padding: '0.35rem 0.9rem', borderRadius: 6, border: 'none', cursor: 'pointer',
          fontSize: '0.78rem', fontWeight: 600, textTransform: 'capitalize',
          background: value === opt ? '#1e40af' : 'transparent',
          color:      value === opt ? '#93c5fd' : '#475569',
          transition: 'all 0.15s',
        }}>
          {opt}
        </button>
      ))}
    </div>
  )
}

function MetricChip({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '0.25rem 0.7rem', borderRadius: 20,
      border: `1px solid ${active ? color : '#334155'}`,
      background: active ? `${color}22` : 'transparent',
      color: active ? color : '#475569',
      fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
    }}>
      {label}
    </button>
  )
}

// ── Stats panel (4th grid cell) ────────────────────────────────

function StatsPanel({ raw }) {
  const latest = useMemo(() => {
    if (!raw?.bodyStats?.length) return null
    return [...raw.bodyStats].sort((a, b) => b.date.localeCompare(a.date))[0]
  }, [raw])

  const avgSleep = useMemo(() => {
    if (!raw?.sleep?.length) return null
    const sorted = [...raw.sleep].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7)
    const total = sorted.reduce((s, r) => s + (r.total_sleep_min || 0), 0)
    return sorted.length ? total / sorted.length : null
  }, [raw])

  const workoutDays = useMemo(() => {
    if (!raw?.workouts?.length) return null
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 30)
    const recent = raw.workouts.filter(w => new Date(w.date + 'T12:00:00') >= cutoff)
    return new Set(recent.map(w => w.date)).size
  }, [raw])

  const asOf = latest?.date
    ? new Date(latest.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  const stats = [
    {
      label: 'Weight',
      value: latest?.weight_lbs != null ? `${latest.weight_lbs} lbs` : '—',
      color: BODY_COLORS.weight,
      sub: asOf,
    },
    {
      label: 'Body Fat',
      value: latest?.body_fat_pct != null ? `${latest.body_fat_pct}%` : '—',
      color: BODY_COLORS.bodyFat,
      sub: asOf,
    },
    {
      label: '7-Day Sleep Avg',
      value: avgSleep != null ? fmtMins(avgSleep) : '—',
      color: SLEEP_COLORS.rem,
      sub: null,
    },
    {
      label: 'Workout Days (30d)',
      value: workoutDays != null ? `${workoutDays} days` : '—',
      color: WORKOUT_COLORS.TraditionalStrengthTraining,
      sub: null,
    },
  ]

  return (
    <DashCard title="Current Stats">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem 1rem' }}>
        {stats.map(s => (
          <div key={s.label}>
            <div style={{
              fontSize: '0.68rem', color: '#475569', textTransform: 'uppercase',
              letterSpacing: '0.07em', fontWeight: 600, marginBottom: '0.35rem',
            }}>
              {s.label}
            </div>
            <div style={{
              fontSize: '1.5rem', fontWeight: 700, color: s.color,
              fontVariantNumeric: 'tabular-nums', lineHeight: 1.1,
            }}>
              {s.value}
            </div>
            {s.sub && (
              <div style={{ fontSize: '0.68rem', color: '#334155', marginTop: '0.2rem' }}>
                as of {s.sub}
              </div>
            )}
          </div>
        ))}
      </div>
    </DashCard>
  )
}

// ── Main component ─────────────────────────────────────────────

export default function HealthDashboard() {
  const [raw, setRaw]                   = useState(null)
  const [granularity, setGranularity]   = useState('weekly')
  const [showLeanMass, setShowLeanMass] = useState(false)
  const [showBMI, setShowBMI]           = useState(false)

  useEffect(() => {
    fetch('/api/health').then(r => r.json()).then(setRaw)
  }, [])

  const bodyData                     = useMemo(() => processBodyStats(raw?.bodyStats, granularity), [raw, granularity])
  const { data: workoutData, types } = useMemo(() => processWorkouts(raw?.workouts, granularity), [raw, granularity])
  const sleepData                    = useMemo(() => processSleep(raw?.sleep, granularity), [raw, granularity])

  const [alignedBody, alignedWorkout, alignedSleep] = useMemo(() => {
    if (!bodyData.length || !workoutData.length || !sleepData.length)
      return [bodyData, workoutData, sleepData]

    const allPeriods = [...bodyData, ...workoutData, ...sleepData].map(d => d.period)
    const globalStart = allPeriods.reduce((a, b) => a < b ? a : b)
    const globalEnd   = allPeriods.reduce((a, b) => a > b ? a : b)
    const periodKeys  = []
    let cur = globalStart
    while (cur <= globalEnd) { periodKeys.push(cur); cur = nextPeriod(cur, granularity) }

    return [
      fillPeriods(bodyData,    periodKeys, granularity),
      fillPeriods(workoutData, periodKeys, granularity),
      fillPeriods(sleepData,   periodKeys, granularity),
    ]
  }, [bodyData, workoutData, sleepData, granularity])

  // Chart heights calibrated to fill each grid cell without scrolling.
  // Body Comp has no legend; Workout + Sleep have a legend row below the chart.
  const CHART_H     = 'calc(50vh - 175px)'
  const CHART_H_LEG = 'calc(50vh - 210px)'

  return (
    <div style={{ color: '#F1F5F9', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Sticky header ── */}
      <div style={{
        padding: '1.25rem 2rem',
        borderBottom: '1px solid var(--c-dark-border)',
        background: 'var(--c-dark)',
        flexShrink: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Health</div>
        <GranularityToggle value={granularity} onChange={setGranularity} />
      </div>

      {/* ── 2×2 grid ── */}
      <div style={{
        flex: 1,
        minHeight: 0,
        padding: '1rem 1.5rem',
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '0.875rem',
        overflow: 'hidden',
      }}>
        {!raw ? (
          <div style={{
            gridColumn: '1 / -1', gridRow: '1 / -1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#475569', fontSize: '0.9rem',
          }}>
            Loading health data...
          </div>
        ) : (
          <>
            {/* Top-left: Body Composition */}
            <DashCard
              title="Body Composition"
              action={
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <MetricChip label="Lean Mass" active={showLeanMass} color={BODY_COLORS.leanMass} onClick={() => setShowLeanMass(v => !v)} />
                  <MetricChip label="BMI"       active={showBMI}      color={BODY_COLORS.bmi}      onClick={() => setShowBMI(v => !v)}      />
                </div>
              }
            >
              <BodyChart
                data={alignedBody}
                showLeanMass={showLeanMass}
                showBMI={showBMI}
                granularity={granularity}
                chartHeight={CHART_H}
              />
            </DashCard>

            {/* Top-right: Workouts */}
            <DashCard title="Workouts">
              <WorkoutChart
                data={alignedWorkout}
                types={types}
                granularity={granularity}
                chartHeight={CHART_H_LEG}
              />
            </DashCard>

            {/* Bottom-left: Sleep */}
            <DashCard title="Sleep">
              <SleepChart
                data={alignedSleep}
                granularity={granularity}
                chartHeight={CHART_H_LEG}
              />
            </DashCard>

            {/* Bottom-right: Current Stats */}
            <StatsPanel raw={raw} />
          </>
        )}
      </div>
    </div>
  )
}

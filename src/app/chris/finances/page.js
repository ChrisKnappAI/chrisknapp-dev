'use client'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import ChrisDashboard, { DashCard } from '@/components/ChrisDashboard'
import {
  AreaChart, Area, Line, LineChart, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'

// ── Formatters ────────────────────────────────────────────────
function fmtDate(str) {
  const [y, m] = str.split('-')
  const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m) - 1]
  return `${mon} '${y.slice(2)}`
}

function fmtDollar(n) {
  if (n == null) return '—'
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`
  if (abs >= 1_000)     return `${sign}$${Math.round(abs / 1_000)}K`
  return `${sign}$${abs}`
}

function fmtDollarFull(n) {
  if (n == null) return '—'
  const sign = n < 0 ? '-' : ''
  return `${sign}$${Math.abs(n).toLocaleString()}`
}

// ── EOM tooltip ─────────────────────────────────────────────────
function TRow({ label, value, color, indent, negative }) {
  if (value == null) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      gap: '2rem', paddingLeft: indent ? '0.8rem' : 0, marginBottom: indent ? '0.15rem' : '0.25rem' }}>
      <span style={{ color: indent ? '#475569' : color, fontSize: indent ? '0.71rem' : '0.79rem' }}>
        {indent && <span style={{ marginRight: '0.3rem', opacity: 0.4 }}>·</span>}
        {label}
      </span>
      <span style={{ color: negative ? '#F87171' : indent ? '#64748B' : color,
        fontWeight: indent ? 400 : 600, fontSize: indent ? '0.71rem' : '0.79rem',
        fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
        {fmtDollarFull(value)}
      </span>
    </div>
  )
}

function NetWorthTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div style={{ background: '#0B1424', border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 10, padding: '1rem 1.2rem', minWidth: 250 }}>
      <div style={{ fontWeight: 700, color: '#F1F5F9', fontSize: '0.88rem', marginBottom: '0.5rem' }}>
        {fmtDate(label)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '0.5rem', marginBottom: '0.65rem' }}>
        <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.82rem' }}>Net Worth</span>
        <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.82rem', fontVariantNumeric: 'tabular-nums' }}>
          {fmtDollarFull(d?.total_net_worth)}
        </span>
      </div>
      <TRow label="Home Equity" value={d?.home_equity} color="#EA580C" />
      <TRow label="Home Value"      value={d?.home_value}        color="#EA580C" indent />
      <TRow label="Mortgage"        value={d?.mortgage_balance}  color="#EA580C" indent negative={d?.mortgage_balance < 0} />
      <div style={{ height: '0.45rem' }} />
      <TRow label="Cash" value={d?.net_cash} color="#94A3B8" />
      <div style={{ height: '0.45rem' }} />
      <TRow label="Investments" value={d?.net_investments} color="#60A5FA" />
      <TRow label="401K (Fidelity)"  value={d?.fidelity_401k} color="#60A5FA" indent />
      <TRow label="Roth IRA"         value={d?.roth_ira}      color="#60A5FA" indent />
      <TRow label="HSA"              value={d?.hsa}           color="#60A5FA" indent />
      {d?.betterment  > 0 && <TRow label="Betterment"  value={d.betterment}  color="#60A5FA" indent />}
      {d?.kel_savings > 0 && <TRow label="KEL Savings" value={d.kel_savings} color="#60A5FA" indent />}
      {d?.debt        < 0 && <TRow label="Debt"        value={d.debt}        color="#60A5FA" indent negative />}
    </div>
  )
}

// ── Projection constants ───────────────────────────────────────
const BIRTH_YEAR = 1987
const MORTGAGE_RATE = 0.0575
const MONTHLY_PAYMENT = 1991   // original P&I on $240K @ 5.75% / 15yr

const PROJ_DEFAULTS = {
  extraInvestmentPerYear: 30_000,
  extraMortgagePerYear:   50_000,
  investmentGrowthRate:   0.08,
  homeValueGrowthRate:    0.025,
  cashGrowthRate:         0.00,
}

function buildProjection(snap, params) {
  const startYear = new Date().getFullYear()
  const endYear   = BIRTH_YEAR + 60

  let investments = snap.net_investments || 0
  let cash        = snap.net_cash        || 0
  let homeValue   = snap.home_value      || 0
  let mortgage    = Math.abs(snap.mortgage_balance || 0)

  const rows = []

  for (let year = startYear; year <= endYear; year++) {
    // Investment growth + annual contribution
    investments = investments * (1 + params.investmentGrowthRate) + params.extraInvestmentPerYear

    // Cash growth (typically 0%)
    cash = cash * (1 + params.cashGrowthRate)

    // Home value appreciation
    homeValue = homeValue * (1 + params.homeValueGrowthRate)

    // Mortgage: simulate 12 monthly amortization payments
    for (let m = 0; m < 12; m++) {
      if (mortgage > 0) {
        const interest  = mortgage * (MORTGAGE_RATE / 12)
        const principal = Math.min(MONTHLY_PAYMENT - interest, mortgage)
        mortgage -= Math.max(0, principal)
      }
    }
    // Extra annual lump-sum payment (stops when paid off)
    if (mortgage > 0) {
      mortgage = Math.max(0, mortgage - params.extraMortgagePerYear)
    }

    const homeEquity = homeValue - mortgage
    const netWorth   = investments + cash + homeEquity
    const age        = year - BIRTH_YEAR

    rows.push({ year, age, investments, cash, homeValue, mortgage, homeEquity, netWorth })
  }

  return rows
}

// ── Projection input field ─────────────────────────────────────
function ProjInput({ label, value, onChange, format }) {
  const toDisplay = v => format === 'pct' ? (v * 100).toFixed(1) : String(Math.round(v))
  const [local,   setLocal]   = useState(toDisplay(value))
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!focused) setLocal(toDisplay(value))
  }, [value, focused]) // eslint-disable-line react-hooks/exhaustive-deps

  const commit = () => {
    setFocused(false)
    const num = parseFloat(local)
    if (!isNaN(num)) onChange(format === 'pct' ? num / 100 : num)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <label style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem',
        background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8, padding: '0.45rem 0.7rem' }}>
        {format !== 'pct' && <span style={{ color: '#475569', fontSize: '0.8rem' }}>$</span>}
        <input
          type="number"
          value={local}
          onChange={e => setLocal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={commit}
          style={{ background: 'none', border: 'none', outline: 'none', color: '#F1F5F9',
            fontSize: '0.85rem', fontWeight: 600, width: '100%',
            fontVariantNumeric: 'tabular-nums', MozAppearance: 'textfield' }}
        />
        {format === 'pct' && <span style={{ color: '#475569', fontSize: '0.8rem' }}>%</span>}
      </div>
    </div>
  )
}

// ── Projection tooltip ─────────────────────────────────────────
function ProjTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div style={{ background: '#0B1424', border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 10, padding: '0.85rem 1.1rem', minWidth: 210 }}>
      <div style={{ fontWeight: 700, color: '#F1F5F9', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
        Age {label}
      </div>
      {[
        { key: 'netWorth',   label: 'Net Worth',   color: '#FFFFFF', bold: true },
        { key: 'investments',label: 'Investments', color: '#60A5FA' },
        { key: 'homeEquity', label: 'Home Equity', color: '#EA580C' },
        { key: 'cash',       label: 'Cash',        color: '#94A3B8' },
      ].map(({ key, label, color, bold }) => (
        <div key={key} style={{ display: 'flex', justifyContent: 'space-between',
          gap: '1.5rem', marginBottom: '0.2rem' }}>
          <span style={{ fontSize: '0.78rem', color, fontWeight: bold ? 700 : 400 }}>{label}</span>
          <span style={{ fontSize: '0.78rem', color, fontWeight: bold ? 700 : 400,
            fontVariantNumeric: 'tabular-nums' }}>
            {fmtDollar(d?.[key])}
          </span>
        </div>
      ))}
      {d?.mortgage > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem',
          marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Mortgage Remaining</span>
          <span style={{ fontSize: '0.74rem', color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>
            {fmtDollar(d.mortgage)}
          </span>
        </div>
      )}
    </div>
  )
}

// ── Projection Tool card ───────────────────────────────────────
function ProjectionTool({ latestSnapshot }) {
  const [params, setParams] = useState(PROJ_DEFAULTS)
  const update = (key, val) => setParams(p => ({ ...p, [key]: val }))

  const rows = useMemo(() => {
    if (!latestSnapshot) return []
    return buildProjection(latestSnapshot, params)
  }, [latestSnapshot, params])

  if (!latestSnapshot) return null

  const INPUTS = [
    { key: 'extraInvestmentPerYear', label: '+ Investments/yr', format: 'dollar' },
    { key: 'extraMortgagePerYear',   label: '+ Mortgage/yr',    format: 'dollar' },
    { key: 'investmentGrowthRate',   label: 'Invest. Growth',   format: 'pct'    },
    { key: 'homeValueGrowthRate',    label: 'Home Apprec.',     format: 'pct'    },
    { key: 'cashGrowthRate',         label: 'Cash Growth',      format: 'pct'    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1.5rem' }}>

      {/* ── Assumptions panel (custom card so inner area can scroll) ── */}
      <div style={{
        background: 'var(--c-dark-card)', border: '1px solid var(--c-dark-border)',
        borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '1.1rem 1.5rem', borderBottom: '1px solid var(--c-dark-border)',
          fontSize: '0.875rem', fontWeight: 700, letterSpacing: '-0.01em', flexShrink: 0,
        }}>
          Assumptions
        </div>
        <div style={{
          flex: 1, overflowY: 'auto', padding: '0.75rem',
          display: 'flex', flexDirection: 'column', gap: '0.5rem',
        }}>
          {INPUTS.map(({ key, label, format }) => (
            <ProjInput key={key} label={label} value={params[key]} format={format} onChange={v => update(key, v)} />
          ))}
        </div>
      </div>

      {/* ── Projection chart ── */}
      <DashCard title="Projected Future Net Worth ($5M at 55)">
        <div style={{ height: 'calc(50vh - 190px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="age" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtDollar} tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} width={72} />
            <Tooltip content={<ProjTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
            <ReferenceLine y={5_000_000} stroke="#FACC15" strokeDasharray="6 3" strokeWidth={1.5}
              label={{ value: '$5M Goal', fill: '#FACC15', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine x={55} stroke="rgba(250,204,21,0.25)" strokeDasharray="4 4" strokeWidth={1}
              label={{ value: '55', fill: '#FACC15', fontSize: 10, position: 'insideTopRight' }} />
            <Line type="monotone" dataKey="netWorth"    name="Net Worth"   stroke="#FFFFFF" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="investments" name="Investments" stroke="#3B82F6" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="homeEquity"  name="Home Equity" stroke="#EA580C" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="cash"        name="Cash"        stroke="#94A3B8" strokeWidth={1.5} dot={false} />
            <Legend
              layout="vertical" align="right" verticalAlign="middle"
              formatter={n => <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>{n}</span>}
            />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </DashCard>

    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────
export default function FinancesDashboard() {
  const [snapshots, setSnapshots] = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    supabase
      .from('net_worth_snapshots')
      .select('*')
      .order('period_date', { ascending: true })
      .then(({ data }) => {
        if (data?.length) {
          const processed = data.map(s => ({
            ...s,
            _stackTop: (s.net_investments || 0) + (s.net_cash || 0) + (s.home_equity || 0),
          }))
          setSnapshots(processed)
        }
        setLoading(false)
      })
  }, [])

  const latest = snapshots[snapshots.length - 1]

  const subtitle = latest
    ? `As of ${fmtDate(latest.period_date)} · Net Worth ${fmtDollarFull(latest.total_net_worth)}`
    : null

  const tickInterval = snapshots.length > 0 ? Math.floor(snapshots.length / 10) : 1

  if (loading) {
    return (
      <ChrisDashboard title="Financial Dashboard">
        <div style={{ color: '#475569', padding: '3rem', textAlign: 'center' }}>Loading…</div>
      </ChrisDashboard>
    )
  }

  return (
    <ChrisDashboard title="Financial Dashboard" subtitle={subtitle}>

      {/* ── Historic chart ── */}
      <DashCard title="Historic Net Worth Development">
        <div style={{ height: 'calc(50vh - 190px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={snapshots} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradInvest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.85} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.55} />
              </linearGradient>
              <linearGradient id="gradCash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#94A3B8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.5} />
              </linearGradient>
              <linearGradient id="gradEquity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#EA580C" stopOpacity={0.85} />
                <stop offset="95%" stopColor="#EA580C" stopOpacity={0.55} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="period_date"
              tickFormatter={fmtDate}
              interval={tickInterval}
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={fmtDollar}
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip content={<NetWorthTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
            <Legend
              formatter={name => <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>{name}</span>}
              wrapperStyle={{ paddingTop: '1rem' }}
            />
            <Area type="linear" dataKey="net_investments" stackId="1" name="Investments"  stroke="#3B82F6" fill="url(#gradInvest)" strokeWidth={1.5} />
            <Area type="linear" dataKey="net_cash"        stackId="1" name="Cash"         stroke="#94A3B8" fill="url(#gradCash)"   strokeWidth={1.5} />
            <Area type="linear" dataKey="home_equity"     stackId="1" name="Home Equity"  stroke="#EA580C" fill="url(#gradEquity)" strokeWidth={1.5} />
            <Line type="linear" dataKey="_stackTop" name="Net Worth" stroke="#FFFFFF" strokeWidth={2} dot={false} legendType="line" />
          </AreaChart>
        </ResponsiveContainer>
        </div>
      </DashCard>

      {/* ── Projection ── */}
      <ProjectionTool latestSnapshot={latest} />

    </ChrisDashboard>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ChrisDashboard, { DashCard } from '@/components/ChrisDashboard'
import {
  AreaChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

// ── Formatters ────────────────────────────────────────────────
function fmtDate(str) {
  // '2019-08-31' → 'Aug '19'
  const [y, m] = str.split('-')
  const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m) - 1]
  return `${mon} '${y.slice(2)}`
}

function fmtDollar(n) {
  if (n == null) return '—'
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000)     return `${sign}$${Math.round(abs / 1_000)}K`
  return `${sign}$${abs}`
}

function fmtDollarFull(n) {
  if (n == null) return '—'
  const sign = n < 0 ? '-' : ''
  return `${sign}$${Math.abs(n).toLocaleString()}`
}

// ── Custom tooltip ─────────────────────────────────────────────
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
          // _stackTop = exact sum of the three stacked components so the
          // net worth line always sits flush on top of the stacked areas
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

  // Tick reducer — show ~10 evenly spaced x-axis labels
  const tickInterval = snapshots.length > 0 ? Math.floor(snapshots.length / 10) : 1

  if (loading) {
    return (
      <ChrisDashboard title="Finances Dashboard">
        <div style={{ color: '#475569', padding: '3rem', textAlign: 'center' }}>Loading…</div>
      </ChrisDashboard>
    )
  }

  return (
    <ChrisDashboard title="Finances Dashboard" subtitle={subtitle}>

      {/* ── Net Worth Chart ── */}
      <DashCard title="Net Worth Over Time">
        <ResponsiveContainer width="100%" height={340}>
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
            {/* Order: investments bottom → cash → equity top */}
            <Area type="linear" dataKey="net_investments" stackId="1" name="Investments"  stroke="#3B82F6" fill="url(#gradInvest)" strokeWidth={1.5} />
            <Area type="linear" dataKey="net_cash"        stackId="1" name="Cash"         stroke="#94A3B8" fill="url(#gradCash)"   strokeWidth={1.5} />
            <Area type="linear" dataKey="home_equity"     stackId="1" name="Home Equity"  stroke="#EA580C" fill="url(#gradEquity)" strokeWidth={1.5} />
            {/* Net worth overlay — uses sum of components so it's guaranteed flush with stack top */}
            <Line type="linear" dataKey="_stackTop" name="Net Worth" stroke="#FFFFFF" strokeWidth={2} dot={false} legendType="line" />
          </AreaChart>
        </ResponsiveContainer>
      </DashCard>

    </ChrisDashboard>
  )
}

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
function NetWorthTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div style={{
      background: '#0B1424', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10, padding: '0.9rem 1.1rem', fontSize: '0.8rem', minWidth: 200,
    }}>
      <div style={{ fontWeight: 700, marginBottom: '0.6rem', color: '#F1F5F9' }}>{fmtDate(label)}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', color: '#EA580C', marginBottom: '0.2rem' }}>
        <span>Home Equity</span><span style={{ fontWeight: 600 }}>{fmtDollarFull(d?.home_equity)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', color: '#94A3B8', marginBottom: '0.2rem' }}>
        <span>Cash</span><span style={{ fontWeight: 600 }}>{fmtDollarFull(d?.net_cash)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', color: '#60A5FA', marginBottom: '0.6rem' }}>
        <span>Investments</span><span style={{ fontWeight: 600 }}>{fmtDollarFull(d?.net_investments)}</span>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', color: '#F1F5F9' }}>
        <span style={{ fontWeight: 700 }}>Net Worth</span>
        <span style={{ fontWeight: 700 }}>{fmtDollarFull(d?.total_net_worth)}</span>
      </div>
    </div>
  )
}

// ── Decomp table rows ──────────────────────────────────────────
function DecompRow({ label, value, indent = 0, bold = false, negative = false, muted = false, isTotal = false }) {
  const textColor = isTotal ? '#F1F5F9' : negative ? '#F87171' : muted ? '#94A3B8' : '#CBD5E1'
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: `${isTotal ? '0.85rem' : '0.55rem'} 0`,
      paddingLeft: indent * 1.5 + 'rem',
      borderBottom: isTotal ? '2px solid var(--c-dark-border)' : '1px solid rgba(255,255,255,0.04)',
    }}>
      <span style={{ fontSize: isTotal ? '0.95rem' : indent > 0 ? '0.78rem' : '0.85rem', fontWeight: bold || isTotal ? 700 : 400, color: textColor }}>
        {indent > 0 && <span style={{ opacity: 0.35, marginRight: '0.4rem' }}>—</span>}
        {label}
      </span>
      <span style={{ fontSize: isTotal ? '1rem' : indent > 0 ? '0.8rem' : '0.88rem', fontWeight: bold || isTotal ? 700 : 500, color: textColor, fontVariantNumeric: 'tabular-nums' }}>
        {value == null ? <span style={{ opacity: 0.3 }}>—</span> : fmtDollarFull(value)}
      </span>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────
export default function FinancesDashboard() {
  const [snapshots, setSnapshots] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [selected,  setSelected]  = useState(null) // period_date string for table

  useEffect(() => {
    supabase
      .from('net_worth_snapshots')
      .select('*')
      .order('period_date', { ascending: true })
      .then(({ data }) => {
        if (data?.length) {
          setSnapshots(data)
          setSelected(data[data.length - 1].period_date)
        }
        setLoading(false)
      })
  }, [])

  const latest  = snapshots[snapshots.length - 1]
  const current = snapshots.find(s => s.period_date === selected) || latest

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
            <Area type="monotone" dataKey="net_investments" stackId="1" name="Investments"  stroke="#3B82F6" fill="url(#gradInvest)" strokeWidth={1.5} />
            <Area type="monotone" dataKey="net_cash"        stackId="1" name="Cash"         stroke="#94A3B8" fill="url(#gradCash)"   strokeWidth={1.5} />
            <Area type="monotone" dataKey="home_equity"     stackId="1" name="Home Equity"  stroke="#EA580C" fill="url(#gradEquity)" strokeWidth={1.5} />
            {/* Total net worth overlay line */}
            <Line type="monotone" dataKey="total_net_worth" name="Net Worth" stroke="#FFFFFF" strokeWidth={2} dot={false} legendType="line" />
          </AreaChart>
        </ResponsiveContainer>
      </DashCard>

      {/* ── Decomp Table ── */}
      <DashCard
        title="Net Worth Breakdown"
        action={
          <select
            value={selected || ''}
            onChange={e => setSelected(e.target.value)}
            style={{
              background: '#0B1424', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6, padding: '0.3rem 0.6rem',
              color: '#94A3B8', fontSize: '0.78rem', outline: 'none', cursor: 'pointer',
            }}
          >
            {[...snapshots].reverse().map(s => (
              <option key={s.period_date} value={s.period_date}>{fmtDate(s.period_date)}</option>
            ))}
          </select>
        }
      >
        {current && (
          <div>
            <DecompRow label="Total Net Worth" value={current.total_net_worth} isTotal bold />

            <DecompRow label="Net Cash"        value={current.net_cash}        bold />

            <DecompRow label="Net Investments" value={current.net_investments} bold />
            <DecompRow label="401K (Fidelity)" value={current.fidelity_401k}  indent={1} />
            <DecompRow label="Roth IRA (Vanguard)" value={current.roth_ira}   indent={1} />
            <DecompRow label="HSA"             value={current.hsa}             indent={1} />
            <DecompRow label="Betterment"      value={current.betterment}      indent={1} />
            {current.kel_savings != null && current.kel_savings !== 0 && (
              <DecompRow label="KEL Savings"   value={current.kel_savings}     indent={1} />
            )}
            {current.debt != null && current.debt !== 0 && (
              <DecompRow label="Debt (liability)" value={current.debt}         indent={1} negative />
            )}

            <DecompRow label="Home Equity"     value={current.home_equity}     bold />
            {current.home_value != null && (
              <DecompRow label="Home Value"    value={current.home_value}      indent={1} />
            )}
            {current.mortgage_balance != null && (
              <DecompRow label="Mortgage Balance" value={current.mortgage_balance} indent={1} negative />
            )}
          </div>
        )}
      </DashCard>

    </ChrisDashboard>
  )
}

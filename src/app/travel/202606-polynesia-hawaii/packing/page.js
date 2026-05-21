'use client'
import { useState, useEffect, useRef } from 'react'
import { usePerson } from '../_context/person'

export default function PackingPage() {
  const person                    = usePerson()
  const [activeTab, setActiveTab] = useState('chris')
  const [items, setItems]         = useState({ chris: [], natalie: [] })
  const [input, setInput]         = useState('')
  const [mode, setMode]           = useState('planning')
  const [loading, setLoading]     = useState(true)
  const inputRef                  = useRef(null)

  useEffect(() => {
    if (person) setActiveTab(person)
  }, [person])

  useEffect(() => {
    Promise.all([
      fetch('/api/travel/packing?person=chris').then(r => r.json()),
      fetch('/api/travel/packing?person=natalie').then(r => r.json()),
    ]).then(([c, n]) => {
      setItems({ chris: c.data || [], natalie: n.data || [] })
      setLoading(false)
    })
  }, [])

  async function addItem() {
    const body = input.trim()
    if (!body) return
    setInput('')
    const res = await fetch('/api/travel/packing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ person: activeTab, body }),
    })
    const { data } = await res.json()
    setItems(t => ({ ...t, [activeTab]: [...t[activeTab], data] }))
    inputRef.current?.focus()
  }

  async function togglePacked(id) {
    const item   = items[activeTab].find(i => i.id === id)
    const packed = !item.packed
    setItems(t => ({ ...t, [activeTab]: t[activeTab].map(i => i.id === id ? { ...i, packed } : i) }))
    await fetch('/api/travel/packing', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, packed }),
    })
  }

  async function deleteItem(id) {
    setItems(t => ({ ...t, [activeTab]: t[activeTab].filter(i => i.id !== id) }))
    await fetch(`/api/travel/packing?id=${id}`, { method: 'DELETE' })
  }

  async function moveItem(id, dir) {
    const list = [...items[activeTab]]
    const idx  = list.findIndex(i => i.id === id)
    const next = dir === 'up' ? idx - 1 : idx + 1
    if (next < 0 || next >= list.length) return

    const tmp   = list[idx]
    list[idx]   = list[next]
    list[next]  = tmp
    list[idx].sort_order  = idx
    list[next].sort_order = next

    setItems(t => ({ ...t, [activeTab]: list }))

    await Promise.all([
      fetch('/api/travel/packing', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: list[idx].id, sort_order: idx }),
      }),
      fetch('/api/travel/packing', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: list[next].id, sort_order: next }),
      }),
    ])
  }

  const list   = items[activeTab]
  const packed = list.filter(i => i.packed)

  return (
    <div style={{ padding: '16px 16px 24px' }}>
      {/* Mode toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <div style={{ display: 'flex', background: '#F0F9FF', borderRadius: 8, padding: 2, gap: 2 }}>
          {[{ key: 'planning', label: 'Planning' }, { key: 'packing', label: 'Packing Day 🧳' }].map(m => (
            <button key={m.key} onClick={() => setMode(m.key)} style={{
              padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontSize: '0.75rem', fontWeight: mode === m.key ? 600 : 500,
              background: mode === m.key ? (m.key === 'packing' ? '#F97316' : '#0891B2') : 'transparent',
              color: mode === m.key ? '#fff' : '#64748B',
            }}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Person tabs */}
      <div style={{ display: 'flex', background: '#F0F9FF', borderRadius: 10, padding: 3, marginBottom: 16, gap: 3 }}>
        {['chris', 'natalie'].map(p => (
          <button key={p} onClick={() => setActiveTab(p)} style={{
            flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: activeTab === p ? (mode === 'packing' ? '#F97316' : '#0891B2') : 'transparent',
            color: activeTab === p ? '#fff' : '#64748B',
            fontWeight: activeTab === p ? 700 : 500, fontSize: '0.875rem',
          }}>
            {p === 'chris' ? 'Chris' : 'Natalie'}
          </button>
        ))}
      </div>

      {/* Planning mode: add input */}
      {mode === 'planning' && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            placeholder={`Add item for ${activeTab === 'chris' ? 'Chris' : 'Natalie'}…`}
            style={{
              flex: 1, padding: '10px 14px', borderRadius: 10, fontSize: '0.875rem',
              border: '1.5px solid rgba(8,145,178,0.2)', background: '#fff',
              outline: 'none', color: '#0F172A', fontFamily: 'inherit',
            }}
          />
          <button onClick={addItem} style={{
            padding: '10px 16px', borderRadius: 10, border: 'none',
            background: '#0891B2', color: '#fff', fontWeight: 700,
            fontSize: '0.875rem', cursor: 'pointer',
          }}>
            Add
          </button>
        </div>
      )}

      {/* Packing mode banner */}
      {mode === 'packing' && list.length > 0 && (
        <div style={{
          background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 10,
          padding: '10px 14px', marginBottom: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '0.78rem', color: '#9A3412' }}>Check items as you pack — won't reorder</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#EA580C' }}>
            {packed.length}/{list.length}
          </span>
        </div>
      )}

      {loading ? (
        <div style={{ color: '#94A3B8', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>Loading…</div>
      ) : list.length === 0 ? (
        <div style={{ color: '#94A3B8', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>
          No items yet. Add some above!
        </div>
      ) : mode === 'planning' ? (
        list.map((item, idx) => (
          <PlanningRow
            key={item.id} item={item}
            isFirst={idx === 0} isLast={idx === list.length - 1}
            onMove={moveItem} onDelete={deleteItem}
          />
        ))
      ) : (
        list.map(item => (
          <PackingRow key={item.id} item={item} onToggle={togglePacked} />
        ))
      )}
    </div>
  )
}

function PlanningRow({ item, isFirst, isLast, onMove, onDelete }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '9px 10px', background: '#fff',
      border: '1px solid rgba(8,145,178,0.1)', borderRadius: 10, marginBottom: 6,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flexShrink: 0 }}>
        <button onClick={() => onMove(item.id, 'up')} disabled={isFirst} style={{
          width: 20, height: 15, border: 'none', background: 'none', cursor: isFirst ? 'default' : 'pointer',
          color: isFirst ? '#E2E8F0' : '#94A3B8', fontSize: '0.5rem', lineHeight: 1, padding: 0,
        }}>▲</button>
        <button onClick={() => onMove(item.id, 'down')} disabled={isLast} style={{
          width: 20, height: 15, border: 'none', background: 'none', cursor: isLast ? 'default' : 'pointer',
          color: isLast ? '#E2E8F0' : '#94A3B8', fontSize: '0.5rem', lineHeight: 1, padding: 0,
        }}>▼</button>
      </div>
      <span style={{ flex: 1, fontSize: '0.875rem', color: '#0F172A' }}>{item.body}</span>
      <button onClick={() => onDelete(item.id)} style={{
        background: 'none', border: 'none', color: '#CBD5E1',
        fontSize: '1.1rem', cursor: 'pointer', padding: '0 4px', lineHeight: 1, flexShrink: 0,
      }}>×</button>
    </div>
  )
}

function PackingRow({ item, onToggle }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '11px 12px',
      background: item.packed ? '#F0FDF4' : '#fff',
      border: `1px solid ${item.packed ? 'rgba(34,197,94,0.2)' : 'rgba(8,145,178,0.1)'}`,
      borderRadius: 10, marginBottom: 6,
    }}>
      <button onClick={() => onToggle(item.id)} style={{
        flexShrink: 0, width: 24, height: 24, borderRadius: 6, cursor: 'pointer',
        border: `2px solid ${item.packed ? '#22C55E' : '#CBD5E1'}`,
        background: item.packed ? '#22C55E' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: '0.75rem', fontWeight: 700,
      }}>
        {item.packed ? '✓' : ''}
      </button>
      <span style={{
        flex: 1, fontSize: '0.9rem',
        color: item.packed ? '#16A34A' : '#0F172A',
        textDecoration: item.packed ? 'line-through' : 'none',
        opacity: item.packed ? 0.65 : 1,
      }}>
        {item.body}
      </span>
    </div>
  )
}

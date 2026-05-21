'use client'
import { useState, useEffect, useRef } from 'react'
import { usePerson } from '../_context/person'

const CHRIS_STARTER = [
  'International Drivers License',
  'Reserve Tahiti ferries (round trip)',
  'Book airport shuttle roundtrip',
  'Book Cusco Pet Sitter',
  'Sleeping Pills — Slow Release',
  'Decide on Dinner Reservations',
  'Decide on Excursions',
  'Figure out Cali / Tahiti / Excursions',
  'Get Cash (how to spend in Tahiti)',
]

export default function TodosPage() {
  const person                    = usePerson()
  const [activeTab, setActiveTab] = useState('chris')
  const [todos, setTodos]         = useState({ chris: [], natalie: [] })
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(true)
  const inputRef                  = useRef(null)

  useEffect(() => {
    if (person) setActiveTab(person)
  }, [person])

  useEffect(() => {
    Promise.all([
      fetch('/api/travel/todos?person=chris').then(r => r.json()),
      fetch('/api/travel/todos?person=natalie').then(r => r.json()),
    ]).then(([c, n]) => {
      setTodos({ chris: c.data || [], natalie: n.data || [] })
      setLoading(false)
    })
  }, [])

  async function addTodo() {
    const body = input.trim()
    if (!body) return
    setInput('')
    const res = await fetch('/api/travel/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ person: activeTab, body }),
    })
    const { data } = await res.json()
    setTodos(t => ({ ...t, [activeTab]: [...t[activeTab], data] }))
    inputRef.current?.focus()
  }

  async function loadStarter() {
    const items = []
    for (const body of CHRIS_STARTER) {
      const res = await fetch('/api/travel/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person: 'chris', body }),
      })
      const { data } = await res.json()
      items.push(data)
    }
    setTodos(t => ({ ...t, chris: [...t.chris, ...items] }))
  }

  async function toggleTodo(id) {
    const item    = todos[activeTab].find(t => t.id === id)
    const checked = !item.checked
    setTodos(t => ({ ...t, [activeTab]: t[activeTab].map(i => i.id === id ? { ...i, checked } : i) }))
    await fetch('/api/travel/todos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, checked }),
    })
  }

  async function deleteTodo(id) {
    setTodos(t => ({ ...t, [activeTab]: t[activeTab].filter(i => i.id !== id) }))
    await fetch(`/api/travel/todos?id=${id}`, { method: 'DELETE' })
  }

  const list      = todos[activeTab]
  const unchecked = list.filter(t => !t.checked)
  const checked   = list.filter(t => t.checked)

  return (
    <div style={{ padding: '16px 16px 24px' }}>
      {/* Person tabs */}
      <div style={{ display: 'flex', background: '#F0F9FF', borderRadius: 10, padding: 3, marginBottom: 16, gap: 3 }}>
        {['chris', 'natalie'].map(p => (
          <button key={p} onClick={() => setActiveTab(p)} style={{
            flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: activeTab === p ? '#0891B2' : 'transparent',
            color: activeTab === p ? '#fff' : '#64748B',
            fontWeight: activeTab === p ? 700 : 500, fontSize: '0.875rem',
          }}>
            {p === 'chris' ? 'Chris' : 'Natalie'}
          </button>
        ))}
      </div>

      {/* Add input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder={`Add to-do for ${activeTab === 'chris' ? 'Chris' : 'Natalie'}…`}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 10, fontSize: '0.875rem',
            border: '1.5px solid rgba(8,145,178,0.2)', background: '#fff',
            outline: 'none', color: '#0F172A', fontFamily: 'inherit',
          }}
        />
        <button onClick={addTodo} style={{
          padding: '10px 16px', borderRadius: 10, border: 'none',
          background: '#0891B2', color: '#fff', fontWeight: 700,
          fontSize: '0.875rem', cursor: 'pointer',
        }}>
          Add
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#94A3B8', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>Loading…</div>
      ) : (
        <>
          {/* Starter prompt for empty Chris list */}
          {activeTab === 'chris' && list.length === 0 && (
            <div style={{
              background: '#F0F9FF', border: '1px dashed rgba(8,145,178,0.35)',
              borderRadius: 12, padding: '16px', marginBottom: 16, textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.82rem', color: '#0891B2', marginBottom: 10 }}>
                Load Chris's pre-trip to-do list?
              </div>
              <button onClick={loadStarter} style={{
                background: '#0891B2', color: '#fff', border: 'none',
                borderRadius: 8, padding: '8px 18px', fontSize: '0.82rem',
                fontWeight: 600, cursor: 'pointer',
              }}>
                Load Starter List
              </button>
            </div>
          )}

          {list.length === 0 && !(activeTab === 'chris') && (
            <div style={{ color: '#94A3B8', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>
              No to-dos yet. Add one above!
            </div>
          )}

          {unchecked.map(item => (
            <TodoRow key={item.id} item={item} onToggle={toggleTodo} onDelete={deleteTodo} />
          ))}

          {checked.length > 0 && unchecked.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0 8px', opacity: 0.5 }}>
              <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
              <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 500 }}>done</span>
              <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
            </div>
          )}

          {checked.map(item => (
            <TodoRow key={item.id} item={item} onToggle={toggleTodo} onDelete={deleteTodo} />
          ))}
        </>
      )}
    </div>
  )
}

function TodoRow({ item, onToggle, onDelete }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px', background: '#fff',
      border: '1px solid rgba(8,145,178,0.1)', borderRadius: 10,
      marginBottom: 6, opacity: item.checked ? 0.5 : 1,
    }}>
      <button onClick={() => onToggle(item.id)} style={{
        flexShrink: 0, width: 22, height: 22, borderRadius: '50%', cursor: 'pointer',
        border: `2px solid ${item.checked ? '#0891B2' : '#CBD5E1'}`,
        background: item.checked ? '#0891B2' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: '0.65rem', fontWeight: 700,
      }}>
        {item.checked ? '✓' : ''}
      </button>
      <span style={{
        flex: 1, fontSize: '0.875rem', color: '#0F172A',
        textDecoration: item.checked ? 'line-through' : 'none',
      }}>
        {item.body}
      </span>
      <button onClick={() => onDelete(item.id)} style={{
        flexShrink: 0, background: 'none', border: 'none',
        color: '#CBD5E1', fontSize: '1.1rem', cursor: 'pointer', padding: '0 4px', lineHeight: 1,
      }}>
        ×
      </button>
    </div>
  )
}

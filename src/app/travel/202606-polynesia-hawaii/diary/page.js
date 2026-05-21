'use client'
import { useState, useEffect, useRef } from 'react'
import { usePerson } from '../_context/person'
import { TRIP_START, TRIP_END, SEGMENTS } from '../_data/timeline'

function toDate(str) {
  return new Date(str + 'T12:00:00')
}

function addDays(str, n) {
  const d = toDate(str)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function fmt(str) {
  return toDate(str).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function getDayLabel(str) {
  const seg = SEGMENTS.find(s => s.date === str)
  return seg ? seg.title : null
}

const PHASE_PROMPT = {
  travel:    'your travel day',
  polynesia: 'French Polynesia 🌴',
  cruise:    'the cruise 🚢',
  hawaii:    'Hawaii 🌺',
}

function getPhase(str) {
  return SEGMENTS.find(s => s.date === str)?.phase || 'polynesia'
}

export default function DiaryPage() {
  const person                 = usePerson()
  const today                  = new Date().toISOString().split('T')[0]
  const clampedToday           = today < TRIP_START ? TRIP_START : today > TRIP_END ? TRIP_END : today
  const [date, setDate]        = useState(clampedToday)
  const [body, setBody]        = useState('')
  const [saved, setSaved]      = useState(false)
  const [saving, setSaving]    = useState(false)
  const debounceRef            = useRef(null)

  useEffect(() => {
    if (!person) return
    setBody('')
    setSaved(false)
    fetch(`/api/travel/diary?person=${person}&date=${date}`)
      .then(r => r.json())
      .then(({ body }) => setBody(body || ''))
  }, [date, person])

  function handleChange(val) {
    setBody(val)
    setSaving(true)
    setSaved(false)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      await fetch('/api/travel/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person, date, body: val }),
      })
      setSaving(false)
      setSaved(true)
    }, 900)
  }

  const canPrev = date > TRIP_START
  const canNext = date < TRIP_END
  const dayLabel = getDayLabel(date)

  if (!person) return null

  return (
    <div style={{ padding: '16px 16px 24px', display: 'flex', flexDirection: 'column' }}>
      {/* Date navigator */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#fff', borderRadius: 12, padding: '9px 12px',
        border: '1px solid rgba(8,145,178,0.12)', marginBottom: 14,
      }}>
        <button onClick={() => canPrev && setDate(d => addDays(d, -1))} disabled={!canPrev} style={{
          background: 'none', border: 'none', fontSize: '1.4rem', lineHeight: 1,
          color: canPrev ? '#0891B2' : '#E2E8F0', cursor: canPrev ? 'pointer' : 'default', padding: '0 6px',
        }}>‹</button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0C4A6E' }}>{fmt(date)}</div>
          {date === today && (
            <div style={{ fontSize: '0.6rem', color: '#F97316', fontWeight: 700, letterSpacing: '0.06em', marginTop: 2 }}>TODAY</div>
          )}
          {dayLabel && (
            <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 1 }}>{dayLabel}</div>
          )}
        </div>

        <button onClick={() => canNext && setDate(d => addDays(d, 1))} disabled={!canNext} style={{
          background: 'none', border: 'none', fontSize: '1.4rem', lineHeight: 1,
          color: canNext ? '#0891B2' : '#E2E8F0', cursor: canNext ? 'pointer' : 'default', padding: '0 6px',
        }}>›</button>
      </div>

      {/* Entry label */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 8,
      }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {person === 'chris' ? "Chris's" : "Natalie's"} Entry
        </span>
        <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
          {saving ? 'saving…' : saved ? '✓ saved' : ''}
        </span>
      </div>

      {/* Textarea */}
      <textarea
        value={body}
        onChange={e => handleChange(e.target.value)}
        placeholder={`How was ${PHASE_PROMPT[getPhase(date)]}? Write about your day…`}
        style={{
          width: '100%', minHeight: 260, resize: 'vertical',
          border: '1.5px solid rgba(8,145,178,0.2)', borderRadius: 12,
          padding: '14px 16px', fontSize: '0.9rem', color: '#0F172A',
          background: '#fff', outline: 'none', fontFamily: 'inherit',
          lineHeight: 1.65,
        }}
      />

      <div style={{ marginTop: 8, fontSize: '0.68rem', color: '#CBD5E1', textAlign: 'right' }}>
        Private — only you can see this entry
      </div>
    </div>
  )
}

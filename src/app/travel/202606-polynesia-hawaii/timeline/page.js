'use client'
import { useState, useEffect, useRef } from 'react'
import { SEGMENTS } from '../_data/timeline'

const PHASE_META = {
  travel:    { label: '✈️  Travel Days',         color: '#7C3AED', bg: '#F5F3FF' },
  polynesia: { label: '🌴  French Polynesia',    color: '#0D9488', bg: '#F0FDFA' },
  cruise:    { label: '🚢  NCL Cruise',           color: '#0891B2', bg: '#F0F9FF' },
  hawaii:    { label: '🌺  Hawaii',              color: '#EA580C', bg: '#FFF7ED' },
}

export default function TimelinePage() {
  const [notes, setNotes]       = useState({})
  const [expanded, setExpanded] = useState(null)
  const [saving, setSaving]     = useState(null)
  const debounceRef             = useRef({})
  const today                   = new Date().toISOString().split('T')[0]

  useEffect(() => {
    fetch('/api/travel/timeline-notes')
      .then(r => r.json())
      .then(({ notes }) => setNotes(notes || {}))
  }, [])

  function toggle(id) {
    setExpanded(e => e === id ? null : id)
  }

  function handleNoteChange(segId, val) {
    setNotes(n => ({ ...n, [segId]: val }))
    if (debounceRef.current[segId]) clearTimeout(debounceRef.current[segId])
    setSaving(segId)
    debounceRef.current[segId] = setTimeout(async () => {
      await fetch('/api/travel/timeline-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segment_id: segId, body: val }),
      })
      setSaving(s => s === segId ? null : s)
    }, 800)
  }

  let lastPhase = null

  return (
    <div style={{ padding: '16px 16px 24px' }}>
      <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500, marginBottom: 16 }}>
        Jun 26 – Jul 16 · 21 days · French Polynesia + NCL Cruise + Hawaii
      </div>

      <div style={{ position: 'relative' }}>
        {/* Gradient vertical line */}
        <div style={{
          position: 'absolute', left: 20, top: 0, bottom: 0, width: 2,
          background: 'linear-gradient(180deg, #7C3AED 0%, #0D9488 30%, #0891B2 60%, #EA580C 85%, #7C3AED 100%)',
          opacity: 0.25, zIndex: 0,
        }} />

        {SEGMENTS.map(seg => {
          const isNewPhase = seg.phase !== lastPhase
          if (isNewPhase) lastPhase = seg.phase
          const phase      = PHASE_META[seg.phase]
          const isExpanded = expanded === seg.id
          const isToday    = seg.date === today
          const hasNote    = !!notes[seg.id]
          const hasEvents  = Array.isArray(seg.events) && seg.events.length > 0

          return (
            <div key={seg.id}>
              {isNewPhase && (
                <div style={{
                  margin: '18px 0 10px 44px',
                  fontSize: '0.65rem', fontWeight: 700,
                  color: phase.color, letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  position: 'relative', zIndex: 1,
                }}>
                  {phase.label}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 7, position: 'relative', zIndex: 1 }}>
                {/* Dot */}
                <div style={{ width: 42, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 14 }}>
                  <div style={{
                    width: isToday ? 20 : 16,
                    height: isToday ? 20 : 16,
                    borderRadius: '50%',
                    background: isToday ? '#F97316' : phase.color,
                    border: `2px solid ${isToday ? '#FED7AA' : '#F8FEFF'}`,
                    boxShadow: isToday ? '0 0 0 4px rgba(249,115,22,0.2)' : `0 0 0 2px ${phase.color}20`,
                    flexShrink: 0,
                  }} />
                </div>

                {/* Card */}
                <div
                  onClick={() => toggle(seg.id)}
                  style={{
                    flex: 1,
                    background: isExpanded ? phase.bg : '#fff',
                    border: `1px solid ${isExpanded ? phase.color + '35' : 'rgba(8,145,178,0.1)'}`,
                    borderRadius: 12,
                    padding: '10px 13px',
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                >
                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 500 }}>{seg.dateLabel}</span>
                      {isToday && (
                        <span style={{ fontSize: '0.6rem', color: '#F97316', fontWeight: 700, background: '#FFF7ED', padding: '1px 6px', borderRadius: 4 }}>TODAY</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {hasNote && <span style={{ fontSize: '0.7rem' }}>📝</span>}
                      <span style={{ fontSize: '0.9rem' }}>{seg.icon}</span>
                      <span style={{
                        fontSize: '0.5rem', color: '#CBD5E1',
                        display: 'inline-block',
                        transform: isExpanded ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s',
                      }}>▼</span>
                    </div>
                  </div>

                  {/* Title */}
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0C4A6E', lineHeight: 1.3, marginBottom: 6 }}>
                    {seg.title}
                  </div>

                  {/* Events list (always visible) or summary text */}
                  {hasEvents ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {seg.events.map((ev, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                          <span style={{ fontSize: '0.8rem', flexShrink: 0, marginTop: 1 }}>{ev.icon}</span>
                          <span style={{ fontSize: '0.775rem', color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>{ev.label}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.775rem', color: '#475569', lineHeight: 1.5 }}>
                      {seg.summary}
                    </div>
                  )}

                  {/* Expanded content */}
                  {isExpanded && (
                    <div
                      style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${phase.color}25` }}
                      onClick={e => e.stopPropagation()}
                    >
                      {/* Expanded events with detail text */}
                      {hasEvents ? (
                        <div style={{ marginBottom: 14 }}>
                          {seg.events.map((ev, i) => (
                            <div key={i} style={{
                              paddingBottom: i < seg.events.length - 1 ? 10 : 0,
                              marginBottom: i < seg.events.length - 1 ? 10 : 0,
                              borderBottom: i < seg.events.length - 1 ? `1px solid ${phase.color}18` : 'none',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                                <span style={{ fontSize: '0.85rem' }}>{ev.icon}</span>
                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0C4A6E' }}>{ev.label}</span>
                              </div>
                              {ev.detail && (
                                <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.55, paddingLeft: 23 }}>
                                  {ev.detail}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : seg.details ? (
                        <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.65, marginBottom: 12 }}>
                          {seg.details}
                        </div>
                      ) : null}

                      {/* Notes */}
                      <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.07em', marginBottom: 5 }}>
                        NOTES {saving === seg.id && <span style={{ color: '#0891B2', fontWeight: 400, letterSpacing: 0 }}>saving…</span>}
                      </div>
                      <textarea
                        value={notes[seg.id] || ''}
                        onChange={e => handleNoteChange(seg.id, e.target.value)}
                        placeholder="Add notes for this day…"
                        rows={3}
                        style={{
                          width: '100%', resize: 'vertical',
                          border: `1.5px solid ${phase.color}40`,
                          borderRadius: 8, padding: '8px 10px',
                          fontSize: '0.82rem', color: '#334155',
                          background: '#fff', outline: 'none',
                          fontFamily: 'inherit', lineHeight: 1.55,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

const POS_COLOR = {
  noun: '#3B82F6', verb: '#8B5CF6', adjective: '#10B981', adverb: '#F59E0B', phrase: '#EC4899',
}
const CEFR_COLOR = { A2: '#34D399', B1: '#38BDF8', B2: '#A78BFA' }

const MODES = [
  { key: 'review', label: 'Review', statKey: 'due' },
  { key: 'learn',  label: 'Learn',  statKey: 'new_available' },
  { key: 'hard',   label: 'Hard',   statKey: 'hard' },
  { key: 'misses', label: 'Misses', statKey: 'misses' },
]

export default function SpanishLearning() {
  const [mode, setMode] = useState('review')
  const [queue, setQueue] = useState([])
  const [idx, setIdx] = useState(0)
  // tapStage: 0 = Spanish only | 1 = +English | 2 = +Sentence+Conj+Buttons
  const [tapStage, setTapStage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [stats, setStats] = useState(null)
  const [showStats, setShowStats] = useState(false)
  const [sessionDone, setSessionDone] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)
  const [swipeDelta, setSwipeDelta] = useState(0)
  const [swipeFlash, setSwipeFlash] = useState(null) // 'good' | 'again' | null

  const audioRef = useRef(null)
  const urlRef = useRef(null)
  const dragStartX = useRef(null)
  const isDragging = useRef(false)

  const card = queue[idx] || null
  const remaining = Math.max(0, queue.length - idx)
  const progressPct = sessionTotal > 0 ? Math.round((sessionDone / sessionTotal) * 100) : 0

  // ─── API ────────────────────────────────────────────────────────────────────

  const loadStats = useCallback(async () => {
    try { setStats(await (await fetch('/api/spanish/stats')).json()) } catch {}
  }, [])

  const loadCards = useCallback(async (m) => {
    setLoading(true)
    setIdx(0); setTapStage(0); setSwipeDelta(0)
    try {
      const { cards } = await (await fetch(`/api/spanish/cards?mode=${m}`)).json()
      setQueue(cards || [])
      setSessionTotal(cards?.length || 0)
      setSessionDone(0)
    } catch {
      setQueue([]); setSessionTotal(0)
    }
    setLoading(false)
  }, [])

  // ─── Audio ──────────────────────────────────────────────────────────────────

  const stopAudio = useCallback(() => {
    audioRef.current?.pause()
    audioRef.current = null
    if (urlRef.current) { URL.revokeObjectURL(urlRef.current); urlRef.current = null }
  }, [])

  const playTTS = useCallback(async (text, lang = 'es') => {
    stopAudio()
    try {
      const res = await fetch('/api/spanish/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      })
      if (!res.ok) return
      const url = URL.createObjectURL(await res.blob())
      urlRef.current = url
      const audio = new Audio(url)
      audioRef.current = audio
      await audio.play().catch(() => {})
    } catch {}
  }, [stopAudio])

  // ─── Init ───────────────────────────────────────────────────────────────────

  useEffect(() => { loadStats(); loadCards('review') }, [])

  // Auto-play Spanish word on each new card
  useEffect(() => {
    if (card && !loading) playTTS(card.spanish)
  }, [card?.id, loading])

  // ─── Card tap (advances stage) ───────────────────────────────────────────────

  const handleCardTap = useCallback(() => {
    if (submitting || isDragging.current) return
    if (tapStage === 0) {
      setTapStage(1)
      if (card?.english) playTTS(card.english, 'en')
    } else if (tapStage === 1) {
      setTapStage(2)
      if (card?.sample_sentence_es) playTTS(card.sample_sentence_es, 'es')
    }
  }, [tapStage, submitting, card, playTTS])

  // ─── Rating ─────────────────────────────────────────────────────────────────

  const handleRate = useCallback(async (rating) => {
    if (!card || submitting) return
    setSubmitting(true)
    setSwipeDelta(0)
    setSwipeFlash(rating === 1 ? 'again' : 'good')

    try {
      await fetch('/api/spanish/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: card.id, rating }),
      })
      setSessionDone(d => d + 1)
    } catch {}

    await new Promise(r => setTimeout(r, 200))
    setSwipeFlash(null)
    setTapStage(0)
    setSubmitting(false)

    const next = idx + 1
    if (next >= queue.length) {
      loadStats()
      loadCards(mode)
    } else {
      setIdx(next)
    }
  }, [card, idx, queue.length, mode, submitting, loadStats, loadCards])

  // ─── Mode switch ─────────────────────────────────────────────────────────────

  const switchMode = useCallback(async (m) => {
    if (loading || submitting) return
    stopAudio()
    setMode(m)
    setShowStats(false)
    await loadCards(m)
  }, [loading, submitting, stopAudio, loadCards])

  // ─── Swipe — mouse ──────────────────────────────────────────────────────────

  const onMouseDown = useCallback((e) => {
    dragStartX.current = e.clientX
    isDragging.current = false
  }, [])

  const onMouseMove = useCallback((e) => {
    if (dragStartX.current === null || tapStage < 1) return
    const dx = e.clientX - dragStartX.current
    if (Math.abs(dx) > 6) isDragging.current = true
    setSwipeDelta(dx)
  }, [tapStage])

  const onMouseUp = useCallback((e) => {
    if (dragStartX.current === null) return
    const dx = e.clientX - dragStartX.current
    dragStartX.current = null
    setSwipeDelta(0)
    if (isDragging.current && Math.abs(dx) > 60 && tapStage >= 1) {
      handleRate(dx > 0 ? 4 : 1)
    }
    setTimeout(() => { isDragging.current = false }, 30)
  }, [tapStage, handleRate])

  const onMouseLeave = useCallback(() => {
    dragStartX.current = null
    setSwipeDelta(0)
  }, [])

  // ─── Swipe — touch ──────────────────────────────────────────────────────────

  const onTouchStart = useCallback((e) => {
    dragStartX.current = e.touches[0].clientX
    isDragging.current = false
  }, [])

  const onTouchEnd = useCallback((e) => {
    if (dragStartX.current === null) return
    const dx = e.changedTouches[0].clientX - dragStartX.current
    dragStartX.current = null
    if (Math.abs(dx) > 60 && tapStage >= 1) {
      handleRate(dx > 0 ? 4 : 1)
    } else if (Math.abs(dx) < 10) {
      handleCardTap()
    }
  }, [tapStage, handleRate, handleCardTap])

  // ─── Keyboard shortcuts ──────────────────────────────────────────────────────

  const handleRateRef = useRef(handleRate)
  const handleCardTapRef = useRef(handleCardTap)
  const tapStageRef = useRef(tapStage)
  useEffect(() => { handleRateRef.current = handleRate }, [handleRate])
  useEffect(() => { handleCardTapRef.current = handleCardTap }, [handleCardTap])
  useEffect(() => { tapStageRef.current = tapStage }, [tapStage])

  useEffect(() => {
    const map = { '1': 1, '2': 3, '3': 4, '4': 5 }
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === ' ') { e.preventDefault(); handleCardTapRef.current() }
      else if (map[e.key] && tapStageRef.current >= 1) handleRateRef.current(map[e.key])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={{
      height: '100dvh', background: '#080D14',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      userSelect: 'none',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '0.75rem 1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F1F5F9' }}>🇪🇸 Knapp en Español</span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {sessionDone > 0 && (
            <span style={{
              background: 'rgba(99,102,241,0.15)', color: '#818CF8',
              borderRadius: 99, padding: '0.15rem 0.55rem',
              fontSize: '0.7rem', fontWeight: 600,
            }}>
              {sessionDone} done
            </span>
          )}
          <button
            onClick={() => setShowStats(s => !s)}
            style={{
              background: showStats ? 'rgba(99,102,241,0.15)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.07)',
              color: showStats ? '#818CF8' : '#334155',
              borderRadius: 7, padding: '0.3rem 0.65rem',
              fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500,
            }}
          >Stats</button>
        </div>
      </div>

      {/* Session progress bar */}
      {!showStats && sessionTotal > 0 && (
        <div style={{ height: 3, background: 'rgba(255,255,255,0.03)', flexShrink: 0 }}>
          <div style={{
            height: '100%', width: `${progressPct}%`,
            background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
            transition: 'width 0.35s ease',
          }} />
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {showStats ? (
          <StatsView stats={stats} />
        ) : loading ? (
          <Center>Loading...</Center>
        ) : !card ? (
          <EmptyState mode={mode} stats={stats} onSwitch={switchMode} onMore={() => loadCards(mode)} />
        ) : (
          <div
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Flash overlay on rating */}
            {(swipeFlash || Math.abs(swipeDelta) > 40) && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
                background: (swipeFlash === 'good' || swipeDelta > 40)
                  ? 'rgba(52,211,153,0.08)'
                  : 'rgba(239,68,68,0.08)',
              }} />
            )}

            {/* Swipe direction indicator */}
            {tapStage >= 1 && Math.abs(swipeDelta) > 30 && !swipeFlash && (
              <div style={{
                position: 'absolute',
                ...(swipeDelta > 0 ? { right: 20 } : { left: 20 }),
                top: '38%', zIndex: 6, pointerEvents: 'none',
                color: swipeDelta > 0 ? '#34D399' : '#EF4444',
                fontSize: '2rem', fontWeight: 800,
                opacity: Math.min(1, Math.abs(swipeDelta) / 100),
              }}>
                {swipeDelta > 0 ? '✓' : '↩'}
              </div>
            )}

            {/* Scrollable card body */}
            <div
              style={{
                flex: 1, overflowY: 'auto',
                padding: '1.25rem 1.25rem 0.75rem',
                transform: `translateX(${swipeDelta * 0.18}px)`,
                transition: (swipeDelta === 0 && !swipeFlash) ? 'transform 0.2s ease' : 'none',
                cursor: tapStage < 2 ? 'pointer' : 'default',
              }}
              onClick={tapStage < 2 ? () => { if (!isDragging.current) handleCardTap() } : undefined}
            >
              {/* Badges + remaining */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <Badge color={POS_COLOR[card.part_of_speech] || '#64748B'}>{card.part_of_speech}</Badge>
                  <Badge color={CEFR_COLOR[card.cefr_level] || '#64748B'}>{card.cefr_level}</Badge>
                  {!card.is_introduced && <Badge color="#334155">new</Badge>}
                </div>
                <span style={{ color: '#1E3A5F', fontSize: '0.72rem' }}>{remaining} left</span>
              </div>

              {/* Spanish word */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{
                  fontSize: '2.75rem', fontWeight: 800, color: '#F8FAFC',
                  lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '0.5rem',
                }}>
                  {card.spanish}
                </div>
                <button
                  onClick={e => { e.stopPropagation(); playTTS(card.spanish, 'es') }}
                  style={{
                    background: 'none', border: 'none', color: '#334155',
                    cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem',
                  }}
                >
                  🔊 <span>replay</span>
                </button>
              </div>

              {/* Stage 1: English */}
              {tapStage >= 1 && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: '0.9rem' }} />
                  <div style={{
                    fontSize: '1.65rem', fontWeight: 700, color: '#E2E8F0',
                    lineHeight: 1.2, letterSpacing: '-0.015em',
                  }}>
                    {card.english}
                  </div>
                  {tapStage < 2 && (
                    <div style={{ marginTop: '0.6rem', color: '#1E3A5F', fontSize: '0.73rem' }}>
                      tap for example →
                    </div>
                  )}
                </div>
              )}

              {/* Stage 2: Sample sentence + conjugation */}
              {tapStage >= 2 && (
                <>
                  {card.sample_sentence_es && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.8rem 1rem',
                      background: 'rgba(255,255,255,0.025)',
                      borderRadius: 9,
                      borderLeft: '2px solid rgba(139,92,246,0.5)',
                    }}>
                      <div style={{ fontSize: '0.875rem', color: '#94A3B8', fontStyle: 'italic', lineHeight: 1.55, marginBottom: '0.35rem' }}>
                        "{card.sample_sentence_es}"
                      </div>
                      {card.sample_sentence_en && (
                        <div style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
                          "{card.sample_sentence_en}"
                        </div>
                      )}
                    </div>
                  )}
                  {card.conjugations && <ConjDisplay raw={card.conjugations} />}
                </>
              )}

              {/* Tap hint */}
              {tapStage === 0 && (
                <div style={{ marginTop: '2.5rem', color: '#1E3A5F', fontSize: '0.78rem', textAlign: 'center' }}>
                  tap to reveal
                </div>
              )}
            </div>

            {/* Action bar — appears at stage 1 */}
            {tapStage >= 1 && (
              <div style={{
                flexShrink: 0,
                padding: '0.7rem 1rem 0.9rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'column', gap: '0.45rem',
              }}>
                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  {[
                    { v: 1, label: 'Again', c: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
                    { v: 3, label: 'Hard',  c: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
                    { v: 4, label: 'Good',  c: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
                    { v: 5, label: 'Easy',  c: '#34D399', bg: 'rgba(52,211,153,0.1)' },
                  ].map(r => (
                    <button
                      key={r.v}
                      onClick={() => handleRate(r.v)}
                      disabled={submitting}
                      style={{
                        flex: 1, padding: '0.65rem 0.15rem',
                        background: r.bg, color: r.c,
                        border: `1px solid ${r.c}33`,
                        borderRadius: 9, fontSize: '0.82rem', fontWeight: 600,
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        opacity: submitting ? 0.4 : 1,
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleRate(99)}
                  disabled={submitting}
                  style={{
                    padding: '0.5rem',
                    background: 'rgba(255,255,255,0.025)', color: '#334155',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 8, fontSize: '0.76rem', fontWeight: 500,
                    cursor: 'pointer', opacity: submitting ? 0.4 : 1,
                  }}
                >
                  I know this — skip ~4 months
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mode footer */}
      {!showStats && (
        <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {MODES.map(m => (
            <ModeTab
              key={m.key}
              label={m.label}
              count={stats?.[m.statKey] ?? '·'}
              active={mode === m.key}
              onClick={() => mode !== m.key && switchMode(m.key)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ConjDisplay({ raw }) {
  const [expanded, setExpanded] = useState(false)
  const conj = typeof raw === 'string' ? JSON.parse(raw) : raw
  const persons = ['yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos/ellas']

  const TenseGrid = ({ tense, forms }) => (
    <div>
      <div style={{ color: '#1E293B', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
        {tense}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.15rem 0.75rem' }}>
        {persons.slice(0, 6).map(p => (
          <div key={p} style={{ display: 'flex', gap: '0.35rem', fontSize: '0.78rem' }}>
            <span style={{ color: '#334155', minWidth: 52 }}>
              {p.replace('/ella', '').replace('/ellas', '')}
            </span>
            <span style={{ color: '#CBD5E1' }}>{forms[p]}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{
      marginTop: '0.85rem',
      background: 'rgba(0,0,0,0.25)',
      borderRadius: 9, padding: '0.75rem 0.875rem',
    }}
    onClick={e => e.stopPropagation()}>
      {/* Gerundio + participio — always visible */}
      <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '0.6rem', lineHeight: 1.7 }}>
        {conj.gerundio && (
          <span>gerundio: <span style={{ color: '#94A3B8' }}>{conj.gerundio}</span></span>
        )}
        {conj.gerundio && conj.participio && (
          <span style={{ margin: '0 0.5rem', color: '#1E293B' }}>·</span>
        )}
        {conj.participio && (
          <span>participio: <span style={{ color: '#94A3B8' }}>{conj.participio}</span></span>
        )}
      </div>

      {/* Presente — always shown */}
      {conj.presente && <TenseGrid tense="presente" forms={conj.presente} />}

      {/* Pretérito + futuro — toggle */}
      {(conj.preterito || conj.futuro) && (
        <>
          <button
            onClick={e => { e.stopPropagation(); setExpanded(x => !x) }}
            style={{
              background: 'none', border: 'none', color: '#334155',
              cursor: 'pointer', fontSize: '0.72rem', marginTop: '0.5rem',
              padding: 0, display: 'block',
            }}
          >
            {expanded ? '▲ hide' : '▼ pretérito + futuro'}
          </button>
          {expanded && (
            <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {conj.preterito && <TenseGrid tense="pretérito" forms={conj.preterito} />}
              {conj.futuro && <TenseGrid tense="futuro" forms={conj.futuro} />}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function EmptyState({ mode, stats, onSwitch, onMore }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem', textAlign: 'center', gap: '0.75rem',
    }}>
      <div style={{ fontSize: '2.5rem' }}>✓</div>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#E2E8F0' }}>
        {mode === 'review' ? 'All caught up' :
         mode === 'learn'  ? 'Batch complete' :
         mode === 'hard'   ? 'No hard cards' : 'No recent misses'}
      </div>
      <div style={{ fontSize: '0.82rem', color: '#475569', maxWidth: 260, lineHeight: 1.5 }}>
        {mode === 'review' && 'No cards due. Learn something new or come back later.'}
        {mode === 'learn'  && 'Want to keep going? Load another batch.'}
        {mode === 'hard'   && 'Keep practicing — ease factors will drop again.'}
        {mode === 'misses' && 'Clean slate. Nice work.'}
      </div>
      {mode === 'learn' && (
        <button onClick={onMore} style={actionBtn}>Give me 20 more →</button>
      )}
      {mode === 'review' && (stats?.new_available ?? 0) > 0 && (
        <button onClick={() => onSwitch('learn')} style={actionBtn}>Learn New Words →</button>
      )}
    </div>
  )
}

const actionBtn = {
  background: 'rgba(99,102,241,0.15)', color: '#818CF8',
  border: '1px solid rgba(99,102,241,0.3)', borderRadius: 9,
  padding: '0.6rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
}

function StatsView({ stats }) {
  if (!stats) return <Center>Loading...</Center>
  const pct = stats.total > 0 ? Math.round((stats.introduced / stats.total) * 100) : 0
  const rows = [
    { label: 'Total words',    value: stats.total,         color: '#64748B' },
    { label: 'Introduced',     value: stats.introduced,    color: '#38BDF8' },
    { label: 'Learned',        value: stats.learned,       color: '#34D399' },
    { label: 'Due now',        value: stats.due,           color: '#F59E0B' },
    { label: 'Hard cards',     value: stats.hard,          color: '#F87171' },
    { label: 'Recent misses',  value: stats.misses,        color: '#C084FC' },
    { label: 'Not started',    value: stats.new_available, color: '#A78BFA' },
  ]
  return (
    <div style={{ flex: 1, padding: '1.5rem', maxWidth: 480, overflowY: 'auto' }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#1E3A5F', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
        Progress
      </div>
      {rows.map(r => (
        <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <span style={{ color: '#475569', fontSize: '0.875rem' }}>{r.label}</span>
          <span style={{ color: r.color, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{r.value ?? '—'}</span>
        </div>
      ))}
      <div style={{ marginTop: '1.25rem' }}>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: 'linear-gradient(90deg, #34D399, #38BDF8)',
            borderRadius: 99, transition: 'width 0.6s ease',
          }} />
        </div>
        <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: '#334155', textAlign: 'right' }}>
          {pct}% introduced
        </div>
      </div>
    </div>
  )
}

function ModeTab({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '0.6rem 0.25rem',
        background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
        border: 'none',
        borderTop: `2px solid ${active ? '#6366F1' : 'transparent'}`,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem',
      }}
    >
      <span style={{ fontSize: '0.68rem', fontWeight: 600, color: active ? '#818CF8' : '#334155' }}>
        {label}
      </span>
      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: active ? '#A5B4FC' : '#1E3A5F', fontVariantNumeric: 'tabular-nums' }}>
        {count}
      </span>
    </button>
  )
}

function Badge({ color, children }) {
  return (
    <span style={{
      background: color + '1A', color,
      border: `1px solid ${color}33`,
      borderRadius: 99, padding: '0.14rem 0.5rem',
      fontSize: '0.7rem', fontWeight: 600,
    }}>
      {children}
    </span>
  )
}

function Center({ children }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: '0.875rem' }}>
      {children}
    </div>
  )
}

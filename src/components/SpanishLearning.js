'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

const POS_COLOR = {
  noun: '#3B82F6', verb: '#8B5CF6', adjective: '#10B981',
  adverb: '#F59E0B', phrase: '#EC4899',
}
const CEFR_COLOR = { A2: '#34D399', B1: '#38BDF8', B2: '#A78BFA' }

const MODES = [
  { key: 'review', label: 'Review', statKey: 'due' },
  { key: 'learn',  label: 'Learn',  statKey: 'new_available' },
  { key: 'today',  label: 'Today',  statKey: 'today_misses' },
  { key: 'week',   label: '7 Days', statKey: 'week_misses' },
]

const POS_OPTIONS = [
  { value: 'all',       label: 'All words' },
  { value: 'noun',      label: 'Nouns' },
  { value: 'verb',      label: 'Verbs' },
  { value: 'adjective', label: 'Adjectives' },
  { value: 'adverb',    label: 'Adverbs' },
  { value: 'phrase',    label: 'Phrases' },
]

function isFocus(mode) { return mode === 'today' || mode === 'week' }

function getIrregNote(card) {
  if (card.part_of_speech !== 'verb' || !card.conjugations) return null
  try {
    const conj = typeof card.conjugations === 'string'
      ? JSON.parse(card.conjugations) : card.conjugations
    const pres = conj.presente
    if (!pres?.['yo']) return null

    let inf = card.spanish.trim()
    if (inf.endsWith('se')) inf = inf.slice(0, -2)
    inf = inf.replace(/\s+(lo|la|les?|nos|os|se)$/, '').trim()
    const ending = inf.slice(-2).toLowerCase()
    if (!['ar', 'er', 'ir'].includes(ending)) return null

    const stem = inf.slice(0, -2).toLowerCase()
    const yo = pres['yo'].toLowerCase()
    if (yo === stem + 'o') return null

    if (['soy', 'voy', 'estoy', 'doy', 'sé', 'he'].includes(yo)) return 'Fully irregular'
    if (yo.endsWith('go') && yo !== stem + 'go') return 'Irregular yo (-go)'
    if (yo.endsWith('zco')) return 'Irregular yo (-zco)'

    const yStem = yo.endsWith('o') ? yo.slice(0, -1) : yo
    if (yStem !== stem) {
      if (yStem.includes('ie') && !stem.includes('ie')) return 'Stem-changing (e → ie)'
      if (yStem.includes('ue') && !stem.includes('ue')) return 'Stem-changing (o → ue)'
      if (!stem.includes('i') && yStem.includes('i')) return 'Stem-changing (e → i)'
      return 'Irregular'
    }
    return null
  } catch { return null }
}

export default function SpanishLearning() {
  const [mode, setMode] = useState('review')
  const [filter, setFilter] = useState('all')
  const [queue, setQueue] = useState([])
  const [idx, setIdx] = useState(0)
  const [tapStage, setTapStage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [stats, setStats] = useState(null)
  const [showStats, setShowStats] = useState(true)
  const [sessionDone, setSessionDone] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)
  const [swipeDelta, setSwipeDelta] = useState(0)
  const [swipeFlash, setSwipeFlash] = useState(null)
  const [showConj, setShowConj] = useState(false)

  const audioRef = useRef(null)
  const urlRef = useRef(null)
  const prefetchRef = useRef(null)
  const dragStartX = useRef(null)
  const isDragging = useRef(false)
  const filterRef = useRef('all')
  const modeRef = useRef('review')
  const showStatsRef = useRef(true)

  useEffect(() => { filterRef.current = filter }, [filter])
  useEffect(() => { modeRef.current = mode }, [mode])
  useEffect(() => { showStatsRef.current = showStats }, [showStats])

  const card = queue[idx] || null
  const remaining = Math.max(0, queue.length - idx)
  const progressPct = sessionTotal > 0 ? Math.round((sessionDone / sessionTotal) * 100) : 0
  const focusMode = isFocus(mode)
  const irregNote = card ? getIrregNote(card) : null

  // ─── API ─────────────────────────────────────────────────────────────────────

  const fetchStats = useCallback(async (pos) => {
    try { setStats(await (await fetch(`/api/spanish/stats?pos=${pos}`)).json()) } catch {}
  }, [])

  const fetchCards = useCallback(async (m, pos) => {
    setLoading(true)
    setIdx(0); setTapStage(0); setSwipeDelta(0); setShowConj(false)
    try {
      const { cards } = await (await fetch(`/api/spanish/cards?mode=${m}&pos=${pos}`)).json()
      setQueue(cards || [])
      setSessionTotal(cards?.length || 0)
      setSessionDone(0)
    } catch { setQueue([]); setSessionTotal(0) }
    setLoading(false)
  }, [])

  useEffect(() => { fetchStats('all'); fetchCards('review', 'all') }, [])

  // ─── Audio ────────────────────────────────────────────────────────────────────

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

  // Auto-play English when card loads
  useEffect(() => {
    if (card && !loading && !showStats) playTTS(card.english, 'en')
  }, [card?.id, loading, showStats])

  // Pre-fetch next card's English TTS
  useEffect(() => {
    const next = queue[idx + 1]
    if (!next || loading) { prefetchRef.current = null; return }
    let cancelled = false
    fetch('/api/spanish/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: next.english, lang: 'en' }),
    })
      .then(r => r.blob())
      .then(blob => {
        if (cancelled) return
        const url = URL.createObjectURL(blob)
        prefetchRef.current = new Audio(url)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [idx, loading])

  // ─── Card tap ─────────────────────────────────────────────────────────────────

  const handleCardTap = useCallback(() => {
    if (submitting || isDragging.current) return
    if (tapStage === 0) {
      setTapStage(1)
      setShowConj(false)
      if (card?.spanish) playTTS(card.spanish, 'es')
    }
  }, [tapStage, submitting, card, playTTS])

  // ─── Advance / Rate ───────────────────────────────────────────────────────────

  const advance = useCallback(async ({ rating = null, drop = false } = {}) => {
    if (!card || submitting) return
    const pos = filterRef.current
    const m = modeRef.current
    const next = idx + 1
    const nextCard = queue[next]

    // Play next card's English audio synchronously (iOS autoplay)
    const prefetched = prefetchRef.current
    prefetchRef.current = null
    if (nextCard) {
      stopAudio()
      if (prefetched) { audioRef.current = prefetched; prefetched.play().catch(() => {}) }
      else playTTS(nextCard.english, 'en')
    }

    setSubmitting(true)
    setSwipeDelta(0)
    if (rating !== null) setSwipeFlash(rating === 1 ? 'miss' : 'correct')

    try {
      if (drop) {
        await fetch('/api/spanish/focus-drop', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: card.id }),
        })
        fetchStats(pos)
      } else if (rating !== null) {
        await fetch('/api/spanish/review', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: card.id, rating }),
        })
      }
      setSessionDone(d => d + 1)
    } catch {}

    await new Promise(r => setTimeout(r, 200))
    setSwipeFlash(null)
    setTapStage(0)
    setShowConj(false)
    setSubmitting(false)

    if (next >= queue.length) {
      fetchStats(pos)
      fetchCards(m, pos)
    } else {
      setIdx(next)
    }
  }, [card, idx, queue, submitting, stopAudio, playTTS, fetchStats, fetchCards])

  // ─── Mode / filter switch ─────────────────────────────────────────────────────

  const switchMode = useCallback((m) => {
    if (loading || submitting) return
    stopAudio()
    setMode(m)
    setShowStats(false)
    fetchCards(m, filterRef.current)
  }, [loading, submitting, stopAudio, fetchCards])

  const switchFilter = useCallback((pos) => {
    setFilter(pos)
    fetchStats(pos)
    if (!showStatsRef.current) fetchCards(modeRef.current, pos)
  }, [fetchStats, fetchCards])

  // ─── Swipe — touch ────────────────────────────────────────────────────────────

  const onTouchStart = useCallback((e) => {
    dragStartX.current = e.touches[0].clientX
    isDragging.current = false
  }, [])

  const onTouchEnd = useCallback((e) => {
    if (dragStartX.current === null) return
    if (e.target.closest('button')) { dragStartX.current = null; return }
    const dx = e.changedTouches[0].clientX - dragStartX.current
    dragStartX.current = null
    if (Math.abs(dx) > 60 && tapStage >= 1) {
      if (isFocus(modeRef.current)) advance()
      else advance({ rating: dx > 0 ? 4 : 1 })
    } else if (Math.abs(dx) < 10) {
      handleCardTap()
    }
  }, [tapStage, advance, handleCardTap])

  // ─── Swipe — mouse ────────────────────────────────────────────────────────────

  const onMouseDown = useCallback((e) => {
    dragStartX.current = e.clientX; isDragging.current = false
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
    dragStartX.current = null; setSwipeDelta(0)
    if (isDragging.current && Math.abs(dx) > 60 && tapStage >= 1) {
      if (isFocus(modeRef.current)) advance()
      else advance({ rating: dx > 0 ? 4 : 1 })
    }
    setTimeout(() => { isDragging.current = false }, 30)
  }, [tapStage, advance])

  const onMouseLeave = useCallback(() => {
    dragStartX.current = null; setSwipeDelta(0)
  }, [])

  // ─── Keyboard ─────────────────────────────────────────────────────────────────

  const advanceRef = useRef(advance)
  const handleCardTapRef = useRef(handleCardTap)
  const tapStageRef = useRef(tapStage)
  useEffect(() => { advanceRef.current = advance }, [advance])
  useEffect(() => { handleCardTapRef.current = handleCardTap }, [handleCardTap])
  useEffect(() => { tapStageRef.current = tapStage }, [tapStage])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === ' ') { e.preventDefault(); handleCardTapRef.current() }
      else if (e.key === 'ArrowLeft' && tapStageRef.current >= 1) {
        if (isFocus(modeRef.current)) advanceRef.current()
        else advanceRef.current({ rating: 1 })
      }
      else if (e.key === 'ArrowRight' && tapStageRef.current >= 1) {
        if (isFocus(modeRef.current)) advanceRef.current()
        else advanceRef.current({ rating: 4 })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div style={{
      height: '100dvh', background: '#080D14',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      userSelect: 'none', overflow: 'hidden',
    }}>

      {/* Header */}
      <div style={{
        padding: '0.6rem 1rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0,
      }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F1F5F9', flexShrink: 0 }}>
          🇪🇸 Knapp en Español
        </span>
        <select
          value={filter}
          onChange={e => switchFilter(e.target.value)}
          style={{
            flex: 1, background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#64748B', borderRadius: 6,
            padding: '0.25rem 0.4rem', fontSize: '0.7rem', cursor: 'pointer',
          }}
        >
          {POS_OPTIONS.map(o => (
            <option key={o.value} value={o.value} style={{ background: '#1E293B' }}>{o.label}</option>
          ))}
        </select>
        {!showStats && sessionDone > 0 && (
          <span style={{
            background: 'rgba(99,102,241,0.12)', color: '#818CF8',
            borderRadius: 99, padding: '0.12rem 0.45rem',
            fontSize: '0.67rem', fontWeight: 600, flexShrink: 0,
          }}>{sessionDone}/{sessionTotal}</span>
        )}
        <button
          onClick={() => { setShowStats(s => !s); if (!showStats) stopAudio() }}
          style={{
            background: showStats ? 'rgba(99,102,241,0.12)' : 'transparent',
            border: '1px solid rgba(255,255,255,0.06)',
            color: showStats ? '#818CF8' : '#334155',
            borderRadius: 6, padding: '0.25rem 0.55rem',
            fontSize: '0.7rem', cursor: 'pointer', fontWeight: 500, flexShrink: 0,
          }}
        >Stats</button>
      </div>

      {/* Progress bar */}
      {!showStats && sessionTotal > 0 && (
        <div style={{ height: 2, background: 'rgba(255,255,255,0.03)', flexShrink: 0 }}>
          <div style={{
            height: '100%', width: `${progressPct}%`,
            background: focusMode
              ? 'linear-gradient(90deg, #F59E0B, #EF4444)'
              : 'linear-gradient(90deg, #6366F1, #8B5CF6)',
            transition: 'width 0.35s ease',
          }} />
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {showStats ? (
          <StatsView stats={stats} onStart={switchMode} />
        ) : loading ? (
          <Center>Loading...</Center>
        ) : !card ? (
          <EmptyState mode={mode} stats={stats} onMore={() => fetchCards(mode, filterRef.current)} onSwitch={switchMode} />
        ) : (
          <div
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove}
            onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          >
            {/* Flash overlay */}
            {(swipeFlash || Math.abs(swipeDelta) > 40) && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
                background: (swipeFlash === 'correct' || swipeDelta > 40)
                  ? 'rgba(52,211,153,0.07)' : 'rgba(239,68,68,0.07)',
              }} />
            )}

            {/* Swipe labels */}
            {tapStage >= 1 && Math.abs(swipeDelta) > 30 && !swipeFlash && !focusMode && (
              <div style={{
                position: 'absolute',
                ...(swipeDelta > 0 ? { right: 16 } : { left: 16 }),
                top: '36%', zIndex: 6, pointerEvents: 'none',
                color: swipeDelta > 0 ? '#34D399' : '#EF4444',
                fontSize: '1rem', fontWeight: 700,
                opacity: Math.min(1, Math.abs(swipeDelta) / 80),
              }}>
                {swipeDelta > 0 ? '✓ Correct' : '✗ Miss'}
              </div>
            )}

            {/* Scrollable card body */}
            <div
              style={{
                flex: 1, overflowY: 'auto',
                padding: '1rem 1.25rem 0.75rem',
                transform: `translateX(${swipeDelta * 0.15}px)`,
                transition: (swipeDelta === 0 && !swipeFlash) ? 'transform 0.2s ease' : 'none',
                cursor: tapStage === 0 ? 'pointer' : 'default',
              }}
              onClick={tapStage === 0 ? () => { if (!isDragging.current) handleCardTap() } : undefined}
            >
              {/* Badges + remaining */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  <Badge color={POS_COLOR[card.part_of_speech] || '#64748B'}>{card.part_of_speech}</Badge>
                  <Badge color={CEFR_COLOR[card.cefr_level] || '#64748B'}>{card.cefr_level}</Badge>
                  {!card.is_introduced && <Badge color="#334155">new</Badge>}
                  {focusMode && <Badge color="#F59E0B">{mode === 'today' ? 'today' : '7-day'}</Badge>}
                </div>
                <span style={{ color: '#1E3A5F', fontSize: '0.7rem' }}>{remaining} left</span>
              </div>

              {/* ENGLISH — front of card */}
              <div style={{ marginBottom: tapStage === 0 ? '2.5rem' : '1rem' }}>
                <div style={{
                  fontSize: '2.5rem', fontWeight: 800, color: '#F8FAFC',
                  lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '0.4rem',
                }}>
                  {card.english}
                </div>
                <button
                  onClick={e => { e.stopPropagation(); playTTS(card.english, 'en') }}
                  style={{
                    background: 'none', border: 'none', color: '#1E3A5F',
                    cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem',
                  }}
                >🔊 <span>replay</span></button>
              </div>

              {tapStage === 0 && (
                <div style={{ color: '#1E3A5F', fontSize: '0.76rem', textAlign: 'center', marginTop: '0.5rem' }}>
                  tap to reveal Spanish
                </div>
              )}

              {/* SPANISH + details — revealed at stage 1 */}
              {tapStage >= 1 && (
                <>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: '0.85rem' }} />

                  {/* Spanish word */}
                  <div style={{ marginBottom: '0.65rem' }}>
                    <div style={{
                      fontSize: '2rem', fontWeight: 700, color: '#A78BFA',
                      lineHeight: 1.1, letterSpacing: '-0.015em', marginBottom: '0.3rem',
                    }}>
                      {card.spanish}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); playTTS(card.spanish, 'es') }}
                      style={{
                        background: 'none', border: 'none', color: '#1E3A5F',
                        cursor: 'pointer', padding: 0,
                        display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem',
                      }}
                    >🔊 <span>replay Spanish</span></button>
                  </div>

                  {/* Verb: irregularity + conjugation toggle */}
                  {card.part_of_speech === 'verb' && (
                    <div style={{ marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {irregNote ? (
                        <span style={{
                          background: 'rgba(245,158,11,0.1)', color: '#F59E0B',
                          border: '1px solid rgba(245,158,11,0.25)',
                          borderRadius: 6, padding: '0.16rem 0.45rem',
                          fontSize: '0.7rem', fontWeight: 600,
                        }}>⚡ {irregNote}</span>
                      ) : (
                        <span style={{
                          background: 'rgba(52,211,153,0.08)', color: '#34D399',
                          border: '1px solid rgba(52,211,153,0.2)',
                          borderRadius: 6, padding: '0.16rem 0.45rem',
                          fontSize: '0.7rem', fontWeight: 500,
                        }}>Regular</span>
                      )}
                      {card.conjugations && (
                        <button
                          onClick={e => { e.stopPropagation(); setShowConj(x => !x) }}
                          style={{
                            background: 'none', border: 'none', color: '#475569',
                            cursor: 'pointer', fontSize: '0.7rem', padding: 0,
                            textDecoration: 'underline', textUnderlineOffset: 2,
                          }}
                        >
                          {showConj ? 'Hide conjugations' : 'See all conjugations'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Conjugation table */}
                  {showConj && card.conjugations && (
                    <div onClick={e => e.stopPropagation()}>
                      <ConjDisplay raw={card.conjugations} />
                    </div>
                  )}

                  {/* Sample sentence */}
                  {card.sample_sentence_es && (
                    <div style={{
                      marginTop: '0.65rem',
                      padding: '0.65rem 0.875rem',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: 8, borderLeft: '2px solid rgba(139,92,246,0.35)',
                    }}>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic', lineHeight: 1.5, marginBottom: card.sample_sentence_en ? '0.2rem' : 0 }}>
                        "{card.sample_sentence_es}"
                      </div>
                      {card.sample_sentence_en && (
                        <div style={{ fontSize: '0.72rem', color: '#334155', lineHeight: 1.4 }}>
                          "{card.sample_sentence_en}"
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Action bar */}
            {tapStage >= 1 && (
              <div
                style={{
                  flexShrink: 0, padding: '0.6rem 1rem 0.75rem',
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                }}
                onClick={e => e.stopPropagation()}
              >
                {focusMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'center' }}>
                    <button
                      onClick={() => advance({ drop: true })}
                      disabled={submitting}
                      style={{
                        width: '100%', padding: '0.65rem',
                        background: 'rgba(239,68,68,0.08)', color: '#F87171',
                        border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: 9, fontSize: '0.82rem', fontWeight: 600,
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        opacity: submitting ? 0.4 : 1,
                      }}
                    >Drop from focus</button>
                    <div style={{ fontSize: '0.65rem', color: '#1E3A5F' }}>swipe to advance</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => advance({ rating: 1 })}
                        disabled={submitting}
                        style={{
                          flex: 1, padding: '0.7rem',
                          background: 'rgba(239,68,68,0.09)', color: '#EF4444',
                          border: '1px solid rgba(239,68,68,0.22)',
                          borderRadius: 9, fontSize: '0.9rem', fontWeight: 700,
                          cursor: submitting ? 'not-allowed' : 'pointer',
                          opacity: submitting ? 0.4 : 1,
                        }}
                      >✗ Miss</button>
                      <button
                        onClick={() => advance({ rating: 4 })}
                        disabled={submitting}
                        style={{
                          flex: 1, padding: '0.7rem',
                          background: 'rgba(52,211,153,0.09)', color: '#34D399',
                          border: '1px solid rgba(52,211,153,0.22)',
                          borderRadius: 9, fontSize: '0.9rem', fontWeight: 700,
                          cursor: submitting ? 'not-allowed' : 'pointer',
                          opacity: submitting ? 0.4 : 1,
                        }}
                      >✓ Correct</button>
                    </div>
                    <button
                      onClick={() => advance({ rating: 99 })}
                      disabled={submitting}
                      style={{
                        padding: '0.42rem',
                        background: 'rgba(255,255,255,0.02)', color: '#334155',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 8, fontSize: '0.7rem',
                        cursor: 'pointer', opacity: submitting ? 0.4 : 1,
                      }}
                    >I know this — skip ~4 months</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mode tabs */}
      {!showStats && (
        <div style={{
          display: 'flex', borderTop: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0, paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
          {MODES.map(m => (
            <ModeTab
              key={m.key}
              label={m.label}
              count={stats?.[m.statKey] ?? '·'}
              active={mode === m.key}
              focus={isFocus(m.key)}
              onClick={() => mode !== m.key && switchMode(m.key)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatsView({ stats, onStart }) {
  if (!stats) return <Center>Loading stats...</Center>
  const total = stats.total || 0
  const neverStarted = stats.new_available || 0
  const inReview = Math.max(0, (stats.introduced || 0) - (stats.learned || 0))
  const learned = stats.learned || 0
  const learnedPct = total > 0 ? (learned / total) * 100 : 0
  const reviewPct = total > 0 ? (inReview / total) * 100 : 0

  const tiles = [
    { label: 'Due for review', value: stats.due,          color: '#38BDF8', mode: 'review' },
    { label: 'New to learn',   value: stats.new_available, color: '#A78BFA', mode: 'learn' },
    { label: "Today's misses", value: stats.today_misses,  color: '#F59E0B', mode: 'today' },
    { label: '7-day misses',   value: stats.week_misses,   color: '#EF4444', mode: 'week' },
  ]

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.25rem' }}>
      <div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#1E3A5F', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
        Word Distribution
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', height: 10, borderRadius: 99, overflow: 'hidden', gap: 1 }}>
          <div style={{ width: `${learnedPct}%`, background: '#34D399', minWidth: learned > 0 ? 3 : 0 }} />
          <div style={{ width: `${reviewPct}%`, background: '#6366F1', minWidth: inReview > 0 ? 3 : 0 }} />
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.62rem', flexWrap: 'wrap' }}>
        <span style={{ color: '#34D399' }}>■ Learned: {learned.toLocaleString()}</span>
        <span style={{ color: '#6366F1' }}>■ Active: {inReview.toLocaleString()}</span>
        <span style={{ color: '#334155' }}>■ Not started: {neverStarted.toLocaleString()}</span>
      </div>

      {/* Stat tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem', marginBottom: '1rem' }}>
        {tiles.map(t => (
          <button
            key={t.mode}
            onClick={() => t.value > 0 && onStart(t.mode)}
            disabled={!t.value}
            style={{
              background: t.color + '0F',
              border: `1px solid ${t.color}25`,
              borderRadius: 10, padding: '0.8rem 0.7rem',
              textAlign: 'left',
              cursor: t.value > 0 ? 'pointer' : 'default',
              opacity: t.value > 0 ? 1 : 0.4,
            }}
          >
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: t.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {(t.value ?? 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#475569', marginTop: '0.28rem' }}>{t.label}</div>
          </button>
        ))}
      </div>

      <div style={{ fontSize: '0.62rem', color: '#1E3A5F', textAlign: 'center' }}>
        {total.toLocaleString()} total words · tap a tile to start
      </div>
    </div>
  )
}

function ConjDisplay({ raw }) {
  const conj = typeof raw === 'string' ? JSON.parse(raw) : raw
  const persons = ['yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos/ellas']

  const Grid = ({ tense, forms }) => (
    <div style={{ marginBottom: '0.65rem' }}>
      <div style={{ color: '#1E293B', fontSize: '0.57rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
        {tense}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.08rem 0.5rem' }}>
        {persons.map(p => (
          <div key={p} style={{ display: 'flex', gap: '0.3rem', fontSize: '0.74rem' }}>
            <span style={{ color: '#334155', minWidth: 46, flexShrink: 0 }}>
              {p.replace('/ella', '').replace('/ellas', '')}
            </span>
            <span style={{ color: '#CBD5E1' }}>{forms?.[p] || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '0.7rem 0.85rem', marginBottom: '0.5rem' }}>
      {(conj.gerundio || conj.participio) && (
        <div style={{ fontSize: '0.72rem', color: '#475569', marginBottom: '0.55rem', lineHeight: 1.7 }}>
          {conj.gerundio && <span>gerundio: <span style={{ color: '#94A3B8' }}>{conj.gerundio}</span></span>}
          {conj.gerundio && conj.participio && <span style={{ margin: '0 0.4rem', color: '#1E293B' }}>·</span>}
          {conj.participio && <span>participio: <span style={{ color: '#94A3B8' }}>{conj.participio}</span></span>}
        </div>
      )}
      {conj.presente  && <Grid tense="presente"  forms={conj.presente} />}
      {conj.preterito && <Grid tense="pretérito" forms={conj.preterito} />}
      {conj.futuro    && <Grid tense="futuro"    forms={conj.futuro} />}
    </div>
  )
}

function EmptyState({ mode, stats, onMore, onSwitch }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem', textAlign: 'center', gap: '0.7rem',
    }}>
      <div style={{ fontSize: '2rem' }}>✓</div>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#E2E8F0' }}>
        {mode === 'review' ? 'All caught up'     :
         mode === 'learn'  ? 'Batch complete'    :
         mode === 'today'  ? 'No today misses'   : 'No 7-day misses'}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#475569', maxWidth: 240, lineHeight: 1.5 }}>
        {mode === 'review' && 'Nothing due. Learn new words or come back later.'}
        {mode === 'learn'  && 'Want more? Load another batch.'}
        {mode === 'today'  && 'No misses today — nice.'}
        {mode === 'week'   && 'Clean slate this week.'}
      </div>
      {mode === 'learn' && (
        <button onClick={onMore} style={actionBtn}>Load 20 more →</button>
      )}
      {mode === 'review' && (stats?.new_available ?? 0) > 0 && (
        <button onClick={() => onSwitch('learn')} style={actionBtn}>Learn New Words →</button>
      )}
    </div>
  )
}

function ModeTab({ label, count, active, focus, onClick }) {
  const ac = focus ? '#F59E0B' : '#6366F1'
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '0.55rem 0.2rem',
        background: active ? (focus ? 'rgba(245,158,11,0.08)' : 'rgba(99,102,241,0.08)') : 'transparent',
        border: 'none',
        borderTop: `2px solid ${active ? ac : 'transparent'}`,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem',
      }}
    >
      <span style={{ fontSize: '0.63rem', fontWeight: 600, color: active ? (focus ? '#FCD34D' : '#818CF8') : '#334155' }}>
        {label}
      </span>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums',
        color: active ? (focus ? '#FCD34D' : '#A5B4FC') : '#1E3A5F' }}>
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
      borderRadius: 99, padding: '0.11rem 0.42rem',
      fontSize: '0.66rem', fontWeight: 600,
    }}>{children}</span>
  )
}

function Center({ children }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: '0.875rem' }}>
      {children}
    </div>
  )
}

const actionBtn = {
  background: 'rgba(99,102,241,0.12)', color: '#818CF8',
  border: '1px solid rgba(99,102,241,0.25)', borderRadius: 9,
  padding: '0.55rem 1.2rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
}

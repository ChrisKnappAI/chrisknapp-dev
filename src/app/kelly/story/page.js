'use client'
import { useState, useEffect, useRef } from 'react'

const CATEGORY_LABELS = {
  origins: 'Origins',
  family: 'Family',
  childhood: 'Childhood',
  school: 'School',
  work: 'Work & Career',
  relationships: 'Relationships',
  places: 'Places',
  milestones: 'Life Milestones',
  legacy: 'Legacy',
}

export default function KellyStoryPage() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})   // questionId → { text, saved }
  const [activeId, setActiveId] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved
  const [doneSent, setDoneSent] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showList, setShowList] = useState(false)

  const saveTimer = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    async function load() {
      const [qRes, aRes] = await Promise.all([
        fetch('/api/kelly/questions'),
        fetch('/api/kelly/answers'),
      ])
      const qs = await qRes.json()
      const as = await aRes.json()

      setQuestions(qs)

      const aMap = {}
      for (const a of as) {
        aMap[a.question_id] = { text: a.raw_text || '', saved: true }
      }
      setAnswers(aMap)

      // Open first pending question
      const firstPending = qs.find(q => !aMap[q.id]?.text?.trim())
      if (firstPending) setActiveId(firstPending.id)
      else if (qs.length > 0) setActiveId(qs[0].id)

      setLoading(false)
    }
    load()
  }, [])

  function handleTextChange(text) {
    setAnswers(prev => ({ ...prev, [activeId]: { text, saved: false } }))
    setSaveStatus('idle')
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => doSave(activeId, text), 1500)
  }

  async function doSave(questionId, text) {
    if (!text?.trim()) return
    setSaveStatus('saving')
    await fetch('/api/kelly/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: questionId, raw_text: text }),
    })
    setSaveStatus('saved')
    setAnswers(prev => ({ ...prev, [questionId]: { ...prev[questionId], saved: true } }))
  }

  async function handleDone() {
    const current = answers[activeId]
    if (activeId && current?.text?.trim() && !current.saved) {
      await doSave(activeId, current.text)
    }
    await fetch('/api/kelly/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'done' }),
    })
    setDoneSent(true)
  }

  function toggleVoice() {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice input requires the Chrome browser. You can also type your answer directly.')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onresult = (event) => {
      const newText = event.results[event.results.length - 1][0].transcript
      const current = answers[activeId]?.text || ''
      handleTextChange(current + (current ? ' ' : '') + newText)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognition.start()
    recognitionRef.current = recognition
    setIsListening(true)
  }

  function goNext() {
    const pending = questions.filter(q => !answers[q.id]?.text?.trim() && q.id !== activeId)
    if (pending.length > 0) setActiveId(pending[0].id)
  }

  function goPrev() {
    const idx = questions.findIndex(q => q.id === activeId)
    if (idx > 0) setActiveId(questions[idx - 1].id)
  }

  const activeQuestion = questions.find(q => q.id === activeId)
  const currentText = answers[activeId]?.text || ''
  const answeredCount = questions.filter(q => answers[q.id]?.text?.trim()).length
  const pendingCount = questions.length - answeredCount
  const activeIdx = questions.findIndex(q => q.id === activeId)

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--c-kelly)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#6B5A30', fontSize: '1rem' }}>Loading your questions…</div>
    </div>
  )

  if (doneSent) return (
    <div style={{ minHeight: '100vh', background: 'var(--c-kelly)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>✓</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '1rem' }}>Thanks, Kelly!</div>
        <div style={{ fontSize: '1rem', color: '#9C8650', lineHeight: 1.7 }}>
          Your answers have been saved. New questions will be ready for your next visit.
        </div>
        <button
          onClick={() => setDoneSent(false)}
          style={{ marginTop: '2rem', background: 'var(--c-amber-dim)', color: 'var(--c-amber)', border: '1px solid var(--c-amber-dark)', borderRadius: 8, padding: '0.75rem 1.5rem', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}
        >
          Keep going
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-kelly)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--c-kelly-sidebar)', borderBottom: '1px solid var(--c-kelly-border)',
        padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#F1F5F9' }}>My Story</div>
          <div style={{ fontSize: '0.75rem', color: '#6B5A30', marginTop: '0.1rem' }}>
            {answeredCount} answered · {pendingCount} remaining
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Progress dots — first 20 questions */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 200 }}>
            {questions.slice(0, 20).map(q => (
              <div
                key={q.id}
                onClick={() => { setActiveId(q.id); setShowList(false) }}
                style={{
                  width: 8, height: 8, borderRadius: '50%', cursor: 'pointer',
                  background: q.id === activeId
                    ? 'var(--c-amber)'
                    : answers[q.id]?.text?.trim()
                      ? '#5C4F2A'
                      : '#2A2410',
                  border: q.id === activeId ? '1px solid var(--c-amber-dark)' : '1px solid transparent',
                }}
              />
            ))}
          </div>
          <button
            onClick={() => setShowList(s => !s)}
            style={{ background: 'var(--c-amber-dim)', color: 'var(--c-amber)', border: '1px solid var(--c-kelly-border)', borderRadius: 6, padding: '0.4rem 0.75rem', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
          >
            All Questions
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex' }}>

        {/* Question list overlay (mobile/tablet) */}
        {showList && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 20, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'flex-end',
          }} onClick={() => setShowList(false)}>
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--c-kelly-card)', width: '100%', maxHeight: '70vh',
                overflowY: 'auto', borderRadius: '16px 16px 0 0',
                padding: '1.5rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B5A30', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                All Questions
              </div>
              {questions.map((q, i) => {
                const isAnswered = !!answers[q.id]?.text?.trim()
                return (
                  <div
                    key={q.id}
                    onClick={() => { setActiveId(q.id); setShowList(false) }}
                    style={{
                      padding: '0.85rem 1rem', borderRadius: 8, marginBottom: '0.4rem', cursor: 'pointer',
                      background: q.id === activeId ? 'var(--c-amber-dim)' : 'transparent',
                      border: `1px solid ${q.id === activeId ? 'var(--c-amber-dark)' : 'var(--c-kelly-border)'}`,
                      display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ fontSize: '0.7rem', color: isAnswered ? '#5C8A50' : '#4B3A1A', fontWeight: 700, marginTop: 2, minWidth: 20 }}>
                      {isAnswered ? '✓' : `${i + 1}`}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: isAnswered ? '#5C8A50' : '#C8A85A', lineHeight: 1.5 }}>
                      {q.text}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Main answer area */}
        <div style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: 760, margin: '0 auto', width: '100%' }}>
          {activeQuestion ? (
            <>
              {/* Question nav */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <button onClick={goPrev} disabled={activeIdx === 0} style={{
                  background: 'none', border: '1px solid var(--c-kelly-border)', color: activeIdx === 0 ? '#2A2410' : '#9C8650',
                  borderRadius: 6, padding: '0.4rem 0.75rem', cursor: activeIdx === 0 ? 'default' : 'pointer', fontSize: '0.85rem',
                }}>← Prev</button>
                <div style={{ fontSize: '0.75rem', color: '#5C4F2A' }}>Question {activeIdx + 1} of {questions.length}</div>
                <button onClick={goNext} disabled={pendingCount === 0} style={{
                  background: 'none', border: '1px solid var(--c-kelly-border)', color: pendingCount === 0 ? '#2A2410' : '#9C8650',
                  borderRadius: 6, padding: '0.4rem 0.75rem', cursor: pendingCount === 0 ? 'default' : 'pointer', fontSize: '0.85rem',
                }}>Next →</button>
              </div>

              {/* Category badge */}
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--c-amber)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                {CATEGORY_LABELS[activeQuestion.category] || activeQuestion.category}
              </div>

              {/* Question text */}
              <div style={{ fontSize: '1.25rem', color: '#F1F5F9', lineHeight: 1.6, marginBottom: '1.5rem', fontWeight: 500 }}>
                {activeQuestion.text}
              </div>

              {/* Answer textarea */}
              <textarea
                value={currentText}
                onChange={e => handleTextChange(e.target.value)}
                placeholder="Take your time. Write whatever comes to mind — long or short, any way you want to say it."
                style={{
                  width: '100%', minHeight: 260, background: 'var(--c-kelly-card)',
                  border: '1px solid var(--c-kelly-border)', borderRadius: 10,
                  color: '#E2D4B0', fontSize: '1.05rem', lineHeight: 1.75,
                  padding: '1.25rem', resize: 'vertical', outline: 'none',
                  fontFamily: 'inherit',
                }}
              />

              {/* Bottom bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button
                  onClick={toggleVoice}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: isListening ? 'rgba(239,68,68,0.15)' : 'var(--c-kelly-card)',
                    border: `1px solid ${isListening ? '#EF4444' : 'var(--c-kelly-border)'}`,
                    color: isListening ? '#EF4444' : '#9C8650',
                    borderRadius: 8, padding: '0.6rem 1rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                  }}
                >
                  {isListening ? '⏹ Stop' : '🎤 Speak'}
                  {isListening && <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>listening…</span>}
                </button>

                <div style={{ fontSize: '0.75rem', color: saveStatus === 'saved' ? '#5C8A50' : '#4B3A1A' }}>
                  {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved ✓' : ''}
                </div>

                <button
                  onClick={goNext}
                  disabled={pendingCount === 0}
                  style={{
                    background: 'var(--c-kelly-card)', color: pendingCount === 0 ? '#3A3018' : '#9C8650',
                    border: '1px solid var(--c-kelly-border)', borderRadius: 8,
                    padding: '0.6rem 1rem', cursor: pendingCount === 0 ? 'default' : 'pointer', fontSize: '0.9rem',
                  }}
                >
                  Next Question →
                </button>
              </div>

              {/* Done for Today */}
              <button
                onClick={handleDone}
                style={{
                  width: '100%', marginTop: '2.5rem',
                  background: 'var(--c-amber-dim)', color: 'var(--c-amber)',
                  border: '1px solid var(--c-amber-dark)', borderRadius: 10,
                  padding: '1rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                }}
              >
                I'm Done for Today
              </button>
              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#4B3A1A', marginTop: '0.5rem' }}>
                Your answers are saved. New questions will be ready next time.
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#6B5A30' }}>
              No questions loaded yet. Check back soon.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── IndexedDB helpers ──────────────────────────────────────────────────────
const DB_NAME = 'catchphrase_db'
const DB_VERSION = 1
const STORE_PHRASES = 'phrases'      // cached unused phrases, keyed by id
const STORE_PENDING = 'pending_used' // IDs queued for server sync

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_PHRASES)) db.createObjectStore(STORE_PHRASES, { keyPath: 'id' })
      if (!db.objectStoreNames.contains(STORE_PENDING)) db.createObjectStore(STORE_PENDING, { keyPath: 'id' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function dbGetAll(store) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly')
    const req = tx.objectStore(store).getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function dbPutAll(store, items) {
  if (items.length === 0) return
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite')
    const s = tx.objectStore(store)
    for (const item of items) s.put(item)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function dbDeleteAll(store, keys) {
  if (keys.length === 0) return
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite')
    const s = tx.objectStore(store)
    for (const k of keys) s.delete(k)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function dbClear(store) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite')
    tx.objectStore(store).clear()
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// ─── Network sync ───────────────────────────────────────────────────────────
const CACHE_REFILL_THRESHOLD = 50
const CACHE_TARGET = 200

async function syncPendingAndRefill() {
  // 1. Flush pending used IDs to server
  const pending = await dbGetAll(STORE_PENDING)
  if (pending.length > 0) {
    const ids = pending.map(p => p.id)
    try {
      const res = await fetch('/api/catchphrase/used', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
      if (res.ok) await dbDeleteAll(STORE_PENDING, ids)
    } catch {
      // offline — leave queue alone
    }
  }

  // 2. Refill cache if low
  const cached = await dbGetAll(STORE_PHRASES)
  if (cached.length < CACHE_REFILL_THRESHOLD) {
    try {
      const res = await fetch(`/api/catchphrase/phrases?limit=${CACHE_TARGET}`)
      if (res.ok) {
        const { phrases } = await res.json()
        const existingIds = new Set(cached.map(c => c.id))
        const fresh = phrases.filter(p => !existingIds.has(p.id))
        await dbPutAll(STORE_PHRASES, fresh)
      }
    } catch {
      // offline — play with what we have
    }
  }
}

// ─── Beep (Web Audio API, no asset needed) ──────────────────────────────────
function beep(duration = 800, frequency = 880) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = frequency
    osc.connect(gain)
    gain.connect(ctx.destination)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000)
    osc.start()
    osc.stop(ctx.currentTime + duration / 1000)
  } catch (e) {
    // audio context blocked — silent fail
  }
}

// ─── Component ──────────────────────────────────────────────────────────────
const TURN_SECONDS = 60

export default function CatchphraseGame() {
  const [phase, setPhase] = useState('idle')          // idle | playing | done
  const [cacheSize, setCacheSize] = useState(0)
  const [pendingSize, setPendingSize] = useState(0)
  const [online, setOnline] = useState(true)
  const [current, setCurrent] = useState(null)
  const [turnHistory, setTurnHistory] = useState([])  // phrases shown this turn
  const [secondsLeft, setSecondsLeft] = useState(TURN_SECONDS)
  const intervalRef = useRef(null)

  // Initial mount: sync + refresh cache stats
  useEffect(() => {
    setOnline(navigator.onLine)
    const onOnline = () => { setOnline(true); refreshStats(); syncPendingAndRefill().then(refreshStats) }
    const onOffline = () => setOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    syncPendingAndRefill().then(refreshStats)

    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  async function refreshStats() {
    const [c, p] = await Promise.all([dbGetAll(STORE_PHRASES), dbGetAll(STORE_PENDING)])
    setCacheSize(c.length)
    setPendingSize(p.length)
  }

  // Pull one random phrase from local cache, remove it, queue it as used
  async function pullNextPhrase() {
    const cached = await dbGetAll(STORE_PHRASES)
    if (cached.length === 0) return null
    const idx = Math.floor(Math.random() * cached.length)
    const phrase = cached[idx]
    await dbDeleteAll(STORE_PHRASES, [phrase.id])
    await dbPutAll(STORE_PENDING, [{ id: phrase.id }])
    return phrase
  }

  async function startTurn() {
    const first = await pullNextPhrase()
    if (!first) {
      alert('No phrases cached. Connect to the internet to load some.')
      return
    }
    setCurrent(first)
    setTurnHistory([first])
    setSecondsLeft(TURN_SECONDS)
    setPhase('playing')
    refreshStats()
  }

  async function nextPhrase() {
    const next = await pullNextPhrase()
    if (!next) {
      // Ran out mid-turn — end the turn
      endTurn()
      return
    }
    setCurrent(next)
    setTurnHistory(h => [...h, next])
    refreshStats()
  }

  function endTurn() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    beep(900, 880)
    setPhase('done')
    // Kick off background sync after turn ends
    syncPendingAndRefill().then(refreshStats)
  }

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          beep(900, 880)
          setPhase('done')
          syncPendingAndRefill().then(refreshStats)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [phase])

  function resetTurn() {
    setCurrent(null)
    setTurnHistory([])
    setSecondsLeft(TURN_SECONDS)
    setPhase('idle')
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  const lowCache = cacheSize < CACHE_REFILL_THRESHOLD

  return (
    <main style={styles.main}>
      {/* Status bar */}
      <div style={styles.statusBar}>
        <span style={styles.statusText}>
          {online ? '● online' : '○ offline'}
        </span>
        <span style={styles.statusText}>
          cached: {cacheSize}{pendingSize > 0 ? ` · pending: ${pendingSize}` : ''}
        </span>
      </div>

      {/* Main content */}
      {phase === 'idle' && (
        <div style={styles.center}>
          <h1 style={styles.title}>Catchphrase Español</h1>
          {lowCache && (
            <p style={styles.warning}>
              {online
                ? 'Loading phrases…'
                : 'No cached phrases. Go online once to load some.'}
            </p>
          )}
          <button
            style={{ ...styles.bigButton, ...(cacheSize === 0 ? styles.disabledButton : {}) }}
            disabled={cacheSize === 0}
            onClick={startTurn}
          >
            START
          </button>
          <p style={styles.hint}>1 minute · say each phrase in Spanish · tap to skip</p>
        </div>
      )}

      {phase === 'playing' && current && (
        <div style={styles.playArea} onClick={nextPhrase}>
          <div style={styles.timer}>{secondsLeft}s</div>
          <div style={styles.phraseBig}>{current.english}</div>
          <div style={styles.cefr}>{current.cefr_level}</div>
          <button style={styles.skipButton} onClick={(e) => { e.stopPropagation(); nextPhrase() }}>
            NEXT →
          </button>
        </div>
      )}

      {phase === 'done' && (
        <div style={styles.doneArea}>
          <h2 style={styles.doneTitle}>Time! · {turnHistory.length} phrases</h2>
          <div style={styles.historyList}>
            {turnHistory.map((p, i) => (
              <div key={p.id} style={styles.historyRow}>
                <div style={styles.historyNum}>{i + 1}.</div>
                <div style={styles.historyText}>
                  <div style={styles.historyEnglish}>{p.english}</div>
                  <div style={styles.historySpanish}>{p.spanish}</div>
                </div>
              </div>
            ))}
          </div>
          <button style={styles.bigButton} onClick={resetTurn}>
            NEW TURN
          </button>
        </div>
      )}
    </main>
  )
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = {
  main: {
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    background: '#0D0D14',
    color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 20px',
    fontSize: 12,
    color: '#666',
    flexShrink: 0,
  },
  statusText: {
    fontVariantNumeric: 'tabular-nums',
  },
  center: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 32,
    color: '#fff',
  },
  warning: {
    color: '#FFA500',
    fontSize: 14,
    marginBottom: 24,
    maxWidth: 320,
  },
  hint: {
    color: '#777',
    fontSize: 13,
    marginTop: 24,
    maxWidth: 280,
  },
  bigButton: {
    background: '#3B82F6',
    color: '#fff',
    border: 'none',
    borderRadius: 16,
    padding: '24px 80px',
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 2,
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
  },
  disabledButton: {
    background: '#333',
    color: '#666',
    boxShadow: 'none',
    cursor: 'not-allowed',
  },
  playArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    cursor: 'pointer',
    userSelect: 'none',
    position: 'relative',
  },
  timer: {
    position: 'absolute',
    top: 16,
    right: 24,
    fontSize: 32,
    fontWeight: 700,
    color: '#3B82F6',
    fontVariantNumeric: 'tabular-nums',
  },
  phraseBig: {
    fontSize: 48,
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: 1.2,
    color: '#fff',
    maxWidth: 600,
    padding: '0 12px',
  },
  cefr: {
    marginTop: 16,
    color: '#666',
    fontSize: 14,
    letterSpacing: 1,
  },
  skipButton: {
    marginTop: 48,
    background: 'transparent',
    color: '#3B82F6',
    border: '2px solid #3B82F6',
    borderRadius: 12,
    padding: '14px 36px',
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: 1,
    cursor: 'pointer',
  },
  doneArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
    minHeight: 0,
  },
  doneTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 700,
    padding: '12px 0 20px',
    color: '#3B82F6',
  },
  historyList: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 12px',
    marginBottom: 16,
  },
  historyRow: {
    display: 'flex',
    gap: 12,
    padding: '12px 0',
    borderBottom: '1px solid #1f1f2e',
  },
  historyNum: {
    color: '#555',
    fontSize: 14,
    fontVariantNumeric: 'tabular-nums',
    minWidth: 28,
    paddingTop: 2,
  },
  historyText: {
    flex: 1,
  },
  historyEnglish: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  historySpanish: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
}

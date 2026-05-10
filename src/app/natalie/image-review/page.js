'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { LESSONS } from '../../santiago-learns-english/chat-with-penny/_data/lessons.js';

const STORAGE_KEY = 'penny-img-review-v1';

/* Build a flat list of every reviewable image from lessons */
function buildAllItems() {
  const out = [];
  for (const lesson of LESSONS) {
    const hasPhoto = lesson.templates?.some(
      t => t.expects === 'photo-name' || t.expects === 'photo-pick'
    );
    if (!hasPhoto) continue;

    if (lesson.imageMap) {
      for (const [word, imgPath] of Object.entries(lesson.imageMap)) {
        if (!imgPath) continue;
        out.push({ topicId: lesson.id, label: lesson.label, word, path: imgPath });
      }
    } else {
      for (const word of (lesson.vocab ?? [])) {
        const path = `/santiago-learns-english/chat-with-penny/images/${lesson.id}/${word.replace(/\s+/g, '-')}.jpg`;
        out.push({ topicId: lesson.id, label: lesson.label, word, path });
      }
    }
  }
  return out;
}

const ALL_ITEMS = buildAllItems();
const key = item => `${item.topicId}/${item.word}`;

export default function ImageReviewPage() {
  const [decisions,    setDecisions]    = useState({});
  const [activeItems,  setActiveItems]  = useState(ALL_ITEMS);
  const [index,        setIndex]        = useState(0);
  const [phase,        setPhase]        = useState('reviewing'); // 'reviewing' | 'done'
  const [flash,        setFlash]        = useState(null);        // 'yes' | 'no' | null
  const [copied,       setCopied]       = useState(false);
  const [loaded,       setLoaded]       = useState(false);
  const flashRef = useRef(null);

  /* Load saved state */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      setDecisions(saved);
      // Resume at first undecided item
      const first = ALL_ITEMS.findIndex(i => !saved[key(i)]);
      if (first === -1) { setIndex(ALL_ITEMS.length); setPhase('done'); }
      else setIndex(first);
    } catch {}
    setLoaded(true);
  }, []);

  /* Persist decisions */
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  }, [decisions, loaded]);

  const triggerFlash = (verdict) => {
    clearTimeout(flashRef.current);
    setFlash(verdict);
    flashRef.current = setTimeout(() => setFlash(null), 280);
  };

  const decide = useCallback((verdict) => {
    const item = activeItems[index];
    if (!item) return;
    setDecisions(d => ({ ...d, [key(item)]: verdict }));
    triggerFlash(verdict);
    if (index + 1 >= activeItems.length) setPhase('done');
    else setIndex(i => i + 1);
  }, [activeItems, index]);

  /* Back = go to previous item AND undo its decision */
  const goBack = useCallback(() => {
    if (index <= 0) return;
    const prev = activeItems[index - 1];
    setDecisions(d => { const n = { ...d }; delete n[key(prev)]; return n; });
    setIndex(i => i - 1);
    setPhase('reviewing');
  }, [index, activeItems]);

  /* Keyboard handler */
  useEffect(() => {
    if (!loaded) return;
    const handler = e => {
      if (phase !== 'reviewing') return;
      if (e.key === 'ArrowUp')   { e.preventDefault(); decide('yes'); }
      if (e.key === 'ArrowDown') { e.preventDefault(); decide('no');  }
      if (e.key === 'Backspace') { e.preventDefault(); goBack();      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [decide, goBack, phase, loaded]);

  /* Re-review: clear decisions for rejected items, review only those */
  const startReReview = () => {
    const rejected = ALL_ITEMS.filter(i => decisions[key(i)] === 'no');
    if (!rejected.length) return;
    setDecisions(d => {
      const n = { ...d };
      rejected.forEach(i => delete n[key(i)]);
      return n;
    });
    setActiveItems(rejected);
    setIndex(0);
    setPhase('reviewing');
  };

  const startOver = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDecisions({});
    setActiveItems(ALL_ITEMS);
    setIndex(0);
    setPhase('reviewing');
  };

  /* Copy-paste text for rejected items, grouped by category */
  const rejectedItems = ALL_ITEMS.filter(i => decisions[key(i)] === 'no');
  const byTopic = rejectedItems.reduce((acc, i) => {
    (acc[i.topicId] = acc[i.topicId] || []).push(i.word);
    return acc;
  }, {});
  const rejectedText = Object.entries(byTopic)
    .map(([topic, words]) => `${topic}:\n${words.map(w => `  ${w}`).join('\n')}`)
    .join('\n\n');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rejectedText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const item    = activeItems[index];
  const decided = item ? decisions[key(item)] : null;
  const yesCount = activeItems.filter(i => decisions[key(i)] === 'yes').length;
  const noCount  = activeItems.filter(i => decisions[key(i)] === 'no').length;
  const pct      = activeItems.length ? Math.round((index / activeItems.length) * 100) : 0;

  if (!loaded) return null;

  /* ── Done screen ── */
  if (phase === 'done') {
    return (
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E2A38', marginBottom: '0.5rem' }}>
          Review Complete
        </h1>
        <p style={{ color: '#A89A85', fontSize: '0.9rem', marginBottom: '2rem' }}>
          {activeItems.length} images reviewed
        </p>

        <div style={{ display: 'flex', gap: 16, marginBottom: '2rem' }}>
          <div style={{ flex: 1, background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: 12, padding: '1.2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#166534' }}>{yesCount}</div>
            <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>✓ Approved</div>
          </div>
          <div style={{ flex: 1, background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 12, padding: '1.2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#991B1B' }}>{noCount}</div>
            <div style={{ fontSize: '0.8rem', color: '#991B1B', fontWeight: 600 }}>✗ Rejected</div>
          </div>
        </div>

        {noCount > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E2A38', margin: 0 }}>
                Paste this to Claude to get replacements:
              </h2>
              <button
                onClick={copyToClipboard}
                style={{
                  padding: '5px 14px', borderRadius: 20, border: '1.5px solid #1D4ED8',
                  background: copied ? '#1D4ED8' : 'white', color: copied ? 'white' : '#1D4ED8',
                  fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre style={{
              background: '#F8F7F5', border: '1.5px solid #E5DDD3', borderRadius: 10,
              padding: '1rem', fontFamily: 'monospace', fontSize: '0.82rem',
              color: '#1E2A38', whiteSpace: 'pre-wrap', userSelect: 'all', lineHeight: 1.7,
            }}>
              {rejectedText}
            </pre>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          {noCount > 0 && (
            <button
              onClick={startReReview}
              style={{
                padding: '10px 22px', borderRadius: 20, border: '2px solid #1D4ED8',
                background: '#1D4ED8', color: 'white', fontSize: '0.9rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Re-review Rejected ({noCount})
            </button>
          )}
          <button
            onClick={startOver}
            style={{
              padding: '10px 22px', borderRadius: 20, border: '1.5px solid #D1C5B8',
              background: 'white', color: '#A89A85', fontSize: '0.9rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  /* ── Review screen ── */
  return (
    <div style={{ maxWidth: 580, margin: '0 auto', padding: '1.5rem 1.5rem 2rem', userSelect: 'none' }}>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#A89A85', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {item?.label}
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E2A38' }}>
          {index + 1} <span style={{ color: '#A89A85', fontWeight: 400 }}>/ {activeItems.length}</span>
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 5, background: '#EDE9E4', borderRadius: 3, marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#1D4ED8', borderRadius: 3, transition: 'width 0.1s' }} />
      </div>

      {/* Image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: 16, overflow: 'hidden', background: '#EDE9E4', marginBottom: 16 }}>
        {item && (
          <img
            key={item.path}
            src={item.path}
            alt={item.word}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        )}

        {/* Flash overlay */}
        {flash && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: flash === 'yes' ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)',
            transition: 'background 0.1s',
          }} />
        )}

        {/* Decision badge */}
        {decided && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: decided === 'yes' ? '#22C55E' : '#EF4444',
            color: 'white', padding: '5px 14px', borderRadius: 20,
            fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.03em',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}>
            {decided === 'yes' ? '✓ YES' : '✗ NO'}
          </div>
        )}

        {/* Running tally */}
        <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 6 }}>
          <span style={{ background: 'rgba(34,197,94,0.85)', color: 'white', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>✓ {yesCount}</span>
          <span style={{ background: 'rgba(239,68,68,0.85)', color: 'white', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>✗ {noCount}</span>
        </div>
      </div>

      {/* Word */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1E2A38', lineHeight: 1.1 }}>{item?.word}</div>
        <div style={{ fontSize: '0.78rem', color: '#A89A85', marginTop: 4, fontStyle: 'italic' }}>{item?.topicId}</div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
        <button
          onClick={goBack}
          disabled={index === 0}
          style={{
            padding: '11px 18px', borderRadius: 12, border: '1.5px solid #D1C5B8',
            background: 'white', color: '#A89A85', fontSize: '0.88rem', fontWeight: 700,
            cursor: index === 0 ? 'default' : 'pointer', opacity: index === 0 ? 0.35 : 1,
            fontFamily: 'inherit', minWidth: 80,
          }}
        >
          ⌫ Back
        </button>
        <button
          onClick={() => decide('no')}
          style={{
            padding: '11px 0', borderRadius: 12, border: '2px solid #EF4444',
            background: decided === 'no' ? '#EF4444' : 'white',
            color: decided === 'no' ? 'white' : '#EF4444',
            fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer',
            fontFamily: 'inherit', flex: 1, maxWidth: 160,
          }}
        >
          ↓ No
        </button>
        <button
          onClick={() => decide('yes')}
          style={{
            padding: '11px 0', borderRadius: 12, border: '2px solid #22C55E',
            background: decided === 'yes' ? '#22C55E' : 'white',
            color: decided === 'yes' ? 'white' : '#22C55E',
            fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer',
            fontFamily: 'inherit', flex: 1, maxWidth: 160,
          }}
        >
          ↑ Yes
        </button>
      </div>

      {/* Keyboard hint */}
      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#C4B49E' }}>
        ↑ yes &nbsp;·&nbsp; ↓ no &nbsp;·&nbsp; ⌫ undo
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'penny-broken-review-v1';
const BASE = '/santiago-learns-english/chat-with-penny/images';

const BROKEN_ITEMS = [
  // body-parts
  { topic: 'body-parts', label: 'Body Parts', word: 'arm' },
  { topic: 'body-parts', label: 'Body Parts', word: 'cheek' },
  { topic: 'body-parts', label: 'Body Parts', word: 'chin' },
  { topic: 'body-parts', label: 'Body Parts', word: 'elbow' },
  { topic: 'body-parts', label: 'Body Parts', word: 'eye' },
  { topic: 'body-parts', label: 'Body Parts', word: 'eyebrow' },
  { topic: 'body-parts', label: 'Body Parts', word: 'eyelash' },
  { topic: 'body-parts', label: 'Body Parts', word: 'face' },
  { topic: 'body-parts', label: 'Body Parts', word: 'finger' },
  { topic: 'body-parts', label: 'Body Parts', word: 'foot' },
  { topic: 'body-parts', label: 'Body Parts', word: 'forehead' },
  { topic: 'body-parts', label: 'Body Parts', word: 'hair' },
  { topic: 'body-parts', label: 'Body Parts', word: 'hand' },
  { topic: 'body-parts', label: 'Body Parts', word: 'head' },
  { topic: 'body-parts', label: 'Body Parts', word: 'knee' },
  { topic: 'body-parts', label: 'Body Parts', word: 'leg' },
  { topic: 'body-parts', label: 'Body Parts', word: 'lips' },
  { topic: 'body-parts', label: 'Body Parts', word: 'mouth' },
  { topic: 'body-parts', label: 'Body Parts', word: 'neck' },
  { topic: 'body-parts', label: 'Body Parts', word: 'nose' },
  { topic: 'body-parts', label: 'Body Parts', word: 'shoulder' },
  { topic: 'body-parts', label: 'Body Parts', word: 'stomach' },
  { topic: 'body-parts', label: 'Body Parts', word: 'teeth' },
  { topic: 'body-parts', label: 'Body Parts', word: 'thumb' },
  { topic: 'body-parts', label: 'Body Parts', word: 'tongue' },
  { topic: 'body-parts', label: 'Body Parts', word: 'wrist' },
  // chess
  { topic: 'chess', label: 'Chess', word: 'bishop' },
  { topic: 'chess', label: 'Chess', word: 'chess board' },
  { topic: 'chess', label: 'Chess', word: 'column' },
  { topic: 'chess', label: 'Chess', word: 'king' },
  { topic: 'chess', label: 'Chess', word: 'knight' },
  { topic: 'chess', label: 'Chess', word: 'pawn' },
  { topic: 'chess', label: 'Chess', word: 'queen' },
  { topic: 'chess', label: 'Chess', word: 'rook' },
  { topic: 'chess', label: 'Chess', word: 'row' },
  { topic: 'chess', label: 'Chess', word: 'square' },
  // classroom
  { topic: 'classroom', label: 'Classroom', word: 'backpack' },
  { topic: 'classroom', label: 'Classroom', word: 'book' },
  { topic: 'classroom', label: 'Classroom', word: 'chair' },
  { topic: 'classroom', label: 'Classroom', word: 'crayon' },
  { topic: 'classroom', label: 'Classroom', word: 'desk' },
  { topic: 'classroom', label: 'Classroom', word: 'eraser' },
  { topic: 'classroom', label: 'Classroom', word: 'glue' },
  { topic: 'classroom', label: 'Classroom', word: 'notebook' },
  { topic: 'classroom', label: 'Classroom', word: 'pen' },
  { topic: 'classroom', label: 'Classroom', word: 'pencil' },
  { topic: 'classroom', label: 'Classroom', word: 'ruler' },
  // farm-animals
  { topic: 'farm-animals', label: 'Farm Animals', word: 'cow' },
  { topic: 'farm-animals', label: 'Farm Animals', word: 'duck' },
  { topic: 'farm-animals', label: 'Farm Animals', word: 'goat' },
  { topic: 'farm-animals', label: 'Farm Animals', word: 'hen' },
  { topic: 'farm-animals', label: 'Farm Animals', word: 'horse' },
  { topic: 'farm-animals', label: 'Farm Animals', word: 'pig' },
  { topic: 'farm-animals', label: 'Farm Animals', word: 'rooster' },
  { topic: 'farm-animals', label: 'Farm Animals', word: 'sheep' },
  // lunch-dinner
  { topic: 'lunch-dinner', label: 'Lunch & Dinner', word: 'beans' },
  { topic: 'lunch-dinner', label: 'Lunch & Dinner', word: 'beef' },
  { topic: 'lunch-dinner', label: 'Lunch & Dinner', word: 'chicken' },
  { topic: 'lunch-dinner', label: 'Lunch & Dinner', word: 'cocoa' },
  { topic: 'lunch-dinner', label: 'Lunch & Dinner', word: 'lemonade' },
  { topic: 'lunch-dinner', label: 'Lunch & Dinner', word: 'lentils' },
  { topic: 'lunch-dinner', label: 'Lunch & Dinner', word: 'pasta' },
  { topic: 'lunch-dinner', label: 'Lunch & Dinner', word: 'potato' },
  { topic: 'lunch-dinner', label: 'Lunch & Dinner', word: 'rice' },
  { topic: 'lunch-dinner', label: 'Lunch & Dinner', word: 'salad' },
  { topic: 'lunch-dinner', label: 'Lunch & Dinner', word: 'soup' },
  { topic: 'lunch-dinner', label: 'Lunch & Dinner', word: 'steak' },
  { topic: 'lunch-dinner', label: 'Lunch & Dinner', word: 'sweet potato' },
  { topic: 'lunch-dinner', label: 'Lunch & Dinner', word: 'tea' },
  { topic: 'lunch-dinner', label: 'Lunch & Dinner', word: 'tuna' },
  { topic: 'lunch-dinner', label: 'Lunch & Dinner', word: 'turkey' },
  { topic: 'lunch-dinner', label: 'Lunch & Dinner', word: 'wine' },
  // rooms
  { topic: 'rooms', label: 'Rooms', word: 'garden' },
  { topic: 'rooms', label: 'Rooms', word: 'kitchen' },
  { topic: 'rooms', label: 'Rooms', word: 'office' },
  // shapes
  { topic: 'shapes', label: 'Shapes', word: 'circle' },
  { topic: 'shapes', label: 'Shapes', word: 'cross' },
  { topic: 'shapes', label: 'Shapes', word: 'diamond' },
  { topic: 'shapes', label: 'Shapes', word: 'heart' },
  { topic: 'shapes', label: 'Shapes', word: 'hexagon' },
  { topic: 'shapes', label: 'Shapes', word: 'octagon' },
  { topic: 'shapes', label: 'Shapes', word: 'oval' },
  { topic: 'shapes', label: 'Shapes', word: 'rectangle' },
  { topic: 'shapes', label: 'Shapes', word: 'square' },
  { topic: 'shapes', label: 'Shapes', word: 'star' },
  { topic: 'shapes', label: 'Shapes', word: 'triangle' },
  // vegetables
  { topic: 'vegetables', label: 'Vegetables', word: 'beet' },
  { topic: 'vegetables', label: 'Vegetables', word: 'broccoli' },
  { topic: 'vegetables', label: 'Vegetables', word: 'cabbage' },
  { topic: 'vegetables', label: 'Vegetables', word: 'carrot' },
  { topic: 'vegetables', label: 'Vegetables', word: 'corn' },
  { topic: 'vegetables', label: 'Vegetables', word: 'cucumber' },
  { topic: 'vegetables', label: 'Vegetables', word: 'garlic' },
  { topic: 'vegetables', label: 'Vegetables', word: 'green beans' },
  { topic: 'vegetables', label: 'Vegetables', word: 'lettuce' },
  { topic: 'vegetables', label: 'Vegetables', word: 'onion' },
  { topic: 'vegetables', label: 'Vegetables', word: 'peas' },
  { topic: 'vegetables', label: 'Vegetables', word: 'pepper' },
  { topic: 'vegetables', label: 'Vegetables', word: 'potato' },
  { topic: 'vegetables', label: 'Vegetables', word: 'spinach' },
  { topic: 'vegetables', label: 'Vegetables', word: 'sweet potato' },
  { topic: 'vegetables', label: 'Vegetables', word: 'tomato' },
  // zoo-animals
  { topic: 'zoo-animals', label: 'Zoo Animals', word: 'bear' },
  { topic: 'zoo-animals', label: 'Zoo Animals', word: 'elephant' },
  { topic: 'zoo-animals', label: 'Zoo Animals', word: 'giraffe' },
  { topic: 'zoo-animals', label: 'Zoo Animals', word: 'hippo' },
  { topic: 'zoo-animals', label: 'Zoo Animals', word: 'kangaroo' },
  { topic: 'zoo-animals', label: 'Zoo Animals', word: 'penguin' },
  { topic: 'zoo-animals', label: 'Zoo Animals', word: 'polar bear' },
  { topic: 'zoo-animals', label: 'Zoo Animals', word: 'shark' },
  { topic: 'zoo-animals', label: 'Zoo Animals', word: 'snake' },
  { topic: 'zoo-animals', label: 'Zoo Animals', word: 'zebra' },
].map(i => ({ ...i, path: `${BASE}/${i.topic}/${i.word.replace(/\s+/g, '-')}.jpg` }));

const key = item => `${item.topic}/${item.word}`;

export default function BrokenReviewPage() {
  const [decisions, setDecisions] = useState({});
  const [index,     setIndex]     = useState(0);
  const [phase,     setPhase]     = useState('reviewing');
  const [flash,     setFlash]     = useState(null);
  const [copied,    setCopied]    = useState(false);
  const [loaded,    setLoaded]    = useState(false);
  const flashRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      setDecisions(saved);
      const first = BROKEN_ITEMS.findIndex(i => !saved[key(i)]);
      if (first === -1) { setIndex(BROKEN_ITEMS.length); setPhase('done'); }
      else setIndex(first);
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  }, [decisions, loaded]);

  const triggerFlash = (verdict) => {
    clearTimeout(flashRef.current);
    setFlash(verdict);
    flashRef.current = setTimeout(() => setFlash(null), 280);
  };

  const decide = useCallback((verdict) => {
    const item = BROKEN_ITEMS[index];
    if (!item) return;
    setDecisions(d => ({ ...d, [key(item)]: verdict }));
    triggerFlash(verdict);
    if (index + 1 >= BROKEN_ITEMS.length) setPhase('done');
    else setIndex(i => i + 1);
  }, [index]);

  const goBack = useCallback(() => {
    if (index <= 0) return;
    const prev = BROKEN_ITEMS[index - 1];
    setDecisions(d => { const n = { ...d }; delete n[key(prev)]; return n; });
    setIndex(i => i - 1);
    setPhase('reviewing');
  }, [index]);

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

  const startOver = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDecisions({});
    setIndex(0);
    setPhase('reviewing');
  };

  const rejectedItems = BROKEN_ITEMS.filter(i => decisions[key(i)] === 'no');
  const byTopic = rejectedItems.reduce((acc, i) => {
    (acc[i.topic] = acc[i.topic] || { label: i.label, words: [] }).words.push(i.word);
    return acc;
  }, {});
  const rejectedText = Object.values(byTopic)
    .map(({ label, words }) => `${label}:\n${words.map(w => `  ${w}`).join('\n')}`)
    .join('\n\n');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rejectedText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const item     = BROKEN_ITEMS[index];
  const decided  = item ? decisions[key(item)] : null;
  const yesCount = BROKEN_ITEMS.filter(i => decisions[key(i)] === 'yes').length;
  const noCount  = BROKEN_ITEMS.filter(i => decisions[key(i)] === 'no').length;
  const pct      = Math.round((index / BROKEN_ITEMS.length) * 100);

  if (!loaded) return null;

  /* ── Done screen ── */
  if (phase === 'done') {
    return (
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E2A38', marginBottom: '0.25rem' }}>
          Broken Images — Review Complete
        </h1>
        <p style={{ color: '#A89A85', fontSize: '0.9rem', marginBottom: '2rem' }}>
          {BROKEN_ITEMS.length} images reviewed
        </p>

        <div style={{ display: 'flex', gap: 16, marginBottom: '2rem' }}>
          <div style={{ flex: 1, background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: 12, padding: '1.2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#166534' }}>{yesCount}</div>
            <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>✓ Keep</div>
          </div>
          <div style={{ flex: 1, background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 12, padding: '1.2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#991B1B' }}>{noCount}</div>
            <div style={{ fontSize: '0.8rem', color: '#991B1B', fontWeight: 600 }}>✗ Replace</div>
          </div>
        </div>

        {noCount > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E2A38', margin: 0 }}>
                Need replacements:
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
    );
  }

  /* ── Review screen ── */
  return (
    <div style={{ maxWidth: 580, margin: '0 auto', padding: '1.5rem 1.5rem 2rem', userSelect: 'none' }}>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A89A85', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
          Broken Images — Re-review
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#A89A85' }}>{item?.label}</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E2A38' }}>
            {index + 1} <span style={{ color: '#A89A85', fontWeight: 400 }}>/ {BROKEN_ITEMS.length}</span>
          </span>
        </div>
      </div>

      <div style={{ height: 5, background: '#EDE9E4', borderRadius: 3, marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#1D4ED8', borderRadius: 3, transition: 'width 0.1s' }} />
      </div>

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

        {flash && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: flash === 'yes' ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)',
          }} />
        )}

        {decided && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: decided === 'yes' ? '#22C55E' : '#EF4444',
            color: 'white', padding: '5px 14px', borderRadius: 20,
            fontWeight: 800, fontSize: '0.85rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}>
            {decided === 'yes' ? '✓ KEEP' : '✗ REPLACE'}
          </div>
        )}

        <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 6 }}>
          <span style={{ background: 'rgba(34,197,94,0.85)', color: 'white', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>✓ {yesCount}</span>
          <span style={{ background: 'rgba(239,68,68,0.85)', color: 'white', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>✗ {noCount}</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1E2A38', lineHeight: 1.1 }}>{item?.word}</div>
        <div style={{ fontSize: '0.78rem', color: '#A89A85', marginTop: 4, fontStyle: 'italic' }}>{item?.topic}</div>
      </div>

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
          ↓ Replace
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
          ↑ Keep
        </button>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#C4B49E' }}>
        ↑ keep &nbsp;·&nbsp; ↓ replace &nbsp;·&nbsp; ⌫ undo
      </div>
    </div>
  );
}

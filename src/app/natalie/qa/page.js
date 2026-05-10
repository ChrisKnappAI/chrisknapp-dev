'use client';

import { useState, useEffect, useCallback } from 'react';
import { LESSONS } from '../../santiago-learns-english/chat-with-penny/_data/lessons.js';

const BASE = '/santiago-learns-english/chat-with-penny/images';

function buildItems() {
  const out = [];
  for (const lesson of LESSONS) {
    const photoTemplates = lesson.templates?.filter(
      t => t.expects === 'photo-name' || t.expects === 'photo-pick'
    );
    if (!photoTemplates?.length) continue;

    const sampleQ = photoTemplates[0];

    if (lesson.imageMap) {
      for (const [word, imgPath] of Object.entries(lesson.imageMap)) {
        if (!imgPath) continue;
        const qText = sampleQ.text.replace(/\{word\}/g, word);
        out.push({ topicId: lesson.id, label: lesson.label, word, path: imgPath, q: qText, type: sampleQ.expects });
      }
    } else {
      for (const word of (lesson.vocab ?? [])) {
        const path = `${BASE}/${lesson.id}/${word.replace(/\s+/g, '-')}.jpg`;
        const qText = sampleQ.text.replace(/\{word\}/g, word);
        out.push({ topicId: lesson.id, label: lesson.label, word, path, q: qText, type: sampleQ.expects });
      }
    }
  }
  return out;
}

const ALL_ITEMS = buildItems();

export default function QAPage() {
  const [index, setIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const item = ALL_ITEMS[index];

  const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIndex(i => Math.min(ALL_ITEMS.length - 1, i + 1)), []);

  useEffect(() => { setImgError(false); }, [index]);

  useEffect(() => {
    const handler = e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  const pct = Math.round(((index + 1) / ALL_ITEMS.length) * 100);

  return (
    <div style={{ maxWidth: 540, margin: '0 auto', padding: '1.5rem 1.5rem 3rem', userSelect: 'none' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A89A85', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          {item.label}
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E2A38' }}>
          {index + 1} <span style={{ color: '#A89A85', fontWeight: 400 }}>/ {ALL_ITEMS.length}</span>
        </span>
      </div>

      {/* Progress */}
      <div style={{ height: 4, background: '#EDE9E4', borderRadius: 3, marginBottom: 18, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#1D4ED8', borderRadius: 3, transition: 'width 0.1s' }} />
      </div>

      {/* Question bubble — mimics how Penny asks it */}
      <div style={{
        background: '#EEF2FF', border: '1.5px solid #C7D2FE', borderRadius: 16,
        padding: '0.9rem 1.2rem', marginBottom: 16, textAlign: 'center',
        fontSize: '1.1rem', fontWeight: 700, color: '#1E2A38',
      }}>
        {item.q}
      </div>

      {/* Image */}
      <div style={{
        width: '100%', aspectRatio: '1', borderRadius: 16, overflow: 'hidden',
        background: '#EDE9E4', marginBottom: 14, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {!imgError ? (
          <img
            key={item.path}
            src={item.path}
            alt={item.word}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#C4B49E' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🚫</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>No image</div>
          </div>
        )}

        {/* Type badge */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: item.type === 'photo-name' ? 'rgba(30,42,56,0.75)' : 'rgba(29,78,216,0.75)',
          color: 'white', fontSize: '0.68rem', fontWeight: 700,
          padding: '3px 9px', borderRadius: 20, letterSpacing: '0.04em',
        }}>
          {item.type === 'photo-name' ? 'TYPE IT' : 'PICK IT'}
        </div>
      </div>

      {/* Answer */}
      <div style={{ textAlign: 'center', marginBottom: 22 }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1E2A38' }}>{item.word}</div>
        <div style={{ fontSize: '0.75rem', color: '#A89A85', marginTop: 3, fontStyle: 'italic' }}>{item.topicId}</div>
      </div>

      {/* Nav buttons */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button
          onClick={prev}
          disabled={index === 0}
          style={{
            flex: 1, maxWidth: 160, padding: '11px 0', borderRadius: 12,
            border: '1.5px solid #D1C5B8', background: 'white', color: '#A89A85',
            fontSize: '0.95rem', fontWeight: 700, cursor: index === 0 ? 'default' : 'pointer',
            opacity: index === 0 ? 0.35 : 1, fontFamily: 'inherit',
          }}
        >
          ← Prev
        </button>
        <button
          onClick={next}
          disabled={index === ALL_ITEMS.length - 1}
          style={{
            flex: 1, maxWidth: 160, padding: '11px 0', borderRadius: 12,
            border: '2px solid #1D4ED8', background: '#1D4ED8', color: 'white',
            fontSize: '0.95rem', fontWeight: 700,
            cursor: index === ALL_ITEMS.length - 1 ? 'default' : 'pointer',
            opacity: index === ALL_ITEMS.length - 1 ? 0.5 : 1, fontFamily: 'inherit',
          }}
        >
          Next →
        </button>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#C4B49E', marginTop: 12 }}>
        ← → arrow keys to navigate
      </div>
    </div>
  );
}

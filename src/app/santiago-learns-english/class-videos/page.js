'use client';

import { useState } from 'react';

// ── Add videos here: title + YouTube video ID ─────────────────────────────
// YouTube ID = the part after ?v= in the URL
// e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ → id: 'dQw4w9WgXcQ'
const VIDEOS = [
  { id: 'hello',              title: 'Hello',                          ytId: 'gghDRJVxFxU' },
  { id: 'little-finger',      title: 'Little Finger',                  ytId: 'eBVqcTEC3zQ' },
  { id: 'goodbye',            title: 'Goodbye',                        ytId: '0LDArAJf7-c' },
  { id: 'weather',            title: 'How is the Weather',             ytId: 'KBL5aXSJTlE' },
  { id: 'what-is-your-name',  title: 'What is Your Name?',             ytId: 'yqlbn_nI2w8' },
  { id: 'are-you-hungry',     title: 'Are You Hungry?',                ytId: 'ykTR0uFGwE0' },
  { id: 'broccoli-ice-cream', title: 'Do You Like Broccoli or Ice Cream?', ytId: 'frN3nvhIHUk' },
];

export default function ClassVideosPage() {
  const [selected, setSelected] = useState(VIDEOS[0]);

  return (
    <div style={{ padding: '28px 24px', maxWidth: 720 }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1D3A8A', letterSpacing: '-0.4px' }}>
          Class Videos
        </h1>
      </div>

      {/* Dropdown */}
      <select
        value={selected.id}
        onChange={e => setSelected(VIDEOS.find(v => v.id === e.target.value))}
        style={{
          width:        '100%',
          maxWidth:      640,
          background:   '#1D4ED8',
          color:        '#fff',
          border:       'none',
          borderRadius:  10,
          padding:      '12px 16px',
          fontSize:      15,
          fontWeight:    700,
          cursor:       'pointer',
          outline:      'none',
          marginBottom:  20,
          appearance:   'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat:   'no-repeat',
          backgroundPosition: 'right 16px center',
          paddingRight:  40,
        }}
      >
        {VIDEOS.map(v => (
          <option key={v.id} value={v.id}>{v.title}</option>
        ))}
      </select>

      {/* Embedded video */}
      <div style={{
        width:          '100%',
        maxWidth:        640,
        aspectRatio:    '16 / 9',
        background:     '#1E293B',
        borderRadius:    12,
        overflow:       'hidden',
        boxShadow:      '0 8px 32px rgba(0,0,0,0.15)',
      }}>
        {selected.ytId ? (
          <iframe
            key={selected.ytId}
            src={`https://www.youtube.com/embed/${selected.ytId}?rel=0&modestbranding=1`}
            title={selected.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 40 }}>🎬</span>
            <span style={{ color: '#475569', fontSize: 14, fontWeight: 600 }}>Videos coming soon</span>
          </div>
        )}
      </div>

    </div>
  );
}

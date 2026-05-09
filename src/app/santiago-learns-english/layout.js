'use client';

import { usePathname, useRouter } from 'next/navigation';

const lessons = [
  { slug: 'body-parts',   label: '🧍 Body Parts',   active: true },
  { slug: 'class-videos', label: '🎬 Class Videos', active: true },
  { slug: 'junk-food',    label: '🍕 Junk Food',    active: true },
];

export default function SantiagoLayout({ children }) {
  const pathname = usePathname();
  const router   = useRouter();
  const current  = pathname.split('/').pop();

  return (
    <div style={{
      height:        '100vh',
      display:       'flex',
      flexDirection: 'column',
      background:    '#EFF6FF',
      fontFamily:    "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflow:      'hidden',
    }}>

      {/* ── Top bar ── */}
      <header style={{
        background:     '#1D4ED8',
        padding:        '0 20px',
        height:          64,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        flexShrink:      0,
        boxShadow:      '0 2px 12px rgba(0,0,0,0.2)',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ lineHeight: 1 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#FDE047' }}>San</span>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#fff'   }}>tiago</span>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.04em' }}>
            Learns English
          </span>
        </div>

        {/* Lesson dropdown */}
        <select
          value={current}
          onChange={e => {
            const lesson = lessons.find(l => l.slug === e.target.value);
            if (lesson?.active) router.push(`/santiago-learns-english/${e.target.value}`);
          }}
          style={{
            background:   '#FDE047',
            color:        '#1D3A8A',
            border:       'none',
            borderRadius:  8,
            padding:      '8px 12px',
            fontSize:      14,
            fontWeight:    700,
            cursor:       'pointer',
            outline:      'none',
            maxWidth:      200,
          }}
        >
          {lessons.map(l => (
            <option key={l.slug} value={l.slug} disabled={!l.active}>
              {l.label}{!l.active ? ' — Soon' : ''}
            </option>
          ))}
        </select>
      </header>

      {/* ── Page content ── */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>

      {/* ── Footer ── */}
      <footer style={{
        background:  '#1D4ED8',
        padding:     '14px 20px',
        textAlign:   'center',
        flexShrink:   0,
        boxShadow:   '0 -2px 12px rgba(0,0,0,0.15)',
      }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
          Made with ❤️ for <span style={{ color: '#FDE047', fontWeight: 800 }}>Santiago</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}> · from your God Parents</span>
        </div>
      </footer>

    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const lessons = [
  { slug: 'class-videos', icon: '🎬', label: 'Class Videos', active: true },
  { slug: 'chess',        icon: '♟',  label: 'Chess',        active: true },
  { slug: 'body-parts',   icon: '🧍', label: 'Body Parts',   active: true },
  { slug: 'junk-food',    icon: '🍕', label: 'Junk Food',    active: true },
];

export default function SantiagoLayout({ children }) {
  const pathname   = usePathname();
  const router     = useRouter();
  const current    = pathname.split('/').pop();
  const [open, setOpen] = useState(false);
  const dropRef    = useRef(null);

  const currentLesson = lessons.find(l => l.slug === current) || lessons[0];

  useEffect(() => {
    function onClickOutside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

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

        {/* Custom lesson dropdown */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              background:   '#FDE047',
              color:        '#1D3A8A',
              border:       'none',
              borderRadius:  8,
              padding:      '8px 12px',
              fontSize:      14,
              fontWeight:    700,
              cursor:       'pointer',
              display:      'flex',
              alignItems:   'center',
              gap:           6,
              minWidth:      160,
              justifyContent: 'space-between',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 22, textAlign: 'center', fontSize: 16, flexShrink: 0 }}>
                {currentLesson.icon}
              </span>
              {currentLesson.label}
            </span>
            <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 4 }}>▼</span>
          </button>

          {open && (
            <div style={{
              position:     'absolute',
              top:          'calc(100% + 6px)',
              right:         0,
              background:   '#FDE047',
              borderRadius:  10,
              boxShadow:    '0 6px 24px rgba(0,0,0,0.25)',
              zIndex:        100,
              overflow:     'hidden',
              minWidth:      180,
            }}>
              {lessons.map(l => {
                const isActive  = l.slug === current;
                return (
                  <div
                    key={l.slug}
                    onClick={() => {
                      if (!l.active) return;
                      router.push(`/santiago-learns-english/${l.slug}`);
                      setOpen(false);
                    }}
                    style={{
                      display:    'flex',
                      alignItems: 'center',
                      gap:         8,
                      padding:    '11px 16px',
                      cursor:      l.active ? 'pointer' : 'default',
                      background:  isActive ? 'rgba(29,78,216,0.12)' : 'transparent',
                      color:      '#1D3A8A',
                      fontWeight:  700,
                      fontSize:    14,
                      opacity:     l.active ? 1 : 0.4,
                    }}
                  >
                    <span style={{ width: 22, textAlign: 'center', fontSize: 16, flexShrink: 0 }}>
                      {l.icon}
                    </span>
                    <span>{l.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
          <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}> · From Your God Parents</span>
        </div>
      </footer>

    </div>
  );
}

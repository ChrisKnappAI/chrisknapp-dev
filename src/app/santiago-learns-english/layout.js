'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const lessons = [
  { slug: 'body-parts', label: 'Body Parts', emoji: '🧍', active: true },
  { slug: 'colors',     label: 'Colors',     emoji: '🎨', active: false },
  { slug: 'numbers',    label: 'Numbers',    emoji: '🔢', active: false },
  { slug: 'animals',    label: 'Animals',    emoji: '🐾', active: false },
  { slug: 'food',       label: 'Food',       emoji: '🍎', active: false },
  { slug: 'family',     label: 'Family',     emoji: '👨‍👩‍👧', active: false },
];

export default function SantiagoLayout({ children }) {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', -apple-system, sans-serif", background: '#EFF6FF' }}>

      {/* Sidebar */}
      <div style={{
        width: 220,
        minWidth: 220,
        background: '#1D4ED8',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 0 24px',
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
      }}>
        {/* Logo */}
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.15)', marginBottom: 20 }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>⭐</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1.25, letterSpacing: '-0.2px' }}>
            Santiago<br/>
            <span style={{ color: '#FDE047' }}>Learns English</span>
          </div>
        </div>

        {/* Lessons */}
        <div style={{ padding: '0 10px', flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 10px', marginBottom: 8 }}>
            Lessons
          </div>
          {lessons.map(lesson => {
            const href    = `/santiago-learns-english/${lesson.slug}`;
            const current = pathname === href;
            const locked  = !lesson.active;
            return (
              <div key={lesson.slug}>
                {lesson.active ? (
                  <Link href={href} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 10,
                      marginBottom: 4,
                      background: current ? '#FDE047' : 'transparent',
                      color:   current ? '#1D3A8A' : '#fff',
                      fontWeight: current ? 800 : 500,
                      fontSize: 14,
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}>
                      <span style={{ fontSize: 18 }}>{lesson.emoji}</span>
                      {lesson.label}
                    </div>
                  </Link>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 10,
                    marginBottom: 4,
                    color: 'rgba(255,255,255,0.35)',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'not-allowed',
                  }}>
                    <span style={{ fontSize: 18, opacity: 0.5 }}>{lesson.emoji}</span>
                    {lesson.label}
                    <span style={{ marginLeft: 'auto', fontSize: 11, background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 20 }}>Soon</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 20px 0', borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: 16 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
            Made with ❤️ for<br/>Santiago, age 8
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

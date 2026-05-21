'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { PersonCtx } from './_context/person'

const BASE = '/travel/202606-polynesia-hawaii'

const TABS = [
  { slug: 'timeline', label: 'Timeline', icon: '🗓️' },
  { slug: 'todos',    label: 'To-Do',    icon: '✅' },
  { slug: 'packing',  label: 'Packing',  icon: '🧳' },
  { slug: 'diary',    label: 'Diary',    icon: '📖' },
]

export default function TravelLayout({ children }) {
  const [person, setPerson] = useState(undefined)
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(({ person }) => setPerson(person))
  }, [])

  const activeSlug = TABS.find(t => pathname.includes(`/${t.slug}`))?.slug || 'timeline'

  if (person === undefined) {
    return (
      <div style={{
        minHeight: '100dvh', background: '#F0F9FF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        <div style={{ color: '#0891B2', fontSize: '0.9rem' }}>Loading…</div>
      </div>
    )
  }

  if (!person) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: 'linear-gradient(180deg, #0369A1 0%, #0891B2 50%, #BAE6FD 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>🌺</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
          Chris & Natalie's Trip
        </div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', marginBottom: '2.5rem' }}>
          French Polynesia & Hawaii · 2026
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: 300 }}>
          <a href="/login/chris" style={{
            display: 'block', background: '#fff', color: '#0891B2',
            padding: '0.9rem', borderRadius: 12, textAlign: 'center',
            textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}>
            Chris's Login
          </a>
          <a href="/login/natalie" style={{
            display: 'block', background: 'rgba(255,255,255,0.15)', color: '#fff',
            padding: '0.9rem', borderRadius: 12, textAlign: 'center',
            textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem',
            border: '1.5px solid rgba(255,255,255,0.35)',
          }}>
            Natalie's Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <PersonCtx.Provider value={person}>
      <style>{`
        html, body { background: #BAE6FD; margin: 0; padding: 0; }
        * { box-sizing: border-box; }
      `}</style>
      <div style={{
        height: '100dvh',
        maxWidth: 640,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        background: '#F8FEFF',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        boxShadow: '0 0 60px rgba(8,145,178,0.2)',
        overflow: 'hidden',
      }}>

        {/* Header */}
        <header style={{
          background: 'linear-gradient(135deg, #0369A1 0%, #0891B2 60%, #0EA5E9 100%)',
          padding: '11px 18px 10px',
          flexShrink: 0,
          boxShadow: '0 2px 16px rgba(3,105,161,0.4)',
        }}>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            French Polynesia & Hawaii · 2026
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              🌺 Chris & Natalie's Trip
            </div>
            <div style={{
              fontSize: '0.68rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600,
              background: 'rgba(255,255,255,0.18)', padding: '3px 10px',
              borderRadius: 20, border: '1px solid rgba(255,255,255,0.25)',
            }}>
              {person === 'chris' ? '👤 Chris' : '👤 Natalie'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </main>

        {/* Bottom Tab Nav */}
        <nav style={{
          flexShrink: 0,
          display: 'flex',
          background: '#fff',
          borderTop: '1px solid rgba(8,145,178,0.12)',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}>
          {TABS.map(tab => {
            const isActive = activeSlug === tab.slug
            return (
              <Link
                key={tab.slug}
                href={`${BASE}/${tab.slug}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '8px 4px 7px',
                  textDecoration: 'none',
                  color: isActive ? '#0891B2' : '#94A3B8',
                  borderTop: `2px solid ${isActive ? '#0891B2' : 'transparent'}`,
                  background: isActive ? 'rgba(8,145,178,0.05)' : 'transparent',
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'color 0.1s',
                }}
              >
                <span style={{ fontSize: '1.15rem', lineHeight: 1, marginBottom: 3 }}>{tab.icon}</span>
                <span style={{ fontSize: '0.6rem', fontWeight: isActive ? 700 : 500, letterSpacing: '0.01em' }}>
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </nav>

      </div>
    </PersonCtx.Provider>
  )
}

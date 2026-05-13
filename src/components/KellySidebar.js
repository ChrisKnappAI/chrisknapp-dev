'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'My Story', href: '/kelly/story', icon: '✎' },
  { label: 'Timeline', href: '/kelly/timeline', icon: '◷' },
  { label: 'People', href: '/kelly/people', icon: '◉' },
  { label: 'Events', href: '/kelly/events', icon: '◈' },
]

export default function KellySidebar() {
  const pathname = usePathname()

  async function handleLogout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'kelly' }),
    })
    window.location.href = '/'
  }

  return (
    <aside className="kelly-sidebar" style={{
      width: 232, minHeight: '100vh', background: 'var(--c-kelly-sidebar)',
      borderRight: '1px solid var(--c-kelly-border)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, zIndex: 50,
    }}>
      <div style={{ padding: '1.5rem 1.5rem 1.25rem', borderBottom: '1px solid var(--c-kelly-border)' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#F1F5F9' }}>
          kelly<span style={{ color: 'var(--c-amber)' }}>knapp</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: '#5C4F2A', marginTop: '0.2rem', fontWeight: 500 }}>My Life Story</div>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        {navItems.map(item => <NavItem key={item.href} item={item} active={pathname === item.href} />)}
      </nav>

      <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--c-kelly-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link href="/" style={{ color: '#5C4F2A', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 500 }}>← Back to site</Link>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#5C4F2A', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', textAlign: 'left', padding: 0 }}>Sign out</button>
      </div>
    </aside>
  )
}

function NavItem({ item, active }) {
  return (
    <Link href={item.href} style={{
      display: 'flex', alignItems: 'center', gap: '0.7rem',
      padding: '0.6rem 0.75rem', borderRadius: 7,
      textDecoration: 'none',
      color: active ? '#FCD34D' : '#6B5A30',
      fontWeight: active ? 600 : 500,
      fontSize: '0.85rem',
      background: active ? 'var(--c-amber-dim)' : 'transparent',
      borderLeft: active ? '2px solid var(--c-amber)' : '2px solid transparent',
    }}>
      <span style={{ width: 16, textAlign: 'center', fontSize: '0.85rem' }}>{item.icon}</span>
      {item.label}
    </Link>
  )
}

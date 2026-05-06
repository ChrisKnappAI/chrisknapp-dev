'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Health Dashboard', href: '/chris/health', icon: '♥' },
  { label: 'Financial Dashboard', href: '/chris/finances', icon: '$' },
  { label: 'Care Dashboard', href: '/chris/care-dashboard', icon: '★' },
  { label: 'Learning Dashboard', href: '/chris/learning', icon: '◎' },
]

const toolItems = [
  { label: 'Food Log', href: '/chris/food', icon: '○' },
  { label: 'Gym Log', href: '/chris/gym', icon: '⊕' },
  { label: 'Care Log', href: '/chris/care-log', icon: '✓' },
]

export default function ChrisSidebar() {
  const pathname = usePathname()

  async function handleLogout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'chris' }),
    })
    window.location.href = '/'
  }

  return (
    <aside style={{
      width: 232, minHeight: '100vh', background: 'var(--c-dark-sidebar)',
      borderRight: '1px solid var(--c-dark-border)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, zIndex: 50,
    }}>
      <div style={{ padding: '1.5rem 1.5rem 1.25rem', borderBottom: '1px solid var(--c-dark-border)' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#F1F5F9' }}>
          chris<span style={{ color: 'var(--c-blue)' }}>knapp</span>.dev
        </div>
        <div style={{ fontSize: '0.72rem', color: '#334155', marginTop: '0.2rem', fontWeight: 500 }}>Chris's Dashboards</div>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        <SectionLabel>Dashboards</SectionLabel>
        {navItems.map(item => <NavItem key={item.href} item={item} active={pathname === item.href} />)}

        <SectionLabel>Tools</SectionLabel>
        {toolItems.map(item => <NavItem key={item.href} item={item} active={pathname === item.href} />)}
      </nav>

      <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--c-dark-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link href="/" style={{ color: '#334155', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 500 }}>← Back to site</Link>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#334155', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', textAlign: 'left', padding: 0 }}>Sign out</button>
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
      color: active ? '#93C5FD' : '#4B6280',
      fontWeight: active ? 600 : 500,
      fontSize: '0.85rem',
      background: active ? 'var(--c-blue-dim)' : 'transparent',
      borderLeft: active ? '2px solid var(--c-blue)' : '2px solid transparent',
    }}>
      <span style={{ width: 16, textAlign: 'center', fontSize: '0.85rem' }}>{item.icon}</span>
      {item.label}
    </Link>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#1E3A5F', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.75rem 0.75rem 0.4rem', marginTop: '0.25rem' }}>
      {children}
    </div>
  )
}

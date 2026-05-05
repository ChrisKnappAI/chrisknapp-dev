'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Goals', href: '/natalie/goals', icon: '★' },
]

const toolItems = [
  { label: "Chris's Food Log", href: '/natalie/food/chris', icon: '○' },
  { label: "My Food Log", href: '/natalie/food/natalie', icon: '○' },
  { label: 'Goal Check-In', href: '/natalie/goal-tracker', icon: '✓' },
]

export default function NatalieSidebar() {
  const pathname = usePathname()

  async function handleLogout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'natalie' }),
    })
    window.location.href = '/'
  }

  return (
    <aside style={{
      width: 232, minHeight: '100vh', background: 'var(--c-beige-sidebar)',
      borderRight: '1px solid var(--c-beige-border)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, zIndex: 50,
    }}>
      <div style={{ padding: '1.5rem 1.5rem 1.25rem', borderBottom: '1px solid var(--c-beige-border)' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#1E2A38' }}>
          chris<span style={{ color: 'var(--c-sky)' }}>knapp</span>.dev
        </div>
        <div style={{ fontSize: '0.72rem', color: '#A89A85', marginTop: '0.2rem', fontWeight: 500 }}>Natalie's Dashboards</div>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        <SectionLabel>Dashboards</SectionLabel>
        {navItems.map(item => <NavItem key={item.href} item={item} active={pathname === item.href} />)}

        <SectionLabel>Tools</SectionLabel>
        {toolItems.map(item => <NavItem key={item.href} item={item} active={pathname === item.href} />)}
      </nav>

      <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--c-beige-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link href="/" style={{ color: '#C4B49E', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 500 }}>← Back to site</Link>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#C4B49E', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', textAlign: 'left', padding: 0 }}>Sign out</button>
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
      color: active ? '#0369A1' : '#A89A85',
      fontWeight: active ? 600 : 500,
      fontSize: '0.85rem',
      background: active ? 'var(--c-sky-dim)' : 'transparent',
      borderLeft: active ? '2px solid var(--c-sky)' : '2px solid transparent',
    }}>
      <span style={{ width: 16, textAlign: 'center', fontSize: '0.85rem' }}>{item.icon}</span>
      {item.label}
    </Link>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#C4B49E', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.75rem 0.75rem 0.4rem', marginTop: '0.25rem' }}>
      {children}
    </div>
  )
}

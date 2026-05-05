'use client'

export default function ChrisDashboard({ title, subtitle, children }) {
  return (
    <div style={{ color: '#F1F5F9', minHeight: '100vh' }}>

      {/* ── Page header ── */}
      <div style={{
        padding: '1.75rem 2.5rem 1.5rem',
        borderBottom: '1px solid var(--c-dark-border)',
        background: 'var(--c-dark)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.025em' }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.2rem', fontWeight: 500 }}>{subtitle}</div>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {children}
      </div>
    </div>
  )
}

export function DashCard({ title, action, children, style }) {
  return (
    <div style={{
      background: 'var(--c-dark-card)',
      border: '1px solid var(--c-dark-border)',
      borderRadius: 14,
      overflow: 'hidden',
      ...style,
    }}>
      {(title || action) && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.1rem 1.5rem',
          borderBottom: '1px solid var(--c-dark-border)',
        }}>
          {title && <div style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</div>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div style={{ padding: '1.5rem' }}>
        {children}
      </div>
    </div>
  )
}

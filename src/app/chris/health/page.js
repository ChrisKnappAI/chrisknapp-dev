export default function HealthPage() {
  return (
    <div style={{ color: '#F1F5F9' }}>
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--c-dark-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Health Dashboard</div>
          <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.2rem' }}>Coming soon — data will load here</div>
        </div>
        <div style={{ fontSize: '0.78rem', color: '#475569' }}>May 4, 2026</div>
      </div>
      <div style={{ padding: '2rem', color: '#475569', fontSize: '0.9rem' }}>
        Charts and stats will appear here once data is connected.
      </div>
    </div>
  )
}

export default function KellyTimelinePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-kelly)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: '2rem', marginBottom: '1.25rem', color: '#5C4F2A' }}>◷</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '0.75rem' }}>Timeline</div>
        <div style={{ fontSize: '0.9rem', color: '#6B5A30', lineHeight: 1.7 }}>
          As you share more stories, your life timeline will be built here — events, people, and moments organized by year.
        </div>
      </div>
    </div>
  )
}

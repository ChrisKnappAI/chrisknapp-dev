import Link from 'next/link'

export default function Landing() {
  return (
    <div style={{ background: 'var(--c-dark)', minHeight: '100vh', color: '#F1F5F9' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.25rem 2.5rem',
        borderBottom: '1px solid var(--c-dark-border)',
      }}>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          chris<span style={{ color: 'var(--c-blue)' }}>knapp</span>.dev
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={navLink}>Portfolio</a>
          <a href="https://www.linkedin.com/in/chrisknappfl/" target="_blank" style={navLink}>LinkedIn ↗</a>
          <a href="mailto:ChrisKnappAI@Gmail.com" style={navLink}>Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 820, margin: '0 auto', padding: '7rem 2rem 5rem', textAlign: 'center' }}>
        <div style={badge}>Data &amp; Strategy · AI Builder · Progressive Insurance</div>

        <h1 style={{ fontSize: 'clamp(3rem,7vw,4.5rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.06, color: '#F8FAFC', margin: '0 0 1.5rem' }}>
          Chris <span style={{ color: 'var(--c-blue)' }}>Knapp</span>
        </h1>

        <p style={{ fontSize: '1.05rem', color: '#94A3B8', maxWidth: 480, margin: '0 auto 3rem', lineHeight: 1.65 }}>
          Manager of Customer Strategy &amp; Data Analysis at Progressive.
          Building AI tools and personal dashboards on the side.
        </p>

        {/* Dashboard cards */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <DashCard
            href="/chris"
            accentGradient="linear-gradient(90deg,#2563EB,#EA580C)"
            tag="Personal"
            tagColor="var(--c-blue)"
            title="Chris's Dashboards"
            desc="Health, finances, goals, learning, and fitness — all in one place."
            pills={[
              { label: 'Health', bg: 'var(--c-blue-dim)', color: '#93C5FD' },
              { label: 'Finances', bg: 'var(--c-orange-dim)', color: '#FB923C' },
              { label: 'Goals', bg: 'var(--c-blue-dim)', color: '#93C5FD' },
              { label: 'Gym', bg: 'var(--c-orange-dim)', color: '#FB923C' },
            ]}
          />
          <DashCard
            href="/natalie"
            accentGradient="linear-gradient(90deg,#38BDF8,#34D399)"
            tag="Personal"
            tagColor="var(--c-sky)"
            title="Natalie's Dashboards"
            desc="Goals, food tracking, and habit streaks — Natalie's space."
            pills={[
              { label: 'Goals', bg: 'var(--c-sky-dim)', color: '#7DD3FC' },
              { label: 'Food', bg: 'var(--c-green-dim)', color: '#6EE7B7' },
              { label: 'Tracker', bg: 'var(--c-sky-dim)', color: '#7DD3FC' },
            ]}
          />
        </div>

        {/* External links */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#" style={extLink}>Portfolio ↗</a>
          <a href="https://www.linkedin.com/in/chrisknappfl/" target="_blank" style={extLink}>LinkedIn ↗</a>
          <a href="mailto:ChrisKnappAI@Gmail.com" style={extLink}>ChrisKnappAI@Gmail.com</a>
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '3rem 2rem', color: '#334155', fontSize: '0.78rem', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '3rem' }}>
        chrisknapp.dev — Built with Next.js &amp; Claude
      </footer>
    </div>
  )
}

function DashCard({ href, accentGradient, tag, tagColor, title, desc, pills }) {
  return (
    <Link href={href} style={{
      background: 'var(--c-dark-card)',
      border: '1px solid var(--c-dark-border)',
      borderRadius: 14,
      padding: '1.75rem 2rem 2.25rem',
      width: 280,
      textAlign: 'left',
      textDecoration: 'none',
      color: 'inherit',
      display: 'block',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accentGradient }} />
      <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: tagColor, marginBottom: '0.75rem' }}>{tag}</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>{title}</div>
      <div style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5 }}>{desc}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.9rem' }}>
        {pills.map(p => (
          <span key={p.label} style={{ fontSize: '0.68rem', fontWeight: 500, padding: '0.2rem 0.55rem', borderRadius: 4, background: p.bg, color: p.color }}>{p.label}</span>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.75rem', color: '#334155', fontSize: '1rem' }}>→</div>
    </Link>
  )
}

const navLink = { color: '#64748B', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }
const badge = { display: 'inline-flex', alignItems: 'center', background: 'var(--c-blue-dim)', border: '1px solid rgba(59,130,246,0.22)', color: '#93C5FD', fontSize: '0.72rem', fontWeight: 600, padding: '0.35rem 0.9rem', borderRadius: 999, marginBottom: '2rem', letterSpacing: '0.06em', textTransform: 'uppercase' }
const extLink = { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, padding: '0.5rem 1.1rem', borderRadius: 7, border: '1px solid rgba(255,255,255,0.07)' }

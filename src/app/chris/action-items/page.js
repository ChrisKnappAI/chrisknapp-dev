'use client'
import ChrisDashboard, { DashCard } from '@/components/ChrisDashboard'

const ITEMS = [
  {
    id: 1,
    title: "Natalie's Birthday — Photo book & printout, gift wrap, decorations",
    due: '2026-05-30',
    category: '🎁 Personal',
  },
  {
    id: 2,
    title: "Natalie's Birthday — Cake pickup",
    due: '2026-05-31',
    category: '🎂 Personal',
  },
  {
    id: 3,
    title: 'TSA PreCheck at MCO — CLEAR line, use SW Business Card (0451)',
    note: 'Takes <10 min. Do on departure day before boarding.',
    due: '2026-06-26',
    category: '✈️ Travel',
  },
  {
    id: 4,
    title: 'Cancel Southwest credit card before annual fee hits',
    note: 'Annual fee charges Nov 1 — cancel before.',
    due: '2026-11-01',
    category: '💳 Finances',
  },
  {
    id: 5,
    title: 'Cancel Southwest credit card before annual fee hits',
    note: 'Annual fee charges Dec 1 — cancel before.',
    due: '2026-12-01',
    category: '💳 Finances',
  },
]

function urgency(dueStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueStr + 'T00:00:00')
  const days = Math.round((due - today) / 86400000)
  if (days < 0)   return { label: 'Overdue',   color: '#EF4444', bg: '#450A0A' }
  if (days === 0) return { label: 'Due Today',  color: '#F97316', bg: '#431407' }
  if (days === 1) return { label: 'Tomorrow',   color: '#F97316', bg: '#431407' }
  if (days <= 7)  return { label: `${days}d`,   color: '#EAB308', bg: '#3D2000' }
  if (days <= 30) return { label: `${days}d`,   color: '#60A5FA', bg: '#0F2844' }
  return                 { label: `${days}d`,   color: '#94A3B8', bg: 'transparent' }
}

function fmtDate(s) {
  return new Date(s + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ActionItemsPage() {
  const sorted = [...ITEMS].sort((a, b) => a.due.localeCompare(b.due))

  return (
    <ChrisDashboard title="Action Items">
      <DashCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sorted.map(item => {
            const u = urgency(item.due)
            return (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: '1rem',
                padding: '1rem 1.25rem',
                background: 'var(--c-dark)',
                border: `1px solid ${u.color}35`,
                borderRadius: 10,
              }}>
                <div style={{
                  flexShrink: 0, minWidth: 72, textAlign: 'center',
                  background: u.bg,
                  border: `1px solid ${u.color}50`,
                  borderRadius: 8, padding: '5px 10px',
                }}>
                  <div style={{ fontSize: '0.6rem', color: u.color, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{u.label}</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748B', marginTop: 2 }}>{fmtDate(item.due)}</div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F1F5F9', lineHeight: 1.4 }}>{item.title}</div>
                  {item.note && (
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4, lineHeight: 1.5 }}>{item.note}</div>
                  )}
                  <div style={{ fontSize: '0.65rem', color: '#475569', marginTop: 6, fontWeight: 500 }}>{item.category}</div>
                </div>
              </div>
            )
          })}
        </div>
      </DashCard>
    </ChrisDashboard>
  )
}

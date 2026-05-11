import NatalieSidebar from '@/components/NatalieSidebar'

export default function NatalieLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--c-beige)' }}>
      <NatalieSidebar />
      <div className="natalie-content" style={{ marginLeft: 232, flex: 1 }}>
        {children}
      </div>
    </div>
  )
}

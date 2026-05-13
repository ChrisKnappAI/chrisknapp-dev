import KellySidebar from '@/components/KellySidebar'

export default function KellyLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--c-kelly)' }}>
      <KellySidebar />
      <div className="kelly-content" style={{ marginLeft: 232, flex: 1 }}>
        {children}
      </div>
    </div>
  )
}

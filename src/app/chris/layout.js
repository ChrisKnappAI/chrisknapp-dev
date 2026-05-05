import ChrisSidebar from '@/components/ChrisSidebar'

export default function ChrisLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--c-dark)' }}>
      <ChrisSidebar />
      <div style={{ marginLeft: 232, flex: 1 }}>
        {children}
      </div>
    </div>
  )
}

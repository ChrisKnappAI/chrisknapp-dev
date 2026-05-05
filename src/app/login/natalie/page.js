'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NatalieLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const res = await fetch('/api/auth/natalie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/natalie/goals')
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--c-beige)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 360, background: 'white', border: '1px solid var(--c-beige-border)', borderRadius: 16, padding: '2.5rem 2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E2A38', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            chris<span style={{ color: 'var(--c-sky)' }}>knapp</span>.dev
          </div>
          <div style={{ fontSize: '0.82rem', color: '#A89A85' }}>Natalie's Dashboards</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            style={{
              background: 'var(--c-beige)', border: `1px solid ${error ? '#EF4444' : 'rgba(0,0,0,0.12)'}`,
              borderRadius: 8, padding: '0.75rem 1rem', color: '#1E2A38', fontSize: '0.9rem',
              outline: 'none', width: '100%',
            }}
          />
          {error && <div style={{ color: '#EF4444', fontSize: '0.8rem' }}>Incorrect password.</div>}
          <button type="submit" disabled={loading} style={{
            background: 'var(--c-sky)', color: 'white', border: 'none',
            borderRadius: 8, padding: '0.75rem', fontSize: '0.9rem', fontWeight: 600,
            cursor: 'pointer', opacity: loading ? 0.6 : 1,
          }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/" style={{ color: '#A89A85', fontSize: '0.78rem', textDecoration: 'none' }}>← Back to site</a>
        </div>
      </div>
    </div>
  )
}

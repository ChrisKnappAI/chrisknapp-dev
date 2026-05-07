'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function PhoneSample() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = 0, H = 0, animId = null, twTimer = null

    function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight }
    resize()
    window.addEventListener('resize', resize)

    class Particle {
      constructor() { this.init() }
      init() {
        this.x = Math.random() * W; this.y = Math.random() * H
        this.vx = (Math.random() - 0.5) * 0.45; this.vy = (Math.random() - 0.5) * 0.45
        this.r = Math.random() * 1.5 + 0.5; this.a = Math.random() * 0.25 + 0.15
      }
      update() {
        this.vx *= 0.985; this.vy *= 0.985
        this.x += this.vx; this.y += this.vy
        if (this.x < 0) this.x = W; else if (this.x > W) this.x = 0
        if (this.y < 0) this.y = H; else if (this.y > H) this.y = 0
      }
    }

    const pts = Array.from({ length: 80 }, () => new Particle())

    const zones = [
      { x: 0, y: 0, vx: 0.4,   vy: 0.3   },
      { x: 0, y: 0, vx: -0.3,  vy: 0.5   },
      { x: 0, y: 0, vx: 0.5,   vy: -0.4  },
      { x: 0, y: 0, vx: -0.45, vy: -0.35 },
    ]
    function initZones() {
      zones[0].x = W*0.2; zones[0].y = H*0.4
      zones[1].x = W*0.6; zones[1].y = H*0.3
      zones[2].x = W*0.8; zones[2].y = H*0.7
      zones[3].x = W*0.4; zones[3].y = H*0.75
    }
    initZones()
    window.addEventListener('resize', initZones)

    const ZONE_R = 160
    function updateZones() {
      zones.forEach(z => {
        z.x += z.vx; z.y += z.vy
        if (z.x < 0 || z.x > W) z.vx *= -1
        if (z.y < 0 || z.y > H) z.vy *= -1
      })
    }
    function zoneInf(p) {
      let max = 0
      zones.forEach(z => {
        const d = Math.hypot(p.x - z.x, p.y - z.y)
        if (d < ZONE_R) max = Math.max(max, 1 - d / ZONE_R)
      })
      return max
    }
    function drawLines() {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
          if (d < 130) {
            const inf = Math.max(zoneInf(pts[i]), zoneInf(pts[j]))
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(59,130,246,${(1 - d / 130) * (0.08 + inf * 0.28)})`
            ctx.lineWidth = 0.8 + inf * 0.6; ctx.stroke()
          }
        }
      }
    }
    function animate() {
      ctx.clearRect(0, 0, W, H)
      updateZones()
      pts.forEach(p => {
        const inf = zoneInf(p)
        p.vx += (Math.random() - 0.5) * inf * 0.06
        p.vy += (Math.random() - 0.5) * inf * 0.06
        p.update()
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + inf * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59,130,246,${Math.min(p.a + inf * 0.45, 0.85)})`; ctx.fill()
      })
      drawLines()
      animId = requestAnimationFrame(animate)
    }
    animate()

    // Typewriter
    const words = [
      'analytics that drive decisions',
      'AI-powered tools',
      'strategy that moves the needle',
      'rigorous experimental designs',
    ]
    let wi = 0, ci = 0, deleting = false
    const twEl = document.getElementById('ph-tw')
    function type() {
      if (!twEl) return
      const w = words[wi]
      if (!deleting) {
        twEl.textContent = w.slice(0, ++ci)
        if (ci === w.length) { deleting = true; twTimer = setTimeout(type, 2000); return }
      } else {
        twEl.textContent = w.slice(0, --ci)
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length }
      }
      twTimer = setTimeout(type, deleting ? 55 : 95)
    }
    twTimer = setTimeout(type, 800)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', initZones)
      if (animId) cancelAnimationFrame(animId)
      if (twTimer) clearTimeout(twTimer)
    }
  }, [])

  return (
    <>
      <style>{`
        html, body { background:#0F172A !important; color:#F1F5F9; margin:0; padding:0; }
        .ph-page { position:relative; z-index:1; min-height:100vh; display:flex; flex-direction:column; }

        /* NAV */
        .ph-nav { position:sticky; top:0; z-index:500; display:flex; align-items:center; justify-content:space-between; padding:1rem 1.5rem; border-bottom:1px solid rgba(255,255,255,0.06); backdrop-filter:blur(12px); background:rgba(15,23,42,0.98); }
        .ph-logo { font-size:1rem; font-weight:800; color:#F1F5F9; text-decoration:none; letter-spacing:-0.02em; }
        .ph-logo span { color:#3B82F6; }
        .ph-nav-links { display:flex; align-items:center; gap:0.1rem; list-style:none; }
        .ph-nav-links a { color:#94A3B8; text-decoration:none; font-size:0.82rem; font-weight:500; padding:0.4rem 0.6rem; border-radius:6px; }

        /* HERO */
        .ph-hero { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:3rem 2rem 2.5rem; }
        .ph-badge { display:inline-flex; align-items:center; gap:0.5rem; background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.22); color:#38BDF8; font-size:0.65rem; font-weight:700; padding:0.3rem 0.85rem; border-radius:100px; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:1.5rem; }
        .ph-badge-dot { width:5px; height:5px; background:#38BDF8; border-radius:50%; animation:ph-pulse 2s ease-in-out infinite; }
        @keyframes ph-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }

        .ph-greeting { font-size:1.1rem; font-weight:400; color:#94A3B8; margin-bottom:0.1rem; }
        .ph-name { font-size:clamp(2.75rem,12vw,4rem); font-weight:900; line-height:1; letter-spacing:-0.04em; margin-bottom:0.85rem; }
        .ph-name span { color:#3B82F6; }
        .ph-role { font-size:0.9rem; color:#94A3B8; line-height:1.6; margin-bottom:0.35rem; }
        .ph-tw-line { font-family:'Courier New',Courier,monospace; font-size:0.85rem; color:#3B82F6; margin-bottom:2.25rem; min-height:1.5em; }
        .ph-tw-cursor { display:inline-block; width:2px; height:0.85em; background:#3B82F6; margin-left:1px; vertical-align:text-bottom; animation:ph-blink 0.75s step-end infinite; }
        @keyframes ph-blink { 50%{opacity:0} }

        .ph-buttons { display:flex; flex-direction:column; align-items:stretch; gap:0.65rem; width:100%; max-width:280px; margin-bottom:2rem; }
        .ph-btn { display:flex; align-items:center; justify-content:center; padding:0.85rem 1.4rem; border-radius:8px; font-size:0.9rem; font-weight:600; text-decoration:none; border:1px solid transparent; }
        .ph-btn-primary { background:#3B82F6; color:#fff; border-color:#3B82F6; box-shadow:0 4px 15px rgba(59,130,246,0.25); }
        .ph-btn-outline { background:transparent; color:#F1F5F9; border-color:rgba(255,255,255,0.15); }

        .ph-desktop-note { font-size:0.82rem; font-weight:500; color:#38BDF8; background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.22); border-radius:8px; padding:0.75rem 1.25rem; width:100%; max-width:280px; text-align:center; letter-spacing:0.01em; }

        /* STATS */
        .ph-stats { border-top:1px solid rgba(255,255,255,0.06); background:#1E293B; position:relative; z-index:10; }
        .ph-stats-grid { display:grid; grid-template-columns:1fr 1fr; }
        .ph-stat-item { padding:1.75rem 1rem; text-align:center; border-right:1px solid rgba(255,255,255,0.06); border-bottom:1px solid rgba(255,255,255,0.06); }
        .ph-stat-item:nth-child(2n) { border-right:none; }
        .ph-stat-item:nth-child(3), .ph-stat-item:nth-child(4) { border-bottom:none; }
        .ph-stat-num { font-size:2rem; font-weight:900; letter-spacing:-0.04em; color:#3B82F6; line-height:1; margin-bottom:0.4rem; font-variant-numeric:tabular-nums; }
        .ph-stat-label { font-size:0.65rem; color:#94A3B8; font-weight:500; text-transform:uppercase; letter-spacing:0.08em; line-height:1.5; }

        /* FOOTER */
        .ph-footer { padding:1.5rem; text-align:center; border-top:1px solid rgba(255,255,255,0.06); }
        .ph-footer-logo { font-size:0.9rem; font-weight:800; color:#475569; letter-spacing:-0.02em; text-decoration:none; }
        .ph-footer-logo span { color:#3B82F6; }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      <div className="ph-page">

        <nav className="ph-nav">
          <Link href="/" className="ph-logo">chris<span>knapp</span>.dev</Link>
          <ul className="ph-nav-links">
            <li><a href="/Chris Knapp Resume 20260219.pdf" download>Resume</a></li>
            <li><a href="mailto:ChrisKnappAI@Gmail.com">Contact</a></li>
          </ul>
        </nav>

        <div className="ph-hero">
          <div className="ph-badge">
            <div className="ph-badge-dot" />
            Strategy · Analytics · AI
          </div>
          <p className="ph-greeting">Hey, I&apos;m</p>
          <h1 className="ph-name">Chris <span>Knapp</span></h1>
          <p className="ph-role">Strategy &amp; Analytics Leader<br />at Progressive Insurance</p>
          <p className="ph-tw-line"># i build <span id="ph-tw" /><span className="ph-tw-cursor" /></p>
          <div className="ph-buttons">
            <a href="/Chris Knapp Resume 20260219.pdf" download className="ph-btn ph-btn-primary">Download Resume</a>
            <a href="mailto:ChrisKnappAI@Gmail.com" className="ph-btn ph-btn-outline">Contact Me</a>
          </div>
          <p className="ph-desktop-note">🖥 Full portfolio available on desktop</p>
        </div>

        <div className="ph-stats">
          <div className="ph-stats-grid">
            <div className="ph-stat-item">
              <div className="ph-stat-num">$120M+</div>
              <div className="ph-stat-label">Annual Profit<br />From Projects</div>
            </div>
            <div className="ph-stat-item">
              <div className="ph-stat-num">150M+</div>
              <div className="ph-stat-label">Insurance Customers<br />Analyzed</div>
            </div>
            <div className="ph-stat-item">
              <div className="ph-stat-num">50+</div>
              <div className="ph-stat-label">Experimental Designs<br />Implemented</div>
            </div>
            <div className="ph-stat-item">
              <div className="ph-stat-num">16+</div>
              <div className="ph-stat-label">Years of<br />Experience</div>
            </div>
          </div>
        </div>

        <footer className="ph-footer">
          <Link href="/" className="ph-footer-logo">chris<span>knapp</span>.dev</Link>
        </footer>

      </div>
    </>
  )
}

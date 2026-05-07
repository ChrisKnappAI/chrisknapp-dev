'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Home() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = 0, H = 0, animId = null, twTimer = null
    const mouse = { x: -9999, y: -9999 }

    function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const onMove = e => { mouse.x = e.clientX; mouse.y = e.clientY }
    document.addEventListener('mousemove', onMove)

    class Particle {
      constructor() { this.init() }
      init() {
        this.x = Math.random() * W; this.y = Math.random() * H
        this.vx = (Math.random() - 0.5) * 0.45; this.vy = (Math.random() - 0.5) * 0.45
        this.r = Math.random() * 1.5 + 0.5; this.a = Math.random() * 0.25 + 0.15
      }
      update() {
        const dx = mouse.x - this.x, dy = mouse.y - this.y
        if (Math.hypot(dx, dy) < 140) { this.vx += dx * 0.00025; this.vy += dy * 0.00025 }
        this.vx *= 0.985; this.vy *= 0.985
        this.x += this.vx; this.y += this.vy
        if (this.x < 0) this.x = W; else if (this.x > W) this.x = 0
        if (this.y < 0) this.y = H; else if (this.y > H) this.y = 0
      }
    }

    const pts = Array.from({ length: 120 }, () => new Particle())

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

    const ZONE_R = 180
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
          if (d < 150) {
            const inf = Math.max(zoneInf(pts[i]), zoneInf(pts[j]))
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(59,130,246,${(1 - d / 150) * (0.08 + inf * 0.28)})`
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
        p.vx += (Math.random() - 0.5) * inf * 0.08
        p.vy += (Math.random() - 0.5) * inf * 0.08
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
      'visualizations customers screenshot',
      'strategy that moves the needle',
      'rigorous experimental designs',
    ]
    let wi = 0, ci = 0, deleting = false
    const twEl = document.getElementById('tw')
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

    // Stat counters
    function animateStats() {
      document.querySelectorAll('.ck-stat-num[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target, 10)
        const prefix = el.dataset.prefix || ''
        const suffix = el.dataset.suffix || ''
        const dur = 1600, start = performance.now()
        function step(now) {
          const pct = Math.min((now - start) / dur, 1)
          el.textContent = `${prefix}${Math.floor((1 - Math.pow(1 - pct, 3)) * target)}${suffix}`
          if (pct < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      })
    }
    const statsObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { animateStats(); statsObs.disconnect() }
    }, { threshold: 0.3 })
    const statsBar = document.querySelector('.ck-stats-bar')
    if (statsBar) statsObs.observe(statsBar)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', initZones)
      document.removeEventListener('mousemove', onMove)
      if (animId) cancelAnimationFrame(animId)
      if (twTimer) clearTimeout(twTimer)
      statsObs.disconnect()
    }
  }, [])

  return (
    <>
      <style>{`
        html, body { background:#0F172A !important; color:#F1F5F9; margin:0; padding:0; }
        .ck-page { position:relative; z-index:1; min-height:100vh; display:flex; flex-direction:column; }

        /* NAV */
        .ck-nav { position:sticky; top:0; z-index:500; display:flex; align-items:center; justify-content:space-between; padding:1.25rem 4rem; border-bottom:1px solid rgba(255,255,255,0.06); backdrop-filter:blur(12px); background:rgba(15,23,42,0.98); }
        .ck-logo { font-size:1.05rem; font-weight:800; color:#F1F5F9; text-decoration:none; letter-spacing:-0.02em; }
        .ck-logo span { color:#3B82F6; }
        .ck-nav-links { display:flex; align-items:center; gap:0.15rem; list-style:none; }
        .ck-nav-links a { color:#94A3B8; text-decoration:none; font-size:0.82rem; font-weight:500; padding:0.4rem 0.7rem; border-radius:6px; transition:color 0.15s, background 0.15s; white-space:nowrap; }
        .ck-nav-links a:hover { color:#F1F5F9; background:rgba(255,255,255,0.05); }
        .ck-nav-sep { width:1px; height:14px; background:rgba(255,255,255,0.1); margin:0 0.4rem; }
        .ck-nav-private { display:flex !important; align-items:center; gap:0.3rem; }
        .ck-nav-lock { font-size:0.65rem; opacity:0.5; }

        /* HERO GRID
           Columns: 50% | 15% | 1fr
           Text spans cols 1+2 = 65%
           Photo: position:absolute, left:50% right:4rem = always 15% overlap, equal side buffers
        */
        .ck-hero-grid { flex:1; display:grid; grid-template-columns:50% 15% 1fr; max-width:1200px; margin:0 auto; width:100%; padding:0 4rem; position:relative; overflow:visible; }

        .ck-hero-content { grid-column:1 / 3; grid-row:1; padding:5rem 0 4rem; position:relative; z-index:2; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; }

        .ck-hero-photo { position:absolute; left:50%; right:4rem; top:3rem; bottom:-80px; z-index:1; }
        .ck-hero-photo img { width:100%; height:100%; object-fit:cover; object-position:top center; filter:grayscale(100%) contrast(1.15) brightness(0.85); display:block; }

        /* BADGE */
        .ck-badge { display:inline-flex; align-items:center; gap:0.5rem; background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.22); color:#38BDF8; font-size:0.7rem; font-weight:700; padding:0.3rem 0.85rem; border-radius:100px; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:1.6rem; }
        .ck-badge-dot { width:5px; height:5px; background:#38BDF8; border-radius:50%; animation:ck-pulse 2s ease-in-out infinite; }
        @keyframes ck-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }

        .ck-greeting { font-size:clamp(1.1rem,2vw,1.4rem); font-weight:400; color:#94A3B8; margin-bottom:0.15rem; }
        .ck-name { font-size:clamp(3rem,6vw,4.75rem); font-weight:900; line-height:1; letter-spacing:-0.04em; margin-bottom:1rem; }
        .ck-name span { color:#3B82F6; }
        .ck-role { font-size:clamp(1.1rem,2vw,1.4rem); color:#94A3B8; font-weight:400; line-height:1.6; margin-bottom:0.4rem; white-space:nowrap; }
        .ck-tw-line { font-family:'Courier New',Courier,monospace; font-size:0.95rem; color:#3B82F6; margin-bottom:2.75rem; min-height:1.6em; white-space:nowrap; }
        .ck-tw-cursor { display:inline-block; width:2px; height:0.95em; background:#3B82F6; margin-left:1px; vertical-align:text-bottom; animation:ck-blink 0.75s step-end infinite; }
        @keyframes ck-blink { 50%{opacity:0} }

        .ck-buttons { display:flex; flex-wrap:wrap; gap:0.85rem; }
        .ck-btn { display:inline-flex; align-items:center; padding:0.7rem 1.4rem; border-radius:8px; font-size:0.875rem; font-weight:600; text-decoration:none; border:1px solid transparent; transition:transform 0.15s, background 0.15s, border-color 0.15s, box-shadow 0.15s; }
        .ck-btn:hover { transform:translateY(-2px); }
        .ck-btn-primary { background:#3B82F6; color:#fff; border-color:#3B82F6; box-shadow:0 4px 15px rgba(59,130,246,0.25); }
        .ck-btn-primary:hover { background:#2563EB; border-color:#2563EB; box-shadow:0 6px 20px rgba(59,130,246,0.35); }
        .ck-btn-outline { background:transparent; color:#F1F5F9; border-color:rgba(255,255,255,0.1); }
        .ck-btn-outline:hover { border-color:#3B82F6; color:#3B82F6; }

        /* STATS */
        .ck-stats-bar { border-top:1px solid rgba(255,255,255,0.06); background:#1E293B; position:relative; z-index:10; }
        .ck-stats-inner { max-width:1200px; margin:0 auto; padding:0 4rem; display:grid; grid-template-columns:repeat(4,1fr); }
        .ck-stat-item { padding:2.25rem 1.5rem; text-align:center; border-right:1px solid rgba(255,255,255,0.06); }
        .ck-stat-item:last-child { border-right:none; }
        .ck-stat-num { font-size:clamp(2rem,3vw,2.75rem); font-weight:900; letter-spacing:-0.04em; color:#3B82F6; line-height:1; margin-bottom:0.5rem; font-variant-numeric:tabular-nums; }
        .ck-stat-label { font-size:0.72rem; color:#94A3B8; font-weight:500; text-transform:uppercase; letter-spacing:0.08em; line-height:1.5; }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      <div className="ck-page">

        <nav className="ck-nav">
          <Link href="/" className="ck-logo">chris<span>knapp</span>.dev</Link>
          <ul className="ck-nav-links">
            <li><Link href="/resume">Resume</Link></li>
            <li><a href="#">Portfolio</a></li>
            <li><a href="mailto:ChrisKnappAI@Gmail.com">Contact</a></li>
            <li><div className="ck-nav-sep" /></li>
            <li>
              <Link href="/chris" className="ck-nav-private">
                <span className="ck-nav-lock">🔒</span> Chris&apos;s Dashboard
              </Link>
            </li>
            <li>
              <Link href="/natalie" className="ck-nav-private">
                <span className="ck-nav-lock">🔒</span> Natalie&apos;s Dashboard
              </Link>
            </li>
          </ul>
        </nav>

        <div className="ck-hero-grid">
          <div className="ck-hero-content">
            <div className="ck-badge">
              <div className="ck-badge-dot" />
              Strategy · Analytics · AI
            </div>
            <p className="ck-greeting">Hey, I&apos;m</p>
            <h1 className="ck-name">Chris <span>Knapp</span></h1>
            <p className="ck-role">A Strategy &amp; Analytics Leader at Progressive Insurance</p>
            <p className="ck-tw-line"># i build <span id="tw" /><span className="ck-tw-cursor" /></p>
            <div className="ck-buttons">
              <a href="mailto:ChrisKnappAI@Gmail.com" className="ck-btn ck-btn-primary">Contact Me</a>
              <Link href="/resume" className="ck-btn ck-btn-outline">My Resume</Link>
              <a href="#" className="ck-btn ck-btn-outline">Explore Portfolio &nbsp;→</a>
            </div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="ck-hero-photo">
            <img src="https://randomuser.me/api/portraits/men/44.jpg" alt="Chris Knapp" />
          </div>
        </div>

        <div className="ck-stats-bar">
          <div className="ck-stats-inner">
            <div className="ck-stat-item">
              <div className="ck-stat-num" data-target="120" data-prefix="$" data-suffix="M+">$0M+</div>
              <div className="ck-stat-label">Profit from Strategy<br />&amp; Analytics Projects</div>
            </div>
            <div className="ck-stat-item">
              <div className="ck-stat-num" data-target="170" data-prefix="" data-suffix="M+">0M+</div>
              <div className="ck-stat-label">Customers<br />Analyzed</div>
            </div>
            <div className="ck-stat-item">
              <div className="ck-stat-num" data-target="50" data-suffix="+">0+</div>
              <div className="ck-stat-label">Experimental Designs<br />Implemented</div>
            </div>
            <div className="ck-stat-item">
              <div className="ck-stat-num" data-target="16" data-suffix="+">0+</div>
              <div className="ck-stat-label">Years of<br />Experience</div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

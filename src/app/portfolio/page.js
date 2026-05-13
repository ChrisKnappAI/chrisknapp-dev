'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

function PennyPreview() {
  const unlocks = [
    { icon: '🐦', label: 'Fly Away',  done: true  },
    { icon: '🥚', label: 'Lay Egg',   done: true  },
    { icon: '💕', label: 'Hold Hands',done: true  },
    { icon: '🐶', label: 'Puppy',     done: false },
  ];
  return (
    <div style={{
      background: '#0B1120', borderRadius: 14, overflow: 'hidden',
      height: '100%', minHeight: 230, display: 'flex', flexDirection: 'column',
      userSelect: 'none', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      border: '2px solid rgba(29,78,216,0.4)',
    }}>

      {/* Toolbar */}
      <div style={{ background: 'rgba(29,78,216,0.92)', padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ background: 'white', borderRadius: 20, padding: '3px 9px', fontSize: 9.5, fontWeight: 700, color: '#1D4ED8' }}>📚 Topics</div>
        <div style={{ background: 'white', borderRadius: 20, padding: '3px 9px', fontSize: 9.5, fontWeight: 700, color: '#1D4ED8' }}>🌋 Volcano ▾</div>
        <div style={{ flex: 1 }} />
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '3px 8px', fontSize: 9, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 3 }}>
          🐶 Penny&apos;s Puppy
        </div>
        <div style={{ background: '#1D4ED8', border: '2px solid white', borderRadius: 20, padding: '2px 10px', fontSize: 9.5, fontWeight: 800, color: 'white' }}>Go</div>
      </div>

      {/* Scene */}
      <div style={{ flex: 1, background: 'linear-gradient(170deg,#1a0800 0%,#3d1200 60%,#1a0000 100%)', position: 'relative', padding: '10px 10px 6px', display: 'flex', gap: 8, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {/* Penny bubble */}
        <div style={{ background: 'white', borderRadius: '12px 12px 12px 3px', padding: '8px 10px', maxWidth: '58%', boxShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, color: '#EC4899', marginBottom: 3 }}>Nice work! Snakes have no legs! 🐍</div>
          <div style={{ width: 28, height: 1, background: '#E5E7EB', margin: '4px 0' }} />
          <div style={{ fontSize: 9.5, fontWeight: 800, color: '#1E2A38', lineHeight: 1.45 }}>Next: Which picture is the <span style={{ color: '#1D4ED8' }}>bread</span>?</div>
          <div style={{ fontSize: 8, color: '#A89A85', marginTop: 3 }}>tap for Spanish</div>
        </div>
        {/* Input */}
        <div style={{ background: 'rgba(240,244,255,0.92)', border: '1.5px solid #1D4ED8', borderRadius: '12px 12px 3px 12px', padding: '6px 9px', fontSize: 9, color: '#94A3B8', alignSelf: 'flex-start', whiteSpace: 'nowrap' }}>
          Type your answer…
        </div>
        {/* Lava streaks (decoration) */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 18, background: 'linear-gradient(to top, rgba(255,80,0,0.12), transparent)', pointerEvents: 'none' }} />
      </div>

      {/* Character bar */}
      <div style={{ background: 'rgba(0,0,0,0.45)', padding: '5px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 8.5, fontWeight: 800, color: '#F472B6', letterSpacing: '0.06em' }}>🐧 PENNY</div>
        <div style={{ display: 'flex', gap: 2.5 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ width: 4.5, height: 4.5, borderRadius: '50%', background: i < 15 ? '#34D399' : 'rgba(255,255,255,0.12)' }} />
          ))}
        </div>
        <div style={{ fontSize: 8.5, fontWeight: 800, color: '#C88B50', letterSpacing: '0.06em' }}>SANTIAGO 🧑</div>
      </div>

      {/* Unlock strip */}
      <div style={{ background: 'rgba(29,78,216,0.18)', borderTop: '1px solid rgba(29,78,216,0.28)', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ fontSize: 8, color: '#60A5FA', fontWeight: 700, whiteSpace: 'nowrap' }}>Unlocked:</div>
        {unlocks.map((u, i) => (
          <div key={i} title={u.label} style={{ fontSize: 12, opacity: u.done ? 1 : 0.28, filter: u.done ? 'none' : 'grayscale(1)' }}>{u.icon}</div>
        ))}
        <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.25)', marginLeft: 2, whiteSpace: 'nowrap' }}>5 more → 🐶</div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, animId = null;
    const mouse = { x: -9999, y: -9999 };

    function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    const onMove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    document.addEventListener('mousemove', onMove);

    class Particle {
      constructor() { this.init(); }
      init() {
        this.x = Math.random() * W; this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.45; this.vy = (Math.random() - 0.5) * 0.45;
        this.r = Math.random() * 1.5 + 0.5; this.a = Math.random() * 0.25 + 0.15;
      }
      update() {
        const dx = mouse.x - this.x, dy = mouse.y - this.y;
        if (Math.hypot(dx, dy) < 140) { this.vx += dx * 0.00025; this.vy += dy * 0.00025; }
        this.vx *= 0.985; this.vy *= 0.985;
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0) this.x = W; else if (this.x > W) this.x = 0;
        if (this.y < 0) this.y = H; else if (this.y > H) this.y = 0;
      }
    }
    const pts = Array.from({ length: 120 }, () => new Particle());

    const zones = [
      { x: 0, y: 0, vx: 0.4, vy: 0.3 }, { x: 0, y: 0, vx: -0.3, vy: 0.5 },
      { x: 0, y: 0, vx: 0.5, vy: -0.4 }, { x: 0, y: 0, vx: -0.45, vy: -0.35 },
    ];
    function initZones() {
      zones[0].x = W*0.2; zones[0].y = H*0.4;
      zones[1].x = W*0.6; zones[1].y = H*0.3;
      zones[2].x = W*0.8; zones[2].y = H*0.7;
      zones[3].x = W*0.4; zones[3].y = H*0.75;
    }
    initZones();
    window.addEventListener('resize', initZones);
    const ZONE_R = 180;

    function updateZones() { zones.forEach(z => { z.x += z.vx; z.y += z.vy; if (z.x < 0 || z.x > W) z.vx *= -1; if (z.y < 0 || z.y > H) z.vy *= -1; }); }
    function zoneInf(p) { let max = 0; zones.forEach(z => { const d = Math.hypot(p.x-z.x, p.y-z.y); if (d < ZONE_R) max = Math.max(max, 1-d/ZONE_R); }); return max; }
    function drawLines() {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i+1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x-pts[j].x, pts[i].y-pts[j].y);
          if (d < 150) {
            const inf = Math.max(zoneInf(pts[i]), zoneInf(pts[j]));
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${(1-d/150)*(0.08+inf*0.28)})`; ctx.lineWidth = 0.8+inf*0.6; ctx.stroke();
          }
        }
      }
    }
    function animate() {
      ctx.clearRect(0, 0, W, H); updateZones();
      pts.forEach(p => {
        const inf = zoneInf(p);
        p.vx += (Math.random()-0.5)*inf*0.08; p.vy += (Math.random()-0.5)*inf*0.08;
        p.update();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r+inf*1.5, 0, Math.PI*2);
        ctx.fillStyle = `rgba(59,130,246,${Math.min(p.a+inf*0.45, 0.85)})`; ctx.fill();
      });
      drawLines();
      animId = requestAnimationFrame(animate);
    }
    animate();

    // Scroll reveal
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('pf-visible'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('.pf-reveal').forEach(el => obs.observe(el));

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', initZones);
      document.removeEventListener('mousemove', onMove);
      if (animId) cancelAnimationFrame(animId);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        html, body { background: #0F172A !important; color: #F1F5F9; margin: 0; padding: 0; }

        /* ── Nav ── */
        .pf-nav { position: sticky; top: 0; z-index: 500; display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 4rem; border-bottom: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(12px); background: rgba(15,23,42,0.98); }
        .pf-logo { font-size: 1.05rem; font-weight: 800; color: #F1F5F9; text-decoration: none; letter-spacing: -0.02em; }
        .pf-logo span { color: #3B82F6; }
        .pf-nav-links { display: flex; align-items: center; gap: 0.15rem; list-style: none; margin: 0; padding: 0; }
        .pf-nav-links a { color: #94A3B8; text-decoration: none; font-size: 0.82rem; font-weight: 500; padding: 0.4rem 0.7rem; border-radius: 6px; transition: color 0.15s, background 0.15s; }
        .pf-nav-links a:hover, .pf-nav-links a.active { color: #F1F5F9; background: rgba(255,255,255,0.05); }
        .pf-nav-links a.active { color: #3B82F6; }
        .pf-nav-sep { width: 1px; height: 14px; background: rgba(255,255,255,0.1); margin: 0 0.4rem; }
        .pf-nav-private { display: flex !important; align-items: center; gap: 0.3rem; }
        .pf-nav-lock { font-size: 0.65rem; opacity: 0.5; }

        /* ── Hero ── */
        .pf-hero { max-width: 1200px; margin: 0 auto; padding: 4.5rem 4rem 2.5rem; position: relative; z-index: 1; }
        .pf-eyebrow { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.22); color: #38BDF8; font-size: 0.7rem; font-weight: 700; padding: 0.3rem 0.85rem; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.25rem; }
        .pf-eyebrow-dot { width: 5px; height: 5px; background: #38BDF8; border-radius: 50%; animation: pf-pulse 2s ease-in-out infinite; }
        @keyframes pf-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        .pf-hero h1 { font-size: clamp(2.5rem,5vw,3.75rem); font-weight: 900; letter-spacing: -0.04em; margin: 0 0 0.75rem; line-height: 1; }
        .pf-hero h1 span { color: #3B82F6; }
        .pf-hero p { font-size: 1.05rem; color: #64748B; max-width: 520px; line-height: 1.7; margin: 0; }
        .pf-divider { max-width: 1200px; margin: 0 auto; padding: 0 4rem; }
        .pf-divider hr { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 0; }

        /* ── Grid ── */
        .pf-grid { max-width: 1200px; margin: 0 auto; padding: 2.5rem 4rem 6rem; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; position: relative; z-index: 1; }

        /* ── Cards ── */
        .pf-card {
          background: rgba(30,41,59,0.7);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          backdrop-filter: blur(8px);
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .pf-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 60% 0%, rgba(59,130,246,0.07) 0%, transparent 65%);
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          border-radius: inherit;
        }
        .pf-card:hover { border-color: rgba(59,130,246,0.45); box-shadow: 0 0 0 1px rgba(59,130,246,0.15), 0 24px 48px rgba(0,0,0,0.35), 0 0 80px rgba(59,130,246,0.07); transform: translateY(-4px); }
        .pf-card:hover::after { opacity: 1; }

        .pf-card-featured { grid-column: span 2; flex-direction: row; gap: 36px; align-items: stretch; }
        .pf-card-featured .pf-card-body { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .pf-card-featured .pf-card-preview { flex: 0 0 280px; }

        .pf-card-locked { border-style: dashed; border-color: rgba(255,255,255,0.05); cursor: default; opacity: 0.55; }
        .pf-card-locked:hover { transform: none; box-shadow: none; border-color: rgba(255,255,255,0.05); }
        .pf-card-locked::after { display: none; }

        /* ── Card internals ── */
        .pf-card-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .pf-badge { display: inline-flex; align-items: center; gap: 5px; padding: 0.25rem 0.7rem; border-radius: 100px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
        .pf-badge-personal { background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.25); color: #34D399; }
        .pf-badge-private  { background: rgba(148,163,184,0.08); border: 1px solid rgba(148,163,184,0.18); color: #64748B; }
        .pf-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
        .pf-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .pf-tag { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); color: #60A5FA; font-size: 0.67rem; font-weight: 600; padding: 0.2rem 0.6rem; border-radius: 6px; letter-spacing: 0.02em; }
        .pf-tag-muted { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.06); color: #475569; }

        .pf-card-title { font-size: 1.35rem; font-weight: 800; letter-spacing: -0.025em; color: #F1F5F9; margin: 4px 0 0; line-height: 1.25; }
        .pf-card-desc { font-size: 0.875rem; color: #94A3B8; line-height: 1.75; margin-top: 10px; flex: 1; }
        .pf-card-cta { display: inline-flex; align-items: center; gap: 6px; color: #3B82F6; font-size: 0.82rem; font-weight: 700; margin-top: 20px; letter-spacing: 0.01em; transition: gap 0.2s ease; }
        .pf-card:hover .pf-card-cta { gap: 10px; }
        .pf-card-cta-arrow { font-size: 1rem; line-height: 1; }

        .pf-card-lock-icon { font-size: 2rem; margin-bottom: 8px; }
        .pf-card-lock-title { font-size: 1.05rem; font-weight: 700; color: #475569; }
        .pf-card-lock-desc { font-size: 0.82rem; color: #334155; margin-top: 6px; line-height: 1.6; }

        /* ── Scroll reveal ── */
        .pf-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease; }
        .pf-reveal.pf-visible { opacity: 1; transform: translateY(0); }
        .pf-reveal:nth-child(2) { transition-delay: 0.1s; }
        .pf-reveal:nth-child(3) { transition-delay: 0.2s; }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .pf-nav { padding: 1rem 1.5rem; }
          .pf-hero { padding: 2.5rem 1.5rem 1.5rem; }
          .pf-divider { padding: 0 1.5rem; }
          .pf-grid { padding: 2rem 1.5rem 4rem; grid-template-columns: 1fr; gap: 14px; }
          .pf-card-featured { flex-direction: column; }
          .pf-card-featured .pf-card-preview { flex: 0 0 auto; }
        }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      {/* Nav */}
      <nav className="pf-nav">
        <Link href="/" className="pf-logo">chris<span>knapp</span>.dev</Link>
        <ul className="pf-nav-links">
          <li><Link href="/resume">Resume</Link></li>
          <li><Link href="/portfolio" className="active">Portfolio</Link></li>
          <li><a href="mailto:ChrisKnappAI@Gmail.com">Contact</a></li>
          <li><div className="pf-nav-sep" /></li>
          <li>
            <Link href="/chris" className="pf-nav-private">
              <span className="pf-nav-lock">🔒</span> Chris&apos;s Dashboard
            </Link>
          </li>
          <li>
            <Link href="/natalie" className="pf-nav-private">
              <span className="pf-nav-lock">🔒</span> Natalie&apos;s Dashboard
            </Link>
          </li>
        </ul>
      </nav>

      {/* Hero */}
      <div className="pf-hero">
        <div className="pf-eyebrow"><div className="pf-eyebrow-dot" />Selected Work</div>
        <h1>My <span>Portfolio</span></h1>
        <p>A growing collection of projects built at the intersection of data, AI, and product — from personal tools to production apps.</p>
      </div>
      <div className="pf-divider"><hr /></div>

      {/* Grid */}
      <div className="pf-grid">

        {/* ── Santiago Learns English — Featured ── */}
        <Link href="/santiago-learns-english" className="pf-card pf-card-featured pf-reveal">
          <div className="pf-card-body">
            <div>
              <div className="pf-card-top">
                <span className="pf-badge pf-badge-personal"><span className="pf-badge-dot" />Personal Project</span>
                <div className="pf-tags">
                  <span className="pf-tag">Claude API</span>
                  <span className="pf-tag">Supabase</span>
                  <span className="pf-tag">Web Speech API</span>
                  <span className="pf-tag">Next.js</span>
                  <span className="pf-tag">Vercel</span>
                </div>
              </div>
              <div className="pf-card-title">Santiago Learns English</div>
              <p className="pf-card-desc">
                A bilingual English-learning app for an 8-year-old, built around Penny — an AI-powered penguin chatbot running on Claude. Penny asks questions, grades spoken and typed answers using the LLM, and reads everything aloud via the Web Speech API. As Santiago earns correct answers, he unlocks special animations (a flying escape, egg-hatching, hand-holding, and a visiting puppy) — a progression system controlled by a parent admin dashboard. Seven animated scene backgrounds, three question types, and 18+ lesson topics, all stored in Supabase with real-time sync.
              </p>
            </div>
            <div className="pf-card-cta">Open App <span className="pf-card-cta-arrow">→</span></div>
          </div>
          <div className="pf-card-preview">
            <PennyPreview />
          </div>
        </Link>

        {/* ── Placeholder 1 ── */}
        <div className="pf-card pf-card-locked pf-reveal">
          <div>
            <div className="pf-card-top">
              <span className="pf-badge pf-badge-private"><span className="pf-badge-dot" />Professional</span>
              <div className="pf-tags">
                <span className="pf-tag pf-tag-muted">Python</span>
                <span className="pf-tag pf-tag-muted">SQL</span>
                <span className="pf-tag pf-tag-muted">Tableau</span>
              </div>
            </div>
            <div className="pf-card-title" style={{ color: '#475569' }}>Progressive Insurance Analytics</div>
            <p className="pf-card-desc" style={{ color: '#334155' }}>
              Customer strategy and data analysis work — A/B experiments, retention modeling, and executive-facing dashboards driving nine-figure business outcomes. Details restricted.
            </p>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#334155', fontSize: '0.8rem', fontWeight: 600 }}>
            🔒 Private
          </div>
        </div>

        {/* ── Placeholder 2 ── */}
        <div className="pf-card pf-card-locked pf-reveal" style={{ alignItems: 'center', justifyContent: 'center', minHeight: 180, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 10 }}>+</div>
          <div className="pf-card-lock-title">Next Project</div>
          <div className="pf-card-lock-desc">More coming soon.</div>
        </div>

      </div>
    </>
  );
}

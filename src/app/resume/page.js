'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Resume() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = 0, H = 0, animId = null
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

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', initZones)
      document.removeEventListener('mousemove', onMove)
      if (animId) cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <>
      <style>{`
        html, body { background:#0F172A !important; color:#F1F5F9; margin:0; padding:0; }
        .rv-page { position:relative; z-index:1; min-height:100vh; display:flex; flex-direction:column; }

        /* NAV */
        .rv-nav {
          position:sticky; top:0; z-index:200;
          display:flex; align-items:center; justify-content:space-between;
          padding:1.25rem 4rem;
          border-bottom:1px solid rgba(255,255,255,0.06);
          backdrop-filter:blur(12px);
          background:rgba(15,23,42,0.8);
        }
        .rv-logo { font-size:1.05rem; font-weight:800; color:#F1F5F9; text-decoration:none; letter-spacing:-0.02em; }
        .rv-logo span { color:#3B82F6; }
        .rv-nav-links { display:flex; align-items:center; gap:0.15rem; list-style:none; }
        .rv-nav-links a { color:#94A3B8; text-decoration:none; font-size:0.82rem; font-weight:500; padding:0.4rem 0.7rem; border-radius:6px; transition:color 0.15s,background 0.15s; white-space:nowrap; }
        .rv-nav-links a:hover { color:#F1F5F9; background:rgba(255,255,255,0.05); }
        .rv-nav-links a.active { color:#3B82F6; }
        .rv-nav-sep { width:1px; height:14px; background:rgba(255,255,255,0.1); margin:0 0.4rem; }
        .rv-nav-private { display:flex !important; align-items:center; gap:0.3rem; }
        .rv-nav-lock { font-size:0.65rem; opacity:0.5; }

        /* BUTTONS */
        .rv-btn { display:inline-flex; align-items:center; gap:0.45rem; padding:0.7rem 1.4rem; border-radius:8px; font-size:0.875rem; font-weight:600; text-decoration:none; cursor:pointer; transition:transform 0.15s,background 0.15s,border-color 0.15s,color 0.15s,box-shadow 0.15s; border:1px solid transparent; letter-spacing:-0.01em; }
        .rv-btn:hover { transform:translateY(-2px); }
        .rv-btn-primary { background:#3B82F6; color:#fff; border-color:#3B82F6; box-shadow:0 4px 15px rgba(59,130,246,0.25); }
        .rv-btn-primary:hover { background:#2563EB; border-color:#2563EB; }
        .rv-btn-outline { background:transparent; color:#F1F5F9; border-color:rgba(255,255,255,0.1); }
        .rv-btn-outline:hover { border-color:#3B82F6; color:#3B82F6; }

        /* CONTENT */
        .rv-content { max-width:860px; margin:0 auto; padding:0 2rem 2rem; width:100%; }

        /* HERO */
        .rv-hero { border-bottom:1px solid rgba(255,255,255,0.06); background:linear-gradient(180deg,rgba(59,130,246,0.04) 0%,transparent 100%); padding:4rem 0 1.5rem; margin-bottom:3.5rem; }
        .rv-badge { display:inline-flex; align-items:center; gap:0.5rem; background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.2); color:#38BDF8; font-size:0.7rem; font-weight:700; padding:0.3rem 0.85rem; border-radius:100px; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:1.4rem; }
        .rv-name { font-size:clamp(2.5rem,5vw,3.75rem); font-weight:900; letter-spacing:-0.04em; line-height:1; margin-bottom:0.6rem; }
        .rv-name span { color:#3B82F6; }
        .rv-role { font-size:1rem; color:#94A3B8; margin-bottom:1.25rem; font-weight:400; }
        .rv-summary { font-size:0.95rem; line-height:1.75; color:#F1F5F9; opacity:0.75; max-width:680px; margin-bottom:2rem; }
        .rv-actions { display:flex; gap:0.85rem; flex-wrap:wrap; }

        /* SECTION TITLES */
        .rv-section-title { font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:#3B82F6; margin-bottom:1.75rem; display:flex; align-items:center; gap:0.85rem; }
        .rv-section-title::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.06); }

        /* EXPERIENCE */
        .rv-exp { margin-bottom:3.5rem; }
        .rv-company { margin-bottom:3rem; }
        .rv-co-header { display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem; }
        .rv-co-logo { width:40px; height:40px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1rem; font-weight:900; flex-shrink:0; border:1px solid rgba(255,255,255,0.1); }
        .rv-co-logo.pgr { background:rgba(59,130,246,0.15); color:#3B82F6; }
        .rv-co-name { font-size:1rem; font-weight:700; color:#F1F5F9; letter-spacing:-0.01em; }
        .rv-co-tenure { font-size:0.78rem; color:#94A3B8; margin-top:0.1rem; }
        .rv-role-group { border-left:2px solid rgba(255,255,255,0.1); padding-left:1.5rem; margin-bottom:1.75rem; position:relative; }
        .rv-role-group::before { content:''; position:absolute; left:-5px; top:6px; width:8px; height:8px; background:#3B82F6; border-radius:50%; border:2px solid #0F172A; }
        .rv-role-row { display:flex; align-items:baseline; justify-content:space-between; gap:1rem; margin-bottom:0.2rem; }
        .rv-role-row:first-child .rv-rtitle { font-size:0.95rem; font-weight:700; color:#F1F5F9; }
        .rv-role-row:not(:first-child) .rv-rtitle { font-size:0.85rem; font-weight:500; color:#94A3B8; }
        .rv-rdates { font-size:0.78rem; color:#475569; white-space:nowrap; flex-shrink:0; }
        .rv-role-row:first-child .rv-rdates { color:#94A3B8; }
        .rv-rteam { font-size:0.78rem; color:#475569; margin-bottom:0.85rem; font-style:italic; }
        .rv-bullets { list-style:none; display:flex; flex-direction:column; gap:0.55rem; }
        .rv-bullets li { font-size:0.875rem; line-height:1.65; color:#F1F5F9; opacity:0.8; padding-left:1rem; position:relative; }
        .rv-bullets li::before { content:'→'; position:absolute; left:0; color:#3B82F6; font-size:0.75rem; top:0.1em; opacity:0.7; }

        /* PRIOR */
        .rv-prior { background:#162032; border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:1.25rem 1.5rem; }
        .rv-prior-title { font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#475569; margin-bottom:1rem; }
        .rv-prior-rows { display:flex; flex-direction:column; gap:0.6rem; }
        .rv-prior-row { display:flex; align-items:center; justify-content:space-between; gap:1rem; }
        .rv-prior-left { display:flex; align-items:center; gap:0.75rem; }
        .rv-prior-role { font-size:0.85rem; font-weight:600; color:#F1F5F9; }
        .rv-prior-sep { color:#475569; font-size:0.75rem; }
        .rv-prior-company { font-size:0.82rem; color:#94A3B8; }
        .rv-prior-dates { font-size:0.75rem; color:#475569; white-space:nowrap; }

        /* SKILLS */
        .rv-skills { margin-bottom:3.5rem; }
        .rv-skills-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; }
        .rv-skill-group { background:#1E293B; border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:1.25rem; }
        .rv-skill-label { font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#94A3B8; margin-bottom:0.85rem; }
        .rv-tags { display:flex; flex-wrap:wrap; gap:0.4rem; }
        .rv-tag { font-size:0.75rem; font-weight:500; padding:0.3rem 0.7rem; border-radius:6px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.06); color:#94A3B8; }
        .rv-tag.blue { background:rgba(59,130,246,0.1); border-color:rgba(59,130,246,0.2); color:#38BDF8; }

        /* EDUCATION */
        .rv-edu { margin-bottom:3.5rem; }
        .rv-edu-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
        .rv-edu-item { background:#1E293B; border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:1.1rem 1.25rem; position:relative; overflow:hidden; }
        .rv-edu-item::before { content:''; position:absolute; top:0;left:0;right:0; height:2px; background:linear-gradient(90deg,#3B82F6,transparent); }
        .rv-edu-item.cert::before { background:linear-gradient(90deg,#EA580C,transparent); }
        .rv-edu-degree { font-size:0.875rem; font-weight:700; color:#F1F5F9; margin-bottom:0.25rem; line-height:1.3; }
        .rv-edu-school { font-size:0.8rem; color:#94A3B8; margin-bottom:0.25rem; }
        .rv-edu-meta { font-size:0.72rem; color:#475569; }

        /* FOOTER */
        .rv-footer { border-top:1px solid rgba(255,255,255,0.06); padding:2.5rem 0; margin-top:auto; }
        .rv-footer-inner { max-width:860px; margin:0 auto; padding:0 2rem; display:flex; align-items:center; justify-content:space-between; }
        .rv-footer-actions { display:flex; gap:0.85rem; }
        .rv-footer-brand { font-size:0.82rem; color:#475569; }
        .rv-footer-brand span { color:#3B82F6; }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      <div className="rv-page">

        {/* NAV */}
        <nav className="rv-nav">
          <Link href="/" className="rv-logo">chris<span>knapp</span>.dev</Link>
          <ul className="rv-nav-links">
            <li><a href="/resume" className="active">Resume</a></li>
            <li><a href="#">Portfolio</a></li>
            <li><a href="mailto:ChrisKnappAI@Gmail.com">Contact</a></li>
            <li><div className="rv-nav-sep" /></li>
            <li>
              <Link href="/chris" className="rv-nav-private">
                <span className="rv-nav-lock">🔒</span> Chris&apos;s Dashboard
              </Link>
            </li>
            <li>
              <Link href="/natalie" className="rv-nav-private">
                <span className="rv-nav-lock">🔒</span> Natalie&apos;s Dashboard
              </Link>
            </li>
          </ul>
        </nav>

        {/* HERO */}
        <div className="rv-hero">
          <div className="rv-content">
            <div className="rv-badge">Customer Strategy &amp; Analytics Leader</div>
            <h1 className="rv-name">Chris <span>Knapp</span></h1>
            <p className="rv-role">Manager, Customer Strategy · Progressive Insurance · Daytona Beach, FL</p>
            <p className="rv-summary">
              Strategic analytics leader with 14+ years at Progressive Insurance. Delivered $120M+ in annual
              profit through customer strategy and analytics. Expert in experimental design, predictive modeling,
              and AI-forward analytics. Proven people leader across Customer Experience and Claims Control.
            </p>
            <div className="rv-actions">
              <a href="/Chris Knapp Resume 20260219.pdf" download className="rv-btn rv-btn-primary">Download PDF</a>
              <a href="https://linkedin.com/in/chrisknappfl/" target="_blank" rel="noreferrer" className="rv-btn rv-btn-outline">LinkedIn &nbsp;→</a>
            </div>
          </div>
        </div>

        <div className="rv-content">

          {/* EXPERIENCE */}
          <div className="rv-exp">
            <h2 className="rv-section-title">Experience</h2>

            <div className="rv-company">
              <div className="rv-co-header">
                <div className="rv-co-logo pgr">P</div>
                <div>
                  <div className="rv-co-name">Progressive Insurance</div>
                  <div className="rv-co-tenure">Aug 2012 – Present &nbsp;·&nbsp; 14 years</div>
                </div>
              </div>

              {/* CXJ roles */}
              <div className="rv-role-group">
                <div>
                  <div className="rv-role-row"><span className="rv-rtitle">Manager, Customer Strategy</span><span className="rv-rdates">Jan 2026 – Present</span></div>
                  <div className="rv-role-row"><span className="rv-rtitle">Manager, Data Analysis</span><span className="rv-rdates">Mar 2024 – Jan 2026</span></div>
                  <div className="rv-role-row"><span className="rv-rtitle">Assoc Manager, Data Analysis</span><span className="rv-rdates">Jun 2023 – Mar 2024</span></div>
                </div>
                <div className="rv-rteam">CRM Customer Experience - Journeys Team</div>
                <ul className="rv-bullets">
                  <li>Delivered $60M in annual profit through customer outreach strategy, retaining 40,000+ additional policies annually</li>
                  <li>Pioneered AI analytics initiative forecasted to generate $15M in additional annual profit</li>
                  <li>Influenced leadership to doubled outbound call staffing, retaining 23,000+ additional policies</li>
                  <li>Recognized as internal expert in statistical experimental design; shaped company-wide test governance methodology</li>
                  <li>Developed successful leaders and highly skilled individual contributors</li>
                </ul>
              </div>

              {/* Lead Marketing */}
              <div className="rv-role-group">
                <div>
                  <div className="rv-role-row"><span className="rv-rtitle">Lead Marketing Process Analyst</span><span className="rv-rdates">Feb 2018 – Jun 2023</span></div>
                </div>
                <div className="rv-rteam">CRM Customer Experience - Journeys Team</div>
                <ul className="rv-bullets">
                  <li>Redefined measurement methodology for outbound call programs, enabling new projects that drove significant policy retention</li>
                  <li>Collaborated with IT and Data Science on predictive models and customer targeting methodology</li>
                </ul>
              </div>

              {/* Claims Manager */}
              <div className="rv-role-group">
                <div>
                  <div className="rv-role-row"><span className="rv-rtitle">Assoc Manager, Data Analysis</span><span className="rv-rdates">Jan 2017 – Feb 2018</span></div>
                </div>
                <div className="rv-rteam">Claims Control · Subrogation and Liability Decision Team</div>
                <ul className="rv-bullets">
                  <li>Built comprehensive reporting suite (Tableau, Power BI, SSRS) using Python, R, SAS, and SQL</li>
                  <li>Key contributor to data governance initiative; certified three new metrics across Claims Control</li>
                </ul>
              </div>

              {/* Data Analysts */}
              <div className="rv-role-group">
                <div>
                  <div className="rv-role-row"><span className="rv-rtitle">Data Analyst IV</span><span className="rv-rdates">Oct 2015 – Jan 2017</span></div>
                  <div className="rv-role-row"><span className="rv-rtitle">Data Analyst III</span><span className="rv-rdates">Oct 2013 – Oct 2015</span></div>
                  <div className="rv-role-row"><span className="rv-rtitle">Data Analyst II</span><span className="rv-rdates">Aug 2012 – Oct 2013</span></div>
                </div>
                <div className="rv-rteam">Claims Control · Trend, BI, PIP, COLL &amp; Salvage Teams</div>
                <ul className="rv-bullets">
                  <li>Led trend analysis across six coverage lines; presented findings to PGR executive and Claims senior leadership</li>
                  <li>Managed COA retuning process across Claims IT, ISO vendor, and cross-functional stakeholders</li>
                  <li>Formally mentored interns, analysts, and consultants across Claims Control</li>
                </ul>
              </div>
            </div>

            {/* Prior */}
            <div className="rv-prior">
              <div className="rv-prior-title">Prior Experience</div>
              <div className="rv-prior-rows">
                <div className="rv-prior-row">
                  <div className="rv-prior-left"><span className="rv-prior-role">Business Intelligence Intern</span><span className="rv-prior-sep">·</span><span className="rv-prior-company">American Greetings</span></div>
                  <span className="rv-prior-dates">Jun – Aug 2012</span>
                </div>
                <div className="rv-prior-row">
                  <div className="rv-prior-left"><span className="rv-prior-role">Statistician Intern</span><span className="rv-prior-sep">·</span><span className="rv-prior-company">Bright Line Marketing</span></div>
                  <span className="rv-prior-dates">Jan – Jun 2012</span>
                </div>
                <div className="rv-prior-row">
                  <div className="rv-prior-left"><span className="rv-prior-role">Analytics Consultant</span><span className="rv-prior-sep">·</span><span className="rv-prior-company">Dotcom Parts</span></div>
                  <span className="rv-prior-dates">Aug 2010 – Jan 2012</span>
                </div>
              </div>
            </div>
          </div>

          {/* SKILLS */}
          <div className="rv-skills">
            <h2 className="rv-section-title">Skills &amp; Tools</h2>
            <div className="rv-skills-grid">
              <div className="rv-skill-group">
                <div className="rv-skill-label">Analytics &amp; Statistics</div>
                <div className="rv-tags">
                  {['Experimental Design','Predictive Modeling','Statistical Analysis','A/B Testing','Trend Analysis','Root Cause Analysis','GLM','Decision Trees','Clustering'].map(s => <span key={s} className="rv-tag">{s}</span>)}
                </div>
              </div>
              <div className="rv-skill-group">
                <div className="rv-skill-label">Tools &amp; Platforms</div>
                <div className="rv-tags">
                  {['SAS','SQL','Python','R','Tableau','Power BI','Excel','SSRS'].map(s => <span key={s} className="rv-tag">{s}</span>)}
                </div>
              </div>
              <div className="rv-skill-group">
                <div className="rv-skill-label">Leadership</div>
                <div className="rv-tags">
                  {['Team Development','Strategic Planning','Stakeholder Management','Data Storytelling','Cross-functional Leadership','Mentorship'].map(s => <span key={s} className="rv-tag">{s}</span>)}
                </div>
              </div>
              <div className="rv-skill-group">
                <div className="rv-skill-label">Emerging Tech</div>
                <div className="rv-tags">
                  {['AI / LLM Integration','Machine Learning','Claude API','Next.js','Supabase','Data Governance'].map(s => <span key={s} className="rv-tag blue">{s}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* EDUCATION */}
          <div className="rv-edu">
            <h2 className="rv-section-title">Education</h2>
            <div className="rv-edu-grid">
              <div className="rv-edu-item">
                <div className="rv-edu-degree">MS, Statistics</div>
                <div className="rv-edu-school">University of Akron</div>
                <div className="rv-edu-meta">2017 &nbsp;·&nbsp; GPA 3.9 / 4.0</div>
              </div>
              <div className="rv-edu-item">
                <div className="rv-edu-degree">BBA, Finance</div>
                <div className="rv-edu-school">Kent State University</div>
                <div className="rv-edu-meta">2012 &nbsp;·&nbsp; GPA 4.0 / 4.0</div>
              </div>
              <div className="rv-edu-item">
                <div className="rv-edu-degree">BS, Mathematics</div>
                <div className="rv-edu-school">Kent State University</div>
                <div className="rv-edu-meta">2012 &nbsp;·&nbsp; GPA 4.0 / 4.0</div>
              </div>
              <div className="rv-edu-item cert">
                <div className="rv-edu-degree">Executive Education for Managers</div>
                <div className="rv-edu-school">Progressive Insurance</div>
                <div className="rv-edu-meta">2025</div>
              </div>
              <div className="rv-edu-item cert">
                <div className="rv-edu-degree">Emotionally Intelligent Leader</div>
                <div className="rv-edu-school">Case Western University</div>
                <div className="rv-edu-meta">2017</div>
              </div>
              <div className="rv-edu-item cert">
                <div className="rv-edu-degree">Summer Mathematics Institute</div>
                <div className="rv-edu-school">Cornell University</div>
                <div className="rv-edu-meta">2009</div>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="rv-footer">
          <div className="rv-footer-inner">
            <div className="rv-footer-actions">
              <a href="/Chris Knapp Resume 20260219.pdf" download className="rv-btn rv-btn-primary">Download PDF Resume</a>
              <a href="https://linkedin.com/in/chrisknappfl/" target="_blank" rel="noreferrer" className="rv-btn rv-btn-outline">View LinkedIn &nbsp;→</a>
            </div>
            <div className="rv-footer-brand">chris<span>knapp</span>.dev</div>
          </div>
        </div>

      </div>
    </>
  )
}

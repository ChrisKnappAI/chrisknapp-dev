'use client';

const SKIN  = '#C88B50';
const HAIR  = '#1A1208';
const HAIR2 = '#2D1F0E';
const PANTS = '#1565C0';
const SHOE  = '#1A1208';
const SHIRT = '#E53935';

/* ── Shared body — taller, slimmer, no red-V chin ──────────────────────────── */
function Santiago({ hair, label, num }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: '16px 12px',
        border: '2.5px solid #E5E7EB', display: 'inline-block',
        boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
      }}>
        <svg viewBox="0 0 180 340" style={{ width: 120, height: 'auto', display: 'block', overflow: 'visible' }}
          xmlns="http://www.w3.org/2000/svg">

          {/* Shoes */}
          <ellipse cx="73" cy="314" rx="21" ry="10" fill={SHOE}/>
          <ellipse cx="107" cy="314" rx="21" ry="10" fill={SHOE}/>

          {/* Legs — longer than original */}
          <rect x="63" y="226" width="23" height="90" rx="11.5" fill={PANTS}/>
          <rect x="94" y="226" width="23" height="90" rx="11.5" fill={PANTS}/>

          {/* Left arm */}
          <path d="M52,160 C35,170 28,198 32,220 C34,230 45,232 52,224 C47,206 48,182 55,168Z" fill={SHIRT}/>
          <ellipse cx="34" cy="222" rx="12" ry="10" fill={SKIN} transform="rotate(-10 34 222)"/>

          {/* Right arm */}
          <path d="M128,160 C145,170 152,198 148,220 C146,230 135,232 128,224 C133,206 132,182 125,168Z" fill={SHIRT}/>
          <ellipse cx="146" cy="222" rx="12" ry="10" fill={SKIN} transform="rotate(10 146 222)"/>

          {/* Shirt — no V collar */}
          <rect x="52" y="140" width="76" height="88" rx="16" fill={SHIRT}/>

          {/* Neck */}
          <rect x="80" y="128" width="20" height="18" rx="9" fill={SKIN}/>

          {/* Head */}
          <circle cx="90" cy="78" r="52" fill={SKIN}/>

          {/* Hair — drawn over head, ears drawn after (on top) */}
          {hair}

          {/* Ears */}
          <circle cx="40" cy="80" r="11" fill={SKIN}/>
          <circle cx="140" cy="80" r="11" fill={SKIN}/>

          {/* Eyes */}
          <circle cx="74" cy="74" r="11" fill="white"/>
          <circle cx="74" cy="76" r="7.5" fill="#2C1A00"/>
          <circle cx="79" cy="71" r="2.5" fill="white"/>
          <circle cx="106" cy="74" r="11" fill="white"/>
          <circle cx="106" cy="76" r="7.5" fill="#2C1A00"/>
          <circle cx="111" cy="71" r="2.5" fill="white"/>

          {/* Eyebrows */}
          <path d="M64,60 Q74,55 84,59" fill="none" stroke={HAIR} strokeWidth="3" strokeLinecap="round"/>
          <path d="M96,59 Q106,55 116,60" fill="none" stroke={HAIR} strokeWidth="3" strokeLinecap="round"/>

          {/* Nose */}
          <ellipse cx="90" cy="90" rx="8" ry="5" fill="#A8703A" opacity="0.5"/>

          {/* Mouth */}
          <path d="M76,104 Q90,118 104,104" fill="none" stroke="#7A4010" strokeWidth="3.5" strokeLinecap="round"/>

          {/* Shirt number */}
          <text x="90" y="208" textAnchor="middle" fill="rgba(255,255,255,0.65)"
            fontSize="28" fontWeight="900" fontFamily="Arial">7</text>
        </svg>
      </div>
      <div style={{ marginTop: 10, fontWeight: 900, fontSize: 18, color: '#1D4ED8' }}>#{num}</div>
      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

/* ── 10 hair variants ───────────────────────────────────────────────────────── */

const variants = [

  // 1 — Classic Side Sweep
  { label: 'Side Sweep', hair: (
    <>
      <path d="M40,70 C40,36 56,16 90,14 C124,16 140,36 140,70 C126,54 108,44 90,48 C70,52 52,60 40,70Z" fill={HAIR}/>
      <path d="M62,48 C74,32 88,24 106,22 C118,20 130,26 138,42 C124,34 108,28 92,30 C78,32 64,42 56,52Z" fill={HAIR2} opacity="0.5"/>
      <path d="M52,50 C66,34 84,24 104,20" fill="none" stroke={HAIR2} strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
      <path d="M46,60 C60,46 76,34 98,26" fill="none" stroke={HAIR2} strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
    </>
  )},

  // 2 — Spiky (5 spikes)
  { label: 'Spiky', hair: (
    <>
      <path d="M40,72 C40,54 52,42 68,40 C76,40 84,40 90,40 C96,40 104,40 112,40 C128,42 140,54 140,72 C128,60 110,54 90,56 C70,58 52,62 40,72Z" fill={HAIR}/>
      <polygon points="59,42 65,10 71,42" fill={HAIR}/>
      <polygon points="73,40 79,6  85,40" fill={HAIR}/>
      <polygon points="87,38 90,2  93,38" fill={HAIR}/>
      <polygon points="95,40 101,8 107,40" fill={HAIR}/>
      <polygon points="109,42 115,14 121,42" fill={HAIR}/>
      <line x1="65" y1="12" x2="67" y2="26" stroke={HAIR2} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <line x1="79" y1="8"  x2="81" y2="22" stroke={HAIR2} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <line x1="90" y1="4"  x2="90" y2="18" stroke={HAIR2} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <line x1="101" y1="10" x2="103" y2="24" stroke={HAIR2} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    </>
  )},

  // 3 — Curly Natural
  { label: 'Curly Natural', hair: (
    <>
      <path d="M40,72 C40,52 44,40 52,32 C58,26 64,22 70,24 C70,16 78,10 86,12 C90,8 96,10 100,14 C106,10 114,14 120,22 C128,32 136,52 138,70 C124,56 108,50 90,52 C72,54 54,60 40,72Z" fill={HAIR}/>
      <ellipse cx="68" cy="22" rx="14" ry="12" fill={HAIR}/>
      <ellipse cx="90" cy="14" rx="14" ry="12" fill={HAIR}/>
      <ellipse cx="112" cy="22" rx="14" ry="12" fill={HAIR}/>
      <path d="M62,18 C66,12 72,10 76,14" fill="none" stroke={HAIR2} strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
      <path d="M85,10 C88,6  93,6  97,10" fill="none" stroke={HAIR2} strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
      <path d="M106,18 C110,12 116,10 120,14" fill="none" stroke={HAIR2} strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
    </>
  )},

  // 4 — Faux Hawk
  { label: 'Faux Hawk', hair: (
    <>
      <path d="M40,76 C40,64 44,56 50,52 C48,62 46,70 44,76Z" fill={HAIR} opacity="0.55"/>
      <path d="M140,76 C140,64 136,56 130,52 C132,62 134,70 136,76Z" fill={HAIR} opacity="0.55"/>
      <path d="M66,60 C68,42 76,26 90,14 C104,26 112,42 114,60 C110,50 102,44 90,44 C78,44 70,50 66,60Z" fill={HAIR}/>
      <path d="M83,28 C86,20 90,14 90,14 C90,14 94,20 97,28" fill="none" stroke={HAIR2} strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
      <path d="M78,46 C82,36 87,28 90,22" fill="none" stroke={HAIR2} strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
      <path d="M102,46 C98,36 93,28 90,22" fill="none" stroke={HAIR2} strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
    </>
  )},

  // 5 — Messy Tousled
  { label: 'Messy Tousled', hair: (
    <>
      <path d="M42,72 C38,50 44,30 56,20 C62,16 70,14 74,18 C72,8 78,4 86,6 C90,4 96,6 98,12 C104,8 114,12 120,22 C130,32 136,52 136,70 C122,54 106,46 90,48 C74,50 56,58 42,72Z" fill={HAIR}/>
      <path d="M56,22 C50,12 48,4 52,-2" fill="none" stroke={HAIR} strokeWidth="5" strokeLinecap="round"/>
      <path d="M74,16 C70,6  72,-2 77,-4" fill="none" stroke={HAIR} strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M90,6  C88,-2 90,-8 93,-4" fill="none" stroke={HAIR} strokeWidth="5" strokeLinecap="round"/>
      <path d="M118,22 C124,12 126,4 122,-2" fill="none" stroke={HAIR} strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M60,30 C66,20 74,14 82,12" fill="none" stroke={HAIR2} strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
    </>
  )},

  // 6 — Undercut Flop Left
  { label: 'Undercut', hair: (
    <>
      <path d="M40,76 C40,68 42,62 46,58 C44,64 42,72 40,76Z" fill={HAIR} opacity="0.4"/>
      <path d="M140,76 C140,68 138,62 134,58 C136,64 138,72 140,76Z" fill={HAIR} opacity="0.4"/>
      <path d="M56,50 C58,30 68,16 90,14 C110,14 122,26 128,40 C116,28 104,20 90,22 C74,24 62,36 58,50Z" fill={HAIR}/>
      <path d="M58,50 C50,42 42,34 44,24 C50,14 62,10 72,16 C66,20 58,30 56,44Z" fill={HAIR}/>
      <path d="M70,20 C78,16 88,16 98,20" fill="none" stroke={HAIR2} strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
      <path d="M62,32 C70,22 80,18 90,18" fill="none" stroke={HAIR2} strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
    </>
  )},

  // 7 — Natural Poof
  { label: 'Natural Poof', hair: (
    <>
      <circle cx="90" cy="50" r="36" fill={HAIR}/>
      <path d="M54,50 C44,56 40,66 40,78 C40,72 42,64 46,60 C48,56 50,54 54,52Z" fill={HAIR}/>
      <path d="M126,50 C136,56 140,66 140,78 C140,72 138,64 134,60 C132,56 130,54 126,52Z" fill={HAIR}/>
      <circle cx="72"  cy="36" r="7" fill={HAIR} stroke={HAIR2} strokeWidth="2" opacity="0.6"/>
      <circle cx="90"  cy="28" r="8" fill={HAIR} stroke={HAIR2} strokeWidth="2" opacity="0.6"/>
      <circle cx="108" cy="36" r="7" fill={HAIR} stroke={HAIR2} strokeWidth="2" opacity="0.6"/>
      <circle cx="80"  cy="47" r="6" fill={HAIR} stroke={HAIR2} strokeWidth="1.5" opacity="0.5"/>
      <circle cx="100" cy="47" r="6" fill={HAIR} stroke={HAIR2} strokeWidth="1.5" opacity="0.5"/>
    </>
  )},

  // 8 — Slick Back
  { label: 'Slick Back', hair: (
    <>
      <path d="M40,72 C40,44 52,24 68,16 C76,12 84,10 90,10 C96,10 104,12 112,16 C128,24 140,44 140,72 C128,58 114,50 90,52 C66,50 52,58 40,72Z" fill={HAIR}/>
      <path d="M64,18 C74,14 84,10 90,10" fill="none" stroke={HAIR2} strokeWidth="2.5" strokeLinecap="round" opacity="0.45"/>
      <path d="M58,28 C68,20 80,14 94,12" fill="none" stroke={HAIR2} strokeWidth="2.2" strokeLinecap="round" opacity="0.4"/>
      <path d="M52,42 C64,30 76,22 92,18" fill="none" stroke={HAIR2} strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
      <path d="M48,56 C60,42 74,32 90,26" fill="none" stroke={HAIR2} strokeWidth="1.8" strokeLinecap="round" opacity="0.3"/>
      <path d="M80,12 C86,10 92,10 98,12" fill="none" stroke="#3D2B1F" strokeWidth="3" strokeLinecap="round" opacity="0.28"/>
    </>
  )},

  // 9 — Textured Crop
  { label: 'Textured Crop', hair: (
    <>
      <path d="M40,72 C40,56 48,40 62,32 C70,28 80,26 90,26 C100,26 110,28 118,32 C132,40 140,56 140,72 C128,60 110,54 90,56 C70,58 52,62 40,72Z" fill={HAIR}/>
      <polygon points="61,34 66,22 71,34" fill={HAIR}/>
      <polygon points="74,30 79,17 84,30" fill={HAIR}/>
      <polygon points="87,28 90,15 93,28" fill={HAIR}/>
      <polygon points="96,30 101,18 106,30" fill={HAIR}/>
      <polygon points="109,34 114,24 119,34" fill={HAIR}/>
      <path d="M64,44 C74,38 82,34 90,34 C98,34 106,38 116,44" fill="none" stroke={HAIR2} strokeWidth="2" strokeLinecap="round" opacity="0.38"/>
    </>
  )},

  // 10 — Wild / Anime
  { label: 'Wild / Anime', hair: (
    <>
      <path d="M44,72 C42,50 48,30 60,20 C68,14 76,12 82,14 C82,6 87,2 92,4 C97,2 102,6 102,14 C108,10 120,14 126,24 C136,36 140,56 138,72 C124,56 108,48 90,50 C72,52 56,60 44,72Z" fill={HAIR}/>
      {/* Left spike going up-left */}
      <path d="M48,32 C42,16 30,4 24,-2 C36,4 46,16 50,30Z" fill={HAIR}/>
      {/* Center tall spike */}
      <path d="M84,14 C86,-2 90,-8 92,-4 C94,-8 94,-2 96,14Z" fill={HAIR}/>
      {/* Right spike going up-right */}
      <path d="M126,26 C136,12 150,2 156,-4 C150,8 140,20 130,34Z" fill={HAIR}/>
      {/* Front piece on forehead */}
      <path d="M72,44 C68,36 64,26 66,18 C68,14 72,14 74,18 C76,14 80,14 82,18 C82,28 78,38 74,44Z" fill={HAIR}/>
      <path d="M88,-4 C90,-8 92,-4" fill="none" stroke={HAIR2} strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
      <path d="M28,-2 C30,-6 34,-6 36,-2" fill="none" stroke={HAIR2} strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    </>
  )},

];

export default function SantiagoPreviewPage() {
  return (
    <div style={{
      minHeight: '100vh', background: '#EFF6FF',
      padding: '2rem 1.5rem',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        <h1 style={{
          textAlign: 'center', fontSize: 22, fontWeight: 900,
          color: '#1E2A38', marginBottom: 6, marginTop: 0,
        }}>
          Santiago — Pick a Style
        </h1>
        <p style={{
          textAlign: 'center', color: '#6B7280', marginBottom: 36,
          fontSize: 14, fontWeight: 500,
        }}>
          All 10 use the new taller, slimmer body. Pick a number.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 24,
        }}>
          {variants.map((v, i) => (
            <Santiago key={i} hair={v.hair} label={v.label} num={i + 1} />
          ))}
        </div>

      </div>
    </div>
  );
}

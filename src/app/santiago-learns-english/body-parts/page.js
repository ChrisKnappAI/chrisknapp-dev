'use client';

import { useEffect, useRef, useState } from 'react';

const HOTSPOTS = [
  { word: 'Hair',     x: 150, y: 106, ldir: 'right' },
  { word: 'Forehead', x: 150, y: 153, ldir: 'right' },
  { word: 'Eyebrow',  x:  98, y: 170, ldir: 'right' },
  { word: 'Eye',      x: 195, y: 191, ldir: 'right' },
  { word: 'Ear',      x:  33, y: 212, ldir: 'left'  },
  { word: 'Nose',     x: 150, y: 228, ldir: 'right' },
  { word: 'Cheek',    x: 221, y: 252, ldir: 'right' },
  { word: 'Mouth',    x: 150, y: 265, ldir: 'right' },
  { word: 'Chin',     x: 150, y: 318, ldir: 'right' },
  { word: 'Neck',     x: 150, y: 368, ldir: 'right' },
];

// SVG face dimensions — hotspot coordinates are relative to this
const SVG_W = 300;
const SVG_H = 440;

export default function BodyPartsPage() {
  const [active, setActive]     = useState(null); // word currently spoken
  const [labelPos, setLabelPos] = useState({});   // computed label positions
  const wrapperRef              = useRef(null);
  const labelRefs               = useRef({});
  const hideTimer               = useRef(null);

  // Compute label positions after mount
  useEffect(() => {
    const positions = {};
    HOTSPOTS.forEach(hs => {
      const el = labelRefs.current[hs.word];
      if (!el) return;
      const lw  = el.offsetWidth;
      const lh  = el.offsetHeight;
      const GAP = 13;
      positions[hs.word] = {
        top:  hs.y - lh / 2,
        left: hs.ldir === 'right' ? hs.x + GAP : hs.x - GAP - lw,
      };
    });
    setLabelPos(positions);
  }, []);

  function speak(hs) {
    if (typeof window === 'undefined') return;
    speechSynthesis.cancel();
    clearTimeout(hideTimer.current);

    setActive(hs.word);

    const utt   = new SpeechSynthesisUtterance(hs.word);
    utt.lang    = 'en-US';
    utt.rate    = 0.82;
    utt.pitch   = 1.05;
    speechSynthesis.speak(utt);

    utt.onend = () => {
      hideTimer.current = setTimeout(() => setActive(null), 900);
    };
  }

  return (
    <div style={{ padding: '36px 40px', maxWidth: 600 }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1D3A8A', letterSpacing: '-0.5px', marginBottom: 6 }}>
          🧍 Body Parts
        </h1>
        <p style={{ fontSize: 15, color: '#3B82F6', fontWeight: 500 }}>
          Tap any dot to hear the word!
        </p>
      </div>

      {/* Face + hotspots */}
      <div
        ref={wrapperRef}
        style={{
          position: 'relative',
          width:    SVG_W,
          height:   SVG_H,
          overflow: 'visible',
        }}
      >
        {/* SVG Face */}
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: SVG_W, height: SVG_H }}>
          <rect  x="124" y="337" width="52" height="76" rx="7" fill="#FDC89A"/>
          <line  x1="124" y1="342" x2="124" y2="413" stroke="#D4906A" strokeWidth="1" opacity="0.35"/>
          <line  x1="176" y1="342" x2="176" y2="413" stroke="#D4906A" strokeWidth="1" opacity="0.35"/>
          <ellipse cx="150" cy="210" rx="107" ry="127" fill="#FDC89A"/>
          <ellipse cx="150" cy="296" rx="76"  ry="44"  fill="#ECA878" opacity="0.22"/>
          <ellipse cx="43"  cy="212" rx="15"  ry="22"  fill="#FDC89A" stroke="#D4906A" strokeWidth="1.5"/>
          <ellipse cx="43"  cy="212" rx="8"   ry="14"  fill="#ECA878" opacity="0.55"/>
          <ellipse cx="257" cy="212" rx="15"  ry="22"  fill="#FDC89A" stroke="#D4906A" strokeWidth="1.5"/>
          <ellipse cx="257" cy="212" rx="8"   ry="14"  fill="#ECA878" opacity="0.55"/>
          <path d="M43 158 Q43 80 150 78 Q257 80 257 158 Q238 142 205 137 Q178 134 150 135 Q122 134 95 137 Q62 142 43 158 Z" fill="#2C1A0E"/>
          <path d="M43 158 Q40 172 42 190 Q45 175 50 164 Z" fill="#2C1A0E"/>
          <path d="M257 158 Q260 172 258 190 Q255 175 250 164 Z" fill="#2C1A0E"/>
          <path d="M80 174 Q100 163 124 168" stroke="#2C1A0E" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M176 168 Q200 163 220 174" stroke="#2C1A0E" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <ellipse cx="105" cy="191" rx="20" ry="14" fill="white"/>
          <circle  cx="105" cy="191" r="9.5"  fill="#5C3317"/>
          <circle  cx="105" cy="191" r="5"    fill="#0D0600"/>
          <circle  cx="109" cy="188" r="2.5"  fill="white"/>
          <path d="M85 186 Q105 175 125 186"  stroke="#2C1A0E" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M86 197 Q105 203 124 197"  stroke="#D4906A" strokeWidth="1"   fill="none" strokeLinecap="round" opacity="0.4"/>
          <ellipse cx="195" cy="191" rx="20" ry="14" fill="white"/>
          <circle  cx="195" cy="191" r="9.5"  fill="#5C3317"/>
          <circle  cx="195" cy="191" r="5"    fill="#0D0600"/>
          <circle  cx="199" cy="188" r="2.5"  fill="white"/>
          <path d="M175 186 Q195 175 215 186"  stroke="#2C1A0E" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M176 197 Q195 203 214 197"  stroke="#D4906A" strokeWidth="1"   fill="none" strokeLinecap="round" opacity="0.4"/>
          <path d="M143 207 L141 232" stroke="#D4906A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.45"/>
          <path d="M157 207 L159 232" stroke="#D4906A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.45"/>
          <ellipse cx="141" cy="233" rx="9" ry="6" fill="#ECA878" stroke="#C4805A" strokeWidth="1.2"/>
          <ellipse cx="159" cy="233" rx="9" ry="6" fill="#ECA878" stroke="#C4805A" strokeWidth="1.2"/>
          <ellipse cx="150" cy="231" rx="6" ry="4" fill="#ECA878" stroke="#C4805A" strokeWidth="1" opacity="0.7"/>
          <path d="M122 263 Q136 257 150 259 Q164 257 178 263" stroke="#C06050" strokeWidth="1.5" fill="#D47060" fillOpacity="0.65" strokeLinecap="round"/>
          <path d="M122 263 Q150 280 178 263" stroke="#C06050" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <path d="M136 270 Q150 274 164 270" stroke="rgba(255,200,180,0.35)" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <ellipse cx="80"  cy="252" rx="22" ry="14" fill="#F4A0A0" opacity="0.28"/>
          <ellipse cx="220" cy="252" rx="22" ry="14" fill="#F4A0A0" opacity="0.28"/>
        </svg>

        {/* Hotspot dots + labels */}
        {HOTSPOTS.map((hs, i) => {
          const isActive = active === hs.word;
          const pos      = labelPos[hs.word];
          return (
            <div key={hs.word}>
              {/* Dot */}
              <div
                onClick={() => speak(hs)}
                style={{
                  position:     'absolute',
                  left:          hs.x,
                  top:           hs.y,
                  width:         22,
                  height:        22,
                  borderRadius:  '50%',
                  background:    isActive ? '#FACC15' : '#1D4ED8',
                  border:        `2.5px solid ${isActive ? '#FDE047' : '#93C5FD'}`,
                  cursor:        'pointer',
                  transform:     `translate(-50%, -50%) scale(${isActive ? 1.6 : 1})`,
                  transition:    'transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease',
                  boxShadow:     isActive
                    ? '0 0 0 6px rgba(250,204,21,0.3)'
                    : '0 0 0 0 transparent',
                  animation:     isActive ? 'none' : `pulse 2.2s ease-out ${i * 0.24}s infinite`,
                  zIndex: 10,
                }}
              />

              {/* Label */}
              <div
                ref={el => labelRefs.current[hs.word] = el}
                style={{
                  position:   'absolute',
                  top:         pos ? pos.top  : hs.y,
                  left:        pos ? pos.left : hs.x,
                  background:  isActive ? '#1D4ED8' : '#1E3A5F',
                  color:       '#fff',
                  padding:     '5px 12px',
                  borderRadius: 6,
                  fontSize:    13,
                  fontWeight:  800,
                  whiteSpace:  'nowrap',
                  pointerEvents: 'none',
                  opacity:     isActive ? 1 : 0,
                  transition:  'opacity 0.15s ease',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  boxShadow:   '0 4px 14px rgba(0,0,0,0.2)',
                  zIndex: 20,
                }}
              >
                {hs.word}
              </div>
            </div>
          );
        })}
      </div>

      {/* Word display */}
      <div style={{
        marginTop:  28,
        height:     52,
        display:    'flex',
        alignItems: 'center',
        gap:        10,
      }}>
        {active && (
          <>
            <span style={{ fontSize: 28 }}>🔊</span>
            <span style={{
              fontSize:   32,
              fontWeight: 900,
              color:      '#1D4ED8',
              letterSpacing: '-0.5px',
            }}>
              {active}
            </span>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0   rgba(29,78,216,0.5); }
          100% { box-shadow: 0 0 0 12px rgba(29,78,216,0);  }
        }
      `}</style>
    </div>
  );
}

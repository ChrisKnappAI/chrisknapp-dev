'use client';

import { useState, useRef } from 'react';

// px/py = percentage of image width/height
// Label appears above the dot (below for dots near top of image)
// Positions are placeholders — will be updated after calibration tool
const HOTSPOTS = [
  // ── Front: Face ───────────────────────────────────────────────
  { id: 'hair',     word: 'Hair',     px: 22, py: 6  },
  { id: 'head',     word: 'Head',     px: 22, py: 18 },
  { id: 'forehead', word: 'Forehead', px: 22, py: 14 },
  { id: 'eyebrow',  word: 'Eyebrow',  px: 19, py: 19 },
  { id: 'eyelash',  word: 'Eyelash',  px: 26, py: 21 },
  { id: 'eye',      word: 'Eye',      px: 25, py: 22 },
  { id: 'ear',      word: 'Ear',      px: 13, py: 24 },
  { id: 'nose',     word: 'Nose',     px: 22, py: 27 },
  { id: 'cheek',    word: 'Cheek',    px: 17, py: 29 },
  { id: 'mouth',    word: 'Mouth',    px: 22, py: 32 },
  { id: 'lips',     word: 'Lips',     px: 50, py: 85 },
  { id: 'teeth',    word: 'Teeth',    px: 51, py: 88 },
  { id: 'tongue',   word: 'Tongue',   px: 52, py: 91 },
  { id: 'chin',     word: 'Chin',     px: 22, py: 36 },
  // ── Front: Body ───────────────────────────────────────────────
  { id: 'neck',     word: 'Neck',     px: 22, py: 41 },
  { id: 'shoulder', word: 'Shoulder', px: 7,  py: 46 },
  { id: 'chest',    word: 'Chest',    px: 22, py: 51 },
  { id: 'body',     word: 'Body',     px: 22, py: 57 },
  { id: 'arm',      word: 'Arm',      px: 5,  py: 55 },
  { id: 'elbow',    word: 'Elbow',    px: 4,  py: 63 },
  { id: 'stomach',  word: 'Stomach',  px: 22, py: 63 },
  { id: 'wrist',    word: 'Wrist',    px: 36, py: 65 },
  { id: 'hand',     word: 'Hand',     px: 39, py: 69 },
  { id: 'thumb',    word: 'Thumb',    px: 42, py: 67 },
  { id: 'finger',   word: 'Finger',   px: 43, py: 74 },
  { id: 'leg',      word: 'Leg',      px: 20, py: 76 },
  { id: 'knee',     word: 'Knee',     px: 19, py: 83 },
  { id: 'foot',     word: 'Foot',     px: 20, py: 96 },
  { id: 'toe',      word: 'Toe',      px: 21, py: 98 },
  // ── Back ──────────────────────────────────────────────────────
  { id: 'back',     word: 'Back',     px: 76, py: 52 },
  { id: 'butt',     word: 'Butt',     px: 76, py: 68 },
];

export default function BodyPartsPage() {
  const [active, setActive] = useState(null);
  const hideTimer           = useRef(null);

  function speak(hs) {
    if (typeof window === 'undefined') return;
    speechSynthesis.cancel();
    clearTimeout(hideTimer.current);
    setActive(hs.id);

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
    <div style={{ padding: '28px 32px' }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1D3A8A', letterSpacing: '-0.4px', marginBottom: 4 }}>
          🧍 Body Parts
        </h1>
        <p style={{ fontSize: 14, color: '#3B82F6', fontWeight: 600 }}>
          Tap a dot to hear the word!
        </p>
      </div>

      {/* Photo labels row */}
      <div style={{ display: 'flex', maxWidth: 500, marginBottom: 6 }}>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Front</div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Back</div>
      </div>

      {/* Image + hotspots */}
      <div style={{ position: 'relative', display: 'inline-block', maxWidth: 500, width: '100%' }}>
        {/* Photo */}
        <img
          src="/santiago-learns-english/body-parts/santiago-body-parts.png"
          alt="Santiago front and back"
          draggable={false}
          style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 12, userSelect: 'none' }}
        />

        {/* Hotspot dots */}
        {HOTSPOTS.map((hs, i) => {
          const isActive = active === hs.id;
          // Show label above dot; for dots near top of image, show below
          const labelAbove = hs.py > 12;

          return (
            <div key={hs.id}>
              {/* Dot */}
              <div
                onClick={() => speak(hs)}
                style={{
                  position:     'absolute',
                  left:         `${hs.px}%`,
                  top:          `${hs.py}%`,
                  width:         20,
                  height:        20,
                  borderRadius: '50%',
                  background:    isActive ? '#FACC15' : '#1D4ED8',
                  border:       `2.5px solid ${isActive ? '#FDE047' : '#93C5FD'}`,
                  cursor:       'pointer',
                  transform:    `translate(-50%, -50%) scale(${isActive ? 1.5 : 1})`,
                  transition:   'transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease',
                  boxShadow:     isActive ? '0 0 0 5px rgba(250,204,21,0.35)' : 'none',
                  animation:     isActive ? 'none' : `pulse 2.2s ease-out ${i * 0.18}s infinite`,
                  zIndex: 10,
                  touchAction: 'manipulation',
                }}
              />

              {/* Label */}
              {isActive && (
                <div style={{
                  position:      'absolute',
                  left:          `${hs.px}%`,
                  top:            labelAbove ? `calc(${hs.py}% - 32px)` : `calc(${hs.py}% + 18px)`,
                  transform:     'translateX(-50%)',
                  background:    '#1D4ED8',
                  color:         '#fff',
                  padding:       '5px 12px',
                  borderRadius:   6,
                  fontSize:       13,
                  fontWeight:     800,
                  whiteSpace:    'nowrap',
                  pointerEvents: 'none',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  boxShadow:     '0 4px 14px rgba(0,0,0,0.25)',
                  zIndex: 20,
                }}>
                  {hs.word}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Word display */}
      <div style={{ marginTop: 20, height: 48, display: 'flex', alignItems: 'center', gap: 10 }}>
        {active && (
          <>
            <span style={{ fontSize: 26 }}>🔊</span>
            <span style={{ fontSize: 30, fontWeight: 900, color: '#1D4ED8', letterSpacing: '-0.5px' }}>
              {HOTSPOTS.find(h => h.id === active)?.word}
            </span>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0   rgba(29,78,216,0.55); }
          100% { box-shadow: 0 0 0 10px rgba(29,78,216,0);   }
        }
      `}</style>
    </div>
  );
}

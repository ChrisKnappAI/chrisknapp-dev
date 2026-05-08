'use client';

import { useState, useRef } from 'react';

// px/py = percentage of image width/height
// Label appears above the dot (below for dots near top of image)
const HOTSPOTS = [
  { id: 'hair',     word: 'Hair',     px: 76.9, py: 5.9  },
  { id: 'head',     word: 'Head',     px: 63.4, py: 12.9 },
  { id: 'face',     word: 'Face',     px: 8.5,  py: 18.7 },
  { id: 'forehead', word: 'Forehead', px: 24.1, py: 14.6 },
  { id: 'eyebrow',  word: 'Eyebrow',  px: 45.2, py: 6.2  },
  { id: 'eyelash',  word: 'Eyelash',  px: 44.6, py: 11.3 },
  { id: 'eye',      word: 'Eye',      px: 41.6, py: 19.1 },
  { id: 'ear',      word: 'Ear',      px: 34.6, py: 22.8 },
  { id: 'nose',     word: 'Nose',     px: 25.3, py: 22.7 },
  { id: 'cheek',    word: 'Cheek',    px: 19.3, py: 23.5 },
  { id: 'mouth',    word: 'Mouth',    px: 86.3, py: 88.5 },
  { id: 'lips',     word: 'Lips',     px: 52.1, py: 95.6 },
  { id: 'teeth',    word: 'Teeth',    px: 53.3, py: 83.8 },
  { id: 'tongue',   word: 'Tongue',   px: 51.2, py: 90   },
  { id: 'chin',     word: 'Chin',     px: 25.3, py: 32.1 },
  { id: 'neck',     word: 'Neck',     px: 75.6, py: 24.3 },
  { id: 'shoulder', word: 'Shoulder', px: 38,   py: 32.3 },
  { id: 'chest',    word: 'Chest',    px: 21.7, py: 41.2 },
  { id: 'body',     word: 'Body',     px: 94.3, py: 68.9 },
  { id: 'arm',      word: 'Arm',      px: 55.3, py: 46.5 },
  { id: 'elbow',    word: 'Elbow',    px: 9.8,  py: 52.4 },
  { id: 'stomach',  word: 'Stomach',  px: 27.1, py: 55.1 },
  { id: 'wrist',    word: 'Wrist',    px: 48.6, py: 59.3 },
  { id: 'hand',     word: 'Hand',     px: 47.6, py: 66.4 },
  { id: 'thumb',    word: 'Thumb',    px: 48.8, py: 32.1 },
  { id: 'finger',   word: 'Finger',   px: 49.4, py: 37.1 },
  { id: 'leg',      word: 'Leg',      px: 9.7,  py: 72.6 },
  { id: 'knee',     word: 'Knee',     px: 20.5, py: 78.1 },
  { id: 'foot',     word: 'Foot',     px: 28.2, py: 94.2 },
  { id: 'toe',      word: 'Toe',      px: 9.5,  py: 95.4 },
  { id: 'back',     word: 'Back',     px: 71.7, py: 45.7 },
  { id: 'butt',     word: 'Butt',     px: 74.4, py: 60.7 },
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

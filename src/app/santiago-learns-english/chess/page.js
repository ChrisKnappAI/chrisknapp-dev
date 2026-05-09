'use client';

import { useState, useRef } from 'react';

const HOTSPOTS = [
  { id: 'move',        word: 'To Move',     es: 'Mover',              px: 5.1,  py: 8.6  },
  { id: 'winner',      word: 'Winner',      es: 'Ganador',            px: 15.4, py: 74.9 },
  { id: 'loser',       word: 'Loser',       es: 'Perdedor',           px: 72.7, py: 61   },
  { id: 'players',     word: 'Players',     es: 'Jugadores',          px: 90.7, py: 20.9 },
  { id: 'check',       word: 'Check',       es: 'Jaque',              px: 89.7, py: 33.6 },
  { id: 'check-mate',  word: 'Check Mate',  es: 'Jaque mate',         px: 89.7, py: 45.5 },
  { id: 'row',         word: 'Row',         es: 'Fila',               px: 90.7, py: 11.2 },
  { id: 'column',      word: 'Column',      es: 'Columna',            px: 54.1, py: 99.7 },
  { id: 'chess-board', word: 'Chess Board', es: 'Tablero de ajedrez', px: 49.7, py: 0    },
  { id: 'pieces',      word: 'Pieces',      es: 'Piezas',             px: 40.7, py: 63.2 },
  { id: 'forward',     word: 'Forward',     es: 'Adelante',           px: 36.9, py: 40.3 },
  { id: 'backward',    word: 'Backward',    es: 'Atrás',              px: 37.1, py: 58.9 },
  { id: 'left',        word: 'Left',        es: 'Izquierda',          px: 29.9, py: 49.6 },
  { id: 'right',       word: 'Right',       es: 'Derecha',            px: 44.4, py: 49.4 },
  { id: 'diagonal',    word: 'Diagonal',    es: 'Diagonal',           px: 44.4, py: 39.9 },
  { id: 'pawn',        word: 'Pawn',        es: 'Peón',               px: 29,   py: 28   },
  { id: 'knight',      word: 'Knight',      es: 'Caballo',            px: 29.1, py: 17   },
  { id: 'queen',       word: 'Queen',       es: 'Reina',              px: 45.7, py: 17   },
  { id: 'king',        word: 'King',        es: 'Rey',                px: 53.9, py: 17   },
  { id: 'rook',        word: 'Rook',        es: 'Torre',              px: 20.6, py: 17.2 },
  { id: 'bishop',      word: 'Bishop',      es: 'Alfil',              px: 37.1, py: 17   },
  { id: 'square',      word: 'Square',      es: 'Casilla',            px: 53.9, py: 55.6 },
];

export default function ChessPage() {
  const [active, setActive] = useState(null);
  const hideTimer           = useRef(null);

  function speak(hs) {
    if (typeof window === 'undefined') return;
    speechSynthesis.cancel();
    clearTimeout(hideTimer.current);
    setActive(hs.id);

    const utt = new SpeechSynthesisUtterance(hs.word);
    utt.lang  = 'en-US';
    utt.rate  = 0.82;
    utt.pitch = 1.05;
    speechSynthesis.speak(utt);

    utt.onend = () => {
      hideTimer.current = setTimeout(() => setActive(null), 900);
    };
  }

  return (
    <div style={{ padding: '14px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 10 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1D3A8A', letterSpacing: '-0.4px' }}>
          ♟ Chess
        </h1>
      </div>

      {/* Image + hotspots */}
      <div style={{ position: 'relative', display: 'inline-block', maxWidth: 700, width: '100%' }}>
        <img
          src="/santiago-learns-english/chess/santiago-learns-spanish-chess-vocab.png"
          alt="Chess vocabulary"
          draggable={false}
          style={{
            display: 'block', width: '100%', height: 'auto', userSelect: 'none',
            maxHeight: 'calc(100vh - 220px)', objectFit: 'contain',
          }}
        />

        {HOTSPOTS.map((hs, i) => {
          const isActive = active === hs.id;
          return (
            <div
              key={hs.id}
              onClick={() => speak(hs)}
              style={{
                position:     'absolute',
                left:         `${hs.px}%`,
                top:          `${hs.py}%`,
                width:         22,
                height:        22,
                borderRadius: '50%',
                background:    isActive ? '#FACC15' : '#1D4ED8',
                border:       `2.5px solid ${isActive ? '#FDE047' : '#93C5FD'}`,
                cursor:       'pointer',
                transform:    'translate(-50%, -50%)',
                transition:   'background 0.15s ease, border-color 0.15s ease',
                animation:     isActive ? 'none' : `pulse 2.2s ease-out ${i * 0.18}s infinite`,
                zIndex:        10,
                touchAction:  'manipulation',
              }}
            />
          );
        })}
      </div>

      {/* Word display */}
      <div style={{ maxWidth: 700, width: '100%', marginTop: 20, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        {active && (() => {
          const hs = HOTSPOTS.find(h => h.id === active);
          return (
            <>
              <span style={{ fontSize: 28 }}>🔊</span>
              <span style={{ fontSize: 34, fontWeight: 900, color: '#1D4ED8', letterSpacing: '-0.5px' }}>
                {hs.word}
              </span>
              <span style={{ fontSize: 22, fontWeight: 600, color: '#64748B' }}>
                ({hs.es})
              </span>
            </>
          );
        })()}
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

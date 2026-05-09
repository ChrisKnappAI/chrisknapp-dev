'use client';

import { useState, useRef } from 'react';

const VOCAB = [
  { word: 'Move',        es: 'Movimiento'         },
  { word: 'Winner',      es: 'Ganador'            },
  { word: 'Loser',       es: 'Perdedor'           },
  { word: 'Players',     es: 'Jugadores'          },
  { word: 'Check',       es: 'Jaque'              },
  { word: 'Check Mate',  es: 'Jaque mate'         },
  { word: 'Row',         es: 'Fila'               },
  { word: 'Column',      es: 'Columna'            },
  { word: 'Chess Board', es: 'Tablero de ajedrez' },
  { word: 'Pieces',      es: 'Piezas'             },
  { word: 'Forward',     es: 'Adelante'           },
  { word: 'Backward',    es: 'Atrás'              },
  { word: 'Left',        es: 'Izquierda'          },
  { word: 'Right',       es: 'Derecha'            },
  { word: 'Diagonal',    es: 'Diagonal'           },
  { word: 'Pawn',        es: 'Peón'               },
  { word: 'Knight',      es: 'Caballo'            },
  { word: 'Queen',       es: 'Reina'              },
  { word: 'King',        es: 'Rey'                },
  { word: 'Rook',        es: 'Torre'              },
  { word: 'Bishop',      es: 'Alfil'              },
  { word: 'Square',      es: 'Casilla'            },
];

export default function ChessSetup() {
  const [placements, setPlacements] = useState([]);
  const [current, setCurrent]       = useState(0);
  const [copied, setCopied]         = useState(false);
  const imgRef                      = useRef(null);

  const done = current >= VOCAB.length;

  function handleClick(e) {
    if (done) return;
    const rect = imgRef.current.getBoundingClientRect();
    const px   = +((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const py   = +((e.clientY - rect.top)  / rect.height * 100).toFixed(1);

    setPlacements(prev => [...prev, { ...VOCAB[current], px, py }]);
    setCurrent(prev => prev + 1);
  }

  function undo() {
    if (placements.length === 0) return;
    setPlacements(prev => prev.slice(0, -1));
    setCurrent(prev => prev - 1);
    setCopied(false);
  }

  function reset() {
    setPlacements([]);
    setCurrent(0);
    setCopied(false);
  }

  const outputLines = placements.map(p => {
    const id = p.word.toLowerCase().replace(/\s+/g, '-');
    return `  { id: '${id}', word: '${p.word}', es: '${p.es}', px: ${p.px}, py: ${p.py} },`;
  }).join('\n');

  const outputText = `const HOTSPOTS = [\n${outputLines}\n];`;

  function copyToClipboard() {
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ padding: '16px 20px', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Status bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        {!done ? (
          <div style={{
            background: '#1D4ED8', color: 'white',
            padding: '8px 18px', borderRadius: 8,
            fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ opacity: 0.65, fontWeight: 400, fontSize: 13 }}>
              {current + 1}/{VOCAB.length}
            </span>
            Click on:
            <span style={{ color: '#FDE047' }}>{VOCAB[current].word}</span>
            <span style={{ opacity: 0.5, fontWeight: 400, fontSize: 13 }}>({VOCAB[current].es})</span>
          </div>
        ) : (
          <div style={{
            background: '#16A34A', color: 'white',
            padding: '8px 18px', borderRadius: 8, fontSize: 16, fontWeight: 700,
          }}>
            ✅ All 22 placed! Copy the code below.
          </div>
        )}

        <button
          onClick={undo}
          disabled={placements.length === 0}
          style={{
            padding: '8px 14px', borderRadius: 8, border: 'none',
            background: placements.length === 0 ? '#e5e7eb' : '#F59E0B',
            color: placements.length === 0 ? '#9ca3af' : '#1a1a1a',
            fontWeight: 700, fontSize: 13, cursor: placements.length === 0 ? 'default' : 'pointer',
          }}
        >
          ↩ Undo
        </button>

        <button
          onClick={reset}
          style={{
            padding: '8px 14px', borderRadius: 8, border: 'none',
            background: '#DC2626', color: 'white',
            fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>

      {/* Image */}
      <div style={{ position: 'relative', display: 'inline-block', maxWidth: 700, width: '100%' }}>
        <img
          ref={imgRef}
          src="/santiago-learns-english/chess/santiago-learns-spanish-chess-vocab.png"
          alt="Chess vocab"
          draggable={false}
          onClick={handleClick}
          style={{
            display: 'block', width: '100%', height: 'auto',
            cursor: done ? 'default' : 'crosshair',
            userSelect: 'none', borderRadius: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        />

        {/* Placed dots */}
        {placements.map((p, i) => (
          <div
            key={i}
            title={p.word}
            style={{
              position:  'absolute',
              left:      `${p.px}%`,
              top:       `${p.py}%`,
              transform: 'translate(-50%, -50%)',
              width:      24, height: 24,
              borderRadius: '50%',
              background: '#FACC15',
              border:    '2.5px solid #1D4ED8',
              display:   'flex', alignItems: 'center', justifyContent: 'center',
              fontSize:   9, fontWeight: 800, color: '#1D3A8A',
              pointerEvents: 'none',
            }}
          >
            {i + 1}
          </div>
        ))}

        {/* Next target hint */}
        {!done && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(29,78,216,0.9)', color: 'white',
            padding: '4px 10px', borderRadius: 20,
            fontSize: 12, fontWeight: 700, pointerEvents: 'none',
          }}>
            Next: {VOCAB[current].word}
          </div>
        )}
      </div>

      {/* Legend */}
      {placements.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {placements.map((p, i) => (
            <span key={i} style={{
              background: '#EFF6FF', border: '1px solid #BFDBFE',
              borderRadius: 20, padding: '2px 10px',
              fontSize: 11, fontWeight: 600, color: '#1D3A8A',
            }}>
              {i + 1}. {p.word}
            </span>
          ))}
        </div>
      )}

      {/* Code output */}
      {placements.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1D3A8A' }}>
              Hotspot array ({placements.length}/{VOCAB.length} placed)
            </span>
            <button
              onClick={copyToClipboard}
              style={{
                padding: '4px 12px', borderRadius: 6, border: 'none',
                background: copied ? '#16A34A' : '#1D4ED8',
                color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer',
              }}
            >
              {copied ? '✅ Copied!' : 'Copy'}
            </button>
          </div>
          <pre style={{
            background: '#1e1e1e', color: '#d4d4d4',
            padding: 14, borderRadius: 8, overflowX: 'auto',
            fontSize: 12, lineHeight: 1.6, margin: 0,
            maxHeight: 300, overflowY: 'auto',
          }}>
            {outputText}
          </pre>
        </div>
      )}
    </div>
  );
}

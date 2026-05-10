'use client';

/**
 * PennyBubble.js
 *
 * Penny's speech bubble — top-left of the scene frame.
 * Click/tap the bubble to toggle the Spanish translation.
 *
 * Props:
 *   english   string   — what Penny is saying
 *   spanish   string   — Spanish translation (shown on tap)
 *   loading   bool     — shows a thinking indicator while waiting for response
 */

import { useState, useEffect } from 'react';

export default function PennyBubble({ english, spanish, loading }) {
  const [showSpanish, setShowSpanish] = useState(false);

  // Reset translation toggle when a new message arrives
  useEffect(() => { setShowSpanish(false); }, [english]);

  return (
    <div
      className="bubble-in"
      onClick={() => spanish && setShowSpanish(s => !s)}
      style={{ position: 'relative', cursor: spanish ? 'pointer' : 'default' }}
      title={spanish ? 'Tap to see Spanish' : ''}
    >
      <div style={{
        background: 'white',
        border: '3px solid #111',
        borderRadius: 16,
        padding: '11px 15px',
        fontSize: 15,
        fontWeight: 700,
        color: showSpanish ? '#059669' : '#1D4ED8',
        lineHeight: 1.45,
        whiteSpace: 'pre-wrap',
        minWidth: 150,
        maxWidth: 240,
        transition: 'color 0.2s',
      }}>
        {loading
          ? <span style={{ opacity: 0.5 }}>🐧 ...</span>
          : showSpanish
            ? `🇵🇪 ${spanish}`
            : english
        }
        {spanish && !loading && (
          <div style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', marginTop: 4 }}>
            {showSpanish ? 'tap for English' : 'tap for Spanish'}
          </div>
        )}
      </div>

      {/* Bubble tail pointing down toward Penny */}
      <span style={{
        position: 'absolute', bottom: -17, left: 22,
        width: 0, height: 0,
        borderLeft: '13px solid transparent',
        borderRight: '13px solid transparent',
        borderTop: '17px solid #111',
        zIndex: 1,
      }}/>
      <span style={{
        position: 'absolute', bottom: -11, left: 25,
        width: 0, height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderTop: '14px solid white',
        zIndex: 2,
      }}/>
    </div>
  );
}

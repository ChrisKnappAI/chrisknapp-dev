'use client';

/**
 * SantiagoBubble.js
 *
 * Santiago's input area — top-right of the scene frame.
 * Text input + send button. Enter submits.
 *
 * Props:
 *   value      string               — controlled input value
 *   onChange   (val) => void
 *   onSubmit   () => void
 *   disabled   bool                 — true while waiting for Claude response
 */

export default function SantiagoBubble({ value, onChange, onSubmit, disabled }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        background: 'white',
        border: '3px solid #111',
        borderRadius: 16,
        padding: '10px 13px',
        display: 'flex',
        gap: 8,
        alignItems: 'flex-end',
        width: 320,
      }}>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value.slice(0, 50))}
          maxLength={50}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey && !disabled) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Type your answer here…"
          disabled={disabled}
          rows={2}
          autoFocus
          style={{
            border: 'none', fontSize: 15, fontWeight: 600, flex: 1,
            color: '#1e293b', background: 'transparent',
            fontFamily: 'inherit', resize: 'none', lineHeight: 1.45,
            outline: 'none',
          }}
        />
        <button
          onClick={onSubmit}
          disabled={disabled}
          style={{
            background:   disabled ? '#93C5FD' : '#1D4ED8',
            color:        'white',
            border:       'none',
            borderRadius: 10,
            padding:      '7px 13px',
            fontSize:     14,
            fontWeight:   800,
            cursor:       disabled ? 'default' : 'pointer',
            transition:   'background 0.15s',
            fontFamily:   'inherit',
            alignSelf:    'flex-end',
            flexShrink:   0,
          }}
        >
          ➤
        </button>
      </div>

      {/* Bubble tail pointing down toward Santiago */}
      <span style={{
        position: 'absolute', bottom: -17, right: 22,
        width: 0, height: 0,
        borderLeft: '13px solid transparent',
        borderRight: '13px solid transparent',
        borderTop: '17px solid #111',
        zIndex: 1,
      }}/>
      <span style={{
        position: 'absolute', bottom: -11, right: 25,
        width: 0, height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderTop: '14px solid white',
        zIndex: 2,
      }}/>
    </div>
  );
}

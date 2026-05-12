'use client';

import { useState } from 'react';
import PennyScene, {
  IDLE_ANIMS, CORRECT_ANIMS, WRONG_ANIM,
  ANIM_DURATIONS, SCENES,
} from '../chat-with-penny/_components/PennyScene.js';

// ── Add new animations here while developing them ────────────────────────────
// Once happy, move them into IDLE_ANIMS / CORRECT_ANIMS in PennyScene.js
const UNDER_TEST = [
  // e.g. 'spin', 'headbob'
];

const GROUPS = [
  { label: '😴 Idle Pool',       color: '#6B7280', anims: IDLE_ANIMS },
  { label: '✅ Correct',          color: '#16A34A', anims: CORRECT_ANIMS },
  { label: '❌ Wrong',            color: '#DC2626', anims: [WRONG_ANIM] },
  { label: '🏆 Unlockable',       color: '#D97706', anims: ['flyaway', 'layegg', 'holdhands'] },
  { label: '🧪 Under Test',       color: '#7C3AED', anims: UNDER_TEST },
];

const SCENE_LABELS = {
  outdoor:   '🌳 Outdoor',
  beach:     '🏖️ Beach',
  classroom: '🏫 Classroom',
  snowy:     '❄️ Snowy',
  city:      '🏙️ City',
};

export default function PennyTest() {
  const [commandAnim, setCommandAnim] = useState(null);
  const [activeAnim,  setActiveAnim]  = useState(null);
  const [scene,       setScene]       = useState('outdoor');

  function trigger(name) {
    setCommandAnim({ name, ts: Date.now() });
    setActiveAnim(name);
    const dur = ANIM_DURATIONS[name] ?? 3000;
    setTimeout(() => setActiveAnim(null), dur);
  }

  return (
    <div style={{
      padding: '20px 24px', background: '#EFF6FF',
      minHeight: '100vh', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#1D4ED8' }}>
          🐧 Penny Animation Lab
        </div>

        {/* Scene picker */}
        <select
          value={scene}
          onChange={e => setScene(e.target.value)}
          style={{
            border: '2px solid #1D4ED8', borderRadius: 20, padding: '5px 14px',
            fontSize: 13, fontWeight: 700, color: '#1D4ED8', background: 'white',
            fontFamily: 'inherit', cursor: 'pointer',
          }}
        >
          {SCENES.map(s => (
            <option key={s} value={s}>{SCENE_LABELS[s] ?? s}</option>
          ))}
        </select>

        {/* Active indicator */}
        <div style={{
          padding: '5px 16px', borderRadius: 20,
          background: activeAnim ? '#1D4ED8' : '#E5E7EB',
          color: activeAnim ? 'white' : '#9CA3AF',
          fontSize: 13, fontWeight: 700, transition: 'background 0.2s',
          minWidth: 160, textAlign: 'center',
        }}>
          {activeAnim
            ? `▶ ${activeAnim}  (${(ANIM_DURATIONS[activeAnim] ?? 3000) / 1000}s)`
            : 'idle'}
        </div>
      </div>

      {/* Penny scene */}
      <div style={{
        width: '100%', maxWidth: 880, aspectRatio: '880 / 400',
        position: 'relative', borderRadius: 20,
        border: '5px solid #1D4ED8',
        boxShadow: '0 8px 36px rgba(29,78,216,0.22)',
        overflow: 'visible', background: '#BFDBFE',
        marginBottom: 24,
      }}>
        <PennyScene commandAnim={commandAnim} isPaused={false} talking={false} scene={scene} />
      </div>

      {/* Animation buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 880 }}>
        {GROUPS.map(group => {
          if (group.anims.length === 0) return null;
          return (
            <div key={group.label}>
              <div style={{
                fontSize: 12, fontWeight: 800, color: group.color,
                letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8,
              }}>
                {group.label}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {group.anims.map(anim => {
                  const active = activeAnim === anim;
                  const dur    = ANIM_DURATIONS[anim];
                  return (
                    <button
                      key={anim}
                      onClick={() => trigger(anim)}
                      style={{
                        padding: '8px 20px',
                        background: active ? group.color : 'white',
                        color:      active ? 'white'      : group.color,
                        border:     `2px solid ${group.color}`,
                        borderRadius: 20, fontFamily: 'inherit',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        transition: 'background 0.15s, color 0.15s',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      {anim}
                      {dur && (
                        <span style={{ fontSize: 11, opacity: 0.65, fontWeight: 600 }}>
                          {dur / 1000}s
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Usage note */}
        <div style={{
          marginTop: 8, padding: '12px 18px', borderRadius: 12,
          background: 'white', border: '2px dashed #D1D5DB',
          fontSize: 12, color: '#6B7280', lineHeight: 1.6,
        }}>
          <strong style={{ color: '#374151' }}>Adding a new animation:</strong><br />
          1. Add the CSS keyframes + class to <code>PennyScene.js</code><br />
          2. Add the name + duration to <code>ANIM_DURATIONS</code> in PennyScene.js<br />
          3. Add the class logic to <code>pennyClass</code> in PennyScene.js<br />
          4. Add the name to <code>UNDER_TEST</code> at the top of this file to test it here<br />
          5. Once it looks good, move it into the right group in PennyScene.js and remove from UNDER_TEST
        </div>
      </div>

    </div>
  );
}

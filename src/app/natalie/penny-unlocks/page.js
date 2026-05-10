'use client';

import { useState, useEffect } from 'react';

const ANIMATIONS = [
  { id: 'flyaway',   label: 'Fly Away',   icon: '🐦', desc: 'Penny soars off the screen and flies back in' },
  { id: 'layegg',   label: 'Lay Egg',    icon: '🥚', desc: 'Penny lays an egg that hatches into a baby penguin' },
  { id: 'holdhands', label: 'Hold Hands', icon: '💕', desc: 'A friend penguin walks in and holds hands with Penny' },
];

export default function PennyUnlocksPage() {
  const [unlocks, setUnlocks] = useState({});
  const [saving,  setSaving]  = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/penny/unlocks')
      .then(r => r.json())
      .then(data => {
        const map = {};
        for (const row of data) map[row.animation_id] = row.unlocked;
        setUnlocks(map);
        setLoading(false);
      });
  }, []);

  async function toggle(id, current) {
    setSaving(s => ({ ...s, [id]: true }));
    await fetch('/api/penny/unlocks', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ animation_id: id, unlocked: !current }),
    });
    setUnlocks(u => ({ ...u, [id]: !current }));
    setSaving(s => ({ ...s, [id]: false }));
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1E2A38', marginBottom: '0.4rem' }}>
        Penny Special Animations
      </h1>
      <p style={{ color: '#A89A85', fontSize: '0.88rem', marginBottom: '2rem' }}>
        Unlock special animations as rewards for Santiago in the Chat with Penny app.
        Changes sync immediately.
      </p>

      {loading ? (
        <p style={{ color: '#C4B49E', fontSize: '0.9rem' }}>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {ANIMATIONS.map(anim => {
            const isUnlocked = !!unlocks[anim.id];
            const isSaving   = !!saving[anim.id];
            return (
              <div key={anim.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                background: isUnlocked ? '#F0FDF4' : 'white',
                border: `1.5px solid ${isUnlocked ? '#86EFAC' : 'var(--c-beige-border)'}`,
                borderRadius: 12,
                transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span style={{ fontSize: '1.6rem' }}>{anim.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E2A38' }}>
                      {anim.label}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#A89A85', marginTop: '0.15rem' }}>
                      {anim.desc}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggle(anim.id, isUnlocked)}
                  disabled={isSaving}
                  style={{
                    padding: '0.45rem 1.1rem',
                    borderRadius: 20,
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: isSaving ? 'default' : 'pointer',
                    fontFamily: 'inherit',
                    background: isUnlocked ? '#DCFCE7' : '#EDE9E4',
                    color:      isUnlocked ? '#166534' : '#A89A85',
                    opacity: isSaving ? 0.6 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  {isSaving ? '...' : isUnlocked ? 'Unlocked' : 'Locked'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

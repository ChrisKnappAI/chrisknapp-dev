'use client';

import { useState, useEffect } from 'react';

const ANIMATIONS = [
  { id: 'flyaway',    label: 'Fly Away',   icon: '🐦', desc: 'Penny soars off the screen and flies back in' },
  { id: 'layegg',    label: 'Lay Egg',     icon: '🥚', desc: 'Penny lays an egg that hatches into a baby penguin' },
  { id: 'holdhands', label: 'Hold Hands',    icon: '💕', desc: 'A friend penguin walks in and holds hands with Penny' },
  { id: 'puppy',     label: "Penny's Puppy", icon: '🐶', desc: "A puppy runs in, sits next to Penny, sticks its tongue out, then runs off" },
];

const SCENES = [
  { id: 'outdoor',    label: 'Outdoor Park', icon: '🌳', desc: 'Green hills and trees under a blue sky' },
  { id: 'beach',      label: 'Beach',        icon: '🏖️', desc: 'Sandy beach with waves and fish' },
  { id: 'snowy',      label: 'Snowy',        icon: '❄️', desc: 'Winter scene with snow and snowflakes' },
  { id: 'city',       label: 'City',         icon: '🏙️', desc: 'City skyline at dusk' },
  { id: 'underwater', label: 'Underwater',   icon: '🐠', desc: 'Ocean with fish, a shark, and rising bubbles' },
  { id: 'volcano',    label: 'Volcano',      icon: '🌋', desc: 'Active volcano with flowing lava and smoke' },
  { id: 'arctic',     label: 'Arctic',       icon: '🧊', desc: 'Ice and glaciers under the northern lights' },
];

function ToggleRow({ icon, label, desc, isUnlocked, isSaving, isLastOn, onToggle }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1rem 1.25rem',
      background: isUnlocked ? '#F0FDF4' : 'white',
      border: `1.5px solid ${isUnlocked ? '#86EFAC' : 'var(--c-beige-border)'}`,
      borderRadius: 12,
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <span style={{ fontSize: '1.6rem' }}>{icon}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E2A38' }}>{label}</div>
          <div style={{ fontSize: '0.78rem', color: '#A89A85', marginTop: '0.15rem' }}>{desc}</div>
        </div>
      </div>
      <button
        onClick={onToggle}
        disabled={isSaving || (isUnlocked && isLastOn)}
        title={isUnlocked && isLastOn ? 'At least one scene must stay unlocked' : undefined}
        style={{
          padding: '0.45rem 1.1rem', borderRadius: 20, border: 'none',
          fontSize: '0.82rem', fontWeight: 700, fontFamily: 'inherit',
          cursor: (isSaving || (isUnlocked && isLastOn)) ? 'default' : 'pointer',
          background: isUnlocked ? '#DCFCE7' : '#EDE9E4',
          color:      isUnlocked ? '#166534' : '#A89A85',
          opacity: (isSaving || (isUnlocked && isLastOn)) ? 0.5 : 1,
          transition: 'all 0.2s',
        }}
      >
        {isSaving ? '...' : isUnlocked ? 'Unlocked' : 'Locked'}
      </button>
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E2A38', marginBottom: '0.75rem', marginTop: 0 }}>
      {children}
    </h2>
  );
}

export default function PennyUnlocksPage() {
  const [unlocks, setUnlocks] = useState({});
  const [scenes,  setScenes]  = useState({});
  const [savingU, setSavingU] = useState({});
  const [savingS, setSavingS] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/penny/unlocks').then(r => r.json()),
      fetch('/api/penny/scenes').then(r => r.json()),
    ]).then(([animData, sceneData]) => {
      const animMap = {};
      for (const row of animData) animMap[row.animation_id] = row.unlocked;
      setUnlocks(animMap);

      const sceneMap = {};
      for (const row of sceneData) sceneMap[row.scene_id] = row.unlocked;
      setScenes(sceneMap);

      setLoading(false);
    });
  }, []);

  async function toggleAnim(id, current) {
    setSavingU(s => ({ ...s, [id]: true }));
    await fetch('/api/penny/unlocks', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ animation_id: id, unlocked: !current }),
    });
    setUnlocks(u => ({ ...u, [id]: !current }));
    setSavingU(s => ({ ...s, [id]: false }));
  }

  async function toggleScene(id, current) {
    setSavingS(s => ({ ...s, [id]: true }));
    await fetch('/api/penny/scenes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scene_id: id, unlocked: !current }),
    });
    setScenes(u => ({ ...u, [id]: !current }));
    setSavingS(s => ({ ...s, [id]: false }));
  }

  const unlockedSceneCount = SCENES.filter(s => !!scenes[s.id]).length;

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1E2A38', marginBottom: '0.4rem' }}>
        Penny Settings
      </h1>
      <p style={{ color: '#A89A85', fontSize: '0.88rem', marginBottom: '2rem' }}>
        Control which scenes and special animations Santiago can use. Changes sync immediately.
      </p>

      {loading ? (
        <p style={{ color: '#C4B49E', fontSize: '0.9rem' }}>Loading...</p>
      ) : (
        <>
          {/* ── Scenes ── */}
          <SectionHeader>🎨 Scenes</SectionHeader>
          <p style={{ color: '#A89A85', fontSize: '0.8rem', marginBottom: '1rem', marginTop: '-0.5rem' }}>
            At least one scene must stay unlocked.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {SCENES.map(scene => (
              <ToggleRow
                key={scene.id}
                icon={scene.icon}
                label={scene.label}
                desc={scene.desc}
                isUnlocked={!!scenes[scene.id]}
                isSaving={!!savingS[scene.id]}
                isLastOn={unlockedSceneCount === 1}
                onToggle={() => toggleScene(scene.id, !!scenes[scene.id])}
              />
            ))}
          </div>

          {/* ── Special Animations ── */}
          <SectionHeader>✨ Special Animations</SectionHeader>
          <p style={{ color: '#A89A85', fontSize: '0.8rem', marginBottom: '1rem', marginTop: '-0.5rem' }}>
            Unlock as rewards when Santiago reaches correct-answer milestones.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ANIMATIONS.map(anim => (
              <ToggleRow
                key={anim.id}
                icon={anim.icon}
                label={anim.label}
                desc={anim.desc}
                isUnlocked={!!unlocks[anim.id]}
                isSaving={!!savingU[anim.id]}
                isLastOn={false}
                onToggle={() => toggleAnim(anim.id, !!unlocks[anim.id])}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

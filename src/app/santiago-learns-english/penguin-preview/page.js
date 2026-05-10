'use client';

import { useState } from 'react';

const css = `
  @keyframes p-bounce {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-14px); }
  }
  @keyframes p-sway {
    0%, 100% { transform: rotate(-7deg); }
    50%      { transform: rotate(7deg); }
  }
  @keyframes p-wobble {
    0%, 100% { transform: rotate(-9deg) scale(1); }
    25%      { transform: rotate(7deg)  scale(1.05); }
    75%      { transform: rotate(-5deg) scale(0.97); }
  }
  @keyframes p-float {
    0%, 100% { transform: translateY(0)   scale(1); }
    50%      { transform: translateY(-9px) scale(1.04); }
  }
  .a-bounce  { animation: p-bounce 1.1s ease-in-out infinite; }
  .a-sway    { animation: p-sway   1.6s ease-in-out infinite; transform-origin: bottom center; }
  .a-wobble  { animation: p-wobble 0.9s ease-in-out infinite; transform-origin: bottom center; }
  .a-float   { animation: p-float  2.0s ease-in-out infinite; }

  .p-card {
    background: white;
    border-radius: 20px;
    padding: 28px 20px 22px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(29,78,216,0.10);
    border: 3px solid transparent;
    cursor: pointer;
    transition: all 0.18s ease;
    user-select: none;
  }
  .p-card:hover {
    border-color: #FDE047;
    box-shadow: 0 10px 34px rgba(29,78,216,0.18);
    transform: translateY(-5px);
  }
  .p-card.chosen {
    border-color: #1D4ED8;
    box-shadow: 0 10px 34px rgba(29,78,216,0.22);
  }
`;

/* ── Bubbles — round, chubby, rosy cheeks ─────────────────────────────────── */
function Bubbles() {
  return (
    <svg viewBox="0 0 120 168" width="150" height="210" style={{ overflow: 'visible' }}>
      {/* feet */}
      <ellipse cx="43"  cy="162" rx="22" ry="9"  fill="#FBBF24"/>
      <ellipse cx="77"  cy="162" rx="22" ry="9"  fill="#FBBF24"/>
      {/* body */}
      <ellipse cx="60"  cy="113" rx="47" ry="53" fill="#60A5FA"/>
      {/* wings */}
      <ellipse cx="9"   cy="108" rx="13" ry="31" fill="#3B82F6" transform="rotate(-12 9 108)"/>
      <ellipse cx="111" cy="108" rx="13" ry="31" fill="#3B82F6" transform="rotate(12 111 108)"/>
      {/* belly */}
      <ellipse cx="60"  cy="118" rx="31" ry="42" fill="#DBEAFE"/>
      {/* head */}
      <circle  cx="60"  cy="54"  r="43"           fill="#60A5FA"/>
      {/* face */}
      <ellipse cx="60"  cy="60"  rx="27" ry="31"  fill="#BFDBFE"/>
      {/* cheeks */}
      <ellipse cx="35"  cy="70"  rx="10" ry="7"   fill="#FCA5A5" opacity="0.5"/>
      <ellipse cx="85"  cy="70"  rx="10" ry="7"   fill="#FCA5A5" opacity="0.5"/>
      {/* beak */}
      <polygon points="60,76 51,87 69,87"          fill="#FBBF24"/>
      <line x1="60" y1="76" x2="60" y2="87"        stroke="#F59E0B" strokeWidth="1.5"/>
      {/* eye whites */}
      <circle cx="47"   cy="52"  r="10"            fill="white"/>
      <circle cx="73"   cy="52"  r="10"            fill="white"/>
      {/* pupils */}
      <circle cx="48.5" cy="53.5" r="6"            fill="#0F172A"/>
      <circle cx="74.5" cy="53.5" r="6"            fill="#0F172A"/>
      {/* shines */}
      <circle cx="51.5" cy="50.5" r="2.2"          fill="white"/>
      <circle cx="77.5" cy="50.5" r="2.2"          fill="white"/>
      {/* sunglasses lenses */}
      <ellipse cx="47"  cy="51"  rx="14" ry="10.5" fill="#FDE047" opacity="0.87"/>
      <ellipse cx="73"  cy="51"  rx="14" ry="10.5" fill="#FDE047" opacity="0.87"/>
      {/* lens reflection */}
      <ellipse cx="41"  cy="46"  rx="5.5" ry="3"   fill="white"   opacity="0.45"/>
      <ellipse cx="67"  cy="46"  rx="5.5" ry="3"   fill="white"   opacity="0.45"/>
      {/* frames */}
      <ellipse cx="47"  cy="51"  rx="14" ry="10.5" fill="none" stroke="#D97706" strokeWidth="2"/>
      <ellipse cx="73"  cy="51"  rx="14" ry="10.5" fill="none" stroke="#D97706" strokeWidth="2"/>
      {/* bridge + temples */}
      <path d="M61 51 C61 48 59 48 59 51"           fill="none" stroke="#D97706" strokeWidth="2"/>
      <line x1="11" y1="51" x2="33" y2="51"         stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="87" y1="51" x2="109" y2="51"        stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Skipper — tall, classic, cool rectangular shades ─────────────────────── */
function Skipper() {
  return (
    <svg viewBox="0 0 100 170" width="130" height="221" style={{ overflow: 'visible' }}>
      {/* feet */}
      <ellipse cx="36" cy="165" rx="18" ry="8"  fill="#FBBF24"/>
      <ellipse cx="64" cy="165" rx="18" ry="8"  fill="#FBBF24"/>
      {/* body */}
      <ellipse cx="50" cy="115" rx="35" ry="57" fill="#1D4ED8"/>
      {/* wings */}
      <ellipse cx="11" cy="110" rx="10" ry="37" fill="#1E40AF" transform="rotate(-7 11 110)"/>
      <ellipse cx="89" cy="110" rx="10" ry="37" fill="#1E40AF" transform="rotate(7 89 110)"/>
      {/* belly */}
      <ellipse cx="50" cy="122" rx="21" ry="44" fill="#EFF6FF"/>
      {/* head */}
      <ellipse cx="50" cy="56"  rx="32" ry="38" fill="#1D4ED8"/>
      {/* face */}
      <ellipse cx="50" cy="62"  rx="19" ry="26" fill="#DBEAFE"/>
      {/* beak */}
      <polygon points="50,80 43,89 57,89"         fill="#FBBF24"/>
      <line x1="50" y1="80" x2="50" y2="89"       stroke="#F59E0B" strokeWidth="1.2"/>
      {/* eye whites */}
      <circle cx="40" cy="55" r="8"               fill="white"/>
      <circle cx="60" cy="55" r="8"               fill="white"/>
      {/* pupils */}
      <circle cx="41" cy="56" r="5"               fill="#0F172A"/>
      <circle cx="61" cy="56" r="5"               fill="#0F172A"/>
      {/* shines */}
      <circle cx="43" cy="53.5" r="1.8"           fill="white"/>
      <circle cx="63" cy="53.5" r="1.8"           fill="white"/>
      {/* rectangular sunglasses */}
      <rect x="26" y="48" width="23" height="14" rx="3" fill="#FDE047" opacity="0.9"/>
      <rect x="51" y="48" width="23" height="14" rx="3" fill="#FDE047" opacity="0.9"/>
      {/* lens reflections */}
      <rect x="28" y="50" width="8" height="4" rx="2" fill="white" opacity="0.4"/>
      <rect x="53" y="50" width="8" height="4" rx="2" fill="white" opacity="0.4"/>
      {/* frames */}
      <rect x="26" y="48" width="23" height="14" rx="3" fill="none" stroke="#D97706" strokeWidth="1.8"/>
      <rect x="51" y="48" width="23" height="14" rx="3" fill="none" stroke="#D97706" strokeWidth="1.8"/>
      {/* bridge + temples */}
      <line x1="49" y1="55" x2="51" y2="55"       stroke="#D97706" strokeWidth="2"/>
      <line x1="4"  y1="55" x2="26" y2="55"        stroke="#D97706" strokeWidth="2"   strokeLinecap="round"/>
      <line x1="74" y1="55" x2="96" y2="55"        stroke="#D97706" strokeWidth="2"   strokeLinecap="round"/>
    </svg>
  );
}

/* ── Pico — chibi, giant head, tiny body, big round glasses ───────────────── */
function Pico() {
  return (
    <svg viewBox="0 0 120 158" width="145" height="191" style={{ overflow: 'visible' }}>
      {/* tiny feet */}
      <ellipse cx="47" cy="152" rx="16" ry="7"  fill="#FBBF24"/>
      <ellipse cx="73" cy="152" rx="16" ry="7"  fill="#FBBF24"/>
      {/* small body */}
      <ellipse cx="60" cy="130" rx="26" ry="22" fill="#7DD3FC"/>
      {/* belly on body */}
      <ellipse cx="60" cy="133" rx="14" ry="15" fill="#E0F2FE"/>
      {/* nub wings */}
      <ellipse cx="31" cy="128" rx="9"  ry="17" fill="#38BDF8" transform="rotate(-15 31 128)"/>
      <ellipse cx="89" cy="128" rx="9"  ry="17" fill="#38BDF8" transform="rotate(15 89 128)"/>
      {/* HUGE head */}
      <circle  cx="60" cy="62"  r="53"           fill="#7DD3FC"/>
      {/* face */}
      <ellipse cx="60" cy="68"  rx="33" ry="37"  fill="#BAE6FD"/>
      {/* cheeks */}
      <ellipse cx="29" cy="80"  rx="12" ry="9"   fill="#FCA5A5" opacity="0.5"/>
      <ellipse cx="91" cy="80"  rx="12" ry="9"   fill="#FCA5A5" opacity="0.5"/>
      {/* beak */}
      <ellipse cx="60" cy="92"  rx="9"  ry="6"   fill="#FBBF24"/>
      <line x1="60" y1="92" x2="60" y2="98"       stroke="#F59E0B" strokeWidth="1.5"/>
      {/* eye whites */}
      <circle cx="45"   cy="61"  r="13"           fill="white"/>
      <circle cx="75"   cy="61"  r="13"           fill="white"/>
      {/* pupils */}
      <circle cx="46.5" cy="63"  r="8.5"          fill="#0F172A"/>
      <circle cx="76.5" cy="63"  r="8.5"          fill="#0F172A"/>
      {/* shines */}
      <circle cx="50.5" cy="58"  r="3.5"          fill="white"/>
      <circle cx="80.5" cy="58"  r="3.5"          fill="white"/>
      <circle cx="43"   cy="67"  r="1.5"          fill="white" opacity="0.6"/>
      <circle cx="73"   cy="67"  r="1.5"          fill="white" opacity="0.6"/>
      {/* big round sunglasses */}
      <circle cx="45"  cy="60"  r="15"             fill="#FDE047" opacity="0.85"/>
      <circle cx="75"  cy="60"  r="15"             fill="#FDE047" opacity="0.85"/>
      {/* lens reflections */}
      <ellipse cx="39" cy="53"  rx="6" ry="3.5"   fill="white"   opacity="0.45"/>
      <ellipse cx="69" cy="53"  rx="6" ry="3.5"   fill="white"   opacity="0.45"/>
      {/* frames */}
      <circle cx="45"  cy="60"  r="15"             fill="none" stroke="#D97706" strokeWidth="2.5"/>
      <circle cx="75"  cy="60"  r="15"             fill="none" stroke="#D97706" strokeWidth="2.5"/>
      {/* bridge + temples */}
      <line x1="60" y1="57" x2="60" y2="63"        stroke="#D97706" strokeWidth="2"/>
      <line x1="8"  y1="60" x2="30" y2="60"         stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="90" y1="60" x2="112" y2="60"        stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Geo — all rounded rectangles, clean/modern ───────────────────────────── */
function Geo() {
  return (
    <svg viewBox="0 0 100 155" width="130" height="202" style={{ overflow: 'visible' }}>
      {/* feet */}
      <rect x="23" y="147" width="22" height="10" rx="5" fill="#FBBF24"/>
      <rect x="55" y="147" width="22" height="10" rx="5" fill="#FBBF24"/>
      {/* body */}
      <rect x="18" y="78"  width="64" height="72" rx="22" fill="#3B82F6"/>
      {/* wings */}
      <rect x="4"  y="85"  width="16" height="50" rx="8"  fill="#2563EB" transform="rotate(-8 4 85)"/>
      <rect x="80" y="85"  width="16" height="50" rx="8"  fill="#2563EB" transform="rotate(8 80 85)"/>
      {/* belly */}
      <rect x="28" y="88"  width="44" height="58" rx="16" fill="#DBEAFE"/>
      {/* head */}
      <rect x="14" y="20"  width="72" height="64" rx="26" fill="#3B82F6"/>
      {/* face */}
      <rect x="24" y="28"  width="52" height="52" rx="20" fill="#BFDBFE"/>
      {/* beak */}
      <rect x="43" y="65"  width="14" height="11" rx="5"  fill="#FBBF24"/>
      {/* eye whites */}
      <rect x="27" y="35"  width="18" height="14" rx="5"  fill="white"/>
      <rect x="55" y="35"  width="18" height="14" rx="5"  fill="white"/>
      {/* pupils */}
      <rect x="30" y="38"  width="10" height="8"  rx="3"  fill="#0F172A"/>
      <rect x="58" y="38"  width="10" height="8"  rx="3"  fill="#0F172A"/>
      {/* shines */}
      <rect x="33" y="39"  width="4"  height="3"  rx="1.5" fill="white"/>
      <rect x="61" y="39"  width="4"  height="3"  rx="1.5" fill="white"/>
      {/* square sunglasses */}
      <rect x="25" y="33"  width="22" height="16" rx="4"  fill="#FDE047" opacity="0.9"/>
      <rect x="53" y="33"  width="22" height="16" rx="4"  fill="#FDE047" opacity="0.9"/>
      {/* lens reflections */}
      <rect x="27" y="35"  width="8"  height="5"  rx="2"  fill="white"   opacity="0.4"/>
      <rect x="55" y="35"  width="8"  height="5"  rx="2"  fill="white"   opacity="0.4"/>
      {/* frames */}
      <rect x="25" y="33"  width="22" height="16" rx="4"  fill="none" stroke="#D97706" strokeWidth="2"/>
      <rect x="53" y="33"  width="22" height="16" rx="4"  fill="none" stroke="#D97706" strokeWidth="2"/>
      {/* bridge + temples */}
      <line x1="47" y1="41" x2="53" y2="41"        stroke="#D97706" strokeWidth="2"/>
      <line x1="3"  y1="41" x2="25" y2="41"         stroke="#D97706" strokeWidth="2"   strokeLinecap="round"/>
      <line x1="75" y1="41" x2="97" y2="41"         stroke="#D97706" strokeWidth="2"   strokeLinecap="round"/>
    </svg>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

const penguins = [
  { id: 'bubbles', name: 'Bubbles', vibe: 'Round · Chubby · Very cute',       anim: 'a-bounce',  C: Bubbles },
  { id: 'skipper', name: 'Skipper', vibe: 'Tall · Classic · Cool',             anim: 'a-sway',    C: Skipper },
  { id: 'pico',    name: 'Pico',    vibe: 'Chibi · Giant head · Tiny body',    anim: 'a-wobble',  C: Pico    },
  { id: 'geo',     name: 'Geo',     vibe: 'Geometric · Minimal · Modern',      anim: 'a-float',   C: Geo     },
];

export default function PenguinPreview() {
  const [chosen, setChosen] = useState(null);

  return (
    <>
      <style>{css}</style>
      <div style={{ padding: '36px 24px 52px', maxWidth: 900, margin: '0 auto' }}>

        {/* header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🐧</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1D4ED8', margin: '0 0 8px' }}>
            Pick Santiago's Penguin
          </h1>
          <p style={{ color: '#64748B', fontSize: 15, margin: 0 }}>
            Four styles — all blue with yellow shades. Click one to pick it.
          </p>
        </div>

        {/* grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 20,
        }}>
          {penguins.map(({ id, name, vibe, anim, C }) => (
            <div
              key={id}
              className={`p-card${chosen === id ? ' chosen' : ''}`}
              onClick={() => setChosen(id)}
            >
              {/* character with animation */}
              <div
                className={anim}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  height: 210,
                }}
              >
                <C />
              </div>

              <div style={{ fontWeight: 800, fontSize: 19, color: '#1D4ED8', marginTop: 14 }}>
                {name}
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 4 }}>
                {vibe}
              </div>

              {chosen === id && (
                <div style={{
                  display: 'inline-block',
                  marginTop: 12,
                  background: '#FDE047',
                  color: '#92400E',
                  borderRadius: 20,
                  padding: '4px 16px',
                  fontSize: 13,
                  fontWeight: 800,
                }}>
                  ✓ This one!
                </div>
              )}
            </div>
          ))}
        </div>

        {/* selection message */}
        {chosen && (
          <div style={{
            marginTop: 32,
            textAlign: 'center',
            color: '#475569',
            fontSize: 15,
            fontWeight: 500,
          }}>
            Nice — <strong>{penguins.find(p => p.id === chosen)?.name}</strong> it is.
            Tell Chris and we'll build the full chatbot around this one.
          </div>
        )}

      </div>
    </>
  );
}

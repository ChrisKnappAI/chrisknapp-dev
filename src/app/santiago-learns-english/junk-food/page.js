'use client';

import { useState, useRef, useMemo } from 'react';

const ITEMS = [
  { id: 'pizza',         word: 'Pizza',         es: 'Pizza',              emoji: '🍕' },
  { id: 'hamburger',     word: 'Hamburger',      es: 'Hamburguesa',        emoji: '🍔' },
  { id: 'french-fries',  word: 'French Fries',  es: 'Papas fritas',       emoji: '🍟' },
  { id: 'fried-chicken', word: 'Fried Chicken', es: 'Pollo frito',        emoji: '🍗' },
  { id: 'soda',          word: 'Soda',          es: 'Gaseosa',            emoji: '🥤' },
  { id: 'chips',         word: 'Potato Chips',  es: 'Papas chips',        emoji: '🍘' },
  { id: 'candy',         word: 'Candy',         es: 'Dulce',              emoji: '🍬' },
  { id: 'cupcake',       word: 'Cupcake',       es: 'Pastelito',          emoji: '🧁' },
  { id: 'ice-cream',     word: 'Ice Cream',     es: 'Helado',             emoji: '🍦' },
  { id: 'milkshake',     word: 'Milk Shake',    es: 'Batido',             emoji: '🍨' },
  { id: 'hot-dog',       word: 'Hot Dog',       es: 'Perro caliente',     emoji: '🌭' },
  { id: 'chocolate-bar', word: 'Chocolate Bar', es: 'Barra de chocolate', emoji: '🍫' },
  { id: 'donut',         word: 'Donut',         es: 'Dona',               emoji: '🍩' },
  { id: 'popcorn',       word: 'Popcorn',       es: 'Palomitas',          emoji: '🍿' },
  { id: 'cake',          word: 'Cake',          es: 'Pastel',             emoji: '🎂' },
  { id: 'nuggets',       word: 'Nuggets',       es: 'Nuggets',            emoji: '🧆' },
  { id: 'pancakes',      word: 'Pancakes',      es: 'Panqueques',         emoji: '🥞' },
  { id: 'cotton-candy',  word: 'Cotton Candy',  es: 'Algodón de azúcar',  emoji: '🌸' },
  { id: 'gum',           word: 'Gum',           es: 'Chicle',             emoji: '🌿' },
  { id: 'lollipop',      word: 'Lollipop',      es: 'Chupete',            emoji: '🍭' },
  { id: 'gummy-bear',    word: 'Gummy Bear',    es: 'Osito de goma',      emoji: '🧸' },
  { id: 'marshmallow',   word: 'Marshmallow',   es: 'Malvavisco',         emoji: '🍡' },
  { id: 'popsicle',      word: 'Popsicle',      es: 'Paleta',             emoji: '🍧' },
  { id: 'brownie',       word: 'Brownie',       es: 'Brownie',            emoji: '🟫' },
  { id: 'onion-rings',   word: 'Onion Rings',   es: 'Aros de cebolla',    emoji: '🥯' },
  { id: 'corn-dog',      word: 'Corn Dog',      es: 'Corn dog',           emoji: '🍢' },
  { id: 'cookies',       word: 'Cookies',       es: 'Galletas',           emoji: '🍪' },
  { id: 'pretzel',       word: 'Pretzel',       es: 'Pretzel',            emoji: '🥨' },
  { id: 'syrup',         word: 'Syrup',         es: 'Jarabe',             emoji: '🍁' },
  { id: 'whipped-cream', word: 'Whipped Cream', es: 'Crema batida',       emoji: '🍰' },
];

export default function JunkFoodPage() {
  const [seen, setSeen]     = useState(new Set());
  const [active, setActive] = useState(null);
  const hideTimer           = useRef(null);

  const shuffled   = useMemo(() => [...ITEMS].sort(() => Math.random() - 0.5), []);
  const activeItem = shuffled.find(i => i.id === active);

  function handleClick(item) {
    if (typeof window === 'undefined') return;
    speechSynthesis.cancel();
    clearTimeout(hideTimer.current);
    setActive(item.id);

    setSeen(prev => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });

    const utt   = new SpeechSynthesisUtterance(item.word);
    utt.lang    = 'en-US';
    utt.rate    = 0.82;
    utt.pitch   = 1.05;
    speechSynthesis.speak(utt);

    utt.onend = () => {
      hideTimer.current = setTimeout(() => setActive(null), 700);
    };
  }

  return (
    <div className="jf-page">

      {/* Header */}
      <h1 style={{ fontSize: 20, fontWeight: 900, color: '#1D3A8A', letterSpacing: '-0.4px', margin: '0 0 6px' }}>
        Junk Food
      </h1>

      {/* Word display */}
      <div style={{
        height:         38,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:             6,
        marginBottom:    8,
        flexShrink:      0,
      }}>
        {activeItem ? (
          <>
            <span style={{ fontSize: 16 }}>🔊</span>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#1D4ED8', letterSpacing: '-0.5px' }}>
              {activeItem.word}
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#64748B' }}>
              ({activeItem.es})
            </span>
          </>
        ) : (
          <span style={{ fontSize: 12, color: '#CBD5E1', fontStyle: 'italic' }}>
            Tap a food to hear its name!
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="jf-grid">
        {shuffled.map(item => {
          const isSeen   = seen.has(item.id);
          const isActive = active === item.id;
          return (
            <div
              key={item.id}
              className="jf-card"
              onClick={() => handleClick(item)}
              style={{
                background:   isSeen ? '#1D4ED8' : '#BFDBFE',
                borderRadius:  10,
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center',
                cursor:       'pointer',
                transition:   'background 0.25s ease',
                outline:       isActive ? '3px solid #FDE047' : 'none',
                userSelect:   'none',
                touchAction:  'manipulation',
              }}
            >
              {item.emoji}
            </div>
          );
        })}
      </div>

      <style>{`
        .jf-page {
          padding: 14px 24px 0;
          height: calc(100vh - 116px);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .jf-grid {
          flex: 1;
          min-height: 0;
          display: grid;
          gap: 6px;
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(6, 1fr);
        }
        .jf-card { font-size: 5.5vw; line-height: 1; }

        @media (min-width: 480px) {
          .jf-grid {
            grid-template-columns: repeat(6, 1fr);
            grid-template-rows: repeat(5, 1fr);
            gap: 8px;
          }
          .jf-card { font-size: 4vh; }
        }
      `}</style>

    </div>
  );
}

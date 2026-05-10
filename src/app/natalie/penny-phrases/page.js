'use client';

import { useState, useEffect, useCallback } from 'react';

const PHRASES = [
  // Simple exclamations
  "Yes!",
  "Wow!",
  "Yay!",
  "Hooray!",
  "Bingo!",
  "Boom!",
  "Score!",
  "Nice!",
  "Whoa!",
  "Ooh!",

  // One-word praise
  "Perfect!",
  "Amazing!",
  "Fantastic!",
  "Excellent!",
  "Incredible!",
  "Brilliant!",
  "Superstar!",
  "Outstanding!",
  "Terrific!",
  "Marvelous!",

  // Short affirmations
  "Great job!",
  "Well done!",
  "Good job!",
  "Very good!",
  "So good!",
  "Too good!",
  "Way to go!",
  "Keep going!",
  "Let's go!",
  "Right on!",

  // "You got it" style
  "You got it!",
  "You did it!",
  "You made it!",
  "You rock!",
  "You win!",
  "You nailed it!",
  "You're right!",
  "That's right!",
  "That's correct!",
  "That's it!",

  // "You're so ___" style
  "You're amazing!",
  "You're a star!",
  "You're so smart!",
  "You're so good!",
  "You're so clever!",
  "You're a champion!",
  "You're a winner!",
  "You're a genius!",
  "You're the best!",
  "You're unstoppable!",

  // First person ("I ___")
  "I love it!",
  "I knew it!",
  "I'm so happy!",
  "I'm proud of you!",
  "I love your answer!",
  "I knew you could do it!",
  "I want to dance!",
  "I'm doing a happy dance!",
  "I can't believe it!",
  "I love when you do that!",

  // Slightly longer but simple
  "That's the right answer!",
  "Exactly right!",
  "One hundred percent!",
  "First try!",
  "Gold star for you!",
  "High five!",
  "Happy dance time!",
  "Keep it up!",
  "Good thinking!",
  "Beautiful answer!",

  // Learning progress
  "You're learning fast!",
  "You're getting so good!",
  "You're a natural!",
  "You never stop amazing me!",
  "You remember everything!",
  "English is easy for you!",
  "Nothing can stop you!",
  "You make it look easy!",
  "You got it again!",
  "Every time!",

  // Fun / Penny personality
  "Penguin dance!",
  "My favorite student!",
  "You surprise me!",
  "Too easy for you!",
  "Look at you go!",
  "You know English!",
  "You know so much!",
  "Number one!",
  "Wow, Santiago!",
  "You make me smile!",

  // "That was ___" style
  "That was perfect!",
  "That was amazing!",
  "That was so good!",
  "That was fast!",
  "That was brilliant!",
  "That was the right answer!",
  "That was easy for you!",
  "That was beautiful!",
  "That was excellent!",
  "That was incredible!",
];

export default function PennyPhrasesPage() {
  const [index, setIndex]         = useState(0);
  const [ratings, setRatings]     = useState({});   // { i: 'up' | 'down' }
  const [variations, setVariations] = useState({}); // { i: true }
  const [copied, setCopied]       = useState(false);

  const go = useCallback((dir) => {
    setIndex(i => Math.max(0, Math.min(PHRASES.length - 1, i + dir)));
  }, []);

  const rate = useCallback((dir) => {
    setRatings(r => ({ ...r, [index]: r[index] === dir ? null : dir }));
  }, [index]);

  const toggleVariation = useCallback(() => {
    setVariations(v => ({ ...v, [index]: !v[index] }));
  }, [index]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  go(-1);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowUp')    { e.preventDefault(); rate('up');   }
      if (e.key === 'ArrowDown')  { e.preventDefault(); rate('down'); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [go, rate]);

  const copyResults = () => {
    const results = PHRASES.map((text, i) => ({
      id: i + 1,
      text,
      rating: ratings[i] ?? null,
      needsVariation: variations[i] ?? false,
    }));
    navigator.clipboard.writeText(JSON.stringify(results, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const phrase         = PHRASES[index];
  const rating         = ratings[index] ?? null;
  const needsVariation = variations[index] ?? false;

  const upCount        = Object.values(ratings).filter(r => r === 'up').length;
  const downCount      = Object.values(ratings).filter(r => r === 'down').length;
  const variationCount = Object.values(variations).filter(Boolean).length;
  const ratedCount     = Object.keys(ratings).length;

  const cardBorder = rating === 'up'
    ? '2px solid #22c55e'
    : rating === 'down'
    ? '2px solid #ef4444'
    : needsVariation
    ? '2px solid #a855f7'
    : '2px solid #2d3748';

  return (
    <div style={{
      background: '#0d1117',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: '#fff',
      padding: '40px 20px',
      userSelect: 'none',
    }}>
      <h1 style={{ fontSize: 16, color: '#555', marginBottom: 6, letterSpacing: 2, textTransform: 'uppercase' }}>
        Penny Praise Phrases
      </h1>

      <p style={{ color: '#444', fontSize: 13, marginBottom: 48 }}>
        ← → navigate &nbsp;·&nbsp; ↑ good &nbsp;·&nbsp; ↓ skip
      </p>

      {/* Progress bar */}
      <div style={{ width: 480, maxWidth: '100%', marginBottom: 12 }}>
        <div style={{ background: '#1e2433', borderRadius: 4, height: 4, overflow: 'hidden' }}>
          <div style={{
            background: '#3b82f6',
            height: '100%',
            width: `${((index + 1) / PHRASES.length) * 100}%`,
            transition: 'width 0.15s',
          }} />
        </div>
      </div>

      <div style={{ fontSize: 13, color: '#555', marginBottom: 32 }}>
        {index + 1} / {PHRASES.length}
        {ratedCount > 0 && (
          <span style={{ marginLeft: 16, color: '#444' }}>
            {ratedCount} rated
          </span>
        )}
      </div>

      {/* Phrase card */}
      <div style={{
        background: '#161b27',
        borderRadius: 20,
        padding: '56px 64px',
        width: 480,
        maxWidth: '100%',
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 700,
        color: '#fff',
        lineHeight: 1.4,
        minHeight: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: cardBorder,
        transition: 'border-color 0.15s',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        {phrase}
      </div>

      {/* Status badges */}
      <div style={{ height: 32, display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
        {rating === 'up'   && <span style={badge('#15803d')}>👍 Kept</span>}
        {rating === 'down' && <span style={badge('#991b1b')}>👎 Skipped</span>}
        {needsVariation    && <span style={badge('#6d28d9')}>✨ Variation flagged</span>}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button onClick={() => go(-1)}         disabled={index === 0}                  style={btn('#1e2433', index === 0)}>◀ Back</button>
        <button onClick={() => rate('up')}                                              style={btn(rating === 'up'   ? '#15803d' : '#1e2433')}>👍 Good</button>
        <button onClick={() => rate('down')}                                            style={btn(rating === 'down' ? '#991b1b' : '#1e2433')}>👎 Skip</button>
        <button onClick={toggleVariation}                                               style={btn(needsVariation    ? '#6d28d9' : '#1e2433')}>✨ Variation</button>
        <button onClick={() => go(1)}          disabled={index === PHRASES.length - 1} style={btn('#1e2433', index === PHRASES.length - 1)}>Next ▶</button>
      </div>

      {/* Stats */}
      <div style={{ marginTop: 48, display: 'flex', gap: 40, color: '#444', fontSize: 14 }}>
        <span><span style={{ color: '#22c55e' }}>👍</span> {upCount} kept</span>
        <span><span style={{ color: '#ef4444' }}>👎</span> {downCount} skipped</span>
        <span><span style={{ color: '#a855f7' }}>✨</span> {variationCount} variations</span>
      </div>

      <button onClick={copyResults} style={{
        ...btn('#1d4ed8'),
        marginTop: 32,
        padding: '12px 28px',
        fontSize: 14,
      }}>
        {copied ? '✅ Copied!' : '📋 Copy Results'}
      </button>
    </div>
  );
}

function btn(bg, disabled = false) {
  return {
    background: disabled ? '#111827' : bg,
    color: disabled ? '#333' : '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '11px 18px',
    fontSize: 14,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.15s',
    fontWeight: 500,
  };
}

function badge(bg) {
  return {
    background: bg,
    color: '#fff',
    borderRadius: 6,
    padding: '3px 10px',
    fontSize: 12,
    fontWeight: 600,
  };
}

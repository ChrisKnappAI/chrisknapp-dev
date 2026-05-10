'use client';

/**
 * PhotoQuestion.js
 *
 * Multiple choice photo question — shows 4 images, Santiago taps the right one.
 * Used when question.hasPhoto === true (e.g. "Which one is an apple?")
 *
 * The correct image is the vocab word photo.
 * The 3 distractors are random OTHER vocab words from the same topic.
 *
 * Props:
 *   question      object     — current question from QUESTIONS
 *   topicVocab    string[]   — all vocab words for this topic (to pick distractors from)
 *   onCorrect     () => void — called when Santiago picks the right photo
 *   onWrong       () => void — called when Santiago picks a wrong photo
 */

import { useState, useMemo } from 'react';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

const BASE = '/santiago-learns-english/chat-with-penny/images';

function imgPath(word, lesson) {
  if (lesson?.imageMap?.[word]) return lesson.imageMap[word];
  return `${BASE}/${lesson?.id}/${word.replace(/\s+/g, '-')}.jpg`;
}

export default function PhotoQuestion({ question, topicVocab, lesson, onCorrect, onWrong }) {
  const [selected, setSelected] = useState(null);

  const correctWord = question.hint;

  // Pick 5 random distractors from the same topic (excluding the correct word) → 6 total
  const choices = useMemo(() => {
    const distractors = shuffle(topicVocab.filter(w => w !== correctWord)).slice(0, 5);
    return shuffle([correctWord, ...distractors]);
  }, [question.id]);

  function handlePick(word) {
    if (selected) return; // already answered
    setSelected(word);
    if (word === correctWord) {
      onCorrect();
    } else {
      onWrong();
    }
  }

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
      gap: 10, padding: 12,
      background: 'white', borderRadius: 16, border: '3px solid #1D4ED8',
    }}>
      {choices.map(word => {
        const isCorrect  = word === correctWord;
        const isSelected = word === selected;

        let borderColor = '#E5E7EB';
        if (isSelected) borderColor = isCorrect ? '#10B981' : '#EF4444';

        return (
          <button
            key={word}
            onClick={() => handlePick(word)}
            style={{
              border: `3px solid ${borderColor}`,
              borderRadius: 12,
              overflow: 'hidden',
              cursor: selected ? 'default' : 'pointer',
              padding: 0,
              background: 'none',
              transition: 'border-color 0.2s',
              transform: isSelected ? 'scale(0.97)' : 'scale(1)',
            }}
          >
            <img
              src={imgPath(word, lesson)}
              alt={word}
              style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
            />
          </button>
        );
      })}
    </div>
  );
}

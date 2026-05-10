'use client';

/**
 * TopicSelector.js
 *
 * Sidebar/panel that shows all topic groups with checkboxes.
 * Santiago (or a parent) checks which topics to practice.
 * Selections are persisted to localStorage.
 *
 * Props:
 *   activeTopics   string[]              — array of active topic ids
 *   onChange       (topicIds) => void    — called when selection changes
 */

import { LESSONS } from '../_data/lessons.js';

export default function TopicSelector({ activeTopics, onChange }) {
  // Group lessons by their group label
  const groups = LESSONS.reduce((acc, lesson) => {
    if (!acc[lesson.group]) acc[lesson.group] = [];
    acc[lesson.group].push(lesson);
    return acc;
  }, {});

  function toggle(id) {
    const next = activeTopics.includes(id)
      ? activeTopics.filter(t => t !== id)
      : [...activeTopics, id];
    onChange(next);
  }

  return (
    <div style={{
      background: 'white',
      border: '3px solid #1D4ED8',
      borderRadius: 16,
      padding: '16px 20px',
      minWidth: 220,
    }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#1D4ED8', marginBottom: 12 }}>
        📚 Topics
      </div>

      {Object.entries(groups).map(([group, lessons]) => (
        <div key={group} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '0.06em', marginBottom: 6 }}>
            {group.toUpperCase()}
          </div>
          {lessons.map(lesson => (
            <label key={lesson.id} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 5, cursor: 'pointer', fontSize: 14, fontWeight: 600,
              color: activeTopics.includes(lesson.id) ? '#1D4ED8' : '#374151',
            }}>
              <input
                type="checkbox"
                checked={activeTopics.includes(lesson.id)}
                onChange={() => toggle(lesson.id)}
                style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#1D4ED8' }}
              />
              {lesson.label}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

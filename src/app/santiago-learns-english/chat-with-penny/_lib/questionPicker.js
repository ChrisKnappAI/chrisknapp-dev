/**
 * questionPicker.js
 *
 * Picks the next question for Penny to ask based on which topics Santiago has enabled.
 * Avoids repeating the same question twice in a row.
 */

import { QUESTIONS } from '../_data/questions.js';

/**
 * Returns a random question from the active topics.
 * @param {string[]} activeTopicIds  — list of topic ids that are checked on
 * @param {string|null} lastQuestionId — the question just asked (excluded from pick)
 * @returns question object or null if no topics are active
 */
export function pickQuestion(activeTopicIds, lastQuestionId = null) {
  const pool = QUESTIONS.filter(
    q => activeTopicIds.includes(q.topic) && q.id !== lastQuestionId
  );

  if (pool.length === 0) return null;

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Returns all unique groups and their topics for the TopicSelector UI.
 */
export function getTopicsByGroup() {
  const { LESSONS } = require('../_data/lessons.js');
  const groups = {};

  for (const lesson of LESSONS) {
    if (!groups[lesson.group]) groups[lesson.group] = [];
    groups[lesson.group].push({ id: lesson.id, label: lesson.label });
  }

  return groups;
}

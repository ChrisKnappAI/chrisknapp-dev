/**
 * grader.js
 *
 * Sends Santiago's answer to the Claude grading API route.
 * Returns Penny's response in both English and Spanish.
 *
 * API route: POST /api/penny/grade
 * Response:  { correct: bool, english: string, spanish: string }
 */

/**
 * @param {object} question        — the current question object from QUESTIONS
 * @param {string} answer          — what Santiago typed
 * @param {string[]} activeTopics  — topic labels currently enabled (for Claude context)
 * @returns {{ correct: boolean, english: string, spanish: string }}
 */
export async function gradeAnswer({ question, answer, activeTopics }) {
  const res = await fetch('/api/penny/grade', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ question, answer, activeTopics }),
  });

  if (!res.ok) throw new Error('Grading API failed');

  return res.json();
}

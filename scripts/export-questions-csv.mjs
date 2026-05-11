// Run with: node scripts/export-questions-csv.mjs
// Outputs: questions-export.csv in the project root

import { QUESTIONS } from '../src/app/santiago-learns-english/chat-with-penny/_data/questions.js';
import { writeFileSync } from 'fs';

function getType(q) {
  if (q.hasPhoto && q.photoType === 'pick') return 'Type 1 - Photo Pick';
  if (q.hasPhoto && q.photoType === 'name') return 'Type 2 - Photo Name';
  return 'Type 3 - Free Form (Claude)';
}

function esc(v) {
  if (v == null) return '';
  const s = String(v);
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? '"' + s.replace(/"/g, '""') + '"'
    : s;
}

const headers = ['Topic', 'TopicGroup', 'QuestionType', 'Question', 'Answer', 'QuestionSpanish'];

const rows = QUESTIONS.map(q => [
  q.topic,
  q.group,
  getType(q),
  q.text,
  q.hint ?? '',
  q.spanish ?? '',
].map(esc).join(','));

const csv = [headers.join(','), ...rows].join('\n');
writeFileSync('questions-export.csv', csv, 'utf8');
console.log(`Exported ${QUESTIONS.length} questions to questions-export.csv`);

// Reads question-bank.csv and outputs _data/question-bank.js
// Run with: node scripts/build-question-bank.mjs

import { readFileSync, writeFileSync } from 'fs';

const TOPIC_ID = {
  'Chess':           'chess',
  'Rooms':           'rooms',
  'Body Parts':      'body-parts',
  'Junk Food':       'junk-food',
  'Fruits':          'fruits',
  'Breakfast Foods': 'breakfast-foods',
  'Weather':         'weather',
  'Pets':            'pets',
  'Zoo Animals':     'zoo-animals',
  'Farm Animals':    'farm-animals',
  'Classroom':       'classroom',
  'Shapes':          'shapes',
  'Lunch & Dinner':  'lunch-dinner',
  'Feelings':        'feelings',
  'Abilities':       'ability',
  'Family':          'family',
  'Days & Months':   'days-months',
};

function parseCSV(text) {
  const lines = text.replace(/\r/g, '').trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;
    const line = lines[i];

    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === '"' && !inQuotes)       { inQuotes = true; }
      else if (ch === '"' && inQuotes)   { if (line[j+1] === '"') { current += '"'; j++; } else inQuotes = false; }
      else if (ch === ',' && !inQuotes)  { values.push(current); current = ''; }
      else                               { current += ch; }
    }
    values.push(current);

    const row = {};
    headers.forEach((h, idx) => { row[h] = values[idx]?.trim() ?? ''; });
    rows.push(row);
  }
  return rows;
}

const csvPath = 'src/app/santiago-learns-english/chat-with-penny/_data/question-bank.csv';
const outPath = 'src/app/santiago-learns-english/chat-with-penny/_data/question-bank.js';

const rows = parseCSV(readFileSync(csvPath, 'utf8'));

const questions = rows.map((row, i) => {
  const type       = row.QuestionType;
  const topicLabel = row.Topic;
  const topic      = TOPIC_ID[topicLabel] ?? topicLabel.toLowerCase().replace(/[&]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  const hasPhoto   = type === 'Type 1 - Photo Pick' || type === 'Type 2 - Photo Name';
  const photoType  = type === 'Type 1 - Photo Pick' ? 'pick'
                   : type === 'Type 2 - Photo Name' ? 'name'
                   : null;

  return {
    id:        `${topic}__${String(i).padStart(4, '0')}`,
    text:      row.Question,
    spanish:   row.QuestionSpanish || null,
    topic,
    group:     row.TopicGroup,
    answer:    row.Answer || null,
    hasPhoto,
    photoType,
  };
});

const js = `// AUTO-GENERATED — do not edit directly.
// Edit question-bank.csv then run: node scripts/build-question-bank.mjs

export const QUESTIONS = ${JSON.stringify(questions, null, 2)};
`;

writeFileSync(outPath, js, 'utf8');
console.log(`Built ${questions.length} questions → question-bank.js`);

'use client';

// Grades Type 2 (Photo Name) answers locally — no API needed.
// Santiago types a word; we check it against q.answer with plural/singular tolerance.

const UNCHANGING = new Set([
  'fish', 'sheep', 'corn', 'rice', 'broccoli', 'spinach', 'lettuce',
  'cheese', 'milk', 'honey', 'sugar', 'oatmeal', 'water', 'bread',
  'popcorn', 'syrup', 'gum', 'chess', 'hair', 'whipped cream',
  'cotton candy', 'coffee', 'tea', 'cocoa', 'pasta', 'salad',
  'cereal', 'butter', 'jelly', 'avocado',
]);

function pluralizeWord(word) {
  const w = word.toLowerCase();
  if (UNCHANGING.has(w)) return w;
  const parts = w.split(' ');
  const last  = parts[parts.length - 1];
  const rest  = parts.slice(0, -1);
  return [...rest, pluralizeSingle(last)].join(' ');
}

function pluralizeSingle(w) {
  if (/[aeiou]y$/.test(w)) return w + 's';
  if (w.endsWith('y'))      return w.slice(0, -1) + 'ies';
  if (/s$|sh$|ch$|x$|z$/.test(w)) return w + 'es';
  if (w.endsWith('o') && !w.endsWith('oo')) return w + 'es';
  return w + 's';
}

function singularizeWord(word) {
  const w = word.toLowerCase();
  if (UNCHANGING.has(w)) return w;
  const parts = w.split(' ');
  const last  = parts[parts.length - 1];
  const rest  = parts.slice(0, -1);
  return [...rest, singularizeSingle(last)].join(' ');
}

function singularizeSingle(w) {
  if (w.endsWith('ies') && w.length > 4)         return w.slice(0, -3) + 'y';
  if (/ses$|xes$|zes$|shes$|ches$|oes$/.test(w)) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 2) return w.slice(0, -1);
  return w;
}

function allForms(word) {
  const w = word.toLowerCase();
  return [...new Set([w, pluralizeWord(w), singularizeWord(w)])];
}

function clean(s) {
  return s.trim().toLowerCase().replace(/[!?.,"'()]/g, '');
}

export function gradeLocal(question, answer) {
  const text = answer.trim();
  if (!text || !question.answer) return { correct: false };
  const valid   = allForms(question.answer);
  const correct = valid.some(v => clean(text).includes(v));
  return { correct };
}

/**
 * localGrader.js
 *
 * Client-side grading — no API key required.
 * Uses the hint/acceptAny fields already on each question.
 *
 * Key design decisions:
 *
 * yes-no split:
 *   - hint is 'yes' or 'no'  → objective question, check for that specific answer
 *   - hint is anything else  → subjective question ("Do you like pizza?"), accept any yes/no
 *
 * plural/singular:
 *   - allForms(word) generates singular + plural so "carrot" and "carrots" both pass
 *   - Handles compound words: "sweet potato" → "sweet potatoes"
 *   - Handles irregular/uncountable nouns: fish, rice, broccoli, etc.
 *
 * pet-or-zoo:
 *   - hint is 'pet' or 'zoo animal'
 *   - Accepts 'zoo' as shorthand for 'zoo animal'
 */

// ── Irregular / uncountable nouns: plural === singular ────────────────────────

const UNCHANGING = new Set([
  'fish', 'sheep', 'corn', 'rice', 'broccoli', 'spinach', 'lettuce',
  'cheese', 'milk', 'honey', 'sugar', 'oatmeal', 'water', 'bread',
  'popcorn', 'syrup', 'gum', 'chess', 'hair', 'whipped cream',
  'cotton candy', 'coffee', 'tea', 'cocoa', 'pasta', 'salad',
  'cereal', 'butter', 'jelly', 'avocado',
]);

// ── Pluralization ─────────────────────────────────────────────────────────────

function pluralizeWord(word) {
  const w = word.toLowerCase();
  if (UNCHANGING.has(w)) return w;

  // Compound: pluralize the last word only (e.g. "sweet potato" → "sweet potatoes")
  const parts = w.split(' ');
  const last  = parts[parts.length - 1];
  const rest  = parts.slice(0, -1);
  return [...rest, pluralizeSingle(last)].join(' ');
}

function pluralizeSingle(w) {
  if (/[aeiou]y$/.test(w)) return w + 's';           // monkey → monkeys
  if (w.endsWith('y'))      return w.slice(0,-1) + 'ies'; // strawberry → strawberries
  if (/s$|sh$|ch$|x$|z$/.test(w)) return w + 'es';   // brush → brushes
  if (w.endsWith('o') && !w.endsWith('oo')) return w + 'es'; // potato → potatoes
  return w + 's';
}

// ── Singularization ───────────────────────────────────────────────────────────

function singularizeWord(word) {
  const w = word.toLowerCase();
  if (UNCHANGING.has(w)) return w;

  const parts = w.split(' ');
  const last  = parts[parts.length - 1];
  const rest  = parts.slice(0, -1);
  return [...rest, singularizeSingle(last)].join(' ');
}

function singularizeSingle(w) {
  if (w.endsWith('ies') && w.length > 4)        return w.slice(0,-3) + 'y';
  if (/ses$|xes$|zes$|shes$|ches$|oes$/.test(w)) return w.slice(0,-2);
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 2) return w.slice(0,-1);
  return w;
}

// ── Accepted forms for a word: original, plural, singular (deduplicated) ──────

function allForms(word) {
  const w = word.toLowerCase();
  return [...new Set([w, pluralizeWord(w), singularizeWord(w)])];
}

// ── Text cleaning ─────────────────────────────────────────────────────────────

function clean(s) {
  return s.trim().toLowerCase().replace(/[!?.,"'()]/g, '');
}

function answerContains(answer, target) {
  const a = clean(answer);
  return allForms(target).some(form => a.includes(form));
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Main grader ───────────────────────────────────────────────────────────────

export function gradeLocal(question, answer) {
  const { expects, hint, acceptAny } = question;
  const text = answer.trim();

  if (!text) return { correct: false, english: 'Say something in English!' };

  // ── Current day ───────────────────────────────────────────────────────────
  if (expects === 'current-day') {
    const days  = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const today = days[new Date().getDay()];
    const correct = clean(text).includes(today);
    return { correct, english: correct ? '' : `Today is ${capitalize(today)}!` };
  }

  // ── Current month ─────────────────────────────────────────────────────────
  if (expects === 'current-month') {
    const months = ['january','february','march','april','may','june',
                    'july','august','september','october','november','december'];
    const month  = months[new Date().getMonth()];
    const correct = clean(text).includes(month);
    return { correct, english: correct ? '' : `This month is ${capitalize(month)}!` };
  }

  // ── Before/after sequence (days and months) ───────────────────────────────
  if (expects === 'sequence') {
    const correct = hint ? answerContains(text, hint) : text.length > 0;
    return {
      correct,
      english: correct ? '' : `Not quite! The answer is "${hint}".`,
    };
  }

  // ── Yes / No ──────────────────────────────────────────────────────────────
  if (expects === 'yes-no') {
    const h = clean(hint ?? '');

    if (h === 'yes' || h === 'no') {
      // Objective: "Is Cecilia your mom?" → definitively yes/no
      const correct = clean(text).includes(h);
      return {
        correct,
        english: correct ? '' : `The answer is "${hint}"!`,
      };
    } else {
      // Subjective: "Do you like pizza?" / "Can you swim?" / "Is a fish a good pet?"
      // Any yes or no response is valid — Santiago just needs to answer in English
      const a = clean(text);
      const correct = a.includes('yes') || a.includes('no') ||
                      a.includes('yeah') || a.includes('nope') || a.includes('yep');
      return {
        correct,
        english: correct ? '' : 'Try saying "yes" or "no"!',
      };
    }
  }

  // ── Pet or zoo animal ─────────────────────────────────────────────────────
  if (expects === 'pet-or-zoo') {
    const h = (hint ?? '').toLowerCase();
    const a = clean(text);
    const correct = h.includes('zoo')
      ? (a.includes('zoo'))
      : (a.includes('pet'));
    return {
      correct,
      english: correct ? '' : `The answer is "${hint}"!`,
    };
  }

  // ── Name / Photo-name ─────────────────────────────────────────────────────
  // acceptAny handles family members with multiple valid names
  if (expects === 'name' || expects === 'photo-name') {
    const valid = acceptAny?.length
      ? acceptAny.flatMap(v => allForms(v))
      : hint ? allForms(hint) : [];
    const correct = valid.length > 0 && valid.some(v => clean(text).includes(v));
    return {
      correct,
      english: correct ? '' : `Not quite! The answer is "${hint}".`,
    };
  }

  // ── Emotion / Ability / Open — accept any non-empty answer ───────────────
  // These are personal questions where any real response is valid
  return { correct: clean(text).length > 0, english: 'Try saying it in English!' };
}

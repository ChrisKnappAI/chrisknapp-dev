/**
 * localGrader.js
 *
 * Client-side grading — no API required.
 * Uses the hint/acceptAny fields already on each question.
 *
 * Returns { correct: bool, english: string }
 * (english = feedback shown when wrong; ignored on correct since ENCOURAGEMENT handles it)
 */

function clean(s) {
  return s.trim().toLowerCase().replace(/[!?.,"']/g, '');
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function gradeLocal(question, answer) {
  const { expects, hint, acceptAny } = question;
  const text = answer.trim();

  if (!text) return { correct: false, english: 'Say something in English!' };

  // ── Current day / month — compare against today's real value ──────────────
  if (expects === 'current-day') {
    const days  = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const today = days[new Date().getDay()];
    const correct = clean(text).includes(today);
    return { correct, english: correct ? '' : `Today is ${capitalize(today)}!` };
  }

  if (expects === 'current-month') {
    const months = ['january','february','march','april','may','june','july',
                    'august','september','october','november','december'];
    const month  = months[new Date().getMonth()];
    const correct = clean(text).includes(month);
    return { correct, english: correct ? '' : `This month is ${capitalize(month)}!` };
  }

  // ── Hint-based matching ───────────────────────────────────────────────────
  if (['yes-no','name','photo-name','sequence','pet-or-zoo'].includes(expects)) {
    const valid   = acceptAny?.map(clean) ?? (hint ? [clean(hint)] : []);
    const cleaned = clean(text);
    const correct = valid.some(v => cleaned.includes(v));
    const feedback = hint
      ? `Not quite! The answer is "${hint}".`
      : 'Not quite! Try again.';
    return { correct, english: feedback };
  }

  // ── Open-ended — accept anything non-empty ────────────────────────────────
  // emotion, ability, open — Santiago just needs to try
  return { correct: true, english: '' };
}

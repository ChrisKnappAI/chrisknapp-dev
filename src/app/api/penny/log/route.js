/**
 * POST /api/penny/log
 *
 * Logs a completed question interaction to santiago_activity_log.
 * Country is read from Vercel's x-vercel-ip-country header.
 *
 * Body: { questionId, questionText, topic, topicGroup, questionType,
 *         answerGiven, correct, gradingMethod, responseGiven, responseType }
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  const country = req.headers.get('x-vercel-ip-country') ?? 'unknown';

  const {
    questionId, questionText, topic, topicGroup, questionType,
    answerGiven, correct, gradingMethod, responseGiven, responseType,
  } = await req.json();

  const now = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const date = new Date(now).toISOString().slice(0, 10);

  const { error } = await supabase.from('santiago_activity_log').insert({
    logged_at:      new Date().toISOString(),
    date,
    country,
    question_id:    questionId,
    question_text:  questionText,
    topic,
    topic_group:    topicGroup,
    question_type:  questionType,
    answer_given:   answerGiven,
    correct,
    grading_method: gradingMethod,
    response_given: responseGiven,
    response_type:  responseType,
  });

  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

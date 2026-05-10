/**
 * POST /api/penny/grade
 *
 * Grades Santiago's answer using Claude Haiku.
 * Returns Penny's response in English + Spanish translation.
 *
 * Requires env var: ANTHROPIC_API_KEY
 *
 * Body:   { question, answer, activeTopics }
 * Returns { correct: bool, english: string, spanish: string }
 */

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  const { question, answer, activeTopics } = await req.json();

  const topicList = activeTopics.join(', ');

  const prompt = `You are Penny, a friendly pink penguin teaching English to Santiago (age 8, beginner).

Santiago has been studying these topics: ${topicList}.

Penny just asked: "${question.text}"
Santiago answered: "${answer}"

Grade his answer and reply in this exact JSON format — no extra text, just JSON:
{
  "correct": true or false,
  "english": "your response to Santiago in English (1-2 short sentences, simple words only)",
  "spanish": "the exact same response translated to Spanish"
}

Rules:
- Be warm, fun, and encouraging — he is 8 years old
- If correct: celebrate! Be enthusiastic.
- If wrong: gently correct him, show the right answer, and invite him to try again
- Use only very simple English words — he is a beginner
- Keep it under 2 sentences
- Return only valid JSON, nothing else`;

  const message = await client.messages.create({
    model:      'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages:   [{ role: 'user', content: prompt }],
  });

  const json = JSON.parse(message.content[0].text);

  return Response.json(json);
}

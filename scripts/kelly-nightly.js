require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const Anthropic = require('@anthropic-ai/sdk')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MEMBER_ID = 1

async function run() {
  console.log('=== Kelly Nightly Processing ===')

  // 1. Find unprocessed answers
  const { data: newAnswers, error: err1 } = await supabase
    .from('story_answers')
    .select('*, story_questions(text, category)')
    .eq('member_id', MEMBER_ID)
    .eq('ready_to_process', true)
    .eq('processed', false)

  if (err1) throw err1

  if (!newAnswers || newAnswers.length === 0) {
    console.log('No answers ready to process. Done.')
    return
  }

  console.log(`Found ${newAnswers.length} new answer(s) to process.`)

  // 2. Get full answer history for context
  const { data: allAnswers } = await supabase
    .from('story_answers')
    .select('raw_text, story_questions(text, category)')
    .eq('member_id', MEMBER_ID)
    .not('raw_text', 'is', null)
    .order('answered_at', { ascending: true })

  const historyContext = allAnswers
    .map(a => `Q: ${a.story_questions?.text}\nA: ${a.raw_text}`)
    .join('\n\n---\n\n')

  const newAnswersText = newAnswers
    .map(a => `Q: ${a.story_questions?.text}\nA: ${a.raw_text}`)
    .join('\n\n---\n\n')

  // 3. Call Claude
  console.log('Calling Claude API…')

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 4096,
    system: `You are building a life story book for Kelly Knapp (born ~1951, lives in Daytona, FL).
Your job is to extract structured data from his answers and generate thoughtful follow-up questions.
Always return valid JSON only — no prose outside the JSON structure.`,
    messages: [{
      role: 'user',
      content: `Here is Kelly's full answer history so far:

${historyContext}

The new answers to process today are:

${newAnswersText}

Do three things:

1. Extract entities from the NEW answers only:
   - People mentioned (name, relationship type, brief notes, status: active/deceased/estranged/unknown)
   - Events described (name, approximate start/end year, brief notes)
   - Places named (name, type: hometown/city/school/workplace/other, brief notes)
   - Organizations referenced (name, type: work/school/sports_team/church/club/civic/other, brief notes)

2. Generate 5–8 new follow-up questions. Prioritize:
   - Loose ends Kelly mentioned but didn't elaborate on
   - People who appear in multiple stories
   - Gaps in the timeline
   - Emotionally significant moments that deserve more depth
   - Stories he hinted at but hasn't told yet

3. For each new answer, write a brief 3rd-person summary (2–3 sentences) for internal use.
   Also note: approximate year range, relevant themes (family/childhood/work/relationships/hardship/pride/humor/legacy), and any loose ends.

Return exactly this JSON:
{
  "entities": {
    "people": [{ "name": "", "relationship_type": "", "relationship_notes": "", "status": "unknown" }],
    "events": [{ "name": "", "date_start": null, "date_end": null, "notes": "" }],
    "places": [{ "name": "", "place_type": "", "notes": "" }],
    "organizations": [{ "name": "", "org_type": "", "notes": "" }]
  },
  "new_questions": [{ "text": "", "category": "" }],
  "answer_summaries": [{
    "question_text": "",
    "summary": "",
    "loose_ends": "",
    "year_range": "",
    "themes": []
  }]
}`,
    }],
  })

  let result
  try {
    const raw = response.content[0].text.trim()
    const jsonStart = raw.indexOf('{')
    const jsonEnd = raw.lastIndexOf('}')
    result = JSON.parse(raw.slice(jsonStart, jsonEnd + 1))
  } catch (e) {
    console.error('Failed to parse Claude response:')
    console.error(response.content[0].text)
    throw e
  }

  // 4. Upsert people
  for (const person of result.entities?.people || []) {
    if (!person.name?.trim()) continue
    const { data: existing } = await supabase
      .from('story_people')
      .select('id')
      .eq('member_id', MEMBER_ID)
      .ilike('name', person.name.trim())
      .maybeSingle()

    if (!existing) {
      await supabase.from('story_people').insert({ member_id: MEMBER_ID, ...person })
      console.log(`  + Person: ${person.name}`)
    }
  }

  // 5. Upsert events
  for (const event of result.entities?.events || []) {
    if (!event.name?.trim()) continue
    const { data: existing } = await supabase
      .from('story_events')
      .select('id')
      .eq('member_id', MEMBER_ID)
      .ilike('name', event.name.trim())
      .maybeSingle()

    if (!existing) {
      await supabase.from('story_events').insert({ member_id: MEMBER_ID, ...event })
      console.log(`  + Event: ${event.name}`)
    }
  }

  // 6. Upsert places
  for (const place of result.entities?.places || []) {
    if (!place.name?.trim()) continue
    const { data: existing } = await supabase
      .from('story_places')
      .select('id')
      .eq('member_id', MEMBER_ID)
      .ilike('name', place.name.trim())
      .maybeSingle()

    if (!existing) {
      await supabase.from('story_places').insert({ member_id: MEMBER_ID, ...place })
      console.log(`  + Place: ${place.name}`)
    }
  }

  // 7. Upsert organizations
  for (const org of result.entities?.organizations || []) {
    if (!org.name?.trim()) continue
    const { data: existing } = await supabase
      .from('story_organizations')
      .select('id')
      .eq('member_id', MEMBER_ID)
      .ilike('name', org.name.trim())
      .maybeSingle()

    if (!existing) {
      await supabase.from('story_organizations').insert({ member_id: MEMBER_ID, ...org })
      console.log(`  + Org: ${org.name}`)
    }
  }

  // 8. Add new questions
  const { data: maxOrderRow } = await supabase
    .from('story_questions')
    .select('display_order')
    .eq('member_id', MEMBER_ID)
    .order('display_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  let nextOrder = (maxOrderRow?.display_order || 0) + 1

  for (const q of result.new_questions || []) {
    if (!q.text?.trim()) continue
    await supabase.from('story_questions').insert({
      member_id: MEMBER_ID,
      text: q.text.trim(),
      category: q.category || 'general',
      source: 'ai_generated',
      status: 'pending',
      display_order: nextOrder++,
    })
    console.log(`  + Question: ${q.text.slice(0, 70)}…`)
  }

  // 9. Update each processed answer
  for (const answer of newAnswers) {
    const summary = result.answer_summaries?.find(
      s => s.question_text === answer.story_questions?.text
    )
    await supabase
      .from('story_answers')
      .update({
        ai_summary: summary?.summary || null,
        loose_ends: summary?.loose_ends || null,
        year_range: summary?.year_range || null,
        themes: summary?.themes || [],
        completeness: 'complete',
        processed: true,
      })
      .eq('id', answer.id)

    // Mark question as answered
    await supabase
      .from('story_questions')
      .update({ status: 'answered' })
      .eq('id', answer.question_id)

    console.log(`  ✓ Processed answer ${answer.id}`)
  }

  console.log('\nNightly processing complete.')
  console.log(`  ${newAnswers.length} answers processed`)
  console.log(`  ${result.new_questions?.length || 0} new questions added`)
  console.log(`  ${(result.entities?.people?.length || 0) + (result.entities?.events?.length || 0) + (result.entities?.places?.length || 0) + (result.entities?.organizations?.length || 0)} entities extracted`)
}

run().catch(err => {
  console.error('ERROR:', err.message)
  process.exit(1)
})

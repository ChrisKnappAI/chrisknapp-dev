import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  const { data, error } = await sb
    .from('penny_unlocks')
    .select('animation_id, unlocked')
    .order('animation_id');

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(req) {
  const { animation_id, unlocked } = await req.json();
  if (!animation_id) return Response.json({ error: 'missing animation_id' }, { status: 400 });

  const { error } = await sb
    .from('penny_unlocks')
    .update({ unlocked, updated_at: new Date().toISOString() })
    .eq('animation_id', animation_id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

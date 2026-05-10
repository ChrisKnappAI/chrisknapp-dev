import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  const { data, error } = await sb
    .from('penny_scenes')
    .select('scene_id, unlocked')
    .order('scene_id');

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(req) {
  const { scene_id, unlocked } = await req.json();
  if (!scene_id) return Response.json({ error: 'missing scene_id' }, { status: 400 });

  const { error } = await sb
    .from('penny_scenes')
    .update({ unlocked, updated_at: new Date().toISOString() })
    .eq('scene_id', scene_id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

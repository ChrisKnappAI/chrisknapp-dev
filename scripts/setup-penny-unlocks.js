const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envFile = path.join(__dirname, '../.env.local');
for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
  const m = line.match(/^([^#=\s][^=]*)=(.*)/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  // Insert rows — if table doesn't exist this will fail with a clear error
  const rows = [
    { animation_id: 'flyaway',   unlocked: false },
    { animation_id: 'layegg',    unlocked: false },
    { animation_id: 'holdhands', unlocked: false },
  ];

  const { error } = await sb.from('penny_unlocks').upsert(rows, { onConflict: 'animation_id', ignoreDuplicates: true });
  if (error) {
    console.error('Error:', error.message);
    console.log('\nTable probably does not exist yet. Create it in the Supabase dashboard SQL editor:\n');
    console.log(`
CREATE TABLE penny_unlocks (
  animation_id TEXT PRIMARY KEY,
  unlocked BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);
INSERT INTO penny_unlocks (animation_id, unlocked) VALUES
  ('flyaway', false), ('layegg', false), ('holdhands', false)
ON CONFLICT (animation_id) DO NOTHING;
    `);
  } else {
    console.log('penny_unlocks seeded successfully.');
  }
}

run();

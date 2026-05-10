CREATE TABLE IF NOT EXISTS penny_unlocks (
  animation_id TEXT PRIMARY KEY,
  unlocked     BOOLEAN NOT NULL DEFAULT false,
  updated_at   TIMESTAMPTZ DEFAULT now()
);

INSERT INTO penny_unlocks (animation_id, unlocked) VALUES
  ('flyaway',   false),
  ('layegg',    false),
  ('holdhands', false)
ON CONFLICT (animation_id) DO NOTHING;

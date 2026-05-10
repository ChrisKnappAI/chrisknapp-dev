CREATE TABLE IF NOT EXISTS penny_scenes (
  scene_id   TEXT PRIMARY KEY,
  unlocked   BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO penny_scenes (scene_id, unlocked) VALUES
  ('outdoor',   true),
  ('beach',     true),
  ('classroom', true),
  ('snowy',     true),
  ('city',      true)
ON CONFLICT (scene_id) DO NOTHING;

-- Migration: add columns missing from tables created by a previous schema

ALTER TABLE algorithms ADD COLUMN IF NOT EXISTS alt_notations JSONB DEFAULT '[]';
ALTER TABLE algorithms ADD COLUMN IF NOT EXISTS triggers JSONB DEFAULT '[]';
ALTER TABLE algorithms ADD COLUMN IF NOT EXISTS arrows JSONB DEFAULT '[]';
ALTER TABLE algorithms ADD COLUMN IF NOT EXISTS difficulty SMALLINT DEFAULT 1;
ALTER TABLE algorithms ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;
ALTER TABLE algorithms ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
ALTER TABLE algorithms ADD COLUMN IF NOT EXISTS synced_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'none';
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS best_time DOUBLE PRECISION;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS avg_time DOUBLE PRECISION;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS attempts INTEGER DEFAULT 0;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS last_practiced TIMESTAMPTZ;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS mastered BOOLEAN DEFAULT false;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS synced_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE collections ADD COLUMN IF NOT EXISTS algorithm_ids JSONB DEFAULT '[]';
ALTER TABLE collections ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE collections ADD COLUMN IF NOT EXISTS synced_at TIMESTAMPTZ DEFAULT NOW();

-- Remove FK constraint on algorithms.step_id — steps are managed client-side and not seeded in Supabase
ALTER TABLE algorithms DROP CONSTRAINT IF EXISTS algorithms_step_id_fkey;

ALTER TABLE algorithms ADD COLUMN IF NOT EXISTS setup TEXT;

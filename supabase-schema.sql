-- Rubix PWA - Supabase Schema (idempotent)

CREATE TABLE IF NOT EXISTS algorithms (
  id UUID PRIMARY KEY,
  step_id TEXT NOT NULL,
  name TEXT NOT NULL,
  notation TEXT NOT NULL,
  alt_notations JSONB DEFAULT '[]',
  triggers JSONB DEFAULT '[]',
  arrows JSONB DEFAULT '[]',
  difficulty SMALLINT DEFAULT 1,
  "order" INTEGER DEFAULT 0,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_algorithms_user_id ON algorithms(user_id);
CREATE INDEX IF NOT EXISTS idx_algorithms_step_id ON algorithms(step_id);

CREATE TABLE IF NOT EXISTS user_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  algorithm_id UUID NOT NULL,
  status TEXT DEFAULT 'none' CHECK (status IN ('none', 'learning', 'learned')),
  best_time DOUBLE PRECISION,
  avg_time DOUBLE PRECISION,
  attempts INTEGER DEFAULT 0,
  last_practiced TIMESTAMPTZ,
  mastered BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, algorithm_id)
);

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  algorithm_ids JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);

-- Enable Row Level Security
ALTER TABLE algorithms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- RLS policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'algorithms' AND policyname = 'Users can CRUD their own algorithms') THEN
    CREATE POLICY "Users can CRUD their own algorithms"
      ON algorithms FOR ALL
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_progress' AND policyname = 'Users can CRUD their own progress') THEN
    CREATE POLICY "Users can CRUD their own progress"
      ON user_progress FOR ALL
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Users can CRUD their own collections') THEN
    CREATE POLICY "Users can CRUD their own collections"
      ON collections FOR ALL
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate triggers to make them idempotent
DROP TRIGGER IF EXISTS trg_algorithms_updated_at ON algorithms;
CREATE TRIGGER trg_algorithms_updated_at
  BEFORE UPDATE ON algorithms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_user_progress_updated_at ON user_progress;
CREATE TRIGGER trg_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_collections_updated_at ON collections;
CREATE TRIGGER trg_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

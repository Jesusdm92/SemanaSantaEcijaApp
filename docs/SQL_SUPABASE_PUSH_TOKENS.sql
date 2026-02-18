-- ============================================
-- Tabla para almacenar Expo Push Tokens
-- Ejecutar en: Supabase > SQL Editor > New Query
-- ============================================

CREATE TABLE push_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  expo_push_token TEXT NOT NULL UNIQUE,
  prefs_danger BOOLEAN DEFAULT TRUE,
  prefs_warning BOOLEAN DEFAULT TRUE,
  prefs_info BOOLEAN DEFAULT FALSE,
  prefs_global BOOLEAN DEFAULT TRUE,
  platform TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

-- Política: permitir insert/update desde la app (anon key)
CREATE POLICY "Allow upsert tokens"
  ON push_tokens FOR ALL
  USING (true)
  WITH CHECK (true);

-- Índice para filtrar por preferencias (n8n queries)
CREATE INDEX idx_push_tokens_prefs
  ON push_tokens (prefs_danger, prefs_warning, prefs_info, prefs_global);

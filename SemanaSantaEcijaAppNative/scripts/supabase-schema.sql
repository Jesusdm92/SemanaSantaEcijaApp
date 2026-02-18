-- ============================================================
-- Tabla: hermandades
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS hermandades (
  id               BIGINT PRIMARY KEY,
  name             TEXT NOT NULL,
  day              TEXT NOT NULL,
  exit_time        TEXT NOT NULL,
  entry_time       TEXT NOT NULL,
  shield_url       TEXT,
  main_image       TEXT,
  itinerary        JSONB DEFAULT '[]'::jsonb,
  description      TEXT NOT NULL DEFAULT '',
  colors           TEXT DEFAULT '',
  music            TEXT DEFAULT '',
  is_favorite      BOOLEAN DEFAULT false,
  numero_pasos     INTEGER DEFAULT 0,
  pasos_images     JSONB DEFAULT '[]'::jsonb,
  pasos            JSONB DEFAULT '[]'::jsonb,
  times            JSONB,
  iglesia          TEXT,
  lugar_salida_entrada TEXT,
  fecha            TEXT,
  titulo_completo  TEXT,
  ano_fundacion    TEXT,
  web_oficial      TEXT,
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security: lectura pública
ALTER TABLE hermandades ENABLE ROW LEVEL SECURITY;

-- Política: cualquier usuario (incluso anónimo) puede leer
CREATE POLICY "Lectura pública de hermandades"
  ON hermandades
  FOR SELECT
  USING (true);

-- Índice por día de salida (para filtrar por día)
CREATE INDEX IF NOT EXISTS idx_hermandades_day ON hermandades(day);

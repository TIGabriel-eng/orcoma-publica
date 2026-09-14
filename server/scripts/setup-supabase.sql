-- ============================================================================
-- Setup da Orcoma Pública no Supabase do Orcoma Site
--
-- IMPORTANTE: execute ESTE arquivo no Supabase SQL Editor (dashboard) ANTES de
-- rodar a migração. Ele cria o schema isolado "publica", a role dedicada e as
-- tabelas. Nada aqui toca nas tabelas do Orcoma Site (que ficam em "public").
-- ============================================================================

-- 1) Schema isolado ------------------------------------------------
CREATE SCHEMA IF NOT EXISTS publica;

-- 2) Role dedicada (só acesso ao schema publica) -------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'orcoma_publica') THEN
    CREATE ROLE orcoma_publica LOGIN PASSWORD 'troque-por-uma-senha-forte';
  END IF;
END $$;

GRANT USAGE ON SCHEMA publica TO orcoma_publica;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA publica TO orcoma_publica;

-- Tabelas novas recebem os privilégios automaticamente
ALTER DEFAULT PRIVILEGES IN SCHEMA publica GRANT ALL ON TABLES TO orcoma_publica;
ALTER DEFAULT PRIVILEGES IN SCHEMA publica GRANT USAGE, SELECT ON SEQUENCES TO orcoma_publica;

-- 3) Tabelas -------------------------------------------------------

-- Usuários do painel (senha SEMPRE em hash bcrypt)
CREATE TABLE IF NOT EXISTS publica.users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Novo Usuário',
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Posts do blog
CREATE TABLE IF NOT EXISTS publica.posts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT DEFAULT '',
  excerpt TEXT DEFAULT '',
  category TEXT DEFAULT 'Geral',
  content JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'Rascunho',
  author TEXT DEFAULT 'Equipe Orcoma',
  image TEXT,
  date TEXT DEFAULT '',
  date_iso TEXT DEFAULT '',
  read_time TEXT DEFAULT '1 min'
);

-- Formulários de contato
CREATE TABLE IF NOT EXISTS publica.forms (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT DEFAULT '',
  email TEXT NOT NULL,
  forma_contato TEXT DEFAULT 'WhatsApp',
  origem TEXT DEFAULT 'Site — Contato',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4) Application role (padrão do Supabase) — NÃO obrigatório, apenas
--    conveniência se você preferir conectar pelo usuário "postgres".
GRANT USAGE ON SCHEMA publica TO postgres;
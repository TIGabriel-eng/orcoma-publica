import 'dotenv/config';

/**
 * Configuração central da API.
 * Todos os valores podem ser sobrescritos via variáveis de ambiente (.env).
 */

// Chave de assinatura dos JWTs — OBRIGATÓRIO trocar em produção!
export const JWT_SECRET = process.env.JWT_SECRET || 'orcoma-dev-secret-change-this-please';

// Tempo de expiração: 8 horas (aceita "8h", "480m", "28800s", etc.)
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

// Porta do servidor Express (o Vite roda na 3000 e faz proxy do /api)
export const PORT = Number(process.env.PORT ?? 4000);

/* ------------------------------ Postgres ------------------------------ */

// Connection string do Supabase (schema publica). O PostgreSQL mais o
// parâmetro ?search_path=publica garante que este app SÓ toca as tabelas
// da Orcoma Pública — as tabelas do Orcoma Site (Django) ficam em "public".
export const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@db.example.supabase.co:5432/postgres?search_path=publica';

/* ------------------------- Supabase Storage --------------------------- */

// URL do projeto (ex.: https://jytqxtsomfdrbhxjtvpz.supabase.co)
export const SUPABASE_URL = process.env.SUPABASE_URL || '';
// Service role key (só no servidor — NUNCA expor no frontend)
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
// Bucket exclusivo da Orcoma Pública (separado do bucket "media" do Site)
export const SUPABASE_STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || 'orcoma-publica';
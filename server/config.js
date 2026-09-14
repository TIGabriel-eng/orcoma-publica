import 'dotenv/config';

/**
 * Configuração central da API.
 * Todos os valores podem ser sobrescritos via variáveis de ambiente (.env).
 *
 * IMPORTANTE: nenhuma dessas leituras lança erro no carregamento do módulo.
 * Em serverless (Vercel), um throw no topo impede a função de inicializar e
 * se manifesta como timeout/504 em TODAS as rotas. Os módulos que precisam
 * dessas variáveis (db.js, auth) falham de forma rápida e legível EM USO.
 */

// Chave de assinatura dos JWTs — OBRIGATÓRIO configurar em produção!
export const JWT_SECRET = process.env.JWT_SECRET || '';

// Tempo de expiração: 8 horas (aceita "8h", "480m", "28800s", etc.)
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

// Porta do servidor Express (o Vite roda na 3000 e faz proxy do /api)
export const PORT = Number(process.env.PORT ?? 4000);

/* ------------------------------ Postgres ------------------------------ */

// Connection string do Supabase (schema publica). O PostgreSQL mais o
// parâmetro ?search_path=publica garante que este app SÓ toca as tabelas
// da Orcoma Pública — as tabelas do Orcoma Site (Django) ficam em "public".
export const DATABASE_URL = process.env.DATABASE_URL || '';

/* ------------------------- Supabase Storage --------------------------- */

// URL do projeto (ex.: https://jytqxtsomfdrbhxjtvpz.supabase.co)
export const SUPABASE_URL = process.env.SUPABASE_URL || '';
// Service role key (só no servidor — NUNCA expor no frontend)
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
// Bucket exclusivo da Orcoma Pública (separado do bucket "media" do Site)
export const SUPABASE_STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || 'orcoma-publica';
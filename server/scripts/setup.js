/**
 * setup.js — configuração automática do Supabase (banco + storage).
 *
 * Tudo aqui é idempotente e seguro de rodar quantas vezes quiser:
 *   1. Cria o schema "publica" (isolado do Orcoma Site) com as tabelas
 *      users / posts / forms no PostgreSQL do Supabase (executa o mesmo
 *      SQL do arquivo setup-supabase.sql, que também pode ser rodado no
 *      SQL Editor do dashboard);
 *   2. Cria o bucket público "orcoma-publica" no Supabase Storage com o
 *      mesmo limite do painel (5MB; PNG/JPG/WebP/GIF).
 *
 * Pré-requisitos (já no .env):
 *   DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_KEY e (opcional)
 *   SUPABASE_STORAGE_BUCKET (padrão: orcoma-publica).
 *
 * Uso:
 *   npm run setup
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../db.js';
import { createClient } from '@supabase/supabase-js';
import {
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  SUPABASE_STORAGE_BUCKET,
} from '../config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, 'setup-supabase.sql');

function fmtBytes(bytes) {
  if (!bytes) return 'sem limite';
  return `${Math.round((bytes / (1024 * 1024)) * 100) / 100} MB`;
}

try {
  /* ------------------- 1) PostgreSQL: schema + tabelas ------------------- */
  const sql = readFileSync(sqlPath, 'utf-8');
  await pool.query(sql);

  const { rows: tables } = await pool.query(
    'SELECT table_name FROM information_schema.tables WHERE table_schema = $1 ORDER BY table_name',
    ['publica'],
  );
  const names = tables.map((t) => t.table_name).join(', ') || '(nenhuma)';
  console.log(`[1/2] OK — schema "publica" pronto. Tabelas: ${names}`);

  /* ----------------- 2) Supabase Storage: bucket público ----------------- */
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_KEY não configurados no .env.');
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const existing = await supabase.storage.getBucket(SUPABASE_STORAGE_BUCKET);
  if (existing.data) {
    console.log(
      `[2/2] OK — bucket "${SUPABASE_STORAGE_BUCKET}" já existia (público=${existing.data.public}).`,
    );
  } else {
    const { data, error } = await supabase.storage.createBucket(SUPABASE_STORAGE_BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5 MB (mesmo limite de routes/uploads.js)
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
    });
    if (error) throw error;
    console.log(`[2/2] OK — bucket "${SUPABASE_STORAGE_BUCKET}" criado (público).`);
  }

  const { data: bucketInfo } = await supabase.storage.getBucket(SUPABASE_STORAGE_BUCKET);
  if (bucketInfo) {
    console.log(
      `      Detalhes: id=${bucketInfo.id} | público=${bucketInfo.public} | ` +
        `limite=${fmtBytes(bucketInfo.fileSizeLimit)}`,
    );
  }

  console.log('\nSetup concluído! Próximo passo:  npm run migrate');
} catch (error) {
  console.error('Erro no setup:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
/**
 * verify.js — valida se o Supabase (banco + storage) está operacional.
 *
 * Confere:
 *   1. Contagem de linhas nas tabelas do schema publica;
 *   2. Objetos presentes no bucket orcoma-publica;
 *   3. Disponibilidade pública da 1ª imagem de um post (HTTP).
 *
 * Uso:
 *   npm run verify
 */
import 'dotenv/config';
import { pool } from '../db.js';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_STORAGE_BUCKET } from '../config.js';

try {
  /* ---------------------------- 1) Banco ---------------------------- */
  const counts = {};
  for (const table of ['users', 'posts', 'forms']) {
    const { rows } = await pool.query(`SELECT COUNT(*)::int AS n FROM publica.${table}`);
    counts[table] = rows[0].n;
  }
  console.log('[1/3] Banco (schema publica):', JSON.stringify(counts));

  const { rows: sample } = await pool.query(
    `SELECT slug, title, image FROM publica.posts ORDER BY date_iso DESC LIMIT 5`,
  );
  console.log('[1/3] Exemplos de posts:', JSON.stringify(sample, null, 2));

  /* --------------------------- 2) Storage --------------------------- */
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data: objects, error } = await supabase.storage.from(SUPABASE_STORAGE_BUCKET).list('', {
    limit: 100,
  });
  if (error) throw error;
  console.log(
    `[2/3] Storage: ${objects.length} objeto(s) em "${SUPABASE_STORAGE_BUCKET}":`,
    objects.map((o) => o.name).join(', '),
  );

  /* ------------------- 3) URL pública (HTTP) ------------------------ */
  const { data: publicUrlData } = supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(objects[0]?.name ?? '');
  const url = publicUrlData?.publicUrl;
  if (url) {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(`[3/3] URL pública "${url}" -> status ${res.status} (${res.headers.get('content-type')})`);
  } else {
    console.log('[3/3] Nenhum objeto para testar.');
  }
} catch (error) {
  console.error('Erro na verificação:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
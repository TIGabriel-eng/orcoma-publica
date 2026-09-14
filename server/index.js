/**
 * index.js — ponto de entrada LOCAL da API (npm run server).
 * A Vercel usa o api/index.js (serverless); este arquivo serva apenas
 * para rodar com `npm run server` em desenvolvimento.
 */
import 'dotenv/config';
import app from './app.js';
import { PORT } from './config.js';

app.listen(PORT, () => {
  console.log(`API Orcoma ouvindo em http://localhost:${PORT}`);
  console.log('POST /api/auth/login  |  /api/gctk9eo956szchibkbei/* protegido por JWT (8h)');
  console.log('Banco: PostgreSQL (schema publica) no Supabase.');
});
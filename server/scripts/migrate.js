/**
 * migrate.js — migração única: server/data/*.json + server/uploads/*
 * para o PostgreSQL (schema publica) e Supabase Storage (bucket orcoma-publica).
 *
 * Pré-requisitos:
 *  1. Rodar server/scripts/setup-supabase.sql no Supabase SQL Editor.
 *  2. Criar o bucket "orcoma-publica" no dashboard (Storage).
 *  3. Ter DATABASE_URL / SUPABASE_URL / SUPABASE_SERVICE_KEY no .env.
 *
 * Uso:
 *   npm run migrate
 */
import 'dotenv/config';
import { readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../db.js';
import { getPublicUrl, uploadBuffer } from '../storage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
const uploadsDir = path.join(__dirname, '..', 'uploads');

const EXT_TYPE = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

function loadJson(file) {
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, 'utf-8'));
}

/** Sobbe um arquivo local para o bucket e devolve a URL pública (ou null). */
async function uploadImage(filename) {
  const filePath = path.join(uploadsDir, filename);
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) return null;
  const ext = path.extname(filename).toLowerCase();
  const buffer = readFileSync(filePath);
  const contentType = EXT_TYPE[ext] || 'image/png';
  try {
    await uploadBuffer(buffer, { contentType, fileName: filename });
  } catch (err) {
    // Se já existir no bucket, ignora (idempotente).
    if (!String(err?.message ?? '').includes('already')) console.error('Upload ignorado:', filename, err.message);
  }
  return getPublicUrl(filename);
}

let users = 0;
let posts = 0;
let forms = 0;
let images = 0;

try {
  /* ------------------------------ Usuários ------------------------------ */
  const usersData = loadJson(path.join(dataDir, 'users.json'));
  if (usersData?.users?.length) {
    for (const u of usersData.users) {
      if (!u.email) continue;
      await pool.query(
        `INSERT INTO publica.users (name, email, password_hash, role, created_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role`,
        [u.name || 'Novo Usuário', u.email.toLowerCase().trim(), u.passwordHash, u.role, u.createdAt],
      );
      users++;
    }
  }

  /* -------------------------------- Posts -------------------------------- */
  const postsData = loadJson(path.join(dataDir, 'posts.json'));
  if (postsData?.posts?.length) {
    for (const p of postsData.posts) {
      let image = p.image ?? null;
      if (image && image.startsWith('/uploads/')) {
        const filename = image.replace('/uploads/', '');
        const publicUrl = await uploadImage(filename);
        if (publicUrl) {
          image = publicUrl;
          images++;
        }
      }
      await pool.query(
        `INSERT INTO publica.posts
           (id, slug, title, subtitle, excerpt, category, content, status,
            author, image, date, date_iso, read_time)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, image = EXCLUDED.image`,
        [
          p.id ?? p.slug,
          p.slug,
          p.title ?? '',
          p.subtitle ?? '',
          p.excerpt ?? '',
          p.category ?? 'Geral',
          JSON.stringify(p.content ?? []),
          p.status ?? 'Rascunho',
          p.author ?? 'Equipe Orcoma',
          image,
          p.date ?? '',
          p.dateIso ?? '',
          p.readTime ?? '1 min',
        ],
      );
      posts++;
    }
  }

  /* ------------------------------ Formulários ----------------------------- */
  const formsData = loadJson(path.join(dataDir, 'forms.json'));
  if (formsData?.forms?.length) {
    for (const f of formsData.forms) {
      await pool.query(
        `INSERT INTO publica.forms (nome, telefone, email, forma_contato, origem, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [f.nome, f.telefone ?? '', f.email, f.formaContato ?? 'WhatsApp', f.origem ?? 'Site — Contato', f.createdAt],
      );
      forms++;
    }
  }

  console.log(`
Migração concluída:
  Usuários:   ${users}
  Posts:      ${posts}
  Formulários: ${forms}
  Imagens enviadas ao bucket: ${images}
`);
} catch (error) {
  console.error('Erro na migração:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
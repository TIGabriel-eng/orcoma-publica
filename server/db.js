/**
 * db.js — camada de acesso a dados (PostgreSQL no Supabase).
 *
 * Todas as tabelas ficam no schema "publica", isolado do Orcoma Site (que usa
 * o schema "public" do mesmo projeto). As funções exportadas têm a MESMA
 * assinatura da versão antiga (arquivos JSON), então nenhuma rota precisa mudar.
 */
import pg from 'pg';
import { URL } from 'node:url';
import { DATABASE_URL } from './config.js';

const { Pool } = pg;

/**
 * Garante que TODA conexão use apenas o schema "publica" (as tabelas do
 * Orcoma Site ficam no schema "public" do mesmo projeto) e que SSL esteja
 * habilitado (obrigatório no pooler Supavisor do Supabase).
 */
function buildConnectionString(connectionString) {
  const url = new URL(connectionString);
  url.searchParams.set('search_path', 'publica');
  if (!url.searchParams.has('sslmode')) {
    url.searchParams.set('sslmode', 'require');
  }
  return url.toString();
}

export const pool = new Pool({
  connectionString: buildConnectionString(DATABASE_URL),
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[db] Pool idle client error:', err.message);
});

/* ---------------------------- Row mappers ------------------------------ */

function mapUser(row, { withHash = false } = {}) {
  if (!row) return null;
  const user = {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
  };
  if (withHash) user.passwordHash = row.password_hash;
  return user;
}

function mapPost(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    excerpt: row.excerpt,
    category: row.category,
    content: row.content,
    status: row.status,
    author: row.author,
    image: row.image,
    date: row.date,
    dateIso: row.date_iso,
    readTime: row.read_time,
  };
}

function mapForm(row) {
  if (!row) return null;
  return {
    id: row.id,
    nome: row.nome,
    telefone: row.telefone,
    email: row.email,
    formaContato: row.forma_contato,
    origem: row.origem,
    createdAt: row.created_at,
  };
}

/* ------------------------------ Usuários ------------------------------ */

/** Busca um usuário pelo e-mail (case-insensitive), com passwordHash. */
export async function findUserByEmail(email) {
  const normalized = String(email ?? '').trim().toLowerCase();
  const { rows } = await pool.query(
    'SELECT * FROM publica.users WHERE LOWER(email) = $1',
    [normalized],
  );
  return mapUser(rows[0], { withHash: true });
}

/** Busca um usuário pelo id, com passwordHash. */
export async function findUserById(id) {
  const { rows } = await pool.query('SELECT * FROM publica.users WHERE id = $1', [String(id)]);
  return mapUser(rows[0], { withHash: true });
}

/** Lista todos os usuários SEM o campo sensível (hash de senha). */
export async function findAllUsers() {
  const { rows } = await pool.query(
    'SELECT id, name, email, role, created_at FROM publica.users ORDER BY created_at DESC',
  );
  return rows.map((row) => mapUser(row));
}

/** Cria um novo usuário e grava no banco. */
export async function createUser({ name, email, passwordHash, role = 'admin' }) {
  const { rows } = await pool.query(
    `INSERT INTO publica.users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name || 'Novo Usuário', email, passwordHash, role || 'admin'],
  );
  return mapUser(rows[0], { withHash: true });
}

const USER_COLUMNS = { name: 'name', email: 'email', passwordHash: 'password_hash', role: 'role' };

/** Atualiza um usuário (apenas campos informados). */
export async function updateUser(id, updates) {
  const keys = Object.keys(updates ?? {}).filter((k) => USER_COLUMNS[k]);
  if (keys.length === 0) {
    return findUserById(id);
  }
  const setSql = keys.map((k, i) => `${USER_COLUMNS[k]} = $${i + 2}`).join(', ');
  const values = keys.map((k) =>
    k === 'passwordHash' ? updates[k] : String(updates[k] ?? '').trim() || null,
  );
  const { rows } = await pool.query(
    `UPDATE publica.users SET ${setSql} WHERE id = $1
     RETURNING id, name, email, role, created_at`,
    [String(id), ...values],
  );
  return mapUser(rows[0], { withHash: true });
}

/** Exclui um usuário pelo id. */
export async function deleteUser(id) {
  const { rowCount } = await pool.query('DELETE FROM publica.users WHERE id = $1', [String(id)]);
  return (rowCount ?? 0) > 0;
}

/* -------------------------------- Posts ------------------------------- */

/** Lista todos os posts, opcionalmente filtrando por status. */
export async function findAllPosts({ status } = {}) {
  const params = [];
  let sql = 'SELECT * FROM publica.posts';
  if (status) {
    params.push(String(status));
    sql += ' WHERE status = $1';
  }
  const { rows } = await pool.query(sql, params);
  return rows.map(mapPost);
}

/** Busca um post pelo id. */
export async function findPostById(id) {
  const { rows } = await pool.query('SELECT * FROM publica.posts WHERE id = $1', [String(id)]);
  return mapPost(rows[0]);
}

/** Busca um post pelo slug (case-insensitive). */
export async function findPostBySlug(slug) {
  const normalized = String(slug ?? '').trim().toLowerCase();
  const { rows } = await pool.query('SELECT * FROM publica.posts WHERE LOWER(slug) = $1', [
    normalized,
  ]);
  return mapPost(rows[0]);
}

const POST_COLUMNS = {
  title: 'title',
  subtitle: 'subtitle',
  excerpt: 'excerpt',
  category: 'category',
  content: 'content',
  slug: 'slug',
  status: 'status',
  author: 'author',
  image: 'image',
  date: 'date',
  dateIso: 'date_iso',
  readTime: 'read_time',
};

/** Cria um novo post e grava no banco. O id é o slug. */
export async function createPost(post) {
  const existing = await findPostBySlug(post.slug);
  if (existing) {
    const err = new Error(`Já existe um post com o slug "${post.slug}".`);
    err.status = 409;
    throw err;
  }
  const row = { ...post, id: post.slug };
  const columns = ['id', ...Object.keys(POST_COLUMNS)];
  const colSql = columns.map((c) => `${POST_COLUMNS[c] ?? c}`).join(', ');
  const valSql = columns.map((_, i) => `$${i + 1}`).join(', ');
  const values = columns.map((c) => serializePostValue(c, row[c]));

  const { rows } = await pool.query(
    `INSERT INTO publica.posts (${colSql}) VALUES (${valSql}) RETURNING *`,
    values,
  );
  return mapPost(rows[0]);
}

/** Atualiza um post (apenas campos informados). Mantém id seguindo o slug. */
export async function updatePost(id, updates) {
  const exists = await findPostById(id);
  if (!exists) return null;

  if (updates.slug) {
    const taken = await findPostBySlug(updates.slug);
    if (taken && String(taken.id) !== String(id)) {
      const err = new Error(`Já existe um post com o slug "${updates.slug}".`);
      err.status = 409;
      throw err;
    }
    // Mantém a invariância: o id do post acompanha o slug.
    updates = { ...updates, id: updates.slug };
  }

  const keys = Object.keys(updates ?? {}).filter((k) => POST_COLUMNS[k] || k === 'id');
  if (keys.length === 0) return exists;

  const setSql = keys.map((k, i) => `${POST_COLUMNS[k] ?? k} = $${i + 2}`).join(', ');
  const values = keys.map((k) => serializePostValue(k, updates[k]));

  const { rows } = await pool.query(
    `UPDATE publica.posts SET ${setSql} WHERE id = $1 RETURNING *`,
    [String(id), ...values],
  );
  return mapPost(rows[0]);
}

/** Serializa valores de post para o Postgres (content vira JSONB). */
function serializePostValue(key, value) {
  if (key === 'id') return String(value);
  if (key === 'content') return JSON.stringify(value ?? []);
  return value === undefined || value === null ? null : String(value);
}

/** Exclui um post pelo id. */
export async function deletePost(id) {
  const { rowCount } = await pool.query('DELETE FROM publica.posts WHERE id = $1', [String(id)]);
  return (rowCount ?? 0) > 0;
}

/* ----------------------------- Formulários ---------------------------- */

/** Lista todos os formulários enviados (mais recentes primeiro). */
export async function findAllForms() {
  const { rows } = await pool.query('SELECT * FROM publica.forms ORDER BY created_at DESC');
  return rows.map(mapForm);
}

/** Registra um novo envio de formulário. */
export async function createForm({ nome, telefone, email, formaContato, origem }) {
  const { rows } = await pool.query(
    `INSERT INTO publica.forms (nome, telefone, email, forma_contato, origem)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      nome,
      telefone || '',
      email,
      formaContato || 'WhatsApp',
      origem || 'Site — Contato',
    ],
  );
  return mapForm(rows[0]);
}

/** Exclui um formulário pelo id. */
export async function deleteForm(id) {
  const { rowCount } = await pool.query('DELETE FROM publica.forms WHERE id = $1', [String(id)]);
  return (rowCount ?? 0) > 0;
}
/**
 * app.js — constrói e exporta a aplicação Express (sem app.listen).
 *
 * Usado pela Vercel (api/index.js) via serverless-http e pelo index.js
 * quando rodamos a API localmente com `npm run server`.
 */
import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';
import formsRoutes from './routes/forms.js';
import adminPostsRoutes from './routes/adminPosts.js';
import adminUsersRoutes from './routes/adminUsers.js';
import adminFormsRoutes from './routes/adminForms.js';
import uploadsRoutes from './routes/uploads.js';
import { requireAuth } from './middleware/auth.js';
import { findUserById, findAllPosts, findAllUsers } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const app = express();

app.disable('x-powered-by');
app.use(express.json());

/* ------------------------- Rotas públicas ------------------------- */

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes); // POST /api/auth/login

app.use('/api/posts', postsRoutes); // GET /api/posts (blog público)
app.use('/api/forms', formsRoutes); // POST /api/forms (formulário de contato)

/* ---------------- Rotas protegidas (/api/gctk9eo956szchibkbei/*) ------------------
 * O middleware abaixo roda em TODA rota que começar com /api/gctk9eo956szchibkbei.
 * Sem token válido a resposta é sempre 401 — proteção REAL no backend.
 * ------------------------------------------------------------------- */
app.use('/api/gctk9eo956szchibkbei', requireAuth);

// CRUD de posts e usuários do painel (protegidos pelo middleware acima)
app.use('/api/gctk9eo956szchibkbei/posts', adminPostsRoutes);
app.use('/api/gctk9eo956szchibkbei/users', adminUsersRoutes);
app.use('/api/gctk9eo956szchibkbei/forms', adminFormsRoutes);
app.use('/api/gctk9eo956szchibkbei/uploads', uploadsRoutes); // POST multipart (campo "file")

// Exemplo de rota protegida: dados do painel vindos da API autenticada
app.get('/api/gctk9eo956szchibkbei/stats', async (req, res, next) => {
  try {
    const [posts, users] = await Promise.all([findAllPosts(), findAllUsers()]);
    res.json({
      user: { id: req.user.id, name: req.user.name },
      stats: [
        { label: 'Posts publicados', value: String(posts.length), delta: `${posts.filter((p) => p.status === 'Publicado').length} publicados` },
        { label: 'Usuários cadastrados', value: String(users.length), delta: `${users.filter((u) => u.role === 'superadmin').length} superadmin` },
        { label: 'Rascunhos', value: String(posts.filter((p) => p.status === 'Rascunho').length), delta: 'aguardando publicação' },
      ],
    });
  } catch (error) {
    next(error);
  }
});

// Usado pelo frontend para validar o token ao restaurar a sessão
app.get('/api/gctk9eo956szchibkbei/me', async (req, res) => {
  const user = await findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }
  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

/* ------------------------ Frontend (build) ------------------------ */

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

// Em dev/produção local, serve o build do Vite com fallback de SPA.
// Na Vercel isto é dispensado (os estáticos são servidos pelo CDN).
if (fs.existsSync(indexPath)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
    res.sendFile(indexPath);
  });
}

/* ---------------------- Tratamento de erros ------------------------ */

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

app.use((err, _req, res, _next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

export default app;
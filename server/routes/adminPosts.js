/**
 * routes/adminPosts.js — CRUD de posts do painel (protegido por JWT).
 *
 * GET    /api/gctk9eo956szchibkbei/posts        -> lista todos (inclui rascunhos)
 * POST   /api/gctk9eo956szchibkbei/posts        -> cria um post
 * PUT    /api/gctk9eo956szchibkbei/posts/:id    -> edita um post
 * DELETE /api/gctk9eo956szchibkbei/posts/:id    -> exclui um post
 */
import { Router } from 'express';
import { createPost, deletePost, findAllPosts, findPostById, updatePost } from '../db.js';
import { removeImage } from '../storage.js';

const router = Router();

/** Remove uma imagem enviada pelo painel do Supabase Storage, se existir. */
function removeUploadedFile(url) {
  if (typeof url !== 'string' || !url) return;
  removeImage(url).catch(() => {
    /* erro ignorado (arquivo já não existe / bucket indisponível) */
  });
}

const MONTHS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

function slugify(text) {
  return String(text ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

function formatDateBR(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Estima o tempo de leitura a partir do conteúdo (palavras por minuto). */
function estimateReadTime(content) {
  const text = Array.isArray(content) ? content.join(' ') : String(content || '');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

/** Monta o objeto de post a partir do corpo da requisição (create/update). */
function buildPost(body, existing = {}) {
  const dateIso = body.dateIso || existing.dateIso || new Date().toISOString().slice(0, 10);
  return {
    title: (body.title ?? existing.title ?? '').trim(),
    subtitle: (body.subtitle ?? existing.subtitle ?? '').trim(),
    excerpt: (body.excerpt ?? existing.excerpt ?? '').trim(),
    category: (body.category ?? existing.category ?? 'Geral').trim(),
    content: Array.isArray(body.content) ? body.content : String(body.content ?? ''),
    slug: (body.slug || slugify(body.title) || existing.slug || '').toLowerCase(),
    status: body.status || existing.status || 'Rascunho',
    author: (body.author ?? existing.author ?? 'Equipe Orcoma').trim(),
    // Se o frontend mandar o campo "image" (inclusive null/""), respeitamos;
    // só mantemos a imagem antiga quando o campo não veio na requisição.
    image: Object.prototype.hasOwnProperty.call(body, 'image')
      ? (body.image && String(body.image).trim()) || null
      : existing.image ?? null,
    date: body.date || formatDateBR(dateIso) || existing.date,
    dateIso,
    readTime: estimateReadTime(body.content ?? existing.content),
  };
}

router.get('/', async (_req, res, next) => {
  try {
    const posts = await findAllPosts();
    posts.sort((a, b) => new Date(b.dateIso) - new Date(a.dateIso));
    res.json({ posts });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const data = buildPost(req.body ?? {});
    if (!data.title || !data.content) {
      return res.status(400).json({ error: 'Informe pelo menos título e conteúdo.' });
    }
    const post = await createPost({ ...data, id: data.slug });
    res.status(201).json({ post });
  } catch (error) {
    if (error.status === 409) return res.status(409).json({ error: error.message });
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const existing = await findPostById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Post não encontrado.' });
    }
    const data = buildPost(req.body ?? {}, existing);
    const post = await updatePost(existing.id, data);
    // Remove o arquivo antigo quando a imagem foi trocada ou removida.
    if (existing.image && existing.image !== post.image) {
      removeUploadedFile(existing.image);
    }
    res.json({ post });
  } catch (error) {
    if (error.status === 409) return res.status(409).json({ error: error.message });
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await findPostById(req.params.id);
    const removed = await deletePost(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Post não encontrado.' });
    }
    // Remove a imagem da capa junto com o post.
    if (existing?.image) {
      removeUploadedFile(existing.image);
    }
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
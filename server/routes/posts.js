/**
 * routes/posts.js — rotas públicas do blog.
 *
 * GET /api/posts        -> lista os posts publicados (rascunhos ocultos)
 * GET /api/posts/:slug  -> retorna um post publicado pelo slug
 */
import { Router } from 'express';
import { findAllPosts, findPostBySlug } from '../db.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const posts = await findAllPosts({ status: 'Publicado' });
    posts.sort((a, b) => new Date(b.dateIso) - new Date(a.dateIso));
    res.json({ posts });
  } catch (error) {
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const post = await findPostBySlug(req.params.slug);
    if (!post || post.status !== 'Publicado') {
      return res.status(404).json({ error: 'Post não encontrado.' });
    }
    res.json({ post });
  } catch (error) {
    next(error);
  }
});

export default router;
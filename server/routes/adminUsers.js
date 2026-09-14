/**
 * routes/adminUsers.js — CRUD de usuários do painel (protegido por JWT).
 *
 * GET    /api/gctk9eo956szchibkbei/users        -> lista todos (sem hash de senha)
 * POST   /api/gctk9eo956szchibkbei/users        -> cria um usuário
 * PUT    /api/gctk9eo956szchibkbei/users/:id    -> edita um usuário (senha nova opcional)
 * DELETE /api/gctk9eo956szchibkbei/users/:id    -> exclui um usuário (nunca o próprio)
 */
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { createUser, deleteUser, findAllUsers, findUserByEmail, findUserById, updateUser } from '../db.js';

const router = Router();

const VALID_ROLES = ['admin', 'superadmin'];

function publicUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

router.get('/', async (req, res, next) => {
  try {
    const users = await findAllUsers();
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Informe nome, e-mail e senha.' });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Informe um e-mail válido.' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
    }
    const userRole = VALID_ROLES.includes(role) ? role : 'admin';

    const existing = await findUserByEmail(normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: 'Já existe um usuário com esse e-mail.' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await createUser({
      name: String(name ?? '').trim() || 'Novo Usuário',
      email: normalizedEmail,
      passwordHash,
      role: userRole,
    });
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body ?? {};
    const existing = await findUserById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const updates = {};
    if (name !== undefined) updates.name = String(name).trim() || existing.name;
    if (role !== undefined && VALID_ROLES.includes(role)) updates.role = role;

    if (email !== undefined) {
      const normalizedEmail = String(email).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return res.status(400).json({ error: 'Informe um e-mail válido.' });
      }
      const taken = await findUserByEmail(normalizedEmail);
      if (taken && String(taken.id) !== String(existing.id)) {
        return res.status(409).json({ error: 'Já existe um usuário com esse e-mail.' });
      }
      updates.email = normalizedEmail;
    }

    if (password) {
      if (String(password).length < 6) {
        return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
      }
      updates.passwordHash = await bcrypt.hash(String(password), 10);
    }

    const user = await updateUser(existing.id, updates);
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (String(req.params.id) === String(req.user.id)) {
      return res.status(400).json({ error: 'Você não pode excluir a sua própria conta.' });
    }
    const removed = await deleteUser(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
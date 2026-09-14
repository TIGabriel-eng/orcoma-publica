import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../db.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config.js';

const router = Router();

/**
 * POST /api/auth/login
 * Body: { email, password }
 *
 * 200 -> { token, user }
 * 400 -> e-mail/senha ausentes
 * 401 -> credenciais inválidas
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Informe e-mail e senha.' });
  }

  try {
    const user = await findUserByEmail(email);

    // Mensagem genérica: não revela se o e-mail existe (evita enumeração).
    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    // A senha NUNCA é lida em texto puro criada na aplicação: aqui apenas
    // comparamos a senha digitada com o hash bcrypt guardado no "banco".
    const senhaConfere = await bcrypt.compare(String(password), user.passwordHash);

    if (!senhaConfere) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    // JWT assinado com a chave secreta e expiração de 8 horas.
    const token = jwt.sign(
      { name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { subject: String(user.id), expiresIn: JWT_EXPIRES_IN },
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno ao realizar o login.' });
  }
});

export default router;
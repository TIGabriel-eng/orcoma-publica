/**
 * routes/forms.js — recebe os formulários de contato do site (público).
 *
 * POST /api/forms  -> grava um novo envio e devolve { form }
 */
import { Router } from 'express';
import { createForm } from '../db.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { nome, telefone, email, formaContato } = req.body ?? {};

    if (!nome || !telefone || !email) {
      return res.status(400).json({ error: 'Informe nome, telefone e e-mail.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return res.status(400).json({ error: 'Informe um e-mail válido.' });
    }

    const form = await createForm({
      nome: String(nome).trim().slice(0, 120),
      telefone: String(telefone).trim().slice(0, 40),
      email: String(email).trim().toLowerCase().slice(0, 160),
      formaContato: String(formaContato || 'WhatsApp').trim().slice(0, 40),
      origem: 'Site — Contato',
    });

    res.status(201).json({ form });
  } catch (error) {
    next(error);
  }
});

export default router;
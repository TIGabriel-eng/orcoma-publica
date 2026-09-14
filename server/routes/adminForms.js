/**
 * routes/adminForms.js — gestão de formulários recebidos (protegido por JWT).
 *
 * GET    /api/gctk9eo956szchibkbei/forms        -> lista todos os envios
 * DELETE /api/gctk9eo956szchibkbei/forms/:id    -> exclui um envio
 */
import { Router } from 'express';
import { deleteForm, findAllForms } from '../db.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const forms = await findAllForms();
    res.json({ forms });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const removed = await deleteForm(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Formulário não encontrado.' });
    }
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
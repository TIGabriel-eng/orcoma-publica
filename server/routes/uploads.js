/**
 * routes/uploads.js — upload de imagens do painel (protegido por JWT).
 *
 * POST /api/gctk9eo956szchibkbei/uploads  (multipart/form-data, campo "file")
 *   -> envia direto ao bucket "orcoma-publica" (Supabase Storage) e devolve
 *      { url } com a URL pública.
 *
 * Limites: PNG, JPG, WEBP e GIF, até 5MB.
 */
import { Router } from 'express';
import busboy from 'busboy';
import { uploadBuffer } from '../storage.js';

const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const EXT = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif' };
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

const router = Router();

router.post('/', (req, res) => {
  const bb = busboy({
    headers: req.headers,
    limits: { fileSize: MAX_BYTES, files: 1 },
  });

  let fileBuffer = null;
  let fileType = null;
  let sizeError = false;

  bb.on('file', (_fieldname, file, info) => {
    const chunks = [];
    fileType = info.mimeType;
    file.on('data', (data) => chunks.push(data));
    file.on('end', () => {
      fileBuffer = Buffer.concat(chunks);
      if (fileBuffer.length === 0) fileBuffer = null;
    });
  });

  bb.on('limit', () => {
    sizeError = true;
  });

  bb.on('error', () => {
    if (!res.headersSent) {
      res.status(400).json({ error: 'Não foi possível receber a imagem.' });
    }
  });

  bb.on('close', async () => {
    try {
      if (sizeError) {
        return res.status(400).json({ error: 'Arquivo muito grande. Tamanho máximo: 5MB.' });
      }
      if (!fileBuffer || !fileType || !ALLOWED.includes(fileType)) {
        return res.status(400).json({
          error: 'Formato inválido. Envie PNG, JPG, WEBP ou GIF (até 5MB).',
        });
      }

      const ext = EXT[fileType] || '.png';
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      const url = await uploadBuffer(fileBuffer, { contentType: fileType, fileName: name });
      return res.status(201).json({ url });
    } catch (err) {
      console.error('Erro no upload:', err);
      if (!res.headersSent) {
        return res.status(500).json({ error: err.message || 'Erro interno ao salvar a imagem.' });
      }
    }
  });

  req.pipe(bb);
});

export default router;
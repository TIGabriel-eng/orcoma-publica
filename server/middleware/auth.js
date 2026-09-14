import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

/**
 * middleware/auth.js — autenticação JWT para TODAS as rotas /api/gctk9eo956szchibkbei/*.
 *
 * Fluxo:
 *  1. Lê o header "Authorization: Bearer <JWT>";
 *  2. Verifica assinatura, integridade e expiração do token;
 *  3. Se inválido/ausente/expirado -> 401 (nunca deixa passar);
 *  4. Se válido -> anexa o usuário em req.user e chama next().
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  // 1) Sem header ou fora do formato "Bearer <token>"
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Acesso não autorizado. Informe um token válido no header Authorization.',
      code: 'NO_TOKEN',
    });
  }

  // 2) Valida assinatura + expiração do JWT
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Sessão expirada. Faça login novamente.',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(401).json({
      error: 'Token inválido ou adulterado.',
      code: 'INVALID_TOKEN',
    });
  }
}
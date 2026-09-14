/**
 * api.ts — cliente HTTP da aplicação.
 * Em dev o Vite faz proxy de /api para o Express (porta 4000, ver vite.config.ts).
 */

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

/** Erro específico de autenticação (usado para distinguir sessão inválida de indisponibilidade). */
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

const API_BASE = import.meta.env?.VITE_API_BASE ?? '';

/** POST /api/auth/login — recebe o JWT e os dados do usuário. */
export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let message = 'Não foi possível entrar. Verifique suas credenciais.';
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // corpo não é JSON
    }
    throw new AuthError(message);
  }

  return (await response.json()) as LoginResponse;
}

/** GET /api/gctk9eo956szchibkbei/me — valida o token e devolve o usuário da sessão. */
export async function apiMe(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE}/api/gctk9eo956szchibkbei/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401 || response.status === 403) {
    throw new AuthError('Sessão expirada ou inválida.');
  }
  if (!response.ok) {
    throw new Error('Não foi possível validar a sessão agora.');
  }

  const data = (await response.json()) as { user: AuthUser };
  return data.user;
}

/**
 * Fetch autenticado para rotas /api/gctk9eo956szchibkbei/*.
 * Qualquer chamada sem o Bearer token recebe 401 do backend.
 */
export function authedFetch(path: string, token: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE}/api/gctk9eo956szchibkbei${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });
}
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { apiLogin, apiMe, AuthError, type AuthUser } from './api';

/**
 * Armazenamento do token:
 * - Memória (estado do React) durante a sessão;
 * - sessionStorage: sobrevive a F5 na mesma aba e é apagado ao fechá-la.
 *
 * NÃO usamos localStorage — assim o token não fica persistido entre
 * sessões/navegadores, reduzindo a superfície de exposição (ex.: XSS).
 * Para exigir login a cada visita, basta remover as linhas de sessionStorage.
 */
const TOKEN_STORAGE_KEY = 'orcoma_admin_token';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isChecking: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    typeof window === 'undefined' ? null : window.sessionStorage.getItem(TOKEN_STORAGE_KEY),
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Ao carregar, valida o token guardado: expirado/adulterado => limpa a sessão.
  useEffect(() => {
    let active = true;

    (async () => {
      const stored = window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
      if (!stored) {
        setIsChecking(false);
        return;
      }

      try {
        const me = await apiMe(stored);
        if (!active) return;
        setToken(stored);
        setUser(me);
      } catch (err) {
        if (err instanceof AuthError) {
          // Token realmente inválido/expirado
          window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
          if (active) {
            setToken(null);
            setUser(null);
          }
        } else if (active) {
          // Backend indisponível no momento: mantém o token em memória.
          setToken(stored);
        }
      } finally {
        if (active) setIsChecking(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token: nextToken, user: nextUser } = await apiLogin(email, password);
    window.sessionStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), isChecking, login, logout }),
    [user, token, isChecking, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro do <AuthProvider>.');
  }
  return context;
}
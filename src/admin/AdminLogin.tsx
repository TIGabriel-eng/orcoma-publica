import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Loader2, Lock, LogIn, Mail } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { TOKENS } from './AdminUI';

/**
 * /gctk9eo956szchibkbei/login — tela de login do painel.
 * Após login bem-sucedido redireciona para a página que o usuário tentava
 * acessar (`state.from`, gravado pelo ProtectedRoute) ou para /gctk9eo956szchibkbei.
 */
export default function AdminLogin() {
  const { login, isAuthenticated, isChecking } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string } | null)?.from ?? '/gctk9eo956szchibkbei';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Já autenticado? Não faz sentido ver o login de novo.
  if (!isChecking && isAuthenticated) {
    return <Navigate to="/gctk9eo956szchibkbei" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{ backgroundColor: '#FFFFF0' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{ backgroundColor: '#0924A7', boxShadow: '0 25px 60px -15px rgba(0,0,0,0.4)' }}
      >
        {/* Cabeçalho */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/grupo-orcoma-logo.png"
            alt="Grupo Orcoma"
            className="h-14 w-auto object-contain mb-4"
          />
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Acesso restrito à equipe
          </p>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div
            className="flex items-start gap-2 rounded-lg px-4 py-3 mb-5 text-sm"
            style={{ backgroundColor: '#FDECEC', color: '#B3261E', border: '1px solid #F5C6C6' }}
            role="alert"
          >
            <AlertCircle size={17} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#FFFFFF' }}>
              E-mail
            </label>
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2.5"
              style={{ backgroundColor: TOKENS.bg, border: `1px solid ${TOKENS.border}` }}
            >
              <Mail size={16} style={{ color: TOKENS.muted }} />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@orcoma.com.br"
                className="bg-transparent w-full text-sm outline-none"
                style={{ color: TOKENS.text }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#FFFFFF' }}>
              Senha
            </label>
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2.5"
              style={{ backgroundColor: TOKENS.bg, border: `1px solid ${TOKENS.border}` }}
            >
              <Lock size={16} style={{ color: TOKENS.muted }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent w-full text-sm outline-none"
                style={{ color: TOKENS.text }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="flex items-center"
                style={{ color: TOKENS.muted }}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-opacity disabled:opacity-60"
            style={{ backgroundColor: TOKENS.gold, color: '#12122B' }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
            {loading ? 'Entrando…' : 'Entrar no painel'}
          </button>
        </form>

        {/* Aviso */}
        <p className="text-xs mt-6 text-center" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Acesso exclusivo para membros autorizados da equipe Orcoma.
        </p>
      </div>
    </div>
  );
}
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * ProtectedRoute — guarda das rotas do painel.
 *
 * - Sem token válido: redireciona para a tela de login, guardando a URL
 *   original em `state.from` para voltar ao destino após o login.
 * - Com token: renderiza as rotas filhas via <Outlet />.
 *
 * Atenção: a proteção REAL acontece no backend (middleware requireAuth
 * nas rotas /api/gctk9eo956szchibkbei/*). Este componente apenas evita que a
 * tela do painel seja exibida a quem não tem sessão.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isChecking } = useAuth();
  const location = useLocation();

  if (isChecking) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: '#F5F5F7' }}
      >
        <p className="text-sm" style={{ color: '#6B6885' }}>
          Verificando sessão…
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/gctk9eo956szchibkbei/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
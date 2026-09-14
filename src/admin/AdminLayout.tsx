import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronRight,
  ClipboardList,
  Home,
  LogOut,
  Newspaper,
  Search,
  Users,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { TOKENS } from './AdminUI';

const NAV_ITEMS = [
  { path: '/gctk9eo956szchibkbei', label: 'Início', icon: Home, end: true },
  { path: '/gctk9eo956szchibkbei/blog', label: 'Blog', icon: Newspaper },
  { path: '/gctk9eo956szchibkbei/usuarios', label: 'Usuários', icon: Users },
  { path: '/gctk9eo956szchibkbei/formularios', label: 'Formulários', icon: ClipboardList },
];

/**
 * Layout do painel administrativo (/gctk9eo956szchibkbei).
 * Todas as rotas filhas (ex.: /gctk9eo956szchibkbei/blog) são renderizadas via <Outlet />.
 * O botão "Sair" limpa o token (AuthContext.logout) e volta ao login.
 */
export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const activeItem = NAV_ITEMS.find((item) =>
    item.end ? location.pathname === item.path : location.pathname.startsWith(item.path),
  );

  const handleLogout = () => {
    logout(); // limpa o token (memória + sessionStorage)
    navigate('/gctk9eo956szchibkbei/login', { replace: true });
  };

  const initials = (user?.name ?? 'Equipe Admin')
    .split(' ')
    .map((part) => part[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="flex w-full min-h-screen"
      style={{ backgroundColor: TOKENS.bg, fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
    >
      {/* Sidebar */}
      <aside
        className="w-60 flex-shrink-0 flex flex-col"
        style={{ backgroundColor: TOKENS.navy }}
      >
        <div className="px-6 py-5">
          <img
            src="/grupo-orcoma-logo.png"
            alt="Grupo Orcoma"
            className="h-10 w-auto object-contain"
          />
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? TOKENS.navyLight : 'transparent',
                  color: isActive ? '#FFFFFF' : '#B8B5D6',
                  borderLeft: isActive ? `3px solid ${TOKENS.gold}` : '3px solid transparent',
                })}
              >
                <Icon size={17} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-6 py-5 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
              style={{ backgroundColor: TOKENS.goldSoft, color: TOKENS.navy }}
            >
              {initials}
            </div>
            <div>
              <p className="text-xs text-white">{user?.name ?? 'Equipe Admin'}</p>
              <p className="text-xs" style={{ color: '#8B87B0' }}>
                {user?.email ?? 'admin@orcoma.com.br'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
            style={{ color: '#FFCFCF', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-8 py-4"
          style={{ backgroundColor: TOKENS.card, borderBottom: `1px solid ${TOKENS.border}` }}
        >
          <div className="flex items-center gap-2 text-sm" style={{ color: TOKENS.muted }}>
            <span>Administração</span>
            <ChevronRight size={14} />
            <span style={{ color: TOKENS.text }}>
              {activeItem?.label ?? 'Administração'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{ backgroundColor: TOKENS.bg, border: `1px solid ${TOKENS.border}` }}
            >
              <Search size={15} style={{ color: TOKENS.muted }} />
              <input
                placeholder="Buscar..."
                className="bg-transparent text-sm outline-none w-40"
                style={{ color: TOKENS.text }}
              />
            </div>
            <Bell size={18} style={{ color: TOKENS.muted, cursor: 'pointer' }} />
          </div>
        </header>

        {/* Página ativa */}
        <main className="flex-1 px-8 py-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
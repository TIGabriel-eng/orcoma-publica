import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import { BlogView, FormulariosView, InicioView, UsuariosView } from './AdminViews';

/**
 * Rotas do painel administrativo (/gctk9eo956szchibkbei/*).
 *
 * Este componente é renderizado dentro de <Route path="/gctk9eo956szchibkbei/*"> e seu
 * <Routes /> é DESCENDENTE — por isso os caminhos precisam ser RELATIVOS
 * ("login", "blog", ...) ao prefixo /gctk9eo956szchibkbei. Caminhos absolutos
 * ("/gctk9eo956szchibkbei") não casam aqui e causam tela branca.
 *
 * Layout:
 *   /gctk9eo956szchibkbei/login          -> público (tela de login)
 *   /gctk9eo956szchibkbei, .../blog,
 *   .../usuarios,
 *   .../formularios    -> protegidas (<ProtectedRoute />)
 *
 * Qualquer outra rota do painel cai no Navigate para o índice.
 */
export default function AdminRoutes() {
  return (
    <Routes>
      {/* Público */}
      <Route path="login" element={<AdminLogin />} />

      {/* Protegido */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<InicioView />} />
          <Route path="blog" element={<BlogView />} />
          <Route path="usuarios" element={<UsuariosView />} />
          <Route path="formularios" element={<FormulariosView />} />
          <Route path="*" element={<Navigate to="/gctk9eo956szchibkbei" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import App from './App.tsx';
import AdminRoutes from './admin/AdminRoutes.tsx';
import {AuthProvider} from './auth/AuthContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Painel administrativo protegido (/gctk9eo956szchibkbei/*) */}
          <Route path="/gctk9eo956szchibkbei/*" element={<AdminRoutes />} />
          {/* Site público (comportamento atual do App) */}
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

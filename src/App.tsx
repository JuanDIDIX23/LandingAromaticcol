import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage }        from './landing/LandingPage';
import { AdminLayout }        from './admin/layout/AdminLayout';
import { ProtectedRoute }     from './admin/components/ProtectedRoute';
import { LoginPage }          from './admin/pages/LoginPage';
import { DashboardPage }      from './admin/pages/DashboardPage';
import { ProspectosPage }     from './admin/pages/ProspectosPage';
import { FeriasPage }         from './admin/pages/FeriasPage';
import { ProductosPage }      from './admin/pages/ProductosPage';
import { ContenidoPage }      from './admin/pages/ContenidoPage';
import { GaleriaPage }        from './admin/pages/GaleriaPage';
import { ConfiguracionPage }  from './admin/pages/ConfiguracionPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Landing pública ─────────────────────────────── */}
        <Route path="/" element={<LandingPage />} />

        {/* ── Admin pública ───────────────────────────────── */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* ── Admin protegida ─────────────────────────────── */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard"    element={<DashboardPage />} />
            <Route path="prospectos"   element={<ProspectosPage />} />
            <Route path="ferias"       element={<FeriasPage />} />
            <Route path="productos"    element={<ProductosPage />} />
            <Route path="contenido"    element={<ContenidoPage />} />
            <Route path="galeria"      element={<GaleriaPage />} />
            <Route path="configuracion" element={<ConfiguracionPage />} />
          </Route>
        </Route>

        {/* ── Catch-all ───────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard':     'Dashboard',
  '/admin/prospectos':    'Prospectos',
  '/admin/ferias':        'Ferias',
  '/admin/productos':     'Productos',
  '/admin/contenido':     'Contenido',
  '/admin/galeria':       'Galería',
  '/admin/configuracion': 'Configuración',
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <header style={{
      height: 60, background: '#fff', borderBottom: '1px solid #e8e2d9',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', position: 'sticky', top: 0, zIndex: 30,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onMenuClick} className="admin-menu-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5a3e2b', display: 'none', padding: 4 }}>
          <Menu size={20} />
        </button>
        <h1 style={{ fontSize: 17, fontWeight: 700, color: '#2a2822' }}>
          {PAGE_TITLES[pathname] ?? 'Admin'}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 12px', borderRadius: 999, background: '#f5f4f2', border: '1px solid #e8e2d9' }}>
          <User size={13} color="#9e8e7e" />
          <span style={{ fontSize: 13, color: '#5a3e2b' }}>{user?.email ?? 'Admin'}</span>
        </div>
        <button onClick={handleSignOut}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500, background: 'none', border: '1px solid #e8e2d9', color: '#b5614a', cursor: 'pointer' }}>
          <LogOut size={13} /> Salir
        </button>
      </div>

      <style>{`
        @media (max-width: 767px) { .admin-menu-btn { display: flex !important; } }
      `}</style>
    </header>
  );
}

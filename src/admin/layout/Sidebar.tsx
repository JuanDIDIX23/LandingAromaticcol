import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, MapPin, Package, FileText,
  Image, Settings, Leaf, X, Globe,
} from 'lucide-react';

const LINKS = [
  { to: '/admin/dashboard',      label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/admin/prospectos',     label: 'Prospectos',     icon: Users            },
  { to: '/admin/ferias',         label: 'Ferias',         icon: MapPin           },
  { to: '/admin/productos',      label: 'Productos',      icon: Package          },
  { to: '/admin/contenido',      label: 'Contenido',      icon: FileText         },
  { to: '/admin/galeria',        label: 'Galería',        icon: Image            },
  { to: '/admin/cobertura',      label: 'Cobertura',      icon: Globe            },
  { to: '/admin/configuracion',  label: 'Configuración',  icon: Settings         },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 39, background: 'rgba(0,0,0,0.4)' }}
          onClick={onClose}
        />
      )}

      <aside style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', width: 220, zIndex: 40,
        background: '#1e1d1b', display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
        // En desktop siempre visible
      }}
        className="admin-sidebar"
      >
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(200,187,168,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#4a5e40,#6b7c5e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={14} color="#e8e2d9" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#e8e2d9' }}>AromaticCol</span>
          </div>
          <button onClick={onClose} className="md:hidden" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9e8e7e', display: 'none' }}>
            <X size={18} />
          </button>
        </div>

        {/* Label sección */}
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#9e8e7e', textTransform: 'uppercase', padding: '16px 20px 8px' }}>
          Admin Panel
        </p>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '0 10px', overflowY: 'auto' }}>
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, marginBottom: 2,
                textDecoration: 'none', fontSize: 14, fontWeight: 500,
                color: isActive ? '#e8e2d9' : 'rgba(232,226,217,0.55)',
                background: isActive ? '#263d29' : 'transparent',
                transition: 'all 0.15s',
              })}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                if (!el.classList.contains('active')) el.style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                if (!el.classList.contains('active')) el.style.background = 'transparent';
              }}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(200,187,168,0.1)' }}>
          <a href="/" target="_blank" rel="noreferrer"
            style={{ fontSize: 12, color: 'rgba(232,226,217,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            Ver landing page ↗
          </a>
        </div>

        <style>{`
          @media (min-width: 768px) {
            .admin-sidebar { transform: translateX(0) !important; }
          }
        `}</style>
      </aside>
    </>
  );
}

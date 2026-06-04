import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f4f2', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Contenido principal — margen izquierdo en desktop */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }} className="admin-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .admin-content { margin-left: 220px; }
        }
      `}</style>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Users, MapPin, Package, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { StatCard } from '../components/StatCard';
import { formatDateTime } from '../../lib/utils';
import type { Prospecto, Feria } from '../../types';

interface Stats {
  totalProspectos: number;
  prospectosEsteMes: number;
  feriasActivas: number;
  feriasFinalizadas: number;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats]               = useState<Stats | null>(null);
  const [recentProspectos, setRecent]   = useState<Prospecto[]>([]);
  const [recentFerias, setFerias]        = useState<Feria[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }

    const today = new Date().toISOString().slice(0, 10);
    const firstOfMonth = new Date(); firstOfMonth.setDate(1); firstOfMonth.setHours(0, 0, 0, 0);

    Promise.all([
      supabase.from('prospectos').select('id', { count: 'exact', head: true }),
      supabase.from('prospectos').select('id', { count: 'exact', head: true }).gte('created_at', firstOfMonth.toISOString()),
      supabase.from('ferias').select('id', { count: 'exact', head: true }).eq('activa', true).gte('fecha_fin', today),
      supabase.from('ferias').select('id', { count: 'exact', head: true }).lt('fecha_fin', today),
      supabase.from('prospectos').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('ferias').select('*').order('created_at', { ascending: false }).limit(4),
    ]).then(([p1, p2, p3, p4, p5, p6]) => {
      setStats({
        totalProspectos:   p1.count ?? 0,
        prospectosEsteMes: p2.count ?? 0,
        feriasActivas:     p3.count ?? 0,
        feriasFinalizadas: p4.count ?? 0,
      });
      setRecent((p5.data ?? []) as Prospecto[]);
      setFerias((p6.data ?? []) as Feria[]);
      setLoading(false);
    });
  }, []);

  const estadoBadge: Record<string, { label: string; bg: string; color: string }> = {
    nuevo:      { label: 'Nuevo',      bg: '#e8f5e9', color: '#2e7d32' },
    contactado: { label: 'Contactado', bg: '#fff3e0', color: '#e65100' },
    convertido: { label: 'Convertido', bg: '#e3f2fd', color: '#1565c0' },
  };

  return (
    <div>
      {!isSupabaseConfigured && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 12, padding: '14px 18px', marginBottom: 24, fontSize: 14, color: '#664d03' }}>
          ⚠️ <strong>Supabase no está configurado.</strong> Crea un archivo <code>.env</code> con tus credenciales para ver datos reales.
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total prospectos"   value={stats?.totalProspectos   ?? 0} icon={<Users size={20} />}    color="#4a5e40" loading={loading} />
        <StatCard label="Este mes"           value={stats?.prospectosEsteMes ?? 0} icon={<TrendingUp size={20} />} color="#b8976a" loading={loading} />
        <StatCard label="Ferias activas"     value={stats?.feriasActivas     ?? 0} icon={<MapPin size={20} />}   color="#263d29" loading={loading} />
        <StatCard label="Ferias finalizadas" value={stats?.feriasFinalizadas ?? 0} icon={<Package size={20} />}  color="#9e8e7e" loading={loading} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {/* Últimos prospectos */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={cardTitleStyle}>Últimos prospectos</h2>
            <button onClick={() => navigate('/admin/prospectos')} style={linkBtnStyle}>
              Ver todos <ArrowRight size={13} />
            </button>
          </div>
          {loading ? (
            <p style={{ color: '#9e8e7e', fontSize: 14 }}>Cargando…</p>
          ) : recentProspectos.length === 0 ? (
            <p style={{ color: '#9e8e7e', fontSize: 14 }}>Aún no hay prospectos</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentProspectos.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: '#faf9f7', border: '1px solid #f0ede8' }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#2a2822' }}>{p.nombre}</p>
                    <p style={{ fontSize: 12, color: '#9e8e7e' }}>{p.telefono} · {formatDateTime(p.created_at)}</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999, ...estadoBadge[p.estado] }}>
                    {estadoBadge[p.estado]?.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ferias recientes */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={cardTitleStyle}>Ferias</h2>
            <button onClick={() => navigate('/admin/ferias')} style={linkBtnStyle}>
              Gestionar <ArrowRight size={13} />
            </button>
          </div>
          {loading ? (
            <p style={{ color: '#9e8e7e', fontSize: 14 }}>Cargando…</p>
          ) : recentFerias.length === 0 ? (
            <p style={{ color: '#9e8e7e', fontSize: 14 }}>No hay ferias registradas</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentFerias.map(f => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: '#faf9f7', border: '1px solid #f0ede8' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.activa ? '#4a5e40' : '#9e8e7e', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#2a2822', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.nombre}</p>
                    <p style={{ fontSize: 12, color: '#9e8e7e' }}>{f.centro_comercial} · {f.ciudad}</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999, background: f.activa ? '#e8f5e9' : '#f5f4f2', color: f.activa ? '#2e7d32' : '#9e8e7e', flexShrink: 0 }}>
                    {f.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #e8e2d9',
  boxShadow: '0 2px 8px rgba(42,40,34,0.06)',
};
const cardTitleStyle: React.CSSProperties = { fontSize: 15, fontWeight: 700, color: '#2a2822' };
const linkBtnStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  fontSize: 13, color: '#4a5e40', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500,
};

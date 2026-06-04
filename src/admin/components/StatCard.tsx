import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  color?: string;
  loading?: boolean;
  suffix?: string;
}

export function StatCard({ label, value, icon, color = '#4a5e40', loading, suffix }: StatCardProps) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '20px 24px',
      border: '1px solid #e8e2d9', boxShadow: '0 2px 8px rgba(42,40,34,0.06)',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${color}18`,
      }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#9e8e7e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          {label}
        </p>
        {loading ? (
          <div style={{ height: 28, width: 64, borderRadius: 6, background: '#e8e2d9', animation: 'pulse 1.5s infinite' }} />
        ) : (
          <p style={{ fontSize: 26, fontWeight: 700, color: '#2a2822', lineHeight: 1 }}>
            {typeof value === 'number' ? value.toLocaleString('es-CO') : value}
            {suffix && <span style={{ fontSize: 16, color: '#9e8e7e', marginLeft: 2 }}>{suffix}</span>}
          </p>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
    </div>
  );
}

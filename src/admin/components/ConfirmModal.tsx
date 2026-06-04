import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmModal({
  open, title, message, confirmLabel = 'Eliminar',
  onConfirm, onCancel, loading,
}: ConfirmModalProps) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    if (open) window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(30,29,27,0.6)', backdropFilter: 'blur(4px)',
      padding: '16px',
    }}
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{
        background: '#fff', borderRadius: 20, padding: '32px',
        maxWidth: 420, width: '100%', boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: '#b5614a18', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AlertTriangle size={20} color="#b5614a" />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 16, color: '#2a2822', marginBottom: 6 }}>{title}</p>
            <p style={{ fontSize: 14, color: '#9e8e7e', lineHeight: 1.5 }}>{message}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} disabled={loading} style={cancelBtnStyle}>
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={loading} style={dangerBtnStyle}>
            {loading ? 'Eliminando…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const cancelBtnStyle: React.CSSProperties = {
  padding: '9px 20px', borderRadius: 10, fontSize: 14, fontWeight: 500,
  background: '#f5f4f2', border: '1px solid #e8e2d9', color: '#5a3e2b',
  cursor: 'pointer',
};

const dangerBtnStyle: React.CSSProperties = {
  padding: '9px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600,
  background: '#b5614a', border: 'none', color: '#fff',
  cursor: 'pointer',
};

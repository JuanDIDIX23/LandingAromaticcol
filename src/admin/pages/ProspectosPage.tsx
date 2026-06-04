import { useState } from 'react';
import { Download, Eye, Trash2, RefreshCw } from 'lucide-react';
import { useProspectos } from '../../hooks/useProspectos';
import { DataTable, type Column } from '../components/DataTable';
import { ConfirmModal } from '../components/ConfirmModal';
import { formatDateTime } from '../../lib/utils';
import type { Prospecto, EstadoProspecto } from '../../types';

const ESTADOS: { value: EstadoProspecto; label: string; bg: string; color: string }[] = [
  { value: 'nuevo',      label: 'Nuevo',      bg: '#e8f5e9', color: '#2e7d32' },
  { value: 'contactado', label: 'Contactado', bg: '#fff3e0', color: '#e65100' },
  { value: 'convertido', label: 'Convertido', bg: '#e3f2fd', color: '#1565c0' },
];

export function ProspectosPage() {
  const { prospectos, loading, refresh, updateEstado, remove, downloadCSV } = useProspectos();
  const [selected, setSelected]       = useState<Prospecto | null>(null);
  const [toDelete, setToDelete]       = useState<Prospecto | null>(null);
  const [deleting, setDeleting]       = useState(false);
  const [filterEstado, setFilter]     = useState<string>('');

  const filtered = filterEstado
    ? prospectos.filter(p => p.estado === filterEstado)
    : prospectos;

  const columns: Column<Prospecto>[] = [
    { key: 'nombre',   header: 'Nombre',   sortable: true,
      render: p => <span style={{ fontWeight: 600 }}>{p.nombre}</span> },
    { key: 'telefono', header: 'Teléfono', sortable: true },
    { key: 'email',    header: 'Email',    render: p => p.email ?? '—' },
    { key: 'producto_interes', header: 'Producto',
      render: p => p.producto_interes ?? '—' },
    { key: 'estado',   header: 'Estado',
      render: p => {
        const e = ESTADOS.find(e => e.value === p.estado);
        return (
          <select
            value={p.estado}
            onChange={ev => updateEstado(p.id, ev.target.value as EstadoProspecto)}
            style={{ fontSize: 12, fontWeight: 600, padding: '3px 8px', borderRadius: 999, border: 'none', cursor: 'pointer', background: e?.bg, color: e?.color }}
          >
            {ESTADOS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        );
      },
    },
    { key: 'created_at', header: 'Fecha', sortable: true,
      render: p => <span style={{ fontSize: 12, color: '#9e8e7e' }}>{formatDateTime(p.created_at)}</span> },
    { key: 'acciones', header: '',
      render: p => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setSelected(p)} style={iconBtn}>
            <Eye size={14} />
          </button>
          <button onClick={() => setToDelete(p)} style={{ ...iconBtn, color: '#b5614a', background: '#fef2f2' }}>
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    await remove(toDelete.id);
    setDeleting(false);
    setToDelete(null);
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#2a2822' }}>
          {prospectos.length} prospectos
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => refresh()} style={outlineBtn}>
            <RefreshCw size={13} /> Actualizar
          </button>
          <button onClick={downloadCSV} style={primaryBtn}>
            <Download size={13} /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Filtro estado */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {[{ value: '', label: 'Todos' }, ...ESTADOS].map(e => (
          <button key={e.value} onClick={() => setFilter(e.value)}
            style={{
              padding: '5px 14px', borderRadius: 999, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', border: 'none',
              background: filterEstado === e.value ? '#4a5e40' : '#e8e2d9',
              color: filterEstado === e.value ? '#fff' : '#5a3e2b',
            }}
          >{e.label}</button>
        ))}
      </div>

      <div style={card}>
        <DataTable
          data={filtered as unknown as Record<string, unknown>[]}
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          searchKeys={['nombre', 'telefono', 'email'] as never[]}
          loading={loading}
          emptyMessage="No hay prospectos"
        />
      </div>

      {/* Modal detalle */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(30,29,27,0.6)', backdropFilter: 'blur(4px)', padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '32px', maxWidth: 480, width: '100%', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#2a2822', marginBottom: 20 }}>Detalle del prospecto</h3>
            {[
              ['Nombre', selected.nombre], ['Teléfono', selected.telefono],
              ['Email', selected.email ?? '—'], ['Producto', selected.producto_interes ?? '—'],
              ['Mensaje', selected.mensaje ?? '—'], ['Origen', selected.feria_origen ?? '—'],
              ['Fecha', formatDateTime(selected.created_at)], ['Estado', selected.estado],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#9e8e7e', width: 90, flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 14, color: '#2a2822', wordBreak: 'break-word' }}>{v}</span>
              </div>
            ))}
            <button onClick={() => setSelected(null)} style={{ ...primaryBtn, marginTop: 12, width: '100%', justifyContent: 'center' }}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Eliminar prospecto"
        message={`¿Eliminar a "${toDelete?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}

const iconBtn: React.CSSProperties = { padding: '5px 8px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#f5f4f2', color: '#5a3e2b', display: 'flex', alignItems: 'center' };
const card:    React.CSSProperties = { background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #e8e2d9', boxShadow: '0 2px 8px rgba(42,40,34,0.06)' };
const primaryBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: '#4a5e40', color: '#fff', border: 'none', cursor: 'pointer' };
const outlineBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500, background: '#fff', color: '#5a3e2b', border: '1px solid #e8e2d9', cursor: 'pointer' };

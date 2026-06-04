import { useState } from 'react';
import { Plus, Pencil, Trash2, Power, PowerOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProductos } from '../../hooks/useProductos';
import { ConfirmModal } from '../components/ConfirmModal';
import { ImageUpload } from '../components/ImageUpload';
import type { Producto } from '../../types';

const TIPOS = [
  { value: 'humidifier', label: 'Humidificador' },
  { value: 'diffuser',   label: 'Difusor' },
  { value: 'kit',        label: 'Kit' },
  { value: 'custom',     label: 'Otro' },
];

const schema = z.object({
  titulo:         z.string().min(2, 'Requerido'),
  tag:            z.string().optional(),
  descripcion:    z.string().optional(),
  tipo:           z.string().optional(),
  activo:         z.boolean(),
  whatsapp_texto: z.string().optional(),
  orden:          z.number().optional(),
});
type FormData = z.infer<typeof schema>;

export function ProductosPage() {
  const { productos, loading, create, update, remove, toggleActivo } = useProductos();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<Producto | null>(null);
  const [toDelete, setToDelete]   = useState<Producto | null>(null);
  const [deleting, setDeleting]   = useState(false);
  const [imgUrl, setImgUrl]       = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { activo: true, orden: 0, tipo: 'humidifier' },
  });

  const openCreate = () => {
    reset({ activo: true, orden: productos.length, titulo: '', tag: '', descripcion: '', tipo: 'humidifier', whatsapp_texto: '' });
    setImgUrl(null); setEditing(null); setModalOpen(true);
  };

  const openEdit = (p: Producto) => {
    setEditing(p); setImgUrl(p.imagen_url);
    reset({ titulo: p.titulo, tag: p.tag ?? '', descripcion: p.descripcion ?? '', tipo: p.tipo ?? 'humidifier', activo: p.activo, whatsapp_texto: p.whatsapp_texto ?? '', orden: p.orden });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true); setError(null);
    const payload = { ...data, tipo: data.tipo ?? 'humidifier', orden: data.orden ?? productos.length, imagen_url: imgUrl };
    const result = editing ? await update(editing.id, payload) : await create(payload as Omit<Producto, 'id' | 'created_at'>);
    setSaving(false);
    if (result.error) setError(result.error);
    else { setModalOpen(false); setEditing(null); }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    await remove(toDelete.id);
    setDeleting(false); setToDelete(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 14, color: '#9e8e7e' }}>{productos.length} productos</p>
        <button onClick={openCreate} style={primaryBtn}><Plus size={15} /> Nuevo producto</button>
      </div>

      {loading ? <p style={{ color: '#9e8e7e' }}>Cargando…</p> : productos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#9e8e7e' }}>
          <p style={{ marginBottom: 12 }}>No hay productos. ¡Crea el primero!</p>
          <button onClick={openCreate} style={primaryBtn}><Plus size={14} /> Crear producto</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {productos.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e8e2d9', boxShadow: '0 2px 8px rgba(42,40,34,0.06)', opacity: p.activo ? 1 : 0.6 }}>
              {p.imagen_url ? (
                <img src={p.imagen_url} alt={p.titulo} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: 140, background: '#f5f4f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>📦</div>
              )}
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2a2822' }}>{p.titulo}</h3>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: p.activo ? '#e8f5e9' : '#f5f4f2', color: p.activo ? '#2e7d32' : '#9e8e7e', flexShrink: 0, marginLeft: 8 }}>
                    {p.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                {p.tag && <span style={{ fontSize: 11, background: 'rgba(74,94,64,0.10)', color: '#4a5e40', padding: '2px 8px', borderRadius: 999 }}>{p.tag}</span>}
                {p.descripcion && <p style={{ fontSize: 13, color: '#9e8e7e', marginTop: 8, lineHeight: 1.5 }}>{p.descripcion.slice(0, 80)}{p.descripcion.length > 80 ? '…' : ''}</p>}
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button onClick={() => openEdit(p)} style={iconBtn}><Pencil size={13} /></button>
                  <button onClick={() => toggleActivo(p.id, !p.activo)} style={{ ...iconBtn, background: p.activo ? '#fff3e0' : '#e8f5e9', color: p.activo ? '#e65100' : '#2e7d32' }}>
                    {p.activo ? <PowerOff size={13} /> : <Power size={13} />}
                  </button>
                  <button onClick={() => setToDelete(p)} style={{ ...iconBtn, background: '#fef2f2', color: '#b5614a' }}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div style={modalStyle}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#2a2822', marginBottom: 20 }}>{editing ? 'Editar producto' : 'Nuevo producto'}</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px', marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Título *</label>
                  <input {...register('titulo')} style={inputStyle(!!errors.titulo)} placeholder="Humidificador Premium" />
                  {errors.titulo && <p style={errStyle}>{errors.titulo.message}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Tag / Badge</label>
                  <input {...register('tag')} style={inputStyle(false)} placeholder="Más vendido" />
                </div>
                <div>
                  <label style={labelStyle}>Tipo de visual</label>
                  <select {...register('tipo')} style={inputStyle(false)}>
                    {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Orden</label>
                  <input {...register('orden', { valueAsNumber: true })} type="number" style={inputStyle(false)} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Descripción</label>
                <textarea {...register('descripcion')} rows={2} style={{ ...inputStyle(false), resize: 'vertical' }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Mensaje WhatsApp (personalizado)</label>
                <input {...register('whatsapp_texto')} style={inputStyle(false)} placeholder="Hola, me interesa el humidificador…" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Imagen del producto</label>
                <ImageUpload bucket="productos" currentUrl={imgUrl} onUploaded={url => setImgUrl(url)} onRemove={() => setImgUrl(null)} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, cursor: 'pointer', fontSize: 14, color: '#5a3e2b' }}>
                <input type="checkbox" {...register('activo')} /> Producto activo (visible en la landing)
              </label>
              {error && <p style={errStyle}>{error}</p>}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={outlineBtn}>Cancelar</button>
                <button type="submit" disabled={saving} style={primaryBtn}>{saving ? 'Guardando…' : editing ? 'Guardar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal open={!!toDelete} title="Eliminar producto" message={`¿Eliminar "${toDelete?.titulo}"?`} onConfirm={handleDelete} onCancel={() => setToDelete(null)} loading={deleting} />
    </div>
  );
}

const overlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(30,29,27,0.6)', backdropFilter: 'blur(4px)', padding: 16, overflowY: 'auto' };
const modalStyle:   React.CSSProperties = { background: '#fff', borderRadius: 20, padding: '28px', width: '100%', maxWidth: 580, boxShadow: '0 24px 48px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' };
const labelStyle:   React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: '#5a3e2b', marginBottom: 5 };
const errStyle:     React.CSSProperties = { fontSize: 12, color: '#b5614a', marginTop: 4 };
const inputStyle    = (hasErr: boolean): React.CSSProperties => ({ width: '100%', padding: '9px 12px', borderRadius: 10, fontSize: 14, border: `1px solid ${hasErr ? '#b5614a' : '#e8e2d9'}`, color: '#2a2822', background: '#fff', outline: 'none', boxSizing: 'border-box' });
const iconBtn:      React.CSSProperties = { padding: '7px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#f5f4f2', color: '#5a3e2b', display: 'flex', alignItems: 'center' };
const primaryBtn:   React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: '#4a5e40', color: '#fff', border: 'none', cursor: 'pointer' };
const outlineBtn:   React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, fontSize: 14, fontWeight: 500, background: '#fff', color: '#5a3e2b', border: '1px solid #e8e2d9', cursor: 'pointer' };

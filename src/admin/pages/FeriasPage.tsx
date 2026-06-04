import { useState } from 'react';
import { Plus, Pencil, Trash2, Power, PowerOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFerias } from '../../hooks/useFerias';
import { ConfirmModal } from '../components/ConfirmModal';
import { ImageUpload } from '../components/ImageUpload';
import { formatDate } from '../../lib/utils';
import type { Feria } from '../../types';

const schema = z.object({
  nombre:          z.string().min(2, 'Requerido'),
  centro_comercial:z.string().min(2, 'Requerido'),
  ciudad:          z.string().min(2, 'Requerido'),
  fecha_inicio:    z.string().min(1, 'Requerido'),
  fecha_fin:       z.string().min(1, 'Requerido'),
  descripcion:     z.string().optional(),
  dias_horario:    z.string().optional(),
  activa:          z.boolean(),
  orden:           z.number().optional(),
});
type FormData = z.infer<typeof schema>;

export function FeriasPage() {
  const { ferias, loading, create, update, remove, toggleActiva } = useFerias();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<Feria | null>(null);
  const [toDelete, setToDelete]   = useState<Feria | null>(null);
  const [deleting, setDeleting]   = useState(false);
  const [imgUrl, setImgUrl]       = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { activa: true, orden: 0 },
  });

  const openCreate = () => {
    reset({ activa: true, orden: ferias.length, nombre: '', centro_comercial: '', ciudad: 'Bogotá', fecha_inicio: '', fecha_fin: '', descripcion: '', dias_horario: '' });
    setImgUrl(null);
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (f: Feria) => {
    setEditing(f);
    setImgUrl(f.imagen_url);
    reset({
      nombre: f.nombre, centro_comercial: f.centro_comercial, ciudad: f.ciudad,
      fecha_inicio: f.fecha_inicio, fecha_fin: f.fecha_fin,
      descripcion: f.descripcion ?? '', dias_horario: f.dias_horario ?? '',
      activa: f.activa, orden: f.orden,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true); setError(null);
    const payload = { ...data, orden: data.orden ?? ferias.length, imagen_url: imgUrl };
    const result = editing
      ? await update(editing.id, payload)
      : await create(payload as Omit<Feria, 'id' | 'created_at'>);
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

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 14, color: '#9e8e7e' }}>{ferias.length} ferias registradas</p>
        <button onClick={openCreate} style={primaryBtn}>
          <Plus size={15} /> Nueva feria
        </button>
      </div>

      {/* Grid de ferias */}
      {loading ? (
        <p style={{ color: '#9e8e7e' }}>Cargando…</p>
      ) : ferias.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#9e8e7e' }}>
          <p style={{ marginBottom: 12 }}>No hay ferias. ¡Crea la primera!</p>
          <button onClick={openCreate} style={primaryBtn}><Plus size={14} /> Crear feria</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {ferias.map(f => {
            const ended = f.fecha_fin < today;
            return (
              <div key={f.id} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e8e2d9', boxShadow: '0 2px 8px rgba(42,40,34,0.06)' }}>
                {/* Imagen */}
                {f.imagen_url ? (
                  <img src={f.imagen_url} alt={f.nombre} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: 140, background: '#f5f4f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 32 }}>🏪</span>
                  </div>
                )}
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2a2822' }}>{f.nombre}</h3>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999, flexShrink: 0, marginLeft: 8, background: ended ? '#f5f4f2' : f.activa ? '#e8f5e9' : '#fff3e0', color: ended ? '#9e8e7e' : f.activa ? '#2e7d32' : '#e65100' }}>
                      {ended ? 'Finalizada' : f.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#9e8e7e', marginBottom: 4 }}>{f.centro_comercial} · {f.ciudad}</p>
                  <p style={{ fontSize: 12, color: '#c8bba8' }}>{formatDate(f.fecha_inicio)} → {formatDate(f.fecha_fin)}</p>
                  {f.dias_horario && <p style={{ fontSize: 12, color: '#c8bba8', marginTop: 2 }}>{f.dias_horario}</p>}

                  {/* Acciones */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <button onClick={() => openEdit(f)} style={iconBtn} title="Editar"><Pencil size={13} /></button>
                    {!ended && (
                      <button onClick={() => toggleActiva(f.id, !f.activa)} style={{ ...iconBtn, background: f.activa ? '#fff3e0' : '#e8f5e9', color: f.activa ? '#e65100' : '#2e7d32' }} title={f.activa ? 'Desactivar' : 'Activar'}>
                        {f.activa ? <PowerOff size={13} /> : <Power size={13} />}
                      </button>
                    )}
                    <button onClick={() => setToDelete(f)} style={{ ...iconBtn, background: '#fef2f2', color: '#b5614a' }} title="Eliminar"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal crear/editar */}
      {modalOpen && (
        <div style={overlay} onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div style={modal}>
            <h3 style={modalTitle}>{editing ? 'Editar feria' : 'Nueva feria'}</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={grid2}>
                <div>
                  <label style={labelStyle}>Nombre *</label>
                  <input {...register('nombre')} style={inputStyle(!!errors.nombre)} placeholder="Feria Primavera" />
                  {errors.nombre && <p style={errStyle}>{errors.nombre.message}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Centro comercial *</label>
                  <input {...register('centro_comercial')} style={inputStyle(!!errors.centro_comercial)} placeholder="Titán Plaza" />
                  {errors.centro_comercial && <p style={errStyle}>{errors.centro_comercial.message}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Ciudad *</label>
                  <input {...register('ciudad')} style={inputStyle(!!errors.ciudad)} placeholder="Bogotá" />
                </div>
                <div>
                  <label style={labelStyle}>Horario (días)</label>
                  <input {...register('dias_horario')} style={inputStyle(false)} placeholder="Jue – Dom 10am–8pm" />
                </div>
                <div>
                  <label style={labelStyle}>Fecha inicio *</label>
                  <input {...register('fecha_inicio')} type="date" style={inputStyle(!!errors.fecha_inicio)} />
                  {errors.fecha_inicio && <p style={errStyle}>{errors.fecha_inicio.message}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Fecha fin *</label>
                  <input {...register('fecha_fin')} type="date" style={inputStyle(!!errors.fecha_fin)} />
                  {errors.fecha_fin && <p style={errStyle}>{errors.fecha_fin.message}</p>}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Descripción</label>
                <textarea {...register('descripcion')} rows={2} style={{ ...inputStyle(false), resize: 'vertical' }} placeholder="Información adicional…" />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Imagen</label>
                <ImageUpload
                  bucket="ferias"
                  currentUrl={imgUrl}
                  onUploaded={url => setImgUrl(url)}
                  onRemove={() => setImgUrl(null)}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, cursor: 'pointer', fontSize: 14, color: '#5a3e2b' }}>
                <input type="checkbox" {...register('activa')} />
                Feria activa (visible en la landing)
              </label>

              {error && <p style={errStyle}>{error}</p>}

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={outlineBtn}>Cancelar</button>
                <button type="submit" disabled={saving} style={primaryBtn}>
                  {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear feria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Eliminar feria"
        message={`¿Eliminar "${toDelete?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}

const overlay:  React.CSSProperties = { position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(30,29,27,0.6)', backdropFilter: 'blur(4px)', padding: 16, overflowY: 'auto' };
const modal:    React.CSSProperties = { background: '#fff', borderRadius: 20, padding: '28px', width: '100%', maxWidth: 620, boxShadow: '0 24px 48px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' };
const modalTitle: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#2a2822', marginBottom: 20 };
const grid2:    React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px', marginBottom: 14 };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: '#5a3e2b', marginBottom: 5 };
const errStyle:   React.CSSProperties = { fontSize: 12, color: '#b5614a', marginTop: 4 };
const inputStyle  = (hasErr: boolean): React.CSSProperties => ({ width: '100%', padding: '9px 12px', borderRadius: 10, fontSize: 14, border: `1px solid ${hasErr ? '#b5614a' : '#e8e2d9'}`, color: '#2a2822', background: '#fff', outline: 'none', boxSizing: 'border-box' });
const iconBtn:    React.CSSProperties = { padding: '7px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#f5f4f2', color: '#5a3e2b', display: 'flex', alignItems: 'center' };
const primaryBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: '#4a5e40', color: '#fff', border: 'none', cursor: 'pointer' };
const outlineBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, fontSize: 14, fontWeight: 500, background: '#fff', color: '#5a3e2b', border: '1px solid #e8e2d9', cursor: 'pointer' };

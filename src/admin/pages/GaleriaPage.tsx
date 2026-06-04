import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { ConfirmModal } from '../components/ConfirmModal';
import { formatDateTime } from '../../lib/utils';
import type { GaleriaItem } from '../../types';

const CATEGORIAS = ['general', 'productos', 'ferias', 'ambientes', 'equipo'];

export function GaleriaPage() {
  const [items, setItems]             = useState<GaleriaItem[]>([]);
  const [loading, setLoading]         = useState(true);
  const [uploading, setUploading]     = useState(false);
  const [toDelete, setToDelete]       = useState<GaleriaItem | null>(null);
  const [deleting, setDeleting]       = useState(false);
  const [filterCat, setFilterCat]     = useState('');
  const [newCat, setNewCat]           = useState('general');
  const [error, setError]             = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    let q = supabase.from('galeria').select('*').order('orden').order('created_at', { ascending: false });
    if (filterCat) q = q.eq('categoria', filterCat);
    const { data } = await q;
    setItems((data ?? []) as GaleriaItem[]);
    setLoading(false);
  }, [filterCat]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleFiles = async (files: FileList) => {
    if (!isSupabaseConfigured) { setError('Supabase no configurado'); return; }
    setUploading(true); setError(null);
    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) { setError(`${file.name} supera 10MB`); continue; }
      const ext  = file.name.split('.').pop();
      const path = `${newCat}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('galerias').upload(path, file, { upsert: true });
      if (upErr) { setError(upErr.message); continue; }
      const { data } = supabase.storage.from('galerias').getPublicUrl(path);
      await supabase.from('galeria').insert({
        url: data.publicUrl, storage_path: path,
        categoria: newCat, nombre: file.name, orden: items.length,
      });
    }
    await fetch();
    setUploading(false);
  };

  const handleDelete = async () => {
    if (!toDelete || !isSupabaseConfigured) return;
    setDeleting(true);
    if (toDelete.storage_path) {
      await supabase.storage.from('galerias').remove([toDelete.storage_path]);
    }
    await supabase.from('galeria').delete().eq('id', toDelete.id);
    setItems(prev => prev.filter(i => i.id !== toDelete.id));
    setDeleting(false); setToDelete(null);
  };

  const filtered = filterCat ? items.filter(i => i.categoria === filterCat) : items;

  return (
    <div>
      {!isSupabaseConfigured && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 12, padding: '14px 18px', marginBottom: 20, fontSize: 14, color: '#664d03' }}>
          ⚠️ Supabase no configurado. Necesitas el bucket "galerias" en Supabase Storage (público).
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 14, color: '#9e8e7e' }}>{filtered.length} imágenes</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={newCat} onChange={e => setNewCat(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: 10, border: '1px solid #e8e2d9', fontSize: 13, color: '#5a3e2b', background: '#fff', outline: 'none' }}>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <label style={{ ...primaryBtn, cursor: 'pointer' }}>
            <Plus size={14} /> {uploading ? 'Subiendo…' : 'Subir imágenes'}
            <input type="file" multiple accept="image/*" style={{ display: 'none' }}
              onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ''; }}
              disabled={uploading}
            />
          </label>
          <button onClick={() => fetch()} style={outlineBtn}><RefreshCw size={13} /></button>
        </div>
      </div>

      {error && <p style={{ fontSize: 13, color: '#b5614a', marginBottom: 12 }}>{error}</p>}

      {/* Filtros por categoría */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {[{ value: '', label: 'Todas' }, ...CATEGORIAS.map(c => ({ value: c, label: c }))].map(c => (
          <button key={c.value} onClick={() => setFilterCat(c.value)}
            style={{ padding: '5px 14px', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none', background: filterCat === c.value ? '#4a5e40' : '#e8e2d9', color: filterCat === c.value ? '#fff' : '#5a3e2b' }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid de imágenes */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: '4/3', borderRadius: 12, background: '#f0ede8', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#9e8e7e' }}>
          <p>No hay imágenes. Sube las primeras.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid #e8e2d9', background: '#f5f4f2', aspectRatio: '4/3' }}>
              <img src={item.url} alt={item.nombre ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              {/* Overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)', opacity: 0, transition: 'opacity 0.2s' }}
                className="img-overlay"
              />
              <button onClick={() => setToDelete(item)}
                style={{ position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: '50%', background: 'rgba(181,97,74,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Trash2 size={13} />
              </button>
              <div style={{ position: 'absolute', bottom: 6, left: 8, right: 8 }}>
                <span style={{ fontSize: 10, background: 'rgba(74,94,64,0.85)', color: '#fff', padding: '2px 7px', borderRadius: 999 }}>
                  {item.categoria}
                </span>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{formatDateTime(item.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Eliminar imagen"
        message="¿Eliminar esta imagen? Se borrará del storage permanentemente."
        confirmLabel="Eliminar imagen"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
    </div>
  );
}

const primaryBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: '#4a5e40', color: '#fff', border: 'none' };
const outlineBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 10, fontSize: 13, fontWeight: 500, background: '#fff', color: '#5a3e2b', border: '1px solid #e8e2d9', cursor: 'pointer' };

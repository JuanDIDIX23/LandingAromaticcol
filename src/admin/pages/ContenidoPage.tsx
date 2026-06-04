import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { ImageUpload } from '../components/ImageUpload';
import type { ContenidoItem } from '../../types';

const SECCIONES = [
  { key: 'hero',      label: 'Hero (portada)' },
  { key: 'nosotros',  label: 'Nosotros' },
  { key: 'cta',       label: 'CTA / Contacto' },
];

export function ContenidoPage() {
  const [activeSection, setActiveSection] = useState('hero');
  const [items, setItems]                 = useState<ContenidoItem[]>([]);
  const [drafts, setDrafts]               = useState<Record<string, string>>({});
  const [loading, setLoading]             = useState(true);
  const [saving, setSaving]               = useState(false);
  const [savedMsg, setSavedMsg]           = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  const fetch = async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase.from('contenido').select('*').order('clave');
    const rows = (data ?? []) as ContenidoItem[];
    setItems(rows);
    const d: Record<string, string> = {};
    rows.forEach(r => { d[`${r.seccion}__${r.clave}`] = r.valor ?? ''; });
    setDrafts(d);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const sectionItems = items.filter(i => i.seccion === activeSection);

  const handleChange = (seccion: string, clave: string, valor: string) => {
    setDrafts(prev => ({ ...prev, [`${seccion}__${clave}`]: valor }));
  };

  const handleSave = async () => {
    if (!isSupabaseConfigured) return;
    setSaving(true); setError(null);
    const toSave = sectionItems.map(item => ({
      id: item.id,
      valor: drafts[`${item.seccion}__${item.clave}`] ?? item.valor ?? '',
    }));
    const results = await Promise.all(
      toSave.map(({ id, valor }) =>
        supabase.from('contenido').update({ valor }).eq('id', id)
      )
    );
    const err = results.find(r => r.error);
    if (err?.error) setError(err.error.message);
    else { setSavedMsg(true); setTimeout(() => setSavedMsg(false), 2500); }
    setSaving(false);
  };

  const handleImageUploaded = (clave: string, url: string) => {
    handleChange(activeSection, clave, url);
    // Guardar inmediatamente
    const item = items.find(i => i.seccion === activeSection && i.clave === clave);
    if (item) supabase.from('contenido').update({ valor: url }).eq('id', item.id);
  };

  return (
    <div style={{ maxWidth: 720 }}>
      {!isSupabaseConfigured && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 12, padding: '14px 18px', marginBottom: 20, fontSize: 14, color: '#664d03' }}>
          ⚠️ Supabase no configurado. Conecta la base de datos para editar contenido.
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid #e8e2d9', paddingBottom: 0 }}>
        {SECCIONES.map(s => (
          <button key={s.key} onClick={() => setActiveSection(s.key)}
            style={{
              padding: '9px 18px', fontSize: 14, fontWeight: 500, border: 'none',
              cursor: 'pointer', background: 'none', borderRadius: '10px 10px 0 0',
              color: activeSection === s.key ? '#4a5e40' : '#9e8e7e',
              borderBottom: `2px solid ${activeSection === s.key ? '#4a5e40' : 'transparent'}`,
            }}
          >{s.label}</button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#9e8e7e' }}>Cargando…</p>
      ) : sectionItems.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e8e2d9', textAlign: 'center', color: '#9e8e7e' }}>
          <p>No hay campos para esta sección.</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>Asegúrate de haber ejecutado el schema SQL en Supabase.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e8e2d9', boxShadow: '0 2px 8px rgba(42,40,34,0.06)' }}>
          {sectionItems.map(item => (
            <div key={item.id} style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#5a3e2b', marginBottom: 6, textTransform: 'capitalize' }}>
                {item.clave.replace(/_/g, ' ')}
                <span style={{ fontSize: 11, color: '#9e8e7e', fontWeight: 400, marginLeft: 6 }}>({item.tipo})</span>
              </label>

              {item.tipo === 'image_url' ? (
                <div>
                  <ImageUpload
                    bucket="contenido"
                    folder={activeSection}
                    currentUrl={drafts[`${item.seccion}__${item.clave}`] || null}
                    onUploaded={url => handleImageUploaded(item.clave, url)}
                    onRemove={() => handleChange(item.seccion, item.clave, '')}
                  />
                </div>
              ) : item.tipo === 'html' || (drafts[`${item.seccion}__${item.clave}`]?.length ?? 0) > 100 ? (
                <textarea
                  value={drafts[`${item.seccion}__${item.clave}`] ?? ''}
                  onChange={e => handleChange(item.seccion, item.clave, e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 10, fontSize: 14, border: '1px solid #e8e2d9', color: '#2a2822', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              ) : (
                <input
                  value={drafts[`${item.seccion}__${item.clave}`] ?? ''}
                  onChange={e => handleChange(item.seccion, item.clave, e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 10, fontSize: 14, border: '1px solid #e8e2d9', color: '#2a2822', outline: 'none', boxSizing: 'border-box' }}
                />
              )}
            </div>
          ))}

          {error && <p style={{ fontSize: 13, color: '#b5614a', marginBottom: 12 }}>{error}</p>}
          {savedMsg && <p style={{ fontSize: 13, color: '#4a5e40', marginBottom: 12 }}>✓ Cambios guardados</p>}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={fetch} style={outlineBtn}><RefreshCw size={13} /> Descartar cambios</button>
            <button onClick={handleSave} disabled={saving} style={primaryBtn}>
              <Save size={13} /> {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const primaryBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: '#4a5e40', color: '#fff', border: 'none', cursor: 'pointer' };
const outlineBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, fontSize: 14, fontWeight: 500, background: '#fff', color: '#5a3e2b', border: '1px solid #e8e2d9', cursor: 'pointer' };

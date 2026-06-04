import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useConfig } from '../../hooks/useConfig';
import { isSupabaseConfigured } from '../../lib/supabase';

const FIELDS = [
  { key: 'whatsapp_numero',  label: 'Número de WhatsApp',   placeholder: '573001234567',          hint: 'Sin espacios ni + (ej: 573001234567)' },
  { key: 'whatsapp_mensaje', label: 'Mensaje de WhatsApp',   placeholder: 'Hola, me interesa…',    hint: 'Texto por defecto al abrir WhatsApp' },
  { key: 'instagram_url',    label: 'URL de Instagram',      placeholder: 'https://instagram.com/aromaticcol', hint: '' },
  { key: 'tiktok_url',       label: 'URL de TikTok',         placeholder: 'https://tiktok.com/@aromaticcol',   hint: '' },
  { key: 'email_contacto',   label: 'Email de contacto',     placeholder: 'contacto@aromaticcol.com', hint: '' },
  { key: 'direccion',        label: 'Dirección / Ciudad',    placeholder: 'Bogotá, Colombia',       hint: '' },
  { key: 'horario_atencion', label: 'Horario de atención',   placeholder: 'Lun – Dom 9am – 8pm',   hint: '' },
];

export function ConfiguracionPage() {
  const { config, loading, setBulk } = useConfig();
  const [drafts, setDrafts]          = useState<Record<string, string>>({});
  const [saving, setSaving]          = useState(false);
  const [savedMsg, setSavedMsg]      = useState(false);
  const [error, setError]            = useState<string | null>(null);

  useEffect(() => {
    if (!loading) setDrafts({ ...config });
  }, [config, loading]);

  const handleSave = async () => {
    setSaving(true); setError(null);
    const { error: err } = await setBulk(drafts);
    setSaving(false);
    if (err) setError(err);
    else { setSavedMsg(true); setTimeout(() => setSavedMsg(false), 2500); }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      {!isSupabaseConfigured && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 12, padding: '14px 18px', marginBottom: 20, fontSize: 14, color: '#664d03' }}>
          ⚠️ Supabase no configurado. Los cambios no se guardarán.
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 16, padding: '28px', border: '1px solid #e8e2d9', boxShadow: '0 2px 8px rgba(42,40,34,0.06)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#2a2822', marginBottom: 24 }}>Información general del negocio</h2>

        {loading ? (
          <p style={{ color: '#9e8e7e' }}>Cargando configuración…</p>
        ) : (
          FIELDS.map(field => (
            <div key={field.key} style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#5a3e2b', marginBottom: 5 }}>
                {field.label}
              </label>
              {field.key === 'whatsapp_mensaje' ? (
                <textarea
                  value={drafts[field.key] ?? ''}
                  onChange={e => setDrafts(p => ({ ...p, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  rows={2}
                  style={textareaStyle}
                />
              ) : (
                <input
                  value={drafts[field.key] ?? ''}
                  onChange={e => setDrafts(p => ({ ...p, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={inputStyle}
                />
              )}
              {field.hint && <p style={{ fontSize: 12, color: '#9e8e7e', marginTop: 4 }}>{field.hint}</p>}
            </div>
          ))
        )}

        {error && <p style={{ fontSize: 13, color: '#b5614a', marginBottom: 12 }}>{error}</p>}
        {savedMsg && <p style={{ fontSize: 13, color: '#4a5e40', marginBottom: 12 }}>✓ Configuración guardada</p>}

        <button onClick={handleSave} disabled={saving || loading} style={primaryBtn}>
          <Save size={14} /> {saving ? 'Guardando…' : 'Guardar configuración'}
        </button>
      </div>

      {/* Vista previa WhatsApp */}
      {drafts.whatsapp_numero && (
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #e8e2d9', marginTop: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#2a2822', marginBottom: 10 }}>Vista previa del link de WhatsApp</h3>
          <a
            href={`https://wa.me/${drafts.whatsapp_numero}?text=${encodeURIComponent(drafts.whatsapp_mensaje ?? '')}`}
            target="_blank" rel="noreferrer"
            style={{ fontSize: 13, color: '#4a5e40', wordBreak: 'break-all' }}
          >
            https://wa.me/{drafts.whatsapp_numero}?text=…
          </a>
        </div>
      )}
    </div>
  );
}

const inputStyle:    React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14, border: '1px solid #e8e2d9', color: '#2a2822', background: '#fff', outline: 'none', boxSizing: 'border-box' };
const textareaStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical', fontFamily: 'inherit' } as React.CSSProperties;
const primaryBtn:    React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: '#4a5e40', color: '#fff', border: 'none', cursor: 'pointer' };

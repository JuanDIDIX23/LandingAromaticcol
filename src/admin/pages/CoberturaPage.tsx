import { useState, useEffect } from 'react';
import { Save, MapPin } from 'lucide-react';
import { useConfig } from '../../hooks/useConfig';
import { isSupabaseConfigured } from '../../lib/supabase';

const STATS_FIELDS = [
  { key: 'cob_stat_tiempo',      label: 'Tiempo promedio de entrega', placeholder: '24 – 48h',   hint: 'Ej: 24 – 48h, 1 – 3 días' },
  { key: 'cob_stat_pedidos',     label: 'Pedidos entregados',         placeholder: '+3,500',      hint: 'Ej: +3,500, +5,000' },
  { key: 'cob_stat_ciudades',    label: 'Cobertura',                  placeholder: '4 ciudades',  hint: 'Ej: 4 ciudades, 5+ ciudades' },
  { key: 'cob_stat_crecimiento', label: 'Crecimiento anual',          placeholder: 'x2.4',        hint: 'Ej: x2.4, x3.0' },
];

const LOCATIONS_INFO = [
  { city: 'Bogotá',   region: 'Cundinamarca', tag: 'Sede principal',  flag: '🏙️' },
  { city: 'Ibagué',   region: 'Tolima',       tag: 'Ciudad corazón',  flag: '🎵' },
  { city: 'Cali',     region: 'Valle del Cauca', tag: 'Pacífico',     flag: '🌺' },
  { city: 'Ecuador',  region: 'Internacional', tag: 'Exportación',    flag: '🌍' },
];

export function CoberturaPage() {
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
    const cobFields: Record<string, string> = {};
    STATS_FIELDS.forEach(f => { cobFields[f.key] = drafts[f.key] ?? ''; });
    const { error: err } = await setBulk(cobFields);
    setSaving(false);
    if (err) setError(err);
    else { setSavedMsg(true); setTimeout(() => setSavedMsg(false), 2500); }
  };

  return (
    <div style={{ maxWidth: 680 }}>
      {!isSupabaseConfigured && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 12, padding: '14px 18px', marginBottom: 20, fontSize: 14, color: '#664d03' }}>
          ⚠️ Supabase no configurado. Los cambios no se guardarán.
        </div>
      )}

      {/* Stats editables */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '28px', border: '1px solid #e8e2d9', boxShadow: '0 2px 8px rgba(42,40,34,0.06)', marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#2a2822', marginBottom: 6 }}>Estadísticas de cobertura</h2>
        <p style={{ fontSize: 13, color: '#9e8e7e', marginBottom: 24 }}>Estos valores se muestran en los indicadores de la sección Cobertura de la landing.</p>

        {loading ? (
          <p style={{ color: '#9e8e7e' }}>Cargando…</p>
        ) : (
          STATS_FIELDS.map(field => (
            <div key={field.key} style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#5a3e2b', marginBottom: 5 }}>
                {field.label}
              </label>
              <input
                value={drafts[field.key] ?? ''}
                onChange={e => setDrafts(p => ({ ...p, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                style={inputStyle}
              />
              <p style={{ fontSize: 12, color: '#9e8e7e', marginTop: 4 }}>{field.hint}</p>
            </div>
          ))
        )}

        {error && <p style={{ fontSize: 13, color: '#b5614a', marginBottom: 12 }}>{error}</p>}
        {savedMsg && <p style={{ fontSize: 13, color: '#4a5e40', marginBottom: 12 }}>✓ Estadísticas guardadas</p>}

        <button onClick={handleSave} disabled={saving || loading} style={primaryBtn}>
          <Save size={14} /> {saving ? 'Guardando…' : 'Guardar estadísticas'}
        </button>
      </div>

      {/* Ciudades activas (solo lectura) */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '28px', border: '1px solid #e8e2d9', boxShadow: '0 2px 8px rgba(42,40,34,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <MapPin size={16} color="#4a5e40" />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#2a2822' }}>Ciudades activas</h2>
        </div>
        <p style={{ fontSize: 13, color: '#9e8e7e', marginBottom: 20 }}>
          Las ciudades se configuran directamente en el código. Contacta al desarrollador para agregar o remover ubicaciones.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {LOCATIONS_INFO.map(loc => (
            <div key={loc.city} style={{ padding: '14px 16px', borderRadius: 12, background: '#f8f5f0', border: '1px solid #e8e2d9' }}>
              <span style={{ fontSize: 22, display: 'block', marginBottom: 6 }}>{loc.flag}</span>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#2a2822', marginBottom: 2 }}>{loc.city}</p>
              <p style={{ fontSize: 11, color: '#9e8e7e', marginBottom: 4 }}>{loc.region}</p>
              <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: '#e8f0e8', color: '#4a5e40' }}>
                {loc.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
  border: '1px solid #e8e2d9', color: '#2a2822', background: '#fff',
  outline: 'none', boxSizing: 'border-box',
};
const primaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '10px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600,
  background: '#4a5e40', color: '#fff', border: 'none', cursor: 'pointer',
};

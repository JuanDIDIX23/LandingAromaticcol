import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { ProspectoFormData } from '../types';

const schema = z.object({
  nombre:           z.string().min(2, 'Ingresa tu nombre'),
  telefono:         z.string().min(7, 'Número de teléfono inválido'),
  email:            z.string().email('Correo inválido').optional().or(z.literal('')),
  producto_interes: z.string().optional(),
  mensaje:          z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const PRODUCTOS_LISTA = [
  'Humidificadores',
  'Difusores de aroma',
  'Kits de aromaterapia',
  'No lo sé aún',
];

// ── Estilos alineados con la paleta de la landing ──────────────
const c = {
  linen:      '#e8e2d9',
  parchment:  '#f2ede6',
  walnut:     '#5a3e2b',
  taupe:      '#9e8e7e',
  sand:       '#c8bba8',
  olive:      '#4a5e40',
  terracotta: '#b5614a',
  goldLight:  '#d4b88a',
};

interface ContactFormProps {
  feriaOrigen?: string;
}

export function ContactForm({ feriaOrigen }: ContactFormProps) {
  const [sent, setSent]     = useState(false);
  const [serverErr, setErr] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setErr(null);
    const payload: ProspectoFormData = {
      nombre:           data.nombre,
      telefono:         data.telefono,
      email:            data.email || undefined,
      mensaje:          data.mensaje || undefined,
      producto_interes: data.producto_interes || undefined,
      feria_origen:     feriaOrigen,
    };

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('prospectos').insert(payload);
      if (error) { setErr('Error al enviar. Escríbenos por WhatsApp.'); return; }
    }
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', padding: '48px 24px' }}
      >
        <motion.div animate={{ scale: [0.8, 1.1, 1] }} transition={{ duration: 0.5 }}>
          <CheckCircle size={56} color={c.goldLight} style={{ margin: '0 auto 16px' }} />
        </motion.div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.8rem', fontWeight: 600, color: c.linen, marginBottom: 10 }}>
          ¡Gracias!
        </h3>
        <p style={{ fontSize: 15, color: 'rgba(232,226,217,0.70)', maxWidth: 340, margin: '0 auto' }}>
          Recibimos tu mensaje. Te contactaremos pronto para ayudarte con tu experiencia de bienestar.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px', marginBottom: 14 }} className="form-grid">
        {/* Nombre */}
        <div>
          <label style={labelStyle}>Nombre *</label>
          <input {...register('nombre')} placeholder="Tu nombre" style={inputStyle(!!errors.nombre)} />
          {errors.nombre && <p style={errStyle}>{errors.nombre.message}</p>}
        </div>
        {/* Teléfono */}
        <div>
          <label style={labelStyle}>Teléfono *</label>
          <input {...register('telefono')} placeholder="3001234567" type="tel" style={inputStyle(!!errors.telefono)} />
          {errors.telefono && <p style={errStyle}>{errors.telefono.message}</p>}
        </div>
        {/* Email */}
        <div>
          <label style={labelStyle}>Correo <span style={{ opacity: 0.5 }}>(opcional)</span></label>
          <input {...register('email')} placeholder="tu@correo.com" type="email" style={inputStyle(!!errors.email)} />
          {errors.email && <p style={errStyle}>{errors.email.message}</p>}
        </div>
        {/* Producto */}
        <div>
          <label style={labelStyle}>¿Qué te interesa?</label>
          <select {...register('producto_interes')} style={inputStyle(false)}>
            <option value="">Selecciona…</option>
            {PRODUCTOS_LISTA.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Mensaje */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Mensaje <span style={{ opacity: 0.5 }}>(opcional)</span></label>
        <textarea {...register('mensaje')} placeholder="¿Alguna pregunta o comentario?" rows={3}
          style={{ ...inputStyle(false), resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
        />
      </div>

      {serverErr && <p style={{ ...errStyle, marginBottom: 12 }}>{serverErr}</p>}

      <motion.button
        type="submit" disabled={isSubmitting}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: '100%', padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 600,
          border: 'none', cursor: isSubmitting ? 'wait' : 'pointer',
          background: isSubmitting ? 'rgba(181,97,74,0.5)' : `linear-gradient(135deg, ${c.terracotta}, #a85542)`,
          color: c.linen,
          boxShadow: '0 8px 24px rgba(181,97,74,0.35)',
        }}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Send size={16} />
        {isSubmitting ? 'Enviando…' : 'Enviar mensaje'}
      </motion.button>

      <style>{`
        @media (max-width: 560px) { .form-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
  textTransform: 'uppercase', color: 'rgba(232,226,217,0.55)', marginBottom: 6,
};
const errStyle: React.CSSProperties = { fontSize: 12, color: '#f87171', marginTop: 4 };
const inputStyle = (hasErr: boolean): React.CSSProperties => ({
  width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14,
  border: `1px solid ${hasErr ? '#f87171' : 'rgba(200,187,168,0.25)'}`,
  color: '#e8e2d9', background: 'rgba(255,255,255,0.07)',
  outline: 'none', boxSizing: 'border-box',
  backdropFilter: 'blur(4px)',
});

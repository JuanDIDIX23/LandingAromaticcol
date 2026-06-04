import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { isSupabaseConfigured } from '../../lib/supabase';

const schema = z.object({
  email:    z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});
type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd]     = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Redirigir si ya hay sesión
  if (user) { navigate('/admin/dashboard', { replace: true }); return null; }

  const onSubmit = async (data: FormData) => {
    setServerErr(null);
    const { error } = await signIn(data.email, data.password);
    if (error) setServerErr(error);
    else navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #1a2e1c 0%, #263d29 60%, #1e2d20 100%)',
      padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 24, padding: '40px 36px',
        width: '100%', maxWidth: 400, boxShadow: '0 32px 64px rgba(0,0,0,0.25)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', margin: '0 auto 12px',
            background: 'linear-gradient(135deg,#4a5e40,#6b7c5e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Leaf size={24} color="#e8e2d9" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#2a2822', marginBottom: 4 }}>AromaticCol</h1>
          <p style={{ fontSize: 14, color: '#9e8e7e' }}>Panel de administración</p>
        </div>

        {/* Alerta Supabase */}
        {!isSupabaseConfigured && (
          <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#664d03' }}>
            ⚠️ Supabase no está configurado. Crea un archivo <code>.env</code> basado en <code>.env.example</code>.
          </div>
        )}

        {/* Error del servidor */}
        {serverErr && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#b91c1c' }}>
            {serverErr}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Correo electrónico</label>
            <input {...register('email')} type="email" placeholder="admin@aromaticcol.com" style={inputStyle(!!errors.email)} />
            {errors.email && <p style={errStyle}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input {...register('password')} type={showPwd ? 'text' : 'password'} placeholder="••••••••" style={{ ...inputStyle(!!errors.password), paddingRight: 40 }} />
              <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9e8e7e' }}>
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p style={errStyle}>{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} style={{
            width: '100%', padding: '13px', borderRadius: 12, fontSize: 15, fontWeight: 600,
            background: isSubmitting ? '#9e8e7e' : 'linear-gradient(135deg,#4a5e40,#6b7c5e)',
            color: '#fff', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}>
            {isSubmitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: '#5a3e2b', marginBottom: 6 };
const errStyle:   React.CSSProperties = { fontSize: 12, color: '#b5614a', marginTop: 4 };
const inputStyle  = (hasErr: boolean): React.CSSProperties => ({
  width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
  border: `1px solid ${hasErr ? '#b5614a' : '#e8e2d9'}`, color: '#2a2822',
  background: '#fff', outline: 'none', boxSizing: 'border-box',
});

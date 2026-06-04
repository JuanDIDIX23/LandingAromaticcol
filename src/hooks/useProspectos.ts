import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { exportToCSV } from '../lib/utils';
import type { Prospecto, EstadoProspecto } from '../types';

export function useProspectos() {
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    const { data, error: err } = await supabase
      .from('prospectos')
      .select('*')
      .order('created_at', { ascending: false });

    if (err) setError(err.message);
    else setProspectos(data as Prospecto[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const updateEstado = useCallback(async (id: string, estado: EstadoProspecto) => {
    if (!isSupabaseConfigured) return { error: 'Supabase no configurado' };
    const { error: err } = await supabase
      .from('prospectos')
      .update({ estado })
      .eq('id', id);
    if (!err) setProspectos(prev =>
      prev.map(p => p.id === id ? { ...p, estado } : p)
    );
    return { error: err?.message ?? null };
  }, []);

  const remove = useCallback(async (id: string) => {
    if (!isSupabaseConfigured) return { error: 'Supabase no configurado' };
    const { error: err } = await supabase
      .from('prospectos')
      .delete()
      .eq('id', id);
    if (!err) setProspectos(prev => prev.filter(p => p.id !== id));
    return { error: err?.message ?? null };
  }, []);

  const downloadCSV = useCallback(() => {
    exportToCSV(
      prospectos.map(p => ({
        nombre:           p.nombre,
        telefono:         p.telefono,
        email:            p.email ?? '',
        mensaje:          p.mensaje ?? '',
        producto_interes: p.producto_interes ?? '',
        feria_origen:     p.feria_origen ?? '',
        estado:           p.estado,
        fecha:            p.created_at,
      })),
      `prospectos_${new Date().toISOString().slice(0, 10)}`
    );
  }, [prospectos]);

  return { prospectos, loading, error, refresh: fetch, updateEstado, remove, downloadCSV };
}

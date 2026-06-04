import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Producto } from '../types';

export function useProductos(soloActivos = false) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    let query = supabase.from('productos').select('*').order('orden');
    if (soloActivos) query = query.eq('activo', true);

    const { data, error: err } = await query;
    if (err) setError(err.message);
    else setProductos(data as Producto[]);
    setLoading(false);
  }, [soloActivos]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (data: Omit<Producto, 'id' | 'created_at'>) => {
    if (!isSupabaseConfigured) return { error: 'Supabase no configurado' };
    const { error: err } = await supabase.from('productos').insert(data);
    if (!err) await fetch();
    return { error: err?.message ?? null };
  }, [fetch]);

  const update = useCallback(async (id: string, data: Partial<Producto>) => {
    if (!isSupabaseConfigured) return { error: 'Supabase no configurado' };
    const { error: err } = await supabase.from('productos').update(data).eq('id', id);
    if (!err) setProductos(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    return { error: err?.message ?? null };
  }, []);

  const remove = useCallback(async (id: string) => {
    if (!isSupabaseConfigured) return { error: 'Supabase no configurado' };
    const { error: err } = await supabase.from('productos').delete().eq('id', id);
    if (!err) setProductos(prev => prev.filter(p => p.id !== id));
    return { error: err?.message ?? null };
  }, []);

  const toggleActivo = useCallback(async (id: string, activo: boolean) => {
    return update(id, { activo });
  }, [update]);

  return { productos, loading, error, refresh: fetch, create, update, remove, toggleActivo };
}

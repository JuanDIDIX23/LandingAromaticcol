import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Feria } from '../types';

export function useFerias(soloActivas = false) {
  const [ferias, setFerias]   = useState<Feria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    let query = supabase.from('ferias').select('*').order('orden').order('fecha_inicio');
    if (soloActivas) query = query.eq('activa', true);

    const { data, error: err } = await query;
    if (err) setError(err.message);
    else setFerias(data as Feria[]);
    setLoading(false);
  }, [soloActivas]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (data: Omit<Feria, 'id' | 'created_at'>) => {
    if (!isSupabaseConfigured) return { error: 'Supabase no configurado' };
    const { error: err } = await supabase.from('ferias').insert(data);
    if (!err) await fetch();
    return { error: err?.message ?? null };
  }, [fetch]);

  const update = useCallback(async (id: string, data: Partial<Feria>) => {
    if (!isSupabaseConfigured) return { error: 'Supabase no configurado' };
    const { error: err } = await supabase.from('ferias').update(data).eq('id', id);
    if (!err) setFerias(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
    return { error: err?.message ?? null };
  }, []);

  const remove = useCallback(async (id: string) => {
    if (!isSupabaseConfigured) return { error: 'Supabase no configurado' };
    const { error: err } = await supabase.from('ferias').delete().eq('id', id);
    if (!err) setFerias(prev => prev.filter(f => f.id !== id));
    return { error: err?.message ?? null };
  }, []);

  const toggleActiva = useCallback(async (id: string, activa: boolean) => {
    return update(id, { activa });
  }, [update]);

  return { ferias, loading, error, refresh: fetch, create, update, remove, toggleActiva };
}

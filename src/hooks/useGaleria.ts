import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { GaleriaItem } from '../types';

export function useGaleria(categoria?: string) {
  const [items, setItems]   = useState<GaleriaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    let q = supabase.from('galeria').select('*').order('orden').order('created_at', { ascending: false });
    if (categoria) q = q.eq('categoria', categoria);
    const { data } = await q;
    setItems((data ?? []) as GaleriaItem[]);
    setLoading(false);
  }, [categoria]);

  useEffect(() => { fetch(); }, [fetch]);

  return { items, loading };
}

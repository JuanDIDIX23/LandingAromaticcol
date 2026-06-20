import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { ConfigItem } from '../types';

export function useConfig() {
  const [config, setConfig]   = useState<Record<string, string>>({});
  const [items, setItems]     = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    const { data, error: err } = await supabase
      .from('config_general')
      .select('*')
      .order('clave');

    if (err) {
      setError(err.message);
    } else {
      const rows = data as ConfigItem[];
      setItems(rows);
      const map: Record<string, string> = {};
      rows.forEach(r => { if (r.valor) map[r.clave] = r.valor; });
      setConfig(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const set = useCallback(async (clave: string, valor: string) => {
    if (!isSupabaseConfigured) return { error: 'Supabase no configurado' };
    const { error: err } = await supabase
      .from('config_general')
      .upsert({ clave, valor }, { onConflict: 'clave' });
    if (!err) {
      setConfig(prev => ({ ...prev, [clave]: valor }));
      setItems(prev => {
        const exists = prev.some(i => i.clave === clave);
        if (exists) return prev.map(i => i.clave === clave ? { ...i, valor } : i);
        return [...prev, { id: '', clave, valor, tipo: 'text' }];
      });
    }
    return { error: err?.message ?? null };
  }, []);

  const setBulk = useCallback(async (updates: Record<string, string>) => {
    const errors: string[] = [];
    for (const [clave, valor] of Object.entries(updates)) {
      const { error } = await set(clave, valor);
      if (error) errors.push(error);
    }
    return { error: errors.length ? errors.join('; ') : null };
  }, [set]);

  return { config, items, loading, error, refresh: fetch, set, setBulk };
}

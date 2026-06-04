import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string | undefined;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

// Si las variables no están definidas devuelve un cliente "vacío" que no
// lanzará errores en import pero fallará silenciosamente en las llamadas.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!)
  : createClient('https://placeholder.supabase.co', 'placeholder');

export type SupabaseError = { message: string };

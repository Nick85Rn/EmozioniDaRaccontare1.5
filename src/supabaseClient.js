import { createClient } from '@supabase/supabase-js';

// IN PRODUZIONE (Netlify): Legge le variabili dalle impostazioni del sito
// IN SVILUPPO (Locale): Legge dal file .env (se esiste)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ ERRORE CRITICO: Mancano le chiavi Supabase! Assicurati di averle inserite nel file .env o nelle impostazioni di Netlify.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
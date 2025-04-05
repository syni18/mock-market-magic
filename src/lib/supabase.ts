
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jrxovfsrznnshmudpoby.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyeG92ZnNyem5uc2htdWRwb2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0ODUwNDcsImV4cCI6MjA1ODA2MTA0N30.XH_tbT97ywmouPP19VlbfyQ7vmyqUBEkSFIr42w2fDs';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

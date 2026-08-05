import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wyvlhapkuuwgjsrtggvd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_hy_nzk3F6AwkZ3rs9c1VBQ_2_x_wuKZ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

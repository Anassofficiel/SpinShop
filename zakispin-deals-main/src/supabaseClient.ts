import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true, // يبقى المستخدم مسجل
    autoRefreshToken: true, // يجدد الـ token تلقائياً
  },
});

// تقدر تستعملها فزر تسجيل الخروج في أي مكان
export const logout = () => supabase.auth.signOut();

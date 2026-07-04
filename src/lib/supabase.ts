import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseDataTruong = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: { schema: "data_truong" },
  auth: { persistSession: false, autoRefreshToken: false },
});

export const supabasePublic = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type Truong = {
  id: number;
  ten_truong: string;
  khu_vuc: string | null;
  ma_truong: string | null;
};

export type NganhDaoTao = {
  id: number;
  ma_nganh: string;
  ten_nganh: string;
  level: number;
  parent_code: string | null;
  trinh_do: string | null;
};

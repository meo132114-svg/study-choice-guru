import { createClient } from "@supabase/supabase-js";

// Đã điền trực tiếp thông tin kết nối Supabase mới để sửa lỗi thiếu cấu hình môi trường (supabaseUrl is required)
const SUPABASE_URL = "https://moofpedjlwwaoysvongr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vb2ZwZWRqbHd3YW95c3ZvbmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMDYwOTksImV4cCI6MjA4Mzc4MjA5OX0.1b1i4iFN_U-Sr_bZfrsTOibHk4G3-_P6lGJqBLEEtTY";

export const supabaseDataTruong = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: { schema: "data_truong" },
  auth: { persistSession: false, autoRefreshToken: false },
});

export const supabasePublic = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: { schema: "public" },
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
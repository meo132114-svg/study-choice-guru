/*
# Create initial schema for EduPath application

1. New Schemas
- `data_truong` - stores reference data for schools and education majors

2. New Tables in `data_truong` schema
- `truong_thpt`: High schools directory
  - `id` (serial, primary key)
  - `ten_truong` (text, school name)
  - `khu_vuc` (text, region/location)
  - `ma_truong` (text, school code)
- `nganh_dao_tao_bgd`: Education majors/fields directory
  - `id` (serial, primary key) 
  - `ma_nganh` (text, major code)
  - `ten_nganh` (text, major name)
  - `level` (int, hierarchy level)
  - `parent_code` (text, parent major code)
  - `trinh_do` (text, education level)

3. New Tables in `public` schema
- `holland_question`: Holland Code test questions
  - `id` (serial, primary key)
  - `text` (text, question text)
  - `type` (text, Holland code type: R/I/A/S/E/C)
- `holland_results`: User test results
  - `id` (uuid, primary key)
  - `score_r`, `score_i`, `score_a`, `score_s`, `score_e`, `score_c` (int, scores for each type)
  - `created_at` (timestamp)
- `hoc_sinh_profile`: Student profiles
  - `id` (uuid, primary key)
  - `truong_thpt` (text, school name)
  - `khoi_lop` (text, grade level: 10/11/12)
  - `ho_ten` (text, student name)
  - `xep_loai_lop9` (text, grade 9 classification)
  - `diem_toan`, `diem_van`, `diem_anh` (numeric, entrance exam scores)
  - `mon_gioi` (text array, strong subjects)
  - `nganh_du_kien` (text, intended major)
  - `created_at` (timestamp)

4. Security
- RLS enabled on all tables
- Policies allow anon + authenticated access (single-tenant, no auth required)
*/

-- Create data_truong schema
CREATE SCHEMA IF NOT EXISTS data_truong;

-- Create truong_thpt table
CREATE TABLE IF NOT EXISTS data_truong.truong_thpt (
  id serial PRIMARY KEY,
  ten_truong text NOT NULL,
  khu_vuc text,
  ma_truong text
);

-- Create nganh_dao_tao_bgd table
CREATE TABLE IF NOT EXISTS data_truong.nganh_dao_tao_bgd (
  id serial PRIMARY KEY,
  ma_nganh text NOT NULL,
  ten_nganh text NOT NULL,
  level int NOT NULL,
  parent_code text,
  trinh_do text
);

-- Create holland_question table
CREATE TABLE IF NOT EXISTS holland_question (
  id serial PRIMARY KEY,
  text text NOT NULL,
  type text NOT NULL CHECK (type IN ('R', 'I', 'A', 'S', 'E', 'C'))
);

-- Create holland_results table
CREATE TABLE IF NOT EXISTS holland_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  score_r int NOT NULL DEFAULT 0,
  score_i int NOT NULL DEFAULT 0,
  score_a int NOT NULL DEFAULT 0,
  score_s int NOT NULL DEFAULT 0,
  score_e int NOT NULL DEFAULT 0,
  score_c int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create hoc_sinh_profile table
CREATE TABLE IF NOT EXISTS hoc_sinh_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  truong_thpt text,
  khoi_lop text,
  ho_ten text NOT NULL,
  xep_loai_lop9 text,
  diem_toan numeric,
  diem_van numeric,
  diem_anh numeric,
  mon_gioi text[],
  nganh_du_kien text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE data_truong.truong_thpt ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_truong.nganh_dao_tao_bgd ENABLE ROW LEVEL SECURITY;
ALTER TABLE holland_question ENABLE ROW LEVEL SECURITY;
ALTER TABLE holland_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE hoc_sinh_profile ENABLE ROW LEVEL SECURITY;

-- Policies for data_truong.truong_thpt (read-only reference data)
DROP POLICY IF EXISTS "anon_select_truong_thpt" ON data_truong.truong_thpt;
CREATE POLICY "anon_select_truong_thpt" ON data_truong.truong_thpt FOR SELECT
  TO anon, authenticated USING (true);

-- Policies for data_truong.nganh_dao_tao_bgd (read-only reference data)
DROP POLICY IF EXISTS "anon_select_nganh_dao_tao" ON data_truong.nganh_dao_tao_bgd;
CREATE POLICY "anon_select_nganh_dao_tao" ON data_truong.nganh_dao_tao_bgd FOR SELECT
  TO anon, authenticated USING (true);

-- Policies for holland_question (read-only test questions)
DROP POLICY IF EXISTS "anon_select_holland_question" ON holland_question;
CREATE POLICY "anon_select_holland_question" ON holland_question FOR SELECT
  TO anon, authenticated USING (true);

-- Policies for holland_results (CRUD for test results)
DROP POLICY IF EXISTS "anon_select_holland_results" ON holland_results;
CREATE POLICY "anon_select_holland_results" ON holland_results FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_holland_results" ON holland_results;
CREATE POLICY "anon_insert_holland_results" ON holland_results FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_holland_results" ON holland_results;
CREATE POLICY "anon_update_holland_results" ON holland_results FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_holland_results" ON holland_results;
CREATE POLICY "anon_delete_holland_results" ON holland_results FOR DELETE
  TO anon, authenticated USING (true);

-- Policies for hoc_sinh_profile (CRUD for student profiles)
DROP POLICY IF EXISTS "anon_select_hoc_sinh_profile" ON hoc_sinh_profile;
CREATE POLICY "anon_select_hoc_sinh_profile" ON hoc_sinh_profile FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_hoc_sinh_profile" ON hoc_sinh_profile;
CREATE POLICY "anon_insert_hoc_sinh_profile" ON hoc_sinh_profile FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_hoc_sinh_profile" ON hoc_sinh_profile;
CREATE POLICY "anon_update_hoc_sinh_profile" ON hoc_sinh_profile FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_hoc_sinh_profile" ON hoc_sinh_profile;
CREATE POLICY "anon_delete_hoc_sinh_profile" ON hoc_sinh_profile FOR DELETE
  TO anon, authenticated USING (true);

-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_truong_thpt_ten ON data_truong.truong_thpt(ten_truong);
CREATE INDEX IF NOT EXISTS idx_nganh_dao_tao_ten ON data_truong.nganh_dao_tao_bgd(ten_nganh);
CREATE INDEX IF NOT EXISTS idx_nganh_dao_tao_level ON data_truong.nganh_dao_tao_bgd(level);
CREATE INDEX IF NOT EXISTS idx_holland_question_type ON holland_question(type);

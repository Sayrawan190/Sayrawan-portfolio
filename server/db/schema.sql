CREATE TABLE IF NOT EXISTS profile (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  photo text NOT NULL DEFAULT '',
  name_en text NOT NULL DEFAULT '', name_ar text NOT NULL DEFAULT '',
  title_en text NOT NULL DEFAULT '', title_ar text NOT NULL DEFAULT '',
  tagline_en text NOT NULL DEFAULT '', tagline_ar text NOT NULL DEFAULT '',
  about_en text NOT NULL DEFAULT '', about_ar text NOT NULL DEFAULT '',
  cv_link text NOT NULL DEFAULT '',
  linkedin text NOT NULL DEFAULT '',
  x text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  focus_en text NOT NULL DEFAULT '', focus_ar text NOT NULL DEFAULT '',
  location_en text NOT NULL DEFAULT '', location_ar text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profile_summary_points (
  id serial PRIMARY KEY,
  profile_id smallint NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
  position integer NOT NULL,
  en text NOT NULL DEFAULT '', ar text NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_summary_points_order ON profile_summary_points (profile_id, position);

CREATE TABLE IF NOT EXISTS profile_role_words (
  id serial PRIMARY KEY,
  profile_id smallint NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
  position integer NOT NULL,
  en text NOT NULL DEFAULT '', ar text NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_role_words_order ON profile_role_words (profile_id, position);

CREATE TABLE IF NOT EXISTS skill_categories (
  id text PRIMARY KEY,
  position integer NOT NULL,
  icon text NOT NULL DEFAULT '',
  name_en text NOT NULL DEFAULT '', name_ar text NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS skills (
  id text PRIMARY KEY,
  category_id text NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  position integer NOT NULL,
  name_en text NOT NULL DEFAULT '', name_ar text NOT NULL DEFAULT '',
  level text NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills (category_id, position);

CREATE TABLE IF NOT EXISTS projects (
  id text PRIMARY KEY,
  position integer NOT NULL,
  name_en text NOT NULL DEFAULT '', name_ar text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '', description_ar text NOT NULL DEFAULT '',
  badge_en text NOT NULL DEFAULT '', badge_ar text NOT NULL DEFAULT '',
  technologies text[] NOT NULL DEFAULT '{}',
  image text NOT NULL DEFAULT '',
  images text[] NOT NULL DEFAULT '{}',
  link text NOT NULL DEFAULT ''
);
-- Adds the multi-image gallery column to a projects table that already
-- existed before it (CREATE TABLE IF NOT EXISTS above is a no-op there).
ALTER TABLE projects ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS experience (
  id text PRIMARY KEY,
  position integer NOT NULL,
  title_en text NOT NULL DEFAULT '', title_ar text NOT NULL DEFAULT '',
  organization_en text NOT NULL DEFAULT '', organization_ar text NOT NULL DEFAULT '',
  start_date text NOT NULL DEFAULT '', end_date text NOT NULL DEFAULT '',
  end_is_present boolean NOT NULL DEFAULT false,
  description_en text NOT NULL DEFAULT '', description_ar text NOT NULL DEFAULT '',
  technologies text[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS certificates (
  id text PRIMARY KEY,
  position integer NOT NULL,
  name_en text NOT NULL DEFAULT '', name_ar text NOT NULL DEFAULT '',
  issuer_en text NOT NULL DEFAULT '', issuer_ar text NOT NULL DEFAULT '',
  date text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '', link text NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS admin_auth (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  password_hash text NOT NULL,
  password_changed_at timestamptz NOT NULL DEFAULT date_trunc('second', now())
);

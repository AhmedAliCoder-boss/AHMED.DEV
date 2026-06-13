-- Supabase setup SQL for AHMED.portfolio
-- Run in Supabase SQL editor (Project SQL) using the service role or SQL runner
-- Replace placeholder UUIDs where indicated and run sample inserts only in development

-- 1) Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2) Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles (username);

-- 3) Admins mapping (optional - alternate approach)
-- You can use either profiles.is_admin OR the admins table below. Both are supported.
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4) Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  reading_time INTEGER DEFAULT 1,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts (status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts (published_at DESC);

-- 5) Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects (featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects (created_at DESC);

-- 6) Contacts table (for contact form submissions)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7) Utility: compute reading time for posts
CREATE OR REPLACE FUNCTION public.compute_reading_time(text)
RETURNS INTEGER AS $$
DECLARE
  words INTEGER := 0;
BEGIN
  IF $1 IS NULL THEN
    RETURN 1;
  END IF;
  words := array_length(regexp_split_to_array(regexp_replace($1, '<[^>]*>', '', 'g'), '\s+'), 1);
  IF words IS NULL OR words = 0 THEN
    RETURN 1;
  END IF;
  RETURN CEIL(words::numeric / 200.0)::INT;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 8) Triggers to update updated_at and compute reading_time
CREATE OR REPLACE FUNCTION public.posts_before_insert_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  NEW.reading_time := public.compute_reading_time(NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_posts_before_insert_update
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION public.posts_before_insert_update();

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_projects_update_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- 9) Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 10) Policies
-- Profiles: public read, user can update own, admins can do all
DROP POLICY IF EXISTS "profiles_select_public" ON profiles;
CREATE POLICY "profiles_select_public" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_update_self" ON profiles;
CREATE POLICY "profiles_update_self" ON profiles FOR UPDATE
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE))
  WITH CHECK (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE));

-- Posts: public read published, authors can manage their posts, admins full access
DROP POLICY IF EXISTS "posts_public_select" ON posts;
CREATE POLICY "posts_public_select" ON posts FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "posts_admin_full" ON posts;
CREATE POLICY "posts_admin_full" ON posts FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE));

DROP POLICY IF EXISTS "posts_author_insert" ON posts;
CREATE POLICY "posts_author_insert" ON posts FOR INSERT
  WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS "posts_author_update" ON posts;
CREATE POLICY "posts_author_update" ON posts FOR UPDATE
  USING (author_id = auth.uid());

DROP POLICY IF EXISTS "posts_author_delete" ON posts;
CREATE POLICY "posts_author_delete" ON posts FOR DELETE
  USING (author_id = auth.uid());

-- Projects: public read, admins full access, authors limited
DROP POLICY IF EXISTS "projects_public_select" ON projects;
CREATE POLICY "projects_public_select" ON projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "projects_admin_full" ON projects;
CREATE POLICY "projects_admin_full" ON projects FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE));

DROP POLICY IF EXISTS "projects_author_insert" ON projects;
CREATE POLICY "projects_author_insert" ON projects FOR INSERT
  WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS "projects_author_update" ON projects;
CREATE POLICY "projects_author_update" ON projects FOR UPDATE
  USING (author_id = auth.uid());

DROP POLICY IF EXISTS "projects_author_delete" ON projects;
CREATE POLICY "projects_author_delete" ON projects FOR DELETE
  USING (author_id = auth.uid());

-- Contacts: public can insert (contact form), only admins can read
DROP POLICY IF EXISTS "contacts_insert_public" ON contacts;
CREATE POLICY "contacts_insert_public" ON contacts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "contacts_select_admins" ON contacts;
CREATE POLICY "contacts_select_admins" ON contacts FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE));

-- Admins table: only admins can read mapping
DROP POLICY IF EXISTS "admins_select_admins" ON admins;
CREATE POLICY "admins_select_admins" ON admins FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE));

-- 11) Notes: create an admin
-- After your first sign-in, find your auth.users.id in Supabase Auth > Users
-- Then run (replace with your user id):
-- INSERT INTO profiles (id, full_name, username, is_admin) VALUES ('<ADMIN_USER_UUID>', 'Ahmed', 'ahmed', TRUE);
-- OR insert into admins: INSERT INTO admins (id) VALUES ('<ADMIN_USER_UUID>');

-- 12) Optional sample data (development only) — uncomment to use
-- INSERT INTO profiles (id, full_name, username, is_admin) VALUES ('00000000-0000-0000-0000-000000000000', 'Dev Admin', 'devadmin', TRUE);
-- INSERT INTO projects (title, slug, description, image, technologies, github_url, live_url, featured, author_id) VALUES ('Sample Project','sample-project','Sample description','https://images.unsplash.com/photo-1',ARRAY['React','Tailwind'],'https://github.com','https://example.com',true,'00000000-0000-0000-0000-000000000000');
-- INSERT INTO posts (title, slug, excerpt, content, category, tags, status, author_id) VALUES ('Sample Post','sample-post','Excerpt','Content','General',ARRAY['sample'],'published','00000000-0000-0000-0000-000000000000');

-- End of setup.sql

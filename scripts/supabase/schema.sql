-- Supabase schema for Ahmed's portfolio
-- Run this in the Supabase SQL editor after creating a project.

-- Ensure uuid generation is available for default ids
create extension if not exists pgcrypto;

-- Profiles
create table if not exists profiles (
  id uuid primary key default auth.uid(),
  full_name text not null,
  role text,
  bio text,
  avatar_url text,
  website text,
  github text,
  linkedin text,
  social_links jsonb,
  updated_at timestamptz default now()
);

-- Projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  description text,
  tech text[],
  cover_url text,
  repo_url text,
  live_url text,
  metadata jsonb,
  status text not null default 'draft',
  featured boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Blog posts (optional, add if you want writing + case studies)
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  tags text[],
  cover_url text,
  status text not null default 'draft',
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Contacts (submissions from contact form)
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  source text,
  created_at timestamptz default now()
);

-- Admins: map Supabase auth user id to admin capability
create table if not exists admins (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz default now()
);

-- Enable Row Level Security where appropriate
alter table profiles enable row level security;
alter table projects enable row level security;
alter table blog_posts enable row level security;
alter table contacts enable row level security;
alter table admins enable row level security;

-- Drop existing policies to make the script safe to rerun
drop policy if exists "profiles_select_public" on profiles;
drop policy if exists "profiles_update_self" on profiles;

drop policy if exists "projects_select_public" on projects;
drop policy if exists "projects_select_draft_admin" on projects;
drop policy if exists "project_insert_admins" on projects;
drop policy if exists "project_update_admins" on projects;
drop policy if exists "project_delete_admins" on projects;

drop policy if exists "blog_posts_select_public" on blog_posts;
drop policy if exists "blog_posts_select_draft_admin" on blog_posts;
drop policy if exists "blog_post_insert_admins" on blog_posts;
drop policy if exists "blog_post_update_admins" on blog_posts;
drop policy if exists "blog_post_delete_admins" on blog_posts;

drop policy if exists "contacts_insert_public" on contacts;
drop policy if exists "contacts_select_admins" on contacts;

drop policy if exists "admins_select_admins" on admins;

-- Profiles: public can read profiles, users can update their own profile
create policy "profiles_select_public" on profiles for select using (true);
create policy "profiles_update_self" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Projects: public read published projects, admins can see drafts
create policy "projects_select_public" on projects for select using (status = 'published');
create policy "projects_select_draft_admin" on projects for select using (
  status = 'published' or exists (select 1 from admins where admins.id = auth.uid())
);
create policy "project_insert_admins" on projects for insert with check (
  exists (select 1 from admins where admins.id = auth.uid())
);
create policy "project_update_admins" on projects for update using (
  exists (select 1 from admins where admins.id = auth.uid())
) with check (
  exists (select 1 from admins where admins.id = auth.uid())
);
create policy "project_delete_admins" on projects for delete using (
  exists (select 1 from admins where admins.id = auth.uid())
);

-- Blog posts: public read published posts, admins can see drafts
create policy "blog_posts_select_public" on blog_posts for select using (status = 'published');
create policy "blog_posts_select_draft_admin" on blog_posts for select using (
  status = 'published' or exists (select 1 from admins where admins.id = auth.uid())
);
create policy "blog_post_insert_admins" on blog_posts for insert with check (
  exists (select 1 from admins where admins.id = auth.uid())
);
create policy "blog_post_update_admins" on blog_posts for update using (
  exists (select 1 from admins where admins.id = auth.uid())
) with check (
  exists (select 1 from admins where admins.id = auth.uid())
);
create policy "blog_post_delete_admins" on blog_posts for delete using (
  exists (select 1 from admins where admins.id = auth.uid())
);

-- Contacts: allow public insert, only admins can read submissions
create policy "contacts_insert_public" on contacts for insert with check (true);
create policy "contacts_select_admins" on contacts for select using (
  exists (select 1 from admins where admins.id = auth.uid())
);

-- Admins: only admins can read admin mapping
create policy "admins_select_admins" on admins for select using (
  exists (select 1 from admins where admins.id = auth.uid())
);

-- Add an admin user after your first Supabase sign-in.
-- Example (replace with the Auth user id from Authentication > Users):
-- insert into admins (id) values ('00000000-0000-0000-0000-000000000000');

-- =====================================================
-- SUPABASE DATABASE SCHEMA FOR PORTFOLIO PLATFORM
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- POSTS TABLE (BLOG POSTS)
-- =====================================================
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    reading_time INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    author_id UUID,
    published_at TIMESTAMP WITH TIME ZONE
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    technologies TEXT[] DEFAULT '{}',
    github_url TEXT,
    live_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Enable RLS on projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POSTS RLS POLICIES
-- =====================================================

-- Public can read published posts
CREATE POLICY "Public can read published posts"
    ON posts FOR SELECT
    USING (status = 'published');

-- Authenticated users can read all posts (for admin)
CREATE POLICY "Authenticated users can read all posts"
    ON posts FOR SELECT
    USING (auth.role() = 'authenticated');

-- Authenticated users can insert posts
CREATE POLICY "Authenticated users can insert posts"
    ON posts FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update posts
CREATE POLICY "Authenticated users can update posts"
    ON posts FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Authenticated users can delete posts
CREATE POLICY "Authenticated users can delete posts"
    ON posts FOR DELETE
    USING (auth.role() = 'authenticated');

-- =====================================================
-- PROJECTS RLS POLICIES
-- =====================================================

-- Public can read all projects
CREATE POLICY "Public can read projects"
    ON projects FOR SELECT
    USING (true);

-- Authenticated users can insert projects
CREATE POLICY "Authenticated users can insert projects"
    ON projects FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update projects
CREATE POLICY "Authenticated users can update projects"
    ON projects FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Authenticated users can delete projects
CREATE POLICY "Authenticated users can delete projects"
    ON projects FOR DELETE
    USING (auth.role() = 'authenticated');

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for posts
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for projects
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- =====================================================

-- Insert sample projects
INSERT INTO projects (title, description, image, technologies, github_url, live_url, featured) VALUES
(
    'E-Commerce Platform',
    'A full-stack e-commerce solution with real-time inventory management',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    'https://github.com/yourusername/ecommerce',
    'https://ecommerce-demo.vercel.app',
    true
),
(
    'Task Management App',
    'Collaborative task management with real-time updates',
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
    ARRAY['React', 'Firebase', 'Tailwind CSS'],
    'https://github.com/yourusername/taskapp',
    'https://taskapp-demo.vercel.app',
    true
),
(
    'Weather Dashboard',
    'Beautiful weather dashboard with 7-day forecasts',
    'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800',
    ARRAY['React', 'OpenWeather API', 'Chart.js'],
    'https://github.com/yourusername/weather',
    'https://weather-demo.vercel.app',
    false
);

-- Insert sample blog posts
INSERT INTO posts (title, slug, excerpt, cover_image, content, category, tags, status, reading_time, published_at) VALUES
(
    'Building Scalable React Applications',
    'building-scalable-react-applications',
    'Learn the best practices for building scalable React applications that can grow with your team and user base.',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    '# Building Scalable React Applications

When building React applications, scalability should be a top priority from day one. Here are some key principles:

## 1. Component Architecture

- Keep components small and focused
- Use composition over inheritance
- Implement proper prop typing

## 2. State Management

- Choose the right state management solution
- Keep state as local as possible
- Avoid prop drilling with context

## 3. Performance Optimization

- Implement code splitting
- Use memo and useMemo strategically
- Optimize re-renders',
    'Engineering',
    ARRAY['React', 'Architecture', 'Best Practices'],
    'published',
    8,
    NOW()
),
(
    'The Future of Web Development',
    'the-future-of-web-development',
    'Exploring the trends and technologies shaping the future of web development.',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800',
    '# The Future of Web Development

The web development landscape is constantly evolving. Here''s what to expect:

## Emerging Technologies

- WebAssembly for high-performance applications
- AI-powered development tools
- Edge computing and serverless architecture

## New Frameworks

- Next.js and React Server Components
- Svelte and SvelteKit
- Astro for content-focused sites',
    'Technology',
    ARRAY['Web Development', 'Future', 'Trends'],
    'published',
    6,
    NOW()
);

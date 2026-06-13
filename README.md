# Ahmed.dev - Portfolio Platform

A production-ready, full-stack personal portfolio platform with modern editorial design, advanced animations, professional project showcase, full blogging system, protected admin dashboard, Supabase backend, PWA support, dark/light theme, and excellent SEO.

## 🚀 Features

- **Premium UI Design**: Ultra-premium, editorial-style design with smooth animations and micro-interactions
- **Multi-page Architecture**: Home, About, Projects, Blog, Blog Details, Contact, Admin Login, Admin Dashboard
- **Supabase Backend**: PostgreSQL database with Row Level Security (RLS) policies
- **Authentication**: Secure admin authentication with Supabase Auth
- **Blog CMS**: Rich markdown editor with live preview, CRUD operations, publish/draft status
- **Project Management**: Admin dashboard for managing projects and blog posts
- **PWA Support**: Progressive Web App with offline support and install prompt
- **Dark/Light Theme**: Seamless theme switching with persistence
- **SEO Optimized**: Dynamic meta tags, Open Graph, Twitter cards, structured data
- **Responsive Design**: Mobile-first, fully responsive across all devices
- **Performance**: Code splitting, lazy loading, memoization for optimal performance

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS
- **Routing**: React Router DOM with lazy loading
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons
- **Markdown**: react-markdown, remark-gfm
- **PWA**: vite-plugin-pwa
- **Utilities**: clsx, date-fns
- **Form**: Formspree (optional)

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account (free tier works)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd AHMED.portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your URL and anon key
3. Run the SQL schema from `supabase-schema.sql` in the SQL Editor

### 4. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FORMSPREE_ID=your_formspree_form_id
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the portfolio.

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/       # Header, Footer
│   └── ui/           # Reusable UI components
├── contexts/         # ThemeContext, AuthContext
├── hooks/            # Custom hooks (useBlogs, useProjects)
├── pages/
│   ├── Admin/        # Admin pages (Login, Dashboard, BlogManager, BlogEditor)
│   ├── Blog/         # Blog listing and details
│   ├── Projects/     # Projects page
│   ├── About/        # About page
│   ├── Contact/      # Contact page
│   └── Home/         # Home page
├── routes/           # AppRoutes with lazy loading
├── services/         # Supabase service functions
├── utils/            # Utility functions
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## 🗄️ Database Schema

The Supabase schema includes:

- **posts**: Blog posts with title, content, excerpt, cover image, category, tags, status, reading time
- **projects**: Projects with title, description, image, technologies, GitHub/live URLs, featured flag
- **profiles**: User profiles (optional)
- **contacts**: Contact form submissions

Run the SQL schema from `supabase-schema.sql` to set up your database.

## 🔐 Authentication

The admin dashboard is protected with Supabase Auth. To set up:

1. Enable Email Auth in Supabase Authentication settings
2. Create an admin user in the Supabase dashboard
3. The admin user can access `/admin/login` to sign in

## 📝 Admin Features

- **Dashboard**: Overview with stats for posts, projects, published/draft counts
- **Blog Manager**: Create, edit, delete, publish blog posts with search and filter
- **Blog Editor**: Rich markdown editor with live preview, auto-slug generation, reading time calculation
- **Project Management**: View and manage projects from the dashboard

## 🌙 Dark Mode

The portfolio supports dark/light theme switching. The theme is persisted in localStorage and automatically detects system preference on first visit.

## 📱 PWA Configuration

The app is configured as a Progressive Web App. To customize:

1. Update `vite.config.js` PWA settings
2. Add your icons to `public/` folder:
   - `icon-192x192.png`
   - `icon-512x512.png`
   - `favicon.ico`
   - `apple-touch-icon.png`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify

1. Push your code to GitHub
2. Import project in [Netlify](https://netlify.com)
3. Add environment variables
4. Deploy

### Other Platforms

Build the project:

```bash
npm run build
```

The `dist` folder contains the production-ready files. Upload to any static hosting service.

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |
| `VITE_FORMSPREE_ID` | Formspree form ID for contact form | No |

## 📊 Performance

- **Code Splitting**: Routes are lazy-loaded for optimal performance
- **Image Optimization**: Use optimized images for best performance
- **Bundle Size**: Optimized with Vite's tree-shaking
- **PWA**: Service worker for offline support and faster loads

## 🎨 Customization

### Colors

Update Tailwind colors in `tailwind.config.cjs` to match your brand.

### Content

Edit the content in each page component to personalize your portfolio.

### Images

Replace placeholder images with your own in the `public/` folder or use external URLs.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Backend by [Supabase](https://supabase.com)
- Icons by [Lucide](https://lucide.dev)

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the author.

---

**Built with ❤️ using modern web technologies**

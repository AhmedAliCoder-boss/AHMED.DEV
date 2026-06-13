import React, { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ui/ProtectedRoute'

const Home = lazy(() => import('../pages/Home/Home'))
const About = lazy(() => import('../pages/About/About'))
const Projects = lazy(() => import('../pages/Projects/Projects'))
const Blog = lazy(() => import('../pages/Blog/Blog'))
const BlogPost = lazy(() => import('../pages/BlogPost/BlogPost'))
const Contact = lazy(() => import('../pages/Contact/Contact'))
const AdminLogin = lazy(() => import('../pages/Admin/Login'))
const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard'))
const AdminBlogManager = lazy(() => import('../pages/Admin/BlogManager'))
const AdminBlogEditor = lazy(() => import('../pages/Admin/BlogEditor'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/blog" element={<ProtectedRoute><AdminBlogManager /></ProtectedRoute>} />
      <Route path="/admin/blog/:id" element={<ProtectedRoute><AdminBlogEditor /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

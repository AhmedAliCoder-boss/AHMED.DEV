import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useBlogs } from '../../hooks/useBlogs'
import { useProjects } from '../../hooks/useProjects'
import { 
  FileText, 
  FolderKanban, 
  Users, 
  TrendingUp, 
  LogOut, 
  Plus,
  ArrowRight,
  Calendar,
  Clock
} from 'lucide-react'

export default function AdminDashboard() {
  const { user, signOut } = useAuth()
  const { blogs } = useBlogs()
  const { projects } = useProjects()

  const stats = [
    {
      title: 'Total Blog Posts',
      value: blogs?.length || 0,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/blog'
    },
    {
      title: 'Total Projects',
      value: projects?.length || 0,
      icon: FolderKanban,
      color: 'from-purple-500 to-purple-600',
      link: '/projects'
    },
    {
      title: 'Published Posts',
      value: blogs?.filter(b => b.status === 'published').length || 0,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      link: '/admin/blog'
    },
    {
      title: 'Draft Posts',
      value: blogs?.filter(b => b.status === 'draft').length || 0,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      link: '/admin/blog'
    }
  ]

  const recentPosts = blogs?.slice(0, 5) || []
  const recentProjects = projects?.slice(0, 5) || []

  const handleLogout = async () => {
    await signOut()
    window.location.href = '/admin/login'
  }

  return (
    <div className="pt-16 px-6 py-20 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Here's what's happening with your portfolio today.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.link}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl`}>
                      <stat.icon className="text-white" size={24} />
                    </div>
                    <ArrowRight className="text-gray-400" size={20} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.title}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Blog Posts</h2>
              <Link to="/admin/blog" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{post.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={14} />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          post.status === 'published' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                    </div>
                    <Link to={`/admin/blog/${post.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                      Edit
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No blog posts yet
                </div>
              )}
            </div>
            <Link to="/admin/blog/new" className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
              <Plus size={18} />
              <span>Create New Post</span>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Projects</h2>
              <Link to="/projects" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={14} />
                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                        {project.featured && (
                          <>
                            <span>•</span>
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                              Featured
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No projects yet
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

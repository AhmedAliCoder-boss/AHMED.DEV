import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useBlogs } from '../../hooks/useBlogs'
import { 
  Save, 
  Eye, 
  Trash2, 
  ArrowLeft, 
  Clock, 
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function BlogEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fetchBlogBySlug, createBlog, updateBlog, deleteBlog, blogs } = useBlogs()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [post, setPost] = useState({ 
    title: '', 
    slug: '', 
    excerpt: '', 
    cover_image: '', 
    content: '', 
    category: '', 
    tags: [], 
    status: 'draft',
    reading_time: 5
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const loadPost = async () => {
      if (id && id !== 'new') {
        setLoading(true)
        try {
          const data = await fetchBlogBySlug(id)
          if (data) {
            setPost({
              ...data,
              tags: data.tags || []
            })
          }
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
    }
    loadPost()
  }, [id, fetchBlogBySlug])

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleChange = (field, value) => {
    setPost(prev => {
      const updated = { ...prev, [field]: value }
      if (field === 'title' && !prev.slug) {
        updated.slug = generateSlug(value)
      }
      if (field === 'content') {
        updated.reading_time = calculateReadingTime(value)
      }
      return updated
    })
  }

  const handleSave = async (publish = false) => {
    setError(null)
    setSaving(true)
    try {
      const payload = { 
        ...post,
        status: publish ? 'published' : 'draft',
        published_at: publish ? new Date().toISOString() : null
      }
      
      if (id === 'new') {
        const created = await createBlog(payload)
        setSuccess(true)
        setTimeout(() => {
          navigate(`/admin/blog/${created.id}`)
        }, 1000)
      } else {
        await updateBlog(id, payload)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2000)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!post.id) return
    if (!window.confirm('Are you sure you want to delete this post?')) return
    setLoading(true)
    try {
      await deleteBlog(id)
      navigate('/admin/blog')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-16 px-6 py-20 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 px-6 py-20 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin/blog" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <ArrowLeft className="text-gray-600 dark:text-gray-400" size={24} />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {id === 'new' ? 'New Post' : 'Edit Post'}
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {post.status === 'published' ? 'Published' : 'Draft'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>Save Draft</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
              <span>Publish</span>
            </motion.button>
            {post.id && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Trash2 size={18} />
                <span>Delete</span>
              </motion.button>
            )}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg"
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg"
          >
            <CheckCircle size={20} />
            <span>Saved successfully!</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={post.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    placeholder="Enter post title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={post.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    placeholder="post-slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={post.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none"
                    placeholder="Brief description of the post"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={post.cover_image}
                    onChange={(e) => handleChange('cover_image', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={post.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      placeholder="Technology"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={post.tags.join(', ')}
                      onChange={(e) => handleChange('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      placeholder="react, javascript, tutorial"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content (Markdown) *
              </label>
              <textarea
                value={post.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={20}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-mono text-sm resize-none"
                placeholder="Write your content in Markdown..."
              />
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{post.reading_time} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>{post.content.split(/\s+/).length} words</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-20 h-fit">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Eye size={20} />
                Live Preview
              </h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {post.cover_image && (
                  <img src={post.cover_image} alt="Cover" className="rounded-xl mb-4" />
                )}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content || '_Start writing to see preview..._'}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

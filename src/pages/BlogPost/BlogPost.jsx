import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useBlogs } from '../../hooks/useBlogs'
import { format } from 'date-fns'
import { Clock, Calendar, ArrowLeft, Share2 } from 'lucide-react'

export default function BlogPost() {
  const { slug } = useParams()
  const { fetchBlogBySlug } = useBlogs()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true)
      try {
        const data = await fetchBlogBySlug(slug)
        setPost(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [slug, fetchBlogBySlug])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share failed:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="pt-16 px-6 py-20 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8">
          <ArrowLeft size={20} />
          <span>Back to Blog</span>
        </Link>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 dark:text-red-400 text-lg">Failed to load post.</p>
          </div>
        ) : !post ? (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">Post not found.</p>
          </div>
        ) : (
          <article>
            {post.cover_image && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium capitalize">
                {post.category}
              </span>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Clock size={16} />
                <span>{post.reading_time} min read</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Calendar size={16} />
                <span>
                  {post.published_at 
                    ? format(new Date(post.published_at), 'MMMM d, yyyy')
                    : format(new Date(post.created_at), 'MMMM d, yyyy')
                  }
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              {post.excerpt}
            </p>

            <div className="flex gap-2 mb-8">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mb-8"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>
          </article>
        )}
      </motion.div>
    </div>
  )
}

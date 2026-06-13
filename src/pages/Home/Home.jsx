import React from 'react'
import { motion } from 'framer-motion'
import Hero from '../../components/Hero'
import Projects from '../../components/Projects'
import ContactForm from '../../components/ContactForm'
import { useBlogs } from '../../hooks/useBlogs'
import { Link } from 'react-router-dom'

export default function Home() {
  const { blogs, loading } = useBlogs()

  const featuredBlogs = blogs?.slice(0, 3) || []

  return (
    <div className="pt-16">
      <Hero />
      
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Projects />
        </motion.div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Latest from the Blog
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Thoughts on technology, design, and development
            </p>
          </div>
          
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : featuredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredBlogs.map((blog) => (
                <Link key={blog.id} to={`/blog/${blog.slug}`}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {blog.cover_image && (
                      <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {blog.category}
                      </span>
                      <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                        {blog.title}
                      </h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>{blog.reading_time} min read</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-400">
              No blog posts yet.
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/blog">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                View All Posts
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-20 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <ContactForm />
        </motion.div>
      </section>
    </div>
  )
}

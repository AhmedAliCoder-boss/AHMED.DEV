import React from 'react'
import { Link } from 'react-router-dom'

export default function BlogCard({ post }) {
  return (
    <article className="p-4 bg-white/60 dark:bg-slate-800/60 border rounded-lg">
      <Link to={`/blog/${post.slug}`}>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{post.title}</h3>
      </Link>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{post.excerpt}</p>
      <div className="mt-3 text-xs text-slate-500">{new Date(post.published_at).toLocaleDateString()} • {post.reading_time} min read</div>
    </article>
  )
}

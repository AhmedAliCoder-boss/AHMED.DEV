import { useState, useEffect } from 'react'
import * as postsService from '../services/postsService'

export const useBlogs = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBlogs = async (filters = {}) => {
    try {
      setLoading(true)
      setError(null)
      const page = filters.page ?? 1
      const perPage = filters.perPage ?? 10
      const { posts, total } = await postsService.fetchPosts({
        page,
        perPage,
        search: filters.search,
        category: filters.category,
        tag: filters.tag,
        status: filters.status ?? 'published',
      })
      setBlogs(posts)
      return { posts, total }
    } catch (err) {
      setError(err)
      return { posts: [], total: 0 }
    } finally {
      setLoading(false)
    }
  }

  const fetchBlogBySlug = async (slug) => {
    try {
      setLoading(true)
      setError(null)
      const post = await postsService.getPostBySlug(slug)
      return post
    } catch (err) {
      setError(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const fetchAllBlogsAdmin = async () => {
    // Admin view: fetch all statuses
    return fetchBlogs({ status: null, page: 1, perPage: 100 })
  }

  const createBlog = async (blogData) => {
    try {
      const post = await postsService.createPost(blogData)
      return post
    } catch (err) {
      setError(err)
      return null
    }
  }

  const updateBlog = async (id, blogData) => {
    try {
      const post = await postsService.updatePost(id, blogData)
      return post
    } catch (err) {
      setError(err)
      return null
    }
  }

  const deleteBlog = async (id) => {
    try {
      await postsService.deletePost(id)
      return true
    } catch (err) {
      setError(err)
      return false
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  return {
    blogs,
    loading,
    error,
    fetchBlogs,
    fetchBlogBySlug,
    fetchAllBlogsAdmin,
    createBlog,
    updateBlog,
    deleteBlog,
  }
}

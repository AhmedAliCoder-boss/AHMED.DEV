import { supabase } from '../lib/supabaseClient'

export async function fetchPosts({ page = 1, perPage = 10, search, category, tag, status = 'published' } = {}) {
  const from = (page - 1) * perPage
  const to = page * perPage - 1

  let query = supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .order('published_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (category) query = query.eq('category', category)
  if (tag) query = query.contains('tags', [tag])
  if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)

  const { data, error, count } = await query.range(from, to)
  if (error) throw error
  return { posts: data ?? [], total: count ?? 0 }
}

export async function getPostBySlug(slug) {
  const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).maybeSingle()
  if (error) throw error
  return data
}

export async function createPost(payload) {
  const { data, error } = await supabase.from('posts').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updatePost(id, payload) {
  const { data, error } = await supabase.from('posts').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
  return true
}

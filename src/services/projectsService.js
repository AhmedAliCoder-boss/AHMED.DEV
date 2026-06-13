import { supabase } from '../lib/supabaseClient'

export async function fetchProjects({ featured, search, technology, page = 1, perPage = 12 } = {}) {
  const from = (page - 1) * perPage
  const to = page * perPage - 1

  let query = supabase.from('projects').select('*', { count: 'exact' }).order('created_at', { ascending: false })

  if (typeof featured === 'boolean') query = query.eq('featured', featured)
  if (technology) query = query.contains('technologies', [technology])
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)

  const { data, error, count } = await query.range(from, to)
  if (error) throw error
  return { projects: data ?? [], total: count ?? 0 }
}

export async function getProjectBySlug(slug) {
  const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle()
  if (error) throw error
  return data
}

export async function createProject(payload) {
  const { data, error } = await supabase.from('projects').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateProject(id, payload) {
  const { data, error } = await supabase.from('projects').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
  return true
}

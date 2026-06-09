import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const emptyForm = {
  title: '',
  slug: '',
  short_description: '',
  description: '',
  tech: '',
  cover_url: '',
  repo_url: '',
  live_url: '',
  status: 'published',
  featured: false,
}

export default function Admin() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [selectedProject, setSelectedProject] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)
      if (data.session) {
        loadProjects()
      }
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sessionData) => {
      setSession(sessionData)
      if (sessionData) {
        loadProjects()
      }
    })

    return () => {
      listener?.subscription?.unsubscribe()
    }
  }, [])

  const isAdmin = useMemo(() => session?.user != null, [session])

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setMessage('Unable to load projects. Check your Supabase setup.')
      console.error(error)
      return
    }

    setProjects(data || [])
  }

  const handleSendLink = async (event) => {
    event.preventDefault()
    setMessage('Sending magic link...')

    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Magic link sent. Check your email.')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setProjects([])
    setForm(emptyForm)
    setSelectedProject(null)
  }

  const handleChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleEdit = (project) => {
    setSelectedProject(project)
    setForm({
      title: project.title || '',
      slug: project.slug || '',
      short_description: project.short_description || '',
      description: project.description || '',
      tech: (project.tech || []).join(', '),
      cover_url: project.cover_url || '',
      repo_url: project.repo_url || '',
      live_url: project.live_url || '',
      status: project.status || 'published',
      featured: project.featured || false,
    })
    setMessage('Editing project: ' + project.title)
  }

  const handleNewProject = () => {
    setSelectedProject(null)
    setForm(emptyForm)
    setMessage('Creating a new project')
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('Saving project...')

    const payload = {
      title: form.title,
      slug: form.slug,
      short_description: form.short_description,
      description: form.description,
      tech: form.tech.split(',').map((item) => item.trim()).filter(Boolean),
      cover_url: form.cover_url,
      repo_url: form.repo_url,
      live_url: form.live_url,
      status: form.status,
      featured: form.featured,
      updated_at: new Date().toISOString(),
    }

    let error = null
    if (selectedProject) {
      const { error: updateError } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', selectedProject.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase.from('projects').insert([payload])
      error = insertError
    }

    if (error) {
      setMessage(error.message)
      setSaving(false)
      return
    }

    await loadProjects()
    setSaving(false)
    setSelectedProject(null)
    setForm(emptyForm)
    setMessage('Project saved successfully.')
  }

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm('Delete this project?')
    if (!confirmed) return

    const { error } = await supabase.from('projects').delete().eq('id', projectId)
    if (error) {
      setMessage(error.message)
      return
    }

    await loadProjects()
    setMessage('Project deleted.')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white px-6 py-16">
        <div className="max-w-3xl mx-auto bg-slate-900 rounded-3xl border border-slate-700 p-8 shadow-xl">
          <h1 className="text-3xl font-bold mb-4">Admin sign-in</h1>
          <p className="text-slate-300 mb-6">
            Enter your email to receive a magic link. You must be added as an admin in Supabase.
          </p>
          <form onSubmit={handleSendLink} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
            <button className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-white">Send magic link</button>
          </form>
          {message && <p className="mt-4 text-sm text-slate-300">{message}</p>}
          <p className="mt-8 text-slate-500 text-sm">Go back to <a className="text-indigo-300 underline" href="/">portfolio</a>.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin dashboard</h1>
            <p className="text-slate-400">Manage your portfolio projects from Supabase.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleNewProject} className="rounded-2xl bg-indigo-600 px-4 py-3 text-white">New project</button>
            <button onClick={handleSignOut} className="rounded-2xl border border-slate-700 px-4 py-3 text-slate-200">Sign out</button>
          </div>
        </header>

        {message && <div className="rounded-3xl border border-slate-700 bg-slate-900 p-4 text-slate-200">{message}</div>}

        <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold mb-4">Project editor</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Project title"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                  required
                />
                <input
                  value={form.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="URL slug"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                  required
                />
              </div>
              <input
                value={form.short_description}
                onChange={(e) => handleChange('short_description', e.target.value)}
                placeholder="Short description"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
              />
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Full description"
                rows={5}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3"
              />
              <input
                value={form.tech}
                onChange={(e) => handleChange('tech', e.target.value)}
                placeholder="Tech tags (comma separated)"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={form.cover_url}
                  onChange={(e) => handleChange('cover_url', e.target.value)}
                  placeholder="Cover image URL"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                />
                <input
                  value={form.repo_url}
                  onChange={(e) => handleChange('repo_url', e.target.value)}
                  placeholder="Repository URL"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={form.live_url}
                  onChange={(e) => handleChange('live_url', e.target.value)}
                  placeholder="Live project URL"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                />
                <select
                  value={form.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <label className="flex items-center gap-3 text-slate-200">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="h-5 w-5 rounded border-slate-600 bg-slate-950"
                />
                Featured project
              </label>
              <div className="flex flex-wrap gap-4">
                <button type="submit" disabled={saving} className="rounded-2xl bg-indigo-600 px-5 py-3 text-white">
                  {saving ? 'Saving…' : 'Save project'}
                </button>
                <button type="button" onClick={handleNewProject} className="rounded-2xl border border-slate-700 px-5 py-3 text-slate-200">
                  Clear form
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold mb-4">Project list</h2>
            {projects.length === 0 ? (
              <p className="text-slate-400">No projects yet.</p>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{project.title}</h3>
                        <p className="text-slate-400 text-sm">{project.slug} • {project.status}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="rounded-2xl bg-slate-700 px-4 py-2 text-sm text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="rounded-2xl bg-red-600 px-4 py-2 text-sm text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Projects() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
        if (mounted && data) setProjects(data)
      } catch (err) {
        console.warn('Could not load projects', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <section id="projects" className="max-w-5xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6">Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {projects.length === 0 ? (
          <div className="text-gray-300">No projects yet — add some from the admin panel.</div>
        ) : (
          projects.map((p) => (
            <article key={p.id} className="p-4 bg-gray-800 rounded-md">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-300">{p.description}</p>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

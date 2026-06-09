import React from 'react'

export default function Hero() {
  return (
    <section className="max-w-5xl mx-auto text-center py-12">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Ahmed — Frontend Engineer</h1>
      <p className="text-lg text-indigo-200 max-w-2xl mx-auto mb-6">
        I build beautiful, accessible web apps using React, Tailwind and Supabase.
      </p>
      <div className="flex items-center justify-center gap-4">
        <a href="#projects" className="px-6 py-3 bg-indigo-600 rounded-md">View Projects</a>
        <a href="#contact" className="px-6 py-3 border rounded-md">Contact</a>
      </div>
    </section>
  )
}

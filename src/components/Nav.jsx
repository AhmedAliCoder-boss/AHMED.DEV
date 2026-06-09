import React from 'react'

export default function Nav() {
  return (
    <header className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold">Ahmed Portfolio</div>
        <nav className="space-x-4">
          <a href="#projects" className="hover:underline">Projects</a>
          <a href="#about" className="hover:underline">About</a>
          <a href="#contact" className="hover:underline">Contact</a>
          <a href="/admin" className="hover:underline">Admin</a>
        </nav>
      </div>
    </header>
  )
}

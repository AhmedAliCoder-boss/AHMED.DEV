import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const { error } = await supabase.from('contacts').insert([{ name, email, message }])
      if (error) throw error
      setStatus('sent')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="max-w-2xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-4">Contact</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full p-3 rounded-md bg-gray-800" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="w-full p-3 rounded-md bg-gray-800" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" className="w-full p-3 rounded-md bg-gray-800" rows={5} />
        <div>
          <button type="submit" className="px-4 py-2 bg-indigo-600 rounded-md">Send</button>
          {status === 'sending' && <span className="ml-3 text-sm">Sending…</span>}
          {status === 'sent' && <span className="ml-3 text-sm text-green-400">Sent — thank you!</span>}
          {status === 'error' && <span className="ml-3 text-sm text-red-400">Error — try again.</span>}
        </div>
      </form>
    </section>
  )
}

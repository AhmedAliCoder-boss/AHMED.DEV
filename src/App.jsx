import './App.css'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Projects from './components/Projects'
import ContactForm from './components/ContactForm'
import Admin from './components/Admin'

function App() {
  const isAdminRoute = window.location.pathname === '/admin'

  if (isAdminRoute) {
    return <Admin />
  }

  return (
    <div id="root" className="min-h-screen">
      <Nav />
      <main className="px-6 py-12">
        <Hero />
        <Projects />
        <ContactForm />
      </main>
    </div>
  )
}

export default App

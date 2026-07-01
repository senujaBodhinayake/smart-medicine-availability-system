import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Stethoscope } from 'lucide-react'

const NAV_LINKS = [
  { to: '/',          label: 'Home'      },
  { to: '/search',    label: 'Search'    },
  { to: '/dashboard', label: 'Dashboard' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors pb-0.5 ${
      isActive
        ? 'text-primary-800 border-b-2 border-primary-800'
        : 'text-slate-600 hover:text-primary-800'
    }`

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold text-primary-800 tracking-tight">MediFind AI</span>
          </button>

          {/* Center nav links — desktop */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Spacer to keep nav centered on desktop */}
          <div className="hidden md:block w-32" />

          {/* Hamburger — mobile */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-4 flex flex-col gap-2">
          {NAV_LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `block py-2.5 text-sm font-medium rounded-lg px-3 transition-colors ${
                  isActive ? 'bg-primary-50 text-primary-800' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar

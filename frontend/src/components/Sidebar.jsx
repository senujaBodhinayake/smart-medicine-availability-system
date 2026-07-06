import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Pill, TrendingUp, Sparkles,
  Stethoscope, User, Activity
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/dashboard',         icon: LayoutDashboard, label: 'Dashboard'       },
  { to: '/search',            icon: Pill,            label: 'Medicines'       },
  { to: '/search?forecast=1', icon: TrendingUp,      label: 'Forecasts'       },
  { to: '/recommend/all',     icon: Sparkles,        label: 'Recommendations' },
  { to: '/predict',           icon: Activity,        label: 'AI Stock Predict'}
]

function Sidebar({ collapsed = false }) {
  return (
    <aside
      className={`bg-sidebar flex flex-col h-screen sticky top-0 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10 shrink-0">
        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shrink-0">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-white font-extrabold text-base tracking-tight truncate">MediFind AI</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={label}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white border-l-4 border-primary-400 pl-3'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/10 p-4 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">MediPlus Pharmacy</p>
            <p className="text-slate-400 text-xs truncate">admin@mediplus.lk</p>
          </div>
        )}
      </div>
    </aside>
  )
}

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
}

export default Sidebar

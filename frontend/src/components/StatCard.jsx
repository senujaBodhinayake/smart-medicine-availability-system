import PropTypes from 'prop-types'
import { TrendingUp, TrendingDown } from 'lucide-react'

function StatCard({ title, value, icon: Icon, color = 'blue', trend }) {
  const colorMap = {
    blue:  { bg: 'bg-primary-50',   icon: 'text-primary-600',   ring: 'bg-primary-100' },
    green: { bg: 'bg-secondary-50', icon: 'text-secondary-600', ring: 'bg-secondary-100' },
    amber: { bg: 'bg-warning-50',   icon: 'text-warning-600',   ring: 'bg-warning-100' },
    red:   { bg: 'bg-danger-50',    icon: 'text-danger-600',    ring: 'bg-danger-100' },
  }
  const c = colorMap[color] || colorMap.blue
  const isPositive = trend >= 0

  return (
    <div className="bg-white rounded-2xl shadow-card p-5 flex items-start gap-4">
      <div className={`${c.ring} rounded-xl p-3 shrink-0`}>
        <Icon className={`w-6 h-6 ${c.icon}`} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5 truncate">{value}</p>
        {trend !== undefined && (
          <p className={`text-xs font-medium mt-1 flex items-center gap-0.5 ${isPositive ? 'text-secondary-600' : 'text-danger-600'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(trend)}% from yesterday
          </p>
        )}
      </div>
    </div>
  )
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon:  PropTypes.elementType.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'amber', 'red']),
  trend: PropTypes.number,
}

export default StatCard

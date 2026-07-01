import PropTypes from 'prop-types'

const CONFIG = {
  Sufficient: { bg: 'bg-secondary-50', text: 'text-secondary-700', dot: 'bg-secondary-500', label: 'Sufficient' },
  Reorder:    { bg: 'bg-warning-50',   text: 'text-warning-700',   dot: 'bg-warning-500',   label: 'Reorder'    },
  Overstock:  { bg: 'bg-danger-50',    text: 'text-danger-700',    dot: 'bg-danger-500',    label: 'Overstock'  },
}

function StockBadge({ status }) {
  const cfg = CONFIG[status] || CONFIG.Reorder
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

StockBadge.propTypes = {
  status: PropTypes.oneOf(['Sufficient', 'Reorder', 'Overstock']).isRequired,
}

export default StockBadge

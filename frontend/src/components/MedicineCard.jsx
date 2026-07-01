import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { MapPin, Package, Pill } from 'lucide-react'
import StockBadge from './StockBadge'

const CATEGORY_COLORS = {
  Painkiller:       'bg-blue-100   text-blue-700',
  Antibiotic:       'bg-purple-100 text-purple-700',
  Antidiabetic:     'bg-green-100  text-green-700',
  Antihypertensive: 'bg-red-100    text-red-700',
  Antihistamine:    'bg-amber-100  text-amber-700',
  Antacid:          'bg-cyan-100   text-cyan-700',
  Supplement:       'bg-pink-100   text-pink-700',
}

function MedicineCard({
  medicine_name,
  category,
  stock_status,
  pharmacy_name,
  quantity,
  unit_price,
  medicine_id,
}) {
  const navigate = useNavigate()
  const catStyle = CATEGORY_COLORS[category] || 'bg-slate-100 text-slate-700'

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold text-slate-800 leading-snug">{medicine_name}</h3>
        <div className={`shrink-0 rounded-xl p-2 ${catStyle}`}>
          <Pill className="w-4 h-4" />
        </div>
      </div>

      {/* Category pill */}
      <span className={`self-start text-xs font-semibold px-2.5 py-0.5 rounded-full ${catStyle}`}>
        {category}
      </span>

      {/* Pharmacy */}
      <p className="flex items-center gap-1.5 text-sm text-slate-500">
        <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
        {pharmacy_name}
      </p>

      {/* Quantity */}
      <p className="flex items-center gap-1.5 text-sm text-slate-600">
        <Package className="w-3.5 h-3.5 shrink-0 text-slate-400" />
        <span><span className="font-semibold">{quantity}</span> units available</span>
      </p>

      {/* Price + badge row */}
      <div className="flex items-center justify-between mt-0.5">
        <span className="text-sm font-bold text-slate-700">LKR {unit_price?.toFixed(2)}</span>
        <StockBadge status={stock_status} />
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-1">
        <button
          onClick={() => navigate(`/medicine/${medicine_id}`)}
          className="flex-1 bg-primary-800 hover:bg-primary-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        >
          View Details
        </button>
        <button
          onClick={() => navigate(`/recommend/${encodeURIComponent(medicine_name)}`)}
          className="flex-1 border border-primary-800 text-primary-800 hover:bg-primary-50 text-sm font-medium py-2 rounded-lg transition-colors"
        >
          Alternatives
        </button>
      </div>
    </div>
  )
}

MedicineCard.propTypes = {
  medicine_name:  PropTypes.string.isRequired,
  category:       PropTypes.string.isRequired,
  stock_status:   PropTypes.oneOf(['Sufficient', 'Reorder', 'Overstock']).isRequired,
  pharmacy_name:  PropTypes.string.isRequired,
  quantity:       PropTypes.number.isRequired,
  unit_price:     PropTypes.number,
  medicine_id:    PropTypes.number.isRequired,
}

export default MedicineCard

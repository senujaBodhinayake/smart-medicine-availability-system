import { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { Pill, User, Layers, ChevronDown, ChevronUp } from 'lucide-react'

/* Colour for rank badge */
const RANK_STYLES = ['bg-yellow-400 text-yellow-900', 'bg-slate-300 text-slate-800', 'bg-amber-600 text-white', 'bg-slate-100 text-slate-700', 'bg-slate-100 text-slate-700']

/* Circular SVG progress ring for similarity score */
function ScoreRing({ score }) {
  const r = 22
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 85 ? '#059669' : score >= 70 ? '#F59E0B' : '#DC2626'
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
        <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
        {score}%
      </span>
    </div>
  )
}
ScoreRing.propTypes = { score: PropTypes.number.isRequired }

function RecommendationCard({ rank, medicine_name, category, age_group, dosage_form, similarity_score }) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()
  const rankStyle = RANK_STYLES[(rank - 1) % RANK_STYLES.length]

  const tags = ['Same category', 'Same usage', 'Similar dosage']

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-200 p-4">
      {/* Main row */}
      <div className="flex items-center gap-4">
        {/* Rank badge */}
        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${rankStyle}`}>
          {rank}
        </span>

        {/* Medicine icon */}
        <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
          <Pill className="w-5 h-5 text-primary-700" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 text-sm truncate">{medicine_name}</p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{category}</span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <User className="w-3 h-3" />{age_group}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Layers className="w-3 h-3" />{dosage_form}
            </span>
          </div>
        </div>

        {/* Score ring */}
        <ScoreRing score={similarity_score} />
      </div>

      {/* Expandable tags + CTA */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-xs text-primary-700 font-medium flex items-center gap-1 hover:text-primary-900 transition-colors"
        >
          Why recommended?
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => navigate(`/search?q=${encodeURIComponent(medicine_name)}`)}
          className="text-xs bg-primary-800 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
        >
          Check Availability
        </button>
      </div>

      {/* Expanded reason tags */}
      {expanded && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <span key={tag} className="text-xs bg-secondary-50 text-secondary-700 border border-secondary-200 px-2 py-0.5 rounded-full">
              ✓ {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

RecommendationCard.propTypes = {
  rank:             PropTypes.number.isRequired,
  medicine_name:    PropTypes.string.isRequired,
  category:         PropTypes.string.isRequired,
  age_group:        PropTypes.string.isRequired,
  dosage_form:      PropTypes.string.isRequired,
  similarity_score: PropTypes.number.isRequired,
}

export default RecommendationCard

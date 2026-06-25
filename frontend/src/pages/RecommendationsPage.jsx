import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AlertTriangle, Sparkles, Home, Search } from 'lucide-react'
import Navbar from '../components/Navbar'
import RecommendationCard from '../components/RecommendationCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { getRecommendations } from '../services/api'

function RecommendationsPage() {
  const { medicine } = useParams()
  const decodedName = decodeURIComponent(medicine || '')

  const [recs, setRecs]     = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!decodedName || decodedName === 'all') return
    setLoading(true)
    getRecommendations(decodedName)
      .then(data => setRecs(data))
      .finally(() => setLoading(false))
  }, [decodedName])

  return (
    <div className="min-h-screen bg-[#F8FAFC] page-enter">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link to="/" className="hover:text-primary-700 flex items-center gap-1"><Home className="w-3.5 h-3.5" /> Home</Link>
          <span>/</span>
          <Link to="/search" className="hover:text-primary-700 flex items-center gap-1"><Search className="w-3.5 h-3.5" /> Search</Link>
          <span>/</span>
          <span className="text-slate-600 font-medium">Alternatives for {decodedName}</span>
        </nav>

        {/* Alert banner */}
        {decodedName && decodedName !== 'all' && (
          <div className="flex items-start gap-3 bg-warning-50 border border-warning-200 rounded-2xl p-4 mb-8">
            <AlertTriangle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-warning-800">
                <span className="font-bold">{decodedName}</span> is currently unavailable
              </p>
              <p className="text-xs text-warning-700 mt-0.5">
                Our AI has analysed 2,400+ medicines to find the best therapeutic alternatives for you.
              </p>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-primary-700" />
          <h1 className="text-xl font-extrabold text-slate-800">Top 5 AI Recommendations</h1>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(5)].map((_, i) => <LoadingSkeleton key={i} />)}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {recs.map(rec => (
              <RecommendationCard key={rec.rank} {...rec} />
            ))}
          </div>
        )}

        {/* Info footer */}
        <div className="mt-8 bg-primary-50 border border-primary-100 rounded-2xl p-4 text-xs text-primary-700">
          <strong className="block mb-1">How these recommendations work</strong>
          Recommendations are ranked by AI similarity scoring using content-based filtering across
          category, therapeutic class, dosage form, and age group data from 2,400+ medicines.
        </div>
      </div>
    </div>
  )
}

export default RecommendationsPage

import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { ArrowLeft, Home, DollarSign, Calendar, Tag, User, Package, TrendingUp } from 'lucide-react'
import Navbar from '../components/Navbar'
import StockBadge from '../components/StockBadge'
import RecommendationCard from '../components/RecommendationCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { getMedicineById, getForecast, getRecommendations } from '../services/api'

function stockBarColor(status) {
  if (status === 'Sufficient') return 'bg-secondary-500'
  if (status === 'Overstock')  return 'bg-warning-500'
  return 'bg-danger-500'
}

function stockTextColor(status) {
  if (status === 'Sufficient') return 'text-secondary-600'
  if (status === 'Overstock')  return 'text-warning-600'
  return 'text-danger-600'
}

function MedicineDetailPage() {
  const { id }    = useParams()
  const navigate  = useNavigate()

  const [med,      setMed]      = useState(null)
  const [forecast, setForecast] = useState([])
  const [recs,     setRecs]     = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getMedicineById(id),
      getForecast(''),
    ]).then(([medData, fcData]) => {
      setMed(medData)
      setForecast(fcData)
      if (medData) return getRecommendations(medData.medicine_name)
    }).then(recData => {
      if (recData) setRecs(recData.slice(0, 3))
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 gap-6">
        {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} />)}
      </div>
    </div>
  )

  if (!med) return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-slate-500 text-xl">Medicine not found.</p>
        <button onClick={() => navigate('/search')} className="mt-4 text-primary-800 underline text-sm">
          Back to search
        </button>
      </div>
    </div>
  )

  const pct = Math.min(100, Math.round((med.quantity / 500) * 100))

  return (
    <div className="min-h-screen bg-[#F8FAFC] page-enter">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">

        {/* Back + breadcrumb */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <nav className="flex items-center gap-2 text-sm text-slate-400">
            <Link to="/" className="hover:text-primary-700 flex items-center gap-1">
              <Home className="w-4 h-4" /> Home
            </Link>
            <span>/</span>
            <Link to="/search" className="hover:text-primary-700">Search</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">{med.medicine_name}</span>
          </nav>
        </div>

        {/* ── Hero card ── */}
        <div className="bg-white rounded-2xl shadow-card p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-800 mb-4">{med.medicine_name}</h1>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: med.category,    bg: 'bg-blue-100   text-blue-700'   },
                  { label: med.dosage_form, bg: 'bg-purple-100 text-purple-700' },
                  { label: med.age_group,   bg: 'bg-green-100  text-green-700'  },
                ].map(({ label, bg }) => label && (
                  <span key={label} className={`text-sm font-semibold px-4 py-1.5 rounded-full ${bg}`}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0 scale-125 origin-right">
              <StockBadge status={med.stock_status} />
            </div>
          </div>

          {/* Pharmacy row */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-8 text-sm text-slate-500">
            <span><span className="font-semibold text-slate-700">Pharmacy:</span> {med.pharmacy_name}</span>
            <span><span className="font-semibold text-slate-700">Category:</span> {med.category}</span>
            <span><span className="font-semibold text-slate-700">Unit Price:</span> LKR {med.unit_price?.toFixed(2)}</span>
            <span><span className="font-semibold text-slate-700">Dosage Form:</span> {med.dosage_form}</span>
          </div>
        </div>

        {/* ── 3-column info grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Stock level */}
          <div className="bg-white rounded-2xl shadow-card p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-700" />
                </div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Current Stock Level</p>
              </div>
              <p className={`text-6xl font-extrabold mb-2 ${stockTextColor(med.stock_status)}`}>
                {med.quantity}
              </p>
              <p className="text-base text-slate-500 mb-6">units available</p>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>0</span>
                <span>500 max</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 mb-3">
                <div
                  className={`h-4 rounded-full transition-all ${stockBarColor(med.stock_status)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-sm text-slate-400">
                Reorder Point: <span className="font-bold text-slate-600">50 units</span>
              </p>
            </div>
          </div>

          {/* Forecast chart */}
          <div className="bg-white rounded-2xl shadow-card p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-secondary-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary-600" />
              </div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">7-Day Demand Forecast</p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={forecast} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#059669" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="demand" stroke="#059669" strokeWidth={2.5}
                  fill="url(#miniGrad)" dot={{ r: 3, fill: '#059669' }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick facts */}
          <div className="bg-white rounded-2xl shadow-card p-8">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-6">Quick Facts</p>
            <div className="flex flex-col gap-5">
              {[
                { icon: DollarSign, label: 'Unit Price',            value: `LKR ${med.unit_price?.toFixed(2) ?? '—'}` },
                { icon: Calendar,   label: 'Expiry Days Remaining', value: '180 days'    },
                { icon: Tag,        label: 'Category',              value: med.category  },
                { icon: User,       label: 'Age Group',             value: med.age_group },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                    <p className="text-base font-bold text-slate-700">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── AI alternatives ── */}
        {recs.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-700 mb-5">AI Alternative Medicines</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recs.map(rec => (
                <RecommendationCard key={rec.rank} {...rec} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MedicineDetailPage

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Pill, Building2, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'

const QUICK_TAGS = ['Paracetamol', 'Amoxicillin', 'Metformin', 'Insulin']

const STATS = [
  { value: '2,400+', label: 'Medicines',     icon: Pill       },
  { value: '150+',   label: 'Pharmacies',    icon: Building2  },
  { value: '98%',    label: 'AI Accuracy',   icon: Sparkles   },
]

const STEPS = [
  {
    num: '1',
    icon: Search,
    title: 'Search Medicine',
    desc: 'Type any medicine name — generic or brand — in our intelligent search bar.',
  },
  {
    num: '2',
    icon: CheckCircle,
    title: 'Check Stock',
    desc: 'See real-time availability across 150+ registered pharmacies in Sri Lanka.',
  },
  {
    num: '3',
    icon: Sparkles,
    title: 'Get AI Alternatives',
    desc: 'When unavailable, our AI recommends the best therapeutic alternatives instantly.',
  },
]

function HomePage() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const handleQuickTag = (tag) => {
    navigate(`/search?q=${encodeURIComponent(tag)}`)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] page-enter">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-600/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            Find Any Medicine.
            <br />
            <span className="text-blue-300">Instantly.</span>
          </h1>
          <p className="text-base sm:text-lg text-blue-100 max-w-xl mx-auto mb-10">
            AI-powered availability search and smart alternatives for pharmacies.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search medicine e.g. Paracetamol..."
              className="w-full pl-12 pr-32 py-4 rounded-2xl text-slate-800 bg-white shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm sm:text-base"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-800 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
            >
              Search <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick tags */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {QUICK_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => handleQuickTag(tag)}
                className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1.5 rounded-full font-medium transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl shadow-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-primary-700" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-800">How It Works</h2>
          <p className="text-slate-500 mt-2">Three simple steps to find or replace any medicine</p>
        </div>

        <div className="relative flex flex-col sm:flex-row gap-6 sm:gap-0 sm:items-start">
          {/* Connecting dotted line — desktop only */}
          <div className="hidden sm:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px border-t-2 border-dashed border-slate-200 z-0" />

          {STEPS.map(({ num, icon: Icon, title, desc }) => (
            <div key={num} className="relative flex-1 text-center z-10 px-4">
              <div className="w-16 h-16 mx-auto bg-primary-800 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-6 h-6 bg-white border-2 border-primary-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 shadow">
                {num}
              </span>
              <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-primary-800 text-white py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to find medicines faster?</h2>
          <p className="text-blue-200 mb-6 text-sm sm:text-base">
            Join 150+ pharmacies already using MediFind AI to improve patient outcomes.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-primary-800 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Open Dashboard
          </button>
        </div>
      </section>

    </div>
  )
}

export default HomePage

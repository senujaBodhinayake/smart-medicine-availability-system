import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, ArrowRight, PackageSearch } from 'lucide-react'
import Navbar from '../components/Navbar'
import MedicineCard from '../components/MedicineCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { getMedicines } from '../services/api'
import { useToast } from '../components/Toast'

const CATEGORIES = ['All', 'Painkiller', 'Antibiotic', 'Antidiabetic', 'Antihypertensive', 'Antihistamine', 'Antacid', 'Supplement']
const STOCK_OPTIONS = ['Sufficient', 'Reorder', 'Overstock']
const AGE_OPTIONS = ['All Ages', 'Adult', 'Pediatric']

function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()

  const queryParam = searchParams.get('q') || ''
  const [inputVal, setInputVal]       = useState(queryParam)
  const [results, setResults]         = useState([])
  const [loading, setLoading]         = useState(false)
  const [filterOpen, setFilterOpen]   = useState(false)

  /* Filters */
  const [category,    setCategory]    = useState('All')
  const [stockFilter, setStockFilter] = useState([])
  const [ageFilter,   setAgeFilter]   = useState([])

  const fetchResults = useCallback(async (q, cat, stock, age) => {
    setLoading(true)
    try {
      const filters = {}
      if (cat && cat !== 'All') filters.category = cat
      if (stock.length === 1) filters.stock_status = stock[0]
      if (age.length === 1 && age[0] !== 'All Ages') filters.age_group = age[0]
      const data = await getMedicines(q, filters)
      setResults(data)
    } catch {
      toast({ message: 'Failed to load results. Showing cached data.', type: 'warning' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    setInputVal(queryParam)
    fetchResults(queryParam, category, stockFilter, ageFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParam])

  const handleSearch = (e) => {
    e.preventDefault()
    if (inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() })
    }
  }

  const applyFilters = () => {
    fetchResults(queryParam, category, stockFilter, ageFilter)
    setFilterOpen(false)
  }

  const toggleArr = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] page-enter">
      <Navbar />

      {/* Search bar */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-30 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex gap-2">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Search medicines..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-slate-50"
            />
          </form>
          <button
            onClick={() => setFilterOpen(o => !o)}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Results count */}
        <p className="text-sm text-slate-500 mb-5">
          {loading ? 'Searching…' : (
            <>Showing <span className="font-semibold text-slate-700">{results.length}</span> results
            {queryParam && <> for <span className="font-semibold text-primary-800">"{queryParam}"</span></>}</>
          )}
        </p>

        <div className="flex gap-6">
          {/* ── Filter sidebar ── */}
          {filterOpen && (
            <aside className="w-64 shrink-0 bg-white rounded-2xl shadow-card p-5 self-start sticky top-32 hidden md:block">
              <h3 className="font-bold text-slate-700 mb-4 text-sm">Filter Results</h3>

              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>

              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Stock Status</label>
              <div className="flex flex-col gap-2 mb-5">
                {STOCK_OPTIONS.map(s => {
                  const dotColor = s === 'Sufficient' ? 'bg-secondary-500' : s === 'Reorder' ? 'bg-warning-500' : 'bg-danger-500'
                  return (
                    <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" className="rounded"
                        checked={stockFilter.includes(s)}
                        onChange={() => toggleArr(stockFilter, setStockFilter, s)} />
                      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                      {s}
                    </label>
                  )
                })}
              </div>

              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Age Group</label>
              <div className="flex flex-col gap-2 mb-6">
                {AGE_OPTIONS.map(a => (
                  <label key={a} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded"
                      checked={ageFilter.includes(a)}
                      onChange={() => toggleArr(ageFilter, setAgeFilter, a)} />
                    {a}
                  </label>
                ))}
              </div>

              <button
                onClick={applyFilters}
                className="w-full bg-primary-800 text-white py-2 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Apply Filters
              </button>
            </aside>
          )}

          {/* ── Results grid ── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} />)}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map(med => (
                  <MedicineCard
                    key={med.id}
                    medicine_id={med.id}
                    medicine_name={med.medicine_name}
                    category={med.category}
                    stock_status={med.stock_status}
                    pharmacy_name={med.pharmacy_name}
                    quantity={med.quantity}
                    unit_price={med.unit_price}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <PackageSearch className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-600 mb-2">No medicines found</h3>
                <p className="text-slate-400 text-sm mb-6">
                  We couldn&apos;t find <strong>"{queryParam}"</strong> in stock. Try AI alternatives.
                </p>
                <button
                  onClick={() => navigate(`/recommend/${encodeURIComponent(queryParam)}`)}
                  className="inline-flex items-center gap-2 bg-primary-800 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors"
                >
                  Get AI Recommendations <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResultsPage

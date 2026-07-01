import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  Package, AlertTriangle, TrendingUp, BarChart2,
  ChevronLeft, ChevronRight, MoreVertical,
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import StockBadge from '../components/StockBadge'
import { getAllMedicines, getForecast } from '../services/api'
import { useToast } from '../components/Toast'

const MOCK_FORECAST = [
  { day: 'Mon', demand: 120 }, { day: 'Tue', demand: 145 },
  { day: 'Wed', demand: 132 }, { day: 'Thu', demand: 178 },
  { day: 'Fri', demand: 165 }, { day: 'Sat', demand: 190 },
  { day: 'Sun', demand: 155 },
]

const MOCK_ALERTS = [
  { id: 1, name: 'Paracetamol 500mg',  qty: 15,  type: 'Reorder'   },
  { id: 2, name: 'Vitamin C 500mg',    qty: 450, type: 'Overstock' },
  { id: 3, name: 'Amoxicillin 250mg',  qty: 8,   type: 'Reorder'   },
]

const PAGE_SIZE = 10

function DashboardPage() {
  const toast = useToast()
  const [medicines, setMedicines]     = useState([])
  const [forecast,  setForecast]      = useState(MOCK_FORECAST)
  const [forecastMed, setForecastMed] = useState('Paracetamol 500mg')
  const [page, setPage]               = useState(0)
  const [sortCol, setSortCol]         = useState(null)
  const [sortDir, setSortDir]         = useState('asc')

  useEffect(() => {
    getAllMedicines()
      .then(setMedicines)
      .catch(() => toast({ message: 'Using cached inventory data.', type: 'info' }))
  }, [toast])

  useEffect(() => {
    getForecast(forecastMed).then(setForecast)
  }, [forecastMed])

  /* Sorting */
  const sorted = [...medicines].sort((a, b) => {
    if (!sortCol) return 0
    const va = a[sortCol], vb = b[sortCol]
    if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    return sortDir === 'asc' ? va - vb : vb - va
  })
  const pageCount = Math.ceil(sorted.length / PAGE_SIZE)
  const pageRows  = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }
  const SortIcon = ({ col }) => sortCol === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕'

  /* KPI counts */
  const lowCount  = medicines.filter(m => m.stock_status === 'Reorder').length
  const overCount = medicines.filter(m => m.stock_status === 'Overstock').length

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 min-w-0 p-5 sm:p-8 overflow-auto">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Dashboard</h1>
        <p className="text-sm text-slate-500 mb-6">MediPlus Pharmacy · Real-time overview</p>

        {/* ── KPI row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Stock Items"     value={medicines.length || '2,847'} icon={Package}      color="blue"  trend={3.2}  />
          <StatCard title="Low Stock Alerts"      value={lowCount  || 12}             icon={AlertTriangle} color="red"   trend={-1.5} />
          <StatCard title="Overstock Items"       value={overCount || 8}              icon={BarChart2}     color="amber" trend={0.8}  />
          <StatCard title="Predicted Demand Today" value="340 units"                  icon={TrendingUp}    color="green" trend={5.1}  />
        </div>

        {/* ── Two-column middle ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Forecast chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="font-bold text-slate-700 text-sm">7-Day Demand Forecast</h2>
              <select
                value={forecastMed}
                onChange={e => setForecastMed(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                {medicines.slice(0, 8).map(m => (
                  <option key={m.id} value={m.medicine_name}>{m.medicine_name}</option>
                ))}
                {medicines.length === 0 && <option>Paracetamol 500mg</option>}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={forecast} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1E40AF" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#1E40AF" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  labelStyle={{ fontWeight: 600, color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="demand" stroke="#1E40AF" strokeWidth={2.5}
                  fill="url(#demandGrad)" dot={{ r: 3, fill: '#1E40AF' }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stock alerts panel */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-bold text-slate-700 text-sm mb-4">Stock Alerts</h2>
            <div className="flex flex-col gap-3">
              {MOCK_ALERTS.map(alert => (
                <div
                  key={alert.id}
                  className={`rounded-xl p-3 border-l-4 ${
                    alert.type === 'Reorder' ? 'border-danger-500 bg-danger-50' : 'border-warning-500 bg-warning-50'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-700 truncate">{alert.name}</p>
                  <p className="text-xs text-slate-500 mb-2">Current stock: <span className="font-bold">{alert.qty}</span> units</p>
                  <button
                    className={`text-xs font-semibold px-3 py-1 rounded-lg text-white transition-colors ${
                      alert.type === 'Reorder'
                        ? 'bg-danger-600 hover:bg-danger-700'
                        : 'bg-warning-500 hover:bg-warning-600'
                    }`}
                    onClick={() => {
                      if (alert.type === 'Reorder') toast({ message: `Reorder triggered for ${alert.name}`, type: 'success' })
                      else toast({ message: `Stock reduction noted for ${alert.name}`, type: 'info' })
                    }}
                  >
                    {alert.type === 'Reorder' ? 'Reorder Now' : 'Reduce Stock'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Inventory table ── */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-700 text-sm">Medicine Inventory</h2>
            <span className="text-xs text-slate-400">{medicines.length} items</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 uppercase tracking-wide border-b border-slate-100">
                  {[
                    { key: null,           label: '#'                },
                    { key: 'medicine_name', label: 'Medicine'        },
                    { key: 'category',      label: 'Category'        },
                    { key: 'quantity',      label: 'Stock'           },
                    { key: null,            label: 'Pred. Demand'    },
                    { key: 'stock_status',  label: 'Status'          },
                    { key: null,            label: 'Action'          },
                  ].map(({ key, label }, i) => (
                    <th
                      key={i}
                      onClick={() => key && handleSort(key)}
                      className={`px-4 py-3 text-left font-semibold ${key ? 'cursor-pointer hover:text-slate-700 select-none' : ''}`}
                    >
                      {label}{key && <SortIcon col={key} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((med, idx) => (
                  <tr
                    key={med.id}
                    className="border-b border-slate-50 hover:bg-[#F0F9FF] transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-400 text-xs">{page * PAGE_SIZE + idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{med.medicine_name}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{med.category}</td>
                    <td className="px-4 py-3 text-slate-700 font-semibold">{med.quantity}</td>
                    <td className="px-4 py-3 text-slate-500">~{Math.round(med.quantity * 0.15)} u/day</td>
                    <td className="px-4 py-3"><StockBadge status={med.stock_status} /></td>
                    <td className="px-4 py-3">
                      <div className="relative inline-block">
                        <button className="flex items-center gap-1 text-xs border border-slate-200 rounded-lg px-2 py-1 hover:bg-slate-50 text-slate-600">
                          Actions <MoreVertical className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-10 text-slate-400 text-sm">Loading inventory…</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Page {page + 1} of {pageCount || 1}</span>
            <div className="flex gap-1">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= pageCount - 1}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage

import { useState } from 'react'
import { getStockStatus } from '../services/api'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Activity } from 'lucide-react'

function StockPredictionPage() {
  const [formData, setFormData] = useState({
    unitsSold: 300,
    stockLevel: 4500,
    unitPrice: 45.0,
    expiryDays: 365,
    month: 10,
    covidFlag: 0,
    medicineEnc: 0,
    categoryEnc: 2,
  })

  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // API expects a 2D array: [[features...]]
      const data = [[
        formData.unitsSold,
        formData.stockLevel,
        formData.unitPrice,
        formData.expiryDays,
        formData.month,
        formData.covidFlag,
        formData.medicineEnc,
        formData.categoryEnc
      ]]
      
      const res = await getStockStatus(data)
      setPrediction(res.class)
    } catch (err) {
      console.error(err)
      alert("Failed to fetch prediction")
    } finally {
      setLoading(false)
    }
  }

  // Stock statuses: 0=Reorder, 1=Sufficient, 2=Overstock
  const getStatusDisplay = (code) => {
    if (code === 0) return { text: "Reorder", color: "text-red-600 bg-red-100" }
    if (code === 1) return { text: "Sufficient", color: "text-green-600 bg-green-100" }
    if (code === 2) return { text: "Overstock", color: "text-yellow-600 bg-yellow-100" }
    return { text: "Unknown", color: "text-gray-600 bg-gray-100" }
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => {}} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                <Activity className="w-8 h-8 text-primary-500" />
                Stock Prediction AI
              </h1>
              <p className="text-slate-500 mt-2 text-lg">
                Enter the medicine features below to test the trained stock classification model.
              </p>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Units Sold</label>
                  <input type="number" name="unitsSold" value={formData.unitsSold} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Current Stock Level</label>
                  <input type="number" name="stockLevel" value={formData.stockLevel} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Unit Price ($)</label>
                  <input type="number" step="0.01" name="unitPrice" value={formData.unitPrice} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Expiry Days Remaining</label>
                  <input type="number" name="expiryDays" value={formData.expiryDays} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Month (1-12)</label>
                  <input type="number" name="month" min="1" max="12" value={formData.month} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">COVID Flag (0=No, 1=Yes)</label>
                  <input type="number" name="covidFlag" min="0" max="1" value={formData.covidFlag} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Medicine Encoding (0-10)</label>
                  <input type="number" name="medicineEnc" value={formData.medicineEnc} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Category Encoding (0-4)</label>
                  <input type="number" name="categoryEnc" value={formData.categoryEnc} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition" />
                </div>

                <div className="md:col-span-2 pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-sm disabled:opacity-70"
                  >
                    {loading ? 'Running AI Model...' : 'Predict Stock Status'}
                  </button>
                </div>
              </form>

              {prediction !== null && (
                <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <h3 className="text-lg font-bold text-slate-700 mb-2">AI Prediction Result</h3>
                  <div className={`inline-block px-6 py-2 rounded-full text-xl font-bold ${getStatusDisplay(prediction).color}`}>
                    {getStatusDisplay(prediction).text}
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default StockPredictionPage

import { useNavigate } from 'react-router-dom'
import { Search, Home, Stethoscope } from 'lucide-react'
import Navbar from '../components/Navbar'

function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Stethoscope className="w-10 h-10 text-primary-400" />
          </div>
          <h1 className="text-6xl font-extrabold text-primary-800 mb-3">404</h1>
          <h2 className="text-xl font-bold text-slate-700 mb-2">Page Not Found</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Try searching for a medicine instead.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 bg-primary-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors"
            >
              <Home className="w-4 h-4" /> Go Home
            </button>
            <button
              onClick={() => navigate('/search')}
              className="inline-flex items-center gap-2 border border-primary-200 text-primary-800 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-50 transition-colors"
            >
              <Search className="w-4 h-4" /> Search Medicines
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import HomePage from './pages/HomePage'
import SearchResultsPage from './pages/SearchResultsPage'
import RecommendationsPage from './pages/RecommendationsPage'
import DashboardPage from './pages/DashboardPage'
import MedicineDetailPage from './pages/MedicineDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import { ToastProvider } from './components/Toast'

/* Scrolls to top and applies page-enter animation on every route change */
function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollReset />
        <Routes>
          <Route path="/"                     element={<HomePage />} />
          <Route path="/search"               element={<SearchResultsPage />} />
          <Route path="/recommend/:medicine"  element={<RecommendationsPage />} />
          <Route path="/dashboard"            element={<DashboardPage />} />
          <Route path="/medicine/:id"         element={<MedicineDetailPage />} />
          <Route path="*"                     element={<NotFoundPage />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App

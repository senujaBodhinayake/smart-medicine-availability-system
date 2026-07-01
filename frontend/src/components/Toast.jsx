import { createContext, useContext, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: <CheckCircle className="w-5 h-5 text-secondary-600" />,
  error:   <XCircle     className="w-5 h-5 text-danger-600"   />,
  warning: <AlertTriangle className="w-5 h-5 text-warning-600" />,
  info:    <Info        className="w-5 h-5 text-primary-600"  />,
}

const STYLES = {
  success: 'border-l-4 border-secondary-500 bg-secondary-50',
  error:   'border-l-4 border-danger-500   bg-danger-50',
  warning: 'border-l-4 border-warning-500  bg-warning-50',
  info:    'border-l-4 border-primary-500  bg-primary-50',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ message, type = 'info', duration = 3500 }) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-80">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-start gap-3 rounded-lg shadow-lg p-4 ${STYLES[t.type]} animate-[pageEnter_0.2s_ease-out]`}
          >
            <span className="shrink-0 mt-0.5">{ICONS[t.type]}</span>
            <p className="text-sm text-slate-700 flex-1">{t.message}</p>
            <button onClick={() => remove(t.id)} className="shrink-0 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

/** Call this hook inside any component to show toasts */
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

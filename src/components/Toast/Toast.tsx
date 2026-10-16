import { useEffect } from 'react'
import { useToast } from '../../contexts/ToastContext'

const variantStyles: Record<string, { bg: string; border: string; icon: string }> = {
  success: { bg: 'bg-[#e9f5ed]', border: 'border-[#28724d]', icon: '✓' },
  error: { bg: 'bg-[#fde8e8]', border: 'border-[#d94444]', icon: '✕' },
  warning: { bg: 'bg-[#fef3e2]', border: 'border-[#e6a23c]', icon: '⚠' },
  info: { bg: 'bg-[#e8f0fe]', border: 'border-[#4a7fc1]', icon: 'ℹ' },
}

const variantText: Record<string, string> = {
  success: 'text-[#28724d]',
  error: 'text-[#d94444]',
  warning: 'text-[#9a6700]',
  info: 'text-[#2b5a9e]',
}

const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col-reverse gap-2" style={{ maxWidth: 380 }}>
      {toasts.map((toast) => (
        <ToastMessage key={toast.id} id={toast.id} message={toast.message} variant={toast.variant} onDismiss={removeToast} />
      ))}
    </div>
  )
}

const ToastMessage = ({
  id,
  message,
  variant,
  onDismiss,
}: {
  id: string
  message: string
  variant: string
  onDismiss: (id: string) => void
}) => {
  const s = variantStyles[variant] ?? variantStyles.info
  const txt = variantText[variant] ?? variantText.info

  useEffect(() => {
    const el = document.getElementById(id)
    if (el) {
      el.style.opacity = '0'
      el.style.transform = 'translateX(100%)'
      requestAnimationFrame(() => {
        el.style.transition = 'all .35s cubic-bezier(.22,1,.36,1)'
        el.style.opacity = '1'
        el.style.transform = 'translateX(0)'
      })
    }
  }, [id])

  return (
    <div
      id={id}
      className={`flex items-start gap-3 rounded-xl border-l-4 ${s.border} ${s.bg} px-4 py-3 shadow-lg`}
      role="alert"
    >
      <span className={`mt-0.5 text-lg font-bold ${txt}`}>{s.icon}</span>
      <p className={`flex-1 text-sm font-semibold ${txt}`}>{message}</p>
      <button onClick={() => onDismiss(id)} className={`text-lg opacity-50 hover:opacity-100 ${txt}`} aria-label="Dismiss">
        ×
      </button>
    </div>
  )
}

export default ToastContainer

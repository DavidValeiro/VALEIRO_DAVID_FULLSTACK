import { useEffect, useState } from 'react'

function Toast({ toast, onDismiss }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    setLeaving(false)
    const t = setTimeout(() => setLeaving(true), 2000)
    return () => clearTimeout(t)
  }, [toast.key])

  const red = toast.type === 'error' || toast.type === 'danger'
  const icon = toast.type === 'error' ? '✗' : '✓'

  return (
    <div
      className={`toast pointer-events-auto flex items-center gap-3 rounded-2xl border-4 border-slate-950 px-5 py-3 shadow-[6px_6px_0_#172033] ${
        red ? 'bg-[#e85d4a] text-white' : 'bg-[#7AC74C] text-slate-950'
      } ${leaving ? 'toast-out' : 'toast-in'}`}
      onAnimationEnd={(e) => {
        if (e.animationName === 'toast-out') onDismiss()
      }}
    >
      <span className="text-xl font-black">{icon}</span>
      <p className="text-sm font-black uppercase tracking-wide">{toast.text}</p>
    </div>
  )
}

export default Toast
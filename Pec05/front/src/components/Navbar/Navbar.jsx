import { useState } from 'react'
import { clearToken } from '../../api'

function Navbar({ onLogout }) {
  function handleLogout() {
    clearToken()
    onLogout()
  }

  return (
    <header className="border-b-4 border-slate-950 bg-[#ffcb05]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border-4 border-slate-950 bg-white shadow-[3px_3px_0_#172033]">
            <svg viewBox="0 0 24 24" className="h-7 w-7">
              <rect x="2.5" y="3" width="19" height="18" rx="4" fill="#e85d4a" stroke="#172033" strokeWidth="1.6" />
              <rect x="5.5" y="6" width="9.5" height="7.5" rx="1.5" fill="#172033" />
              <rect x="6.7" y="7.2" width="7.1" height="5.1" rx="1" fill="#7dd3fc" />
              <circle cx="10.2" cy="9.75" r="1" fill="#172033" />
              <circle cx="17" cy="7.5" r="1.9" fill="#fff" stroke="#172033" strokeWidth="1.1" />
              <circle cx="17" cy="7.5" r="0.85" fill="#60a5fa" />
              <circle cx="16.8" cy="14" r="1.3" fill="#ffcb05" stroke="#172033" strokeWidth="0.9" />
              <circle cx="16.8" cy="17.6" r="1.3" fill="#fff" stroke="#172033" strokeWidth="0.9" />
            </svg>
          </span>
          <h1 className="text-xl font-black uppercase text-slate-950">Usuadex</h1>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <button
            onClick={handleLogout}
            className="cursor-pointer rounded-xl border-4 border-slate-950 bg-[#e85d4a] px-4 py-2 font-black uppercase text-white shadow-[3px_3px_0_#172033] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#172033]"
          >
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
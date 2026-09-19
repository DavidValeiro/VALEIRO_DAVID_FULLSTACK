import { useState } from 'react'
import { Link } from 'react-router-dom'
import { clearToken } from '../../api'

function Navbar({ onLogout }) {
  function handleLogout() {
    clearToken()
    onLogout()
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-800">Usuarios · PEC05</h1>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/users" className="text-blue-600 hover:underline">
            Usuarios
          </Link>
          <button
            onClick={handleLogout}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg transition"
          >
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
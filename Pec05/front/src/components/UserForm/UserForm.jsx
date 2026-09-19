import { useState } from 'react'

function UserForm({ onSubmit, initial = {}, submitLabel = 'Guardar', onCancel }) {
  const [name, setName] = useState(initial.name || '')
  const [email, setEmail] = useState(initial.email || '')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(!!initial.is_admin)

  function handleSubmit(e) {
    e.preventDefault()
    const payload = { name, email, is_admin: isAdmin }
    if (password) payload.password = password
    if (initial._id) {
      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined || payload[k] === '') delete payload[k]
      })
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Nombre
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Contraseña{' '}
          {initial._id && (
            <span className="font-normal text-slate-400">
              (déjala vacía para no cambiarla)
            </span>
          )}
        </label>
        <input
          type="password"
          required={!initial._id}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
          className="w-4 h-4"
        />
        Es administrador
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default UserForm
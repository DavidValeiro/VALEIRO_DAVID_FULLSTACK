import { useState } from 'react'
import PokemonPicker from '../PokemonPicker/PokemonPicker'

function UserForm({ onSubmit, initial = {}, submitLabel = 'Guardar', onCancel }) {
  const [name, setName] = useState(initial.name || '')
  const [email, setEmail] = useState(initial.email || '')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(!!initial.is_admin)
  const [pokemon, setPokemon] = useState(initial.pokemon || null)

  function handleSubmit(e) {
    e.preventDefault()
    const payload = { name, email, is_admin: isAdmin }
    if (password) payload.password = password
    if (initial._id) {
      payload.pokemon = pokemon
      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined || payload[k] === '') delete payload[k]
      })
    } else if (pokemon) {
      payload.pokemon = pokemon
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="reveal-stagger flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Nombre
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border-4 border-slate-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#172033] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#ffcb05]"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border-4 border-slate-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#172033] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#ffcb05]"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Contraseña{' '}
          {initial._id && (
            <span className="font-bold normal-case text-slate-400">
              (déjala vacía para no cambiarla)
            </span>
          )}
        </label>
        <input
          type="password"
          required={!initial._id}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border-4 border-slate-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#172033] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#ffcb05]"
        />
      </div>
      <label className="flex cursor-pointer items-center gap-3 text-sm font-black uppercase text-slate-700">
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
          className="h-5 w-5 accent-[#ffcb05]"
        />
        Es administrador
      </label>

      <PokemonPicker value={pokemon} onChange={setPokemon} />

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 cursor-pointer rounded-xl border-4 border-slate-950 bg-[#ffcb05] px-5 py-3 text-lg font-black uppercase text-slate-950 shadow-[4px_4px_0_#172033] transition hover:-translate-y-1 hover:bg-[#ffd740] hover:shadow-[6px_6px_0_#172033]"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-xl border-4 border-slate-950 bg-white px-5 py-3 text-lg font-black uppercase text-slate-950 shadow-[4px_4px_0_#172033] transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#172033]"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default UserForm
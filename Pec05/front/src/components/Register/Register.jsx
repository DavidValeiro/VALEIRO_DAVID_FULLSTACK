import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PokemonPicker from '../PokemonPicker/PokemonPicker'
import { api, setToken } from '../../api'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pokemon, setPokemon] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      const payload = { name, email, password }
      if (pokemon) payload.pokemon = pokemon
      await api.register(payload)
      const data = await api.login(email, password)
      setToken(data.token)
      navigate('/users', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full min-h-[860px] w-full max-w-md flex-col overflow-hidden rounded-4xl border-4 border-slate-950 bg-[#e8f1ff] shadow-[0_18px_40px_rgba(23,32,51,0.25)]">
      <div className="flex items-center justify-between border-b-4 border-slate-950 bg-[#2a6ccb] px-6 py-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">Nuevo usuario</p>
          <h1 className="text-3xl font-black uppercase leading-none text-white">Crear cuenta</h1>
          <p className="mt-1 text-sm font-black text-blue-200">Regístrate para acceder (solo lectura)</p>
        </div>
        <span className="rounded-full border-2 border-slate-950 bg-white px-3 py-1 text-sm font-black text-[#2a6ccb]">registro</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
        <div>
          <label className="mb-1 block text-xs font-black uppercase tracking-[0.2em] text-[#2a6ccb]">Nombre</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ash Ketchum"
            className="w-full rounded-xl border-4 border-slate-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#172033] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#2a6ccb]"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-black uppercase tracking-[0.2em] text-[#2a6ccb]">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ash.ketchum@example.com"
            className="w-full rounded-xl border-4 border-slate-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#172033] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#2a6ccb]"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-black uppercase tracking-[0.2em] text-[#2a6ccb]">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border-4 border-slate-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#172033] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#2a6ccb]"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-black uppercase tracking-[0.2em] text-[#2a6ccb]">Repite la contraseña</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border-4 border-slate-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#172033] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#2a6ccb]"
          />
        </div>

        <PokemonPicker value={pokemon} onChange={setPokemon} />

        <p className="rounded-xl border-2 border-slate-950 bg-blue-100 px-4 py-3 text-xs font-black uppercase tracking-wide text-blue-800 shadow-[3px_3px_0_#172033]">
          Los registros siempre se crean como usuario normal (sin permisos de administrador).
        </p>

        {error && (
          <p className="rounded-xl border-2 border-slate-950 bg-[#e85d4a] px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0_#172033]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-xl border-4 border-slate-950 bg-[#2a6ccb] px-5 py-3 text-lg font-black uppercase text-white shadow-[4px_4px_0_#0f3d8c] transition hover:-translate-y-1 hover:bg-[#3b7cd6] hover:shadow-[6px_6px_0_#0f3d8c] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#0f3d8c]"
        >
          {loading ? 'Registrando…' : 'Crear cuenta'}
        </button>
      </form>
    </div>
  )
}

export default Register
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Register from '../components/Register/Register'
import { api, setToken } from '../api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [scale, setScale] = useState(1)
  const wrapRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const compute = () => {
      const vh = window.innerHeight
      const vw = window.innerWidth
      const s = Math.min(1, (vh - 96) / el.offsetHeight, (vw - 48) / el.offsetWidth)
      setScale(Number(Math.max(0.4, s).toFixed(3)))
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    window.addEventListener('resize', compute)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', compute)
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
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
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-[#f1eee6]">
      <div ref={wrapRef} className="flex flex-col items-center" style={{ transform: `scale(${scale})` }}>
        <div className="deck-stage relative">
          <div className="grid" style={{ gridTemplateAreas: '"deck"' }}>
            <div className={`deck-card ${flipped ? 'deck-back' : 'deck-front'}`}>
              <div className="flex h-full min-h-[860px] w-full max-w-md flex-col overflow-hidden rounded-4xl border-4 border-slate-950 bg-[#fff8e7] shadow-[0_18px_40px_rgba(23,32,51,0.25)]">
                <div className="flex items-center justify-between border-b-4 border-slate-950 bg-[#ffcb05] px-6 py-5">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">PEC05</p>
                    <h1 className="text-3xl font-black uppercase leading-none text-slate-950">Usuarios API</h1>
                    <p className="mt-1 text-sm font-black text-slate-700">Inicia sesión para gestionar usuarios</p>
                  </div>
                  <span className="rounded-full border-2 border-slate-950 bg-white px-3 py-1 text-sm font-black text-slate-950">login</span>
                </div>

                <form onSubmit={handleSubmit} className="mb-0 flex flex-col gap-4 p-6">
                  <div>
                    <label className="mb-1 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="david.valeiro@example.com"
                      className="w-full rounded-xl border-4 border-slate-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#172033] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#ffcb05]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">Contraseña</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border-4 border-slate-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#172033] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#ffcb05]"
                    />
                  </div>

                  {error && (
                    <p className="rounded-xl border-2 border-slate-950 bg-[#e85d4a] px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0_#172033]">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer rounded-xl border-4 border-slate-950 bg-[#ffcb05] px-5 py-3 text-lg font-black uppercase text-slate-950 shadow-[4px_4px_0_#172033] transition hover:-translate-y-1 hover:bg-[#ffd740] hover:shadow-[6px_6px_0_#172033] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#172033]"
                  >
                    {loading ? 'Entrando…' : 'Iniciar sesión'}
                  </button>
                </form>

                <div className="min-h-0 flex-1 overflow-hidden">
                  <div
                    className="h-full w-full shadow-[inset_16px_16px_28px_rgba(23,32,51,0.7),inset_-14px_-14px_24px_rgba(255,255,255,0.4)]"
                    role="img"
                    aria-label="Charmander aplastado contra el cristal"
                    style={{
                      backgroundImage: 'url(/window-charmander.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </div>

              </div>
            </div>

            <div className={`deck-card ${flipped ? 'deck-front' : 'deck-back'}`}>
              <Register />
            </div>
          </div>

          <div
            className={`pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-[100%] bg-slate-950 blur-xl transition-all duration-700 ease-out ${
              flipped ? 'h-8 w-[72%] opacity-40' : 'h-6 w-[58%] opacity-30'
            }`}
          />
        </div>

        <button
          onClick={() => setFlipped((f) => !f)}
          className="mt-12 cursor-pointer rounded-xl border-4 border-slate-950 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.15em] text-slate-950 shadow-[4px_4px_0_#172033] transition hover:-translate-y-1 hover:bg-[#ffcb05] hover:shadow-[6px_6px_0_#172033]"
        >
          {flipped ? '← Ir a iniciar sesión' : 'Ir a crear cuenta →'}
        </button>
      </div>
    </div>
  )
}

export default Login
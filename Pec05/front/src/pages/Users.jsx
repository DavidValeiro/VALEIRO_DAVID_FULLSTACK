import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import UserCard from '../components/UserCard/UserCard'
import UserForm from '../components/UserForm/UserForm'
import Toast from '../components/Toast/Toast'
import { api, clearToken, getIsAdmin } from '../api'

const CREATE_CLOSE_MS = 450

function Users() {
  const isAdmin = getIsAdmin()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [createClosing, setCreateClosing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [searchId, setSearchId] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const createTimer = useRef(null)
  const navigate = useNavigate()

  function showToast(text, type = 'success') {
    setToast({ text, type, key: Date.now() })
  }

  function closeCreate() {
    if (!showCreate || createClosing) return
    setCreateClosing(true)
    createTimer.current = setTimeout(() => {
      setShowCreate(false)
      setCreateClosing(false)
    }, CREATE_CLOSE_MS)
  }

  function toggleCreate() {
    if (showCreate) closeCreate()
    else setShowCreate(true)
  }

  useEffect(() => {
    return () => clearTimeout(createTimer.current)
  }, [])

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    try {
      const data = await api.getUsers()
      setUsers(data)
    } catch (err) {
      if (err.message === 'Authorization header missing' || err.message === 'Invalid token') {
        clearToken()
        navigate('/login', { replace: true })
        return
      }
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(payload) {
    try {
      const created = await api.createUser(payload)
      setUsers((prev) => [...prev, created])
      closeCreate()
      showToast('Usuario creado correctamente')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  function handleDeleted(id) {
    setUsers((prev) => prev.filter((u) => u._id !== id))
    setSearchResult((prev) => (prev && prev._id === id ? null : prev))
    showToast('Usuario eliminado', 'danger')
  }

  function handleEdited(updated) {
    setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)))
    setSearchResult((prev) => (prev && prev._id === updated._id ? updated : prev))
    showToast('Guardado correctamente')
  }

  async function handleSearch() {
    setSearchResult(null)
    if (!searchId) return
    try {
      const data = await api.getUserById(searchId)
      setSearchResult(data)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className="min-h-screen bg-[#f1eee6]">
      <Navbar onLogout={() => navigate('/login', { replace: true })} />

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        {toast && (
          <div className="pointer-events-none fixed right-4 top-24 z-50">
            <Toast toast={toast} onDismiss={() => setToast(null)} />
          </div>
        )}

        {!isAdmin && (
          <p className="rounded-xl border-4 border-slate-950 bg-[#fff8e7] px-4 py-3 text-sm font-black text-slate-700 shadow-[4px_4px_0_#172033]">
            Tu usuario no es administrador: solo lectura, no puedes crear, editar ni eliminar usuarios.
          </p>
        )}

        {isAdmin && (
          <section className="flex flex-wrap items-end gap-4">
          <div className="min-w-64 flex-1">
            <label className="mb-1 block text-xs font-black uppercase tracking-[0.2em] text-slate-600">
              Buscar usuario por ID
            </label>
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="pega un ObjectId"
              className="w-full rounded-xl border-4 border-slate-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#172033] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#ffcb05]"
            />
          </div>
          <button
            onClick={handleSearch}
            className="cursor-pointer rounded-xl border-4 border-slate-950 bg-[#ffcb05] px-5 py-3 font-black uppercase text-slate-950 shadow-[4px_4px_0_#172033] transition hover:-translate-y-1 hover:bg-[#ffd740] hover:shadow-[6px_6px_0_#172033]"
          >
            Buscar
          </button>
        </section>
        )}

        {searchResult && (
          <section>
            <h2 className="mb-3 text-xl font-black uppercase text-slate-800">
              Resultado de búsqueda
            </h2>
            <UserCard
              user={searchResult}
              canManage={isAdmin}
              editing={editId === searchResult._id}
              onStartEdit={setEditId}
              onEndEdit={() => setEditId(null)}
              onDeleted={(id) => {
                handleDeleted(id)
                setSearchResult(null)
              }}
              onEdited={handleEdited}
              onError={(msg) => showToast(msg, 'error')}
            />
          </section>
        )}

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-black uppercase text-slate-800">
              Usuarios ({users.length})
            </h2>
            {isAdmin && (
              <button
                onClick={toggleCreate}
                className="cursor-pointer rounded-xl border-4 border-slate-950 bg-[#ffcb05] px-5 py-3 font-black uppercase text-slate-950 shadow-[4px_4px_0_#172033] transition hover:-translate-y-1 hover:bg-[#ffd740] hover:shadow-[6px_6px_0_#172033]"
              >
                {showCreate && !createClosing ? 'Cancelar' : '+ Crear usuario'}
              </button>
            )}
          </div>

          {isAdmin && showCreate && (
            <div className={`despliegue mb-4 ${createClosing ? 'despliegue-cerrar' : ''}`}>
              <div className="despliegue-inner">
                <div className="rounded-3xl border-4 border-slate-950 bg-[#fff8e7] p-5 shadow-[6px_6px_0_#172033]">
                  <UserForm submitLabel="Crear usuario" onSubmit={handleCreate} />
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-sm font-black text-slate-500">Cargando usuarios…</p>
          ) : users.length === 0 ? (
            <p className="text-sm font-black text-slate-500">No hay usuarios.</p>
          ) : (
            <div className="grid items-start gap-6 md:grid-cols-2">
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  canManage={isAdmin}
                  editing={editId === user._id}
                  onStartEdit={setEditId}
                  onEndEdit={() => setEditId(null)}
                  onDeleted={handleDeleted}
                  onEdited={handleEdited}
                  onError={(msg) => showToast(msg, 'error')}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Users
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import UserCard from '../components/UserCard/UserCard'
import UserForm from '../components/UserForm/UserForm'
import { api, clearToken, getIsAdmin } from '../api'

function Users() {
  const isAdmin = getIsAdmin()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [searchId, setSearchId] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    setError('')
    try {
      const data = await api.getUsers()
      setUsers(data)
    } catch (err) {
      if (err.message === 'Authorization header missing' || err.message === 'Invalid token') {
        clearToken()
        navigate('/login', { replace: true })
        return
      }
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(payload) {
    setError('')
    setMessage('')
    try {
      await api.createUser(payload)
      setShowCreate(false)
      setMessage('Usuario creado correctamente')
      loadUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  function handleDeleted() {
    setMessage('Usuario eliminado')
    loadUsers()
  }

  function handleEdited() {
    setMessage('Usuario actualizado')
    loadUsers()
  }

  async function handleSearch() {
    setError('')
    setSearchResult(null)
    if (!searchId) return
    try {
      const data = await api.getUserById(searchId)
      setSearchResult(data)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar onLogout={() => navigate('/login', { replace: true })} />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {(message || error) && (
          <div
            className={`px-4 py-3 rounded-lg text-sm border ${
              error
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-green-50 text-green-700 border-green-200'
            }`}
          >
            {error || message}
          </div>
        )}

        {!isAdmin && (
          <p className="px-4 py-3 rounded-lg text-sm border bg-slate-50 text-slate-600 border-slate-200">
            Tu usuario no es administrador: solo lectura, no puedes crear, editar ni eliminar usuarios.
          </p>
        )}

        <section className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Buscar usuario por ID
            </label>
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="pega un ObjectId"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-slate-800 hover:bg-slate-900 text-white font-medium px-4 py-2 rounded-lg transition"
          >
            Buscar
          </button>
        </section>

        {searchResult && (
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3">
              Resultado de búsqueda
            </h2>
            <UserCard
              user={searchResult}
              canManage={isAdmin}
              onDeleted={() => {
                setSearchResult(null)
                handleDeleted()
              }}
              onEdited={handleEdited}
              onError={setError}
            />
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-800">
              Usuarios ({users.length})
            </h2>
            {isAdmin && (
              <button
                onClick={() => setShowCreate((v) => !v)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
              >
                {showCreate ? 'Cancelar' : '+ Crear usuario'}
              </button>
            )}
          </div>

          {isAdmin && showCreate && (
            <div className="bg-white rounded-xl shadow p-4 border border-slate-200 mb-4">
              <UserForm submitLabel="Crear usuario" onSubmit={handleCreate} />
            </div>
          )}

          {loading ? (
            <p className="text-slate-500">Cargando usuarios…</p>
          ) : users.length === 0 ? (
            <p className="text-slate-500">No hay usuarios.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  canManage={isAdmin}
                  onDeleted={handleDeleted}
                  onEdited={handleEdited}
                  onError={setError}
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
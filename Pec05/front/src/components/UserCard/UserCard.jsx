import { useState } from 'react'
import UserForm from '../UserForm/UserForm'
import { api } from '../../api'

function UserCard({ user, onDeleted, onEdited, onError, canManage = true }) {
  const [editing, setEditing] = useState(false)

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar a ${user.name}?`)) return
    try {
      await api.deleteUser(user._id)
      onDeleted(user._id)
    } catch (err) {
      onError(err.message)
    }
  }

  async function handleEdit(payload) {
    try {
      await api.updateUser(user._id, payload)
      onEdited()
      setEditing(false)
    } catch (err) {
      onError(err.message)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 border border-slate-200">
      {editing ? (
        <UserForm
          initial={user}
          submitLabel="Guardar cambios"
          onSubmit={handleEdit}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">{user.name}</h3>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                user.is_admin
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {user.is_admin ? 'Admin' : 'Usuario'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">ID: {user._id}</p>
          {canManage ? (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setEditing(true)}
                className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg transition"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="text-sm bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-1.5 rounded-lg transition"
              >
                Eliminar
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-400 mt-3">Solo lectura</p>
          )}
        </>
      )}
    </div>
  )
}

export default UserCard
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import Spinner from '@/components/Spinner';
import Toast from '@/components/Toast';
import UserCard from '@/components/UserCard';
import UserForm from '@/components/UserForm';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const CREATE_CLOSE_MS = 450;

function UsersPage() {
  const { isAdmin, user: currentUser, token, patchUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createClosing, setCreateClosing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const createTimer = useRef(null);
  const router = useRouter();

  const showToast = useCallback((text, type = 'success') => {
    setToast({ text, type, key: Date.now() });
  }, []);

  const closeCreate = useCallback(() => {
    setCreateClosing(true);
    createTimer.current = setTimeout(() => {
      setShowCreate(false);
      setCreateClosing(false);
    }, CREATE_CLOSE_MS);
  }, []);

  const toggleCreate = () => {
    if (showCreate) closeCreate();
    else setShowCreate(true);
  };

  useEffect(() => () => clearTimeout(createTimer.current), []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = isAdmin
        ? await api.get('/users', token)
        : await api.get(`/users/${currentUser._id}`, token);
      setUsers(Array.isArray(data) ? data : [data]);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace('/login');
        return;
      }
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [currentUser._id, isAdmin, router, showToast, token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleCreate(payload) {
    try {
      const created = await api.post('/users', payload, token);
      setUsers((prev) => [...prev, created]);
      closeCreate();
      showToast('Usuario creado correctamente');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  function handleDeleted(id) {
    setUsers((prev) => prev.filter((user) => user._id !== id));
    setSearchResult((prev) => (prev && prev._id === id ? null : prev));
    showToast('Usuario eliminado', 'danger');
  }

  function handleEdited(updated) {
    setUsers((prev) => prev.map((user) => (user._id === updated._id ? updated : user)));
    setSearchResult((prev) => (prev && prev._id === updated._id ? updated : prev));
    if (updated._id === currentUser._id) patchUser(updated);
    showToast('Guardado correctamente');
  }

  async function handleSearch() {
    setSearchResult(null);
    if (!searchId) return;
    try {
      setSearchResult(await api.get(`/users/${searchId.trim()}`, token));
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  return (
    <div className="space-y-8">
      {toast && (
        <div className="pointer-events-none fixed right-4 top-24 z-50">
          <Toast toast={toast} onDismiss={() => setToast(null)} />
        </div>
      )}

      {isAdmin && (
        <section className="flex flex-wrap items-end gap-4">
          <div className="min-w-64 flex-1">
            <label
              htmlFor="search-user"
              className="mb-1 block text-xs font-black uppercase tracking-[0.2em] text-slate-600"
            >
              Buscar usuario por ID
            </label>
            <input
              id="search-user"
              type="text"
              value={searchId}
              onChange={(event) => setSearchId(event.target.value)}
              placeholder="pega un ObjectId"
              className="w-full rounded-xl border-4 border-slate-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#172033] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#ffcb05]"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="cursor-pointer rounded-xl border-4 border-slate-950 bg-[#ffcb05] px-5 py-3 font-black uppercase text-slate-950 shadow-[4px_4px_0_#172033] transition hover:-translate-y-1 hover:bg-[#ffd740] hover:shadow-[6px_6px_0_#172033]"
          >
            Buscar
          </button>
        </section>
      )}

      {searchResult && (
        <section>
          <h2 className="mb-3 text-xl font-black uppercase text-slate-800">Resultado de búsqueda</h2>
          <UserCard
            user={searchResult}
            canEdit
            canDelete={isAdmin}
            showAdminField={isAdmin}
            editing={editId === searchResult._id}
            onStartEdit={setEditId}
            onEndEdit={() => setEditId(null)}
            onDeleted={(id) => {
              handleDeleted(id);
              setSearchResult(null);
            }}
            onEdited={handleEdited}
            onError={(message) => showToast(message, 'error')}
          />
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase text-slate-800">
            {isAdmin ? `Usuarios (${users.length})` : 'Tu usuario'}
          </h2>
          {isAdmin && (
            <button
              type="button"
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
                <UserForm submitLabel="Crear usuario" onSubmit={handleCreate} showAdmin />
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <Spinner label="Cargando usuarios…" />
        ) : users.length === 0 ? (
          <p className="text-sm font-black text-slate-500">No hay usuarios.</p>
        ) : (
          <div className="grid items-start gap-6 md:grid-cols-2">
            {users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                canEdit
                canDelete={isAdmin}
                showAdminField={isAdmin}
                editing={editId === user._id}
                onStartEdit={setEditId}
                onEndEdit={() => setEditId(null)}
                onDeleted={handleDeleted}
                onEdited={handleEdited}
                onError={(message) => showToast(message, 'error')}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function UsersRoute() {
  return (
    <RequireAuth>
      <UsersPage />
    </RequireAuth>
  );
}
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import UserForm from '../UserForm/UserForm'
import { api } from '../../api'
import { getSpriteUrl } from '../../pokemon'

const CLOSE_DURATION = 380
const BORDER_PX = 8

function UserCard({ user, onDeleted, onEdited, onError, canManage = true, editing, onStartEdit, onEndEdit }) {
  const [closing, setClosing] = useState(false)
  const [closeTo, setCloseTo] = useState(false)
  const [closeRange, setCloseRange] = useState(null)
  const [dropIn, setDropIn] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const formRef = useRef(null)
  const readRef = useRef(null)

  useEffect(() => {
    if (!confirmOpen) return
    function onKey(e) {
      if (e.key === 'Escape') setConfirmOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmOpen])

  useEffect(() => {
    if (!closing) return
    const raf = requestAnimationFrame(() => setCloseTo(true))
    const t = setTimeout(finishClose, CLOSE_DURATION - 340)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
      setCloseTo(false)
    }
  }, [closing])

  function closeEditor() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onEndEdit()
      return
    }
    const from = (formRef.current?.getBoundingClientRect().height ?? 0) + BORDER_PX
    const to = (readRef.current?.getBoundingClientRect().height ?? 0) + BORDER_PX
    setCloseRange({ from, to })
    setCloseTo(false)
    setClosing(true)
  }

  function finishClose() {
    setDropIn(true)
    onEndEdit()
  }

  function handleDropEnd() {
    setClosing(false)
    setCloseTo(false)
    setCloseRange(null)
  }

  function handleTransitionEnd(e) {
    if (e.target !== e.currentTarget || e.propertyName !== 'height') return
    finishClose()
  }

  async function handleDelete() {
    setConfirmOpen(true)
  }

  async function confirmDelete() {
    try {
      await api.deleteUser(user._id)
      onDeleted(user._id)
      setConfirmOpen(false)
    } catch (err) {
      onError(err.message)
      setConfirmOpen(false)
    }
  }

  async function handleEdit(payload) {
    try {
      const updated = await api.updateUser(user._id, payload)
      onEdited(updated)
      closeEditor()
    } catch (err) {
      onError(err.message)
    }
  }

  function renderReadOnly() {
    return (
      <>
        <div
          className={`flex items-start justify-between gap-3 border-b-4 border-slate-950 px-5 py-4 ${
            user.is_admin ? 'bg-[#a855f7]' : 'bg-[#ffcb05]'
          }`}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {user.pokemon?.id && (
              <div className="aspect-square shrink-0 self-stretch">
                <img
                  src={getSpriteUrl(user.pokemon.id, !!user.pokemon.shiny)}
                  className="pixel-art h-full w-full rounded-lg border-2 border-slate-950 bg-white object-contain p-0.5 shadow-[2px_2px_0_rgba(23,32,51,0.5)]"
                  alt={user.pokemon.name}
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-black uppercase tracking-[0.2em] ${user.is_admin ? 'text-purple-100' : 'text-slate-600'}`}>Usuario</p>
              <h3 className={`truncate text-2xl font-black leading-none ${user.is_admin ? 'text-white' : 'text-slate-950'}`}>
                {user.name}
              </h3>
              <FitText
                className={`mt-1 text-sm font-bold ${user.is_admin ? 'text-purple-100' : 'text-slate-700'}`}
              >
                {user.email}
              </FitText>
              {user.pokemon?.name && (
                <p className={`mt-0.5 truncate text-sm font-black capitalize ${user.is_admin ? 'text-purple-100' : 'text-slate-600'}`}>
                  {user.pokemon.name}
                  {user.pokemon.shiny && <span className="ml-1">✨</span>}
                </p>
              )}
            </div>
          </div>
          <span
            className={`flex shrink-0 items-center gap-1 rounded-full border-2 border-slate-950 px-3 py-1 text-sm font-black ${
              user.is_admin ? 'bg-white text-[#a855f7]' : 'bg-slate-200 text-slate-800'
            }`}
          >
            {user.is_admin ? 'Admin' : 'Usuario'}
            {user.is_admin && (
              <svg className="inline-block h-4 w-4" viewBox="0 0 24 24" aria-label="favorito">
                <path
                  d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  fill="#ffcb05"
                  stroke="#ffcb05"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </div>
        <div className="px-5 py-4">
          {canManage && (
            <p className="break-all text-xs font-black text-slate-400">ID: {user._id}</p>
          )}
          {canManage ? (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onStartEdit(user._id)}
                className="cursor-pointer rounded-xl border-4 border-slate-950 bg-white px-4 py-2 text-sm font-black uppercase text-slate-950 shadow-[3px_3px_0_#172033] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#172033]"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="cursor-pointer rounded-xl border-4 border-slate-950 bg-[#e85d4a] px-4 py-2 text-sm font-black uppercase text-white shadow-[3px_3px_0_#172033] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#172033]"
              >
                Eliminar
              </button>
            </div>
          ) : (
            <p className="text-center text-base font-black uppercase tracking-widest text-slate-500">Solo lectura</p>
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <div
        className="relative overflow-hidden rounded-3xl border-4 border-slate-950 bg-[#fff8e7] shadow-[6px_6px_0_#172033]"
        onTransitionEnd={handleTransitionEnd}
      style={
        closing
          ? {
              height: `${(closeTo ? closeRange.to : closeRange.from) || 0}px`,
              transition: `height ${CLOSE_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            }
          : undefined
      }
    >
      {editing ? (
        <>
          <div
            ref={readRef}
            aria-hidden="true"
            className="pointer-events-none invisible absolute inset-x-0 top-0"
          >
            {renderReadOnly()}
          </div>
          <div ref={formRef} className="overflow-hidden">
            <div className="despliegue">
              <div className="despliegue-inner">
                <div className="p-5">
                  <UserForm
                    initial={user}
                    submitLabel="Guardar cambios"
                    onSubmit={handleEdit}
                    onCancel={closeEditor}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={dropIn ? 'card-drop' : undefined} onAnimationEnd={handleDropEnd}>
          {renderReadOnly()}
        </div>
      )}
      </div>

      {confirmOpen &&
        createPortal(
          <div
            className="modal-fade fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setConfirmOpen(false)}
          >
            <div
              className="slide-from-top w-full max-w-md rounded-4xl border-4 border-slate-950 bg-[#fff8e7] p-6 shadow-[10px_10px_0_#172033]"
              onClick={(e) => e.stopPropagation()}
              role="alertdialog"
              aria-modal="true"
              aria-label="Confirmar eliminación"
            >
              <h3 className="text-xl font-black uppercase text-slate-950">¿Eliminar usuario?</h3>
              <p className="mt-2 text-sm font-bold text-slate-600">
                Vas a eliminar a{' '}
                <span className="font-black text-slate-950">{user.name}</span>. Esta acción no se
                puede deshacer.
              </p>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="flex-1 cursor-pointer rounded-xl border-4 border-slate-950 bg-white px-5 py-3 text-sm font-black uppercase text-slate-950 shadow-[3px_3px_0_#172033] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#172033]"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 cursor-pointer rounded-xl border-4 border-slate-950 bg-[#e85d4a] px-5 py-3 text-sm font-black uppercase text-white shadow-[3px_3px_0_#172033] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#172033]"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

function FitText({ children, className, base = 14, min = 9 }) {
  const ref = useRef(null)
  const [fontSize, setFontSize] = useState(base)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const parent = el.parentElement

    function fit() {
      const avail = parent ? parent.clientWidth : el.clientWidth
      el.style.fontSize = `${base}px`
      el.style.whiteSpace = 'nowrap'
      const needed = el.scrollWidth
      let size = base
      if (avail > 0 && needed > avail) size = Math.max(min, (base * avail) / needed)
      setFontSize(size)
    }

    fit()
    if (document.fonts?.ready) document.fonts.ready.then(fit)
    const ro = new ResizeObserver(fit)
    if (parent) ro.observe(parent)
    return () => ro.disconnect()
  }, [children, base, min])

  return (
    <p
      ref={ref}
      className={className}
      style={{ fontSize: `${fontSize}px`, lineHeight: 1.3, whiteSpace: 'nowrap' }}
    >
      {children}
    </p>
  )
}

export default UserCard
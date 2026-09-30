'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatDate, initials } from '@/lib/format';
import { getSpriteUrl } from '@/lib/pokemon';
import Alert from '@/components/Alert';

export default function CommentSection({ postId, comments, onCreate, onUpdate, onDelete }) {
  const { isAuthenticated, token, errorMessage, canManage } = useAuth();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [busyId, setBusyId] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) {
      setError('El comentario no puede estar vacío');
      return;
    }

    setSending(true);
    setError('');
    try {
      await onCreate({ postId, content: content.trim(), token });
      setContent('');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const startEditing = (comment) => {
    setEditingId(comment._id);
    setEditingContent(comment.content);
    setError('');
  };

  const saveEdit = async (comment) => {
    if (!editingContent.trim()) {
      setError('El comentario no puede quedar vacío');
      return;
    }
    setBusyId(comment._id);
    setError('');
    try {
      await onUpdate({ id: comment._id, content: editingContent.trim(), token });
      setEditingId(null);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (comment) => {
    if (!window.confirm('¿Seguro que quieres eliminar este comentario?')) return;
    setBusyId(comment._id);
    setError('');
    try {
      await onDelete({ id: comment._id, token });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="space-y-5">
      <h2 className="text-lg font-black uppercase text-slate-900">
        Comentarios <span className="text-slate-500">({comments.length})</span>
      </h2>

      <Alert message={error} />

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            rows={3}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Escribe un comentario…"
            className="w-full resize-y rounded-xl border-4 border-slate-950 bg-white px-4 py-3 text-sm font-bold shadow-[4px_4px_0_#172033] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#ffcb05]"
          />
          <button
            type="submit"
            disabled={sending}
            className="cursor-pointer rounded-xl border-4 border-slate-950 bg-[#ffcb05] px-5 py-2.5 text-sm font-black uppercase text-slate-950 shadow-[3px_3px_0_#172033] transition hover:-translate-y-0.5 hover:bg-[#ffd740] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? 'Publicando…' : 'Comentar'}
          </button>
        </form>
      ) : (
        <p className="rounded-xl border-4 border-dashed border-slate-950 bg-[#fff8e7] px-4 py-3 text-sm font-bold text-slate-600">
          <Link href="/login" className="font-black text-[#2a6ccb] underline decoration-4 underline-offset-4">
            Inicia sesión
          </Link>{' '}
          para comentar en esta publicación.
        </p>
      )}

      {comments.length === 0 ? (
        <p className="text-sm font-black text-slate-500">Todavía no hay comentarios.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => {
            const mine = canManage(comment);
            const isEditing = editingId === comment._id;

            return (
              <li
                key={comment._id}
                className="rounded-2xl border-4 border-slate-950 bg-[#fff8e7] p-4 shadow-[5px_5px_0_#172033]"
              >
                <div className="flex items-center gap-3">
                  {comment.user?.pokemon?.id ? (
                    <img
                      src={getSpriteUrl(comment.user.pokemon.id, !!comment.user.pokemon.shiny)}
                      alt={comment.user.pokemon.name}
                      className="pixel-art size-9 shrink-0 rounded-lg border-2 border-slate-950 bg-white object-contain p-0.5"
                    />
                  ) : (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border-2 border-slate-950 bg-[#ffcb05] text-xs font-black text-slate-950">
                      {initials(comment.user?.name)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-900">{comment.user?.name || 'Usuario'}</p>
                    <p className="text-xs font-bold text-slate-500">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>

                {isEditing ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      rows={3}
                      value={editingContent}
                      onChange={(event) => setEditingContent(event.target.value)}
                      className="w-full resize-y rounded-xl border-4 border-slate-950 bg-white px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#ffcb05]"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => saveEdit(comment)}
                        disabled={busyId === comment._id}
                        className="cursor-pointer rounded-xl border-4 border-slate-950 bg-[#ffcb05] px-4 py-2 text-sm font-black uppercase text-slate-950 shadow-[3px_3px_0_#172033] disabled:opacity-60"
                      >
                        {busyId === comment._id ? 'Guardando…' : 'Guardar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="cursor-pointer rounded-xl border-4 border-slate-950 bg-white px-4 py-2 text-sm font-black uppercase text-slate-950 shadow-[3px_3px_0_#172033]"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 whitespace-pre-wrap text-sm font-bold text-slate-700">{comment.content}</p>
                )}

                {mine && !isEditing ? (
                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => startEditing(comment)}
                      className="cursor-pointer rounded-xl border-4 border-slate-950 bg-white px-3 py-1.5 text-sm font-black uppercase text-slate-950 shadow-[2px_2px_0_#172033]"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(comment)}
                      disabled={busyId === comment._id}
                      className="cursor-pointer rounded-xl border-4 border-slate-950 bg-[#e85d4a] px-3 py-1.5 text-sm font-black uppercase text-white shadow-[2px_2px_0_#172033] disabled:opacity-60"
                    >
                      {busyId === comment._id ? 'Eliminando…' : 'Eliminar'}
                    </button>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

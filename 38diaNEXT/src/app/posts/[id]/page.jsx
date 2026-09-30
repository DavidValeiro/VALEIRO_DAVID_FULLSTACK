'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { formatDate, initials } from '@/lib/format';
import { getSpriteUrl } from '@/lib/pokemon';
import Alert from '@/components/Alert';
import Spinner from '@/components/Spinner';
import CommentSection from '@/components/CommentSection';

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, canManage, errorMessage } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [postData, commentsData] = await Promise.all([
        api.get(`/posts/${id}`),
        api.get(`/posts/${id}/comments`)
      ]);
      setPost(postData);
      setComments(commentsData);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id, errorMessage]);

  useEffect(() => {
    load();
  }, [load]);

  const createComment = async ({ postId, content, token: authToken }) => {
    const created = await api.post(`/posts/${postId}/comments`, { content }, authToken);
    setComments((prev) => [...prev, created]);
    setPost((prev) => (prev ? { ...prev, comments: [...(prev.comments || []), created._id] } : prev));
  };

  const updateComment = async ({ id: commentId, content, token: authToken }) => {
    const updated = await api.put(`/comments/${commentId}`, { content }, authToken);
    setComments((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
  };

  const deleteComment = async ({ id: commentId, token: authToken }) => {
    await api.delete(`/comments/${commentId}`, authToken);
    setComments((prev) => prev.filter((c) => c._id !== commentId));
    setPost((prev) =>
      prev ? { ...prev, comments: (prev.comments || []).filter((cid) => cid !== commentId) } : prev
    );
  };

  const deletePost = async () => {
    if (!window.confirm('¿Seguro que quieres eliminar esta publicación y sus comentarios?')) return;
    setDeleting(true);
    setActionError('');
    try {
      await api.delete(`/posts/${post._id}`, token);
      router.push('/');
    } catch (err) {
      setActionError(errorMessage(err));
      setDeleting(false);
    }
  };

  if (loading) return <Spinner label="Cargando publicación…" />;
  if (error) {
    return (
      <div className="space-y-4">
        <Alert message={error} />
        <Link
          href="/"
          className="cursor-pointer rounded-xl border-4 border-slate-950 bg-white px-4 py-2 text-sm font-black uppercase text-slate-950 shadow-[3px_3px_0_#172033]"
        >
          ← Volver al inicio
        </Link>
      </div>
    );
  }
  if (!post) return null;

  const authorPokemon = post.author?.pokemon;

  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-block cursor-pointer rounded-xl border-4 border-slate-950 bg-white px-4 py-2 text-sm font-black uppercase text-slate-950 shadow-[3px_3px_0_#172033]"
      >
        ← Volver al inicio
      </Link>

      <article className="overflow-hidden rounded-3xl border-4 border-slate-950 bg-[#fff8e7] shadow-[8px_8px_0_#172033]">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image} alt={post.title} className="h-64 w-full border-b-4 border-slate-950 bg-slate-100 object-cover sm:h-80" />
        ) : null}

        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {authorPokemon?.id ? (
                <img
                  src={getSpriteUrl(authorPokemon.id, !!authorPokemon.shiny)}
                  alt={authorPokemon.name}
                  className="pixel-art size-10 shrink-0 rounded-xl border-2 border-slate-950 bg-white object-contain p-0.5"
                />
              ) : (
                <span className="flex size-10 items-center justify-center rounded-xl border-2 border-slate-950 bg-[#ffcb05] text-sm font-black text-slate-950">
                  {initials(post.author?.name)}
                </span>
              )}
              <div>
                <p className="text-sm font-black text-slate-900">{post.author?.name || 'Autor desconocido'}</p>
                <p className="text-xs font-bold text-slate-500">{formatDate(post.createdAt)}</p>
              </div>
            </div>

            {canManage(post) ? (
              <div className="flex gap-3">
                <Link
                  href={`/posts/${post._id}/edit`}
                  className="cursor-pointer rounded-xl border-4 border-slate-950 bg-white px-4 py-2 text-sm font-black uppercase text-slate-950 shadow-[3px_3px_0_#172033]"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={deletePost}
                  disabled={deleting}
                  className="cursor-pointer rounded-xl border-4 border-slate-950 bg-[#e85d4a] px-4 py-2 text-sm font-black uppercase text-white shadow-[3px_3px_0_#172033] disabled:opacity-60"
                >
                  {deleting ? 'Eliminando…' : 'Eliminar'}
                </button>
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase text-slate-950 sm:text-3xl">{post.title}</h1>
            <p className="whitespace-pre-wrap text-sm font-bold leading-relaxed text-slate-700">
              {post.description}
            </p>
          </div>

          <Alert message={actionError} />
        </div>
      </article>

      <div className="rounded-3xl border-4 border-slate-950 bg-[#fff8e7] p-6 shadow-[8px_8px_0_#172033]">
        <CommentSection
          postId={post._id}
          comments={comments}
          onCreate={createComment}
          onUpdate={updateComment}
          onDelete={deleteComment}
        />
      </div>
    </div>
  );
}

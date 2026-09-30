'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import RequireAuth from '@/components/RequireAuth';
import PostForm from '@/components/PostForm';
import Alert from '@/components/Alert';
import Spinner from '@/components/Spinner';

function EditPostForm() {
  const { id } = useParams();
  const router = useRouter();
  const { token, canManage, errorMessage } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    api
      .get(`/posts/${id}`)
      .then((data) => alive && setPost(data))
      .catch((err) => alive && setError(errorMessage(err)))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [id, errorMessage]);

  const handleSubmit = async (values) => {
    try {
      await api.put(`/posts/${post._id}`, values, token);
      router.push(`/posts/${post._id}`);
    } catch (err) {
      throw new Error(errorMessage(err));
    }
  };

  if (loading) return <Spinner label="Cargando publicación…" />;

  if (error) {
    return (
      <div className="space-y-4">
        <Alert message={error} />
        <button
          type="button"
          onClick={() => router.push('/')}
          className="cursor-pointer rounded-xl border-4 border-slate-950 bg-white px-4 py-2 text-sm font-black uppercase text-slate-950 shadow-[3px_3px_0_#172033]"
        >
          ← Volver al inicio
        </button>
      </div>
    );
  }

  if (!post) return null;

  if (!canManage(post)) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Alert message="Solo puedes editar tus propias publicaciones." />
        <button
          type="button"
          onClick={() => router.push(`/posts/${post._id}`)}
          className="cursor-pointer rounded-xl border-4 border-slate-950 bg-white px-4 py-2 text-sm font-black uppercase text-slate-950 shadow-[3px_3px_0_#172033]"
        >
          ← Volver a la publicación
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black uppercase text-slate-900">Editar publicación</h1>
        <p className="text-sm font-bold text-slate-500">Cambia el título, la descripción o la imagen.</p>
      </div>

      <div className="rounded-3xl border-4 border-slate-950 bg-[#fff8e7] p-6 shadow-[8px_8px_0_#172033]">
        <PostForm
          initialValues={{ _id: post._id, title: post.title, description: post.description, image: post.image }}
          submitLabel="Guardar cambios"
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/posts/${post._id}`)}
        />
      </div>
    </div>
  );
}

export default function EditPostPage() {
  return (
    <RequireAuth>
      <EditPostForm />
    </RequireAuth>
  );
}

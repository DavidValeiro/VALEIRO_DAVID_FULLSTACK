'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import RequireAuth from '@/components/RequireAuth';
import PostForm from '@/components/PostForm';

function NewPostForm() {
  const router = useRouter();
  const { token, errorMessage } = useAuth();

  const handleSubmit = async (values) => {
    try {
      await api.post('/posts', values, token);
      router.push('/');
    } catch (err) {
      throw new Error(errorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black uppercase text-slate-900">Nueva publicación</h1>
        <p className="text-sm font-bold text-slate-500">Necesitas iniciar sesión para publicar.</p>
      </div>

      <div className="rounded-3xl border-4 border-slate-950 bg-[#fff8e7] p-6 shadow-[8px_8px_0_#172033]">
        <PostForm onSubmit={handleSubmit} onCancel={() => router.push('/')} />
      </div>
    </div>
  );
}

export default function NewPostPage() {
  return (
    <RequireAuth>
      <NewPostForm />
    </RequireAuth>
  );
}

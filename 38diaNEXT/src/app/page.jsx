'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import PostCard from '@/components/PostCard';
import Alert from '@/components/Alert';
import Spinner from '@/components/Spinner';

export default function HomePage() {
  const { isAuthenticated, status } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    api
      .get('/posts')
      .then((data) => alive && setPosts(data))
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="mt-1 flex flex-wrap gap-3">
        {isAuthenticated ? (
          <Link
            href="/posts/new"
            className="rounded-xl border-4 border-slate-950 bg-[#ffcb05] px-4 py-2 text-sm font-black uppercase text-slate-950 shadow-[3px_3px_0_#172033] transition hover:-translate-y-0.5 hover:bg-[#ffd740]"
          >
            Nueva publicación
          </Link>
        ) : null}
      </div>

      {loading ? <Spinner label="Cargando publicaciones…" /> : null}
      <Alert message={error} />

      {!loading && !error && posts.length === 0 ? (
        <p className="rounded-3xl border-4 border-dashed border-slate-950 bg-[#fff8e7] px-6 py-12 text-center text-sm font-black text-slate-600">
          Todavía no hay publicaciones.
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Alert from '@/components/Alert';
import Spinner from '@/components/Spinner';

const inputClass =
  'w-full rounded-xl border-4 border-slate-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#172033] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#ffcb05]';

const labelClass = 'mb-1 block text-xs font-black uppercase tracking-[0.2em] text-slate-500';

function LoginForm() {
  const { login, errorMessage, isAuthenticated, status } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (status === 'ready' && isAuthenticated) {
      router.replace(next);
    }
  }, [status, isAuthenticated, router, next]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setError('');
    try {
      await login(form.email.trim(), form.password);
      router.push(next);
    } catch (err) {
      setError(errorMessage(err));
      setSending(false);
    }
  };

  return (
    <div className="deck-stage mx-auto max-w-md">
      <div className="overflow-hidden rounded-4xl border-4 border-slate-950 bg-[#fff8e7] shadow-[10px_10px_0_#172033]">
        <div className="flex items-center justify-between border-b-4 border-slate-950 bg-[#ffcb05] px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">38diaNEXT</p>
            <h1 className="text-3xl font-black uppercase leading-none text-slate-950">Usuadex</h1>
            <p className="mt-1 text-sm font-black text-slate-700">Inicia sesión para publicar y comentar</p>
          </div>
          <span className="rounded-full border-2 border-slate-950 bg-white px-3 py-1 text-sm font-black text-slate-950">
            login
          </span>
        </div>

        <form onSubmit={handleSubmit} className="reveal-stagger flex flex-col gap-4 p-6">
          <Alert message={error} />

          <div>
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange('email')}
              autoComplete="email"
              placeholder="david.valeiro@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange('password')}
              autoComplete="current-password"
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full cursor-pointer rounded-xl border-4 border-slate-950 bg-[#ffcb05] px-5 py-3 text-lg font-black uppercase text-slate-950 shadow-[4px_4px_0_#172033] transition hover:-translate-y-1 hover:bg-[#ffd740] hover:shadow-[6px_6px_0_#172033] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#172033]"
          >
            {sending ? 'Entrando…' : 'Iniciar sesión'}
          </button>

          <p className="text-center text-sm font-black text-slate-600">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-[#2a6ccb] underline decoration-4 underline-offset-4">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <LoginForm />
    </Suspense>
  );
}
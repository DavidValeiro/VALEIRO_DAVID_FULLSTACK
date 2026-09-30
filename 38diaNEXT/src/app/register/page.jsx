'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Alert from '@/components/Alert';
import PokemonPicker from '@/components/PokemonPicker';

const inputClass =
  'w-full rounded-xl border-4 border-slate-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#172033] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#2a6ccb]';

const labelClass = 'mb-1 block text-xs font-black uppercase tracking-[0.2em] text-[#2a6ccb]';

export default function RegisterPage() {
  const { register, errorMessage, isAuthenticated, status } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (status === 'ready' && isAuthenticated) {
      router.replace('/');
    }
  }, [status, isAuthenticated, router]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setSending(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password, pokemon);
      router.push('/');
    } catch (err) {
      setError(errorMessage(err));
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="overflow-hidden rounded-4xl border-4 border-slate-950 bg-[#e8f1ff] shadow-[10px_10px_0_#172033]">
        <div className="flex items-center justify-between border-b-4 border-slate-950 bg-[#2a6ccb] px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">Nuevo usuario</p>
            <h1 className="text-3xl font-black uppercase leading-none text-white">Crear cuenta</h1>
            <p className="mt-1 text-sm font-black text-blue-200">Regístrate para publicar y comentar</p>
          </div>
          <span className="rounded-full border-2 border-slate-950 bg-white px-3 py-1 text-sm font-black text-[#2a6ccb]">
            registro
          </span>
        </div>

        <form onSubmit={handleSubmit} className="reveal-stagger flex flex-col gap-4 p-6">
          <Alert message={error} />

          <div>
            <label className={labelClass} htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange('name')}
              autoComplete="name"
              placeholder="Ash Ketchum"
              className={inputClass}
            />
          </div>

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
              placeholder="ash.ketchum@example.com"
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
              autoComplete="new-password"
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="confirm">
              Repite la contraseña
            </label>
            <input
              id="confirm"
              type="password"
              required
              value={form.confirm}
              onChange={handleChange('confirm')}
              autoComplete="new-password"
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          <PokemonPicker value={pokemon} onChange={setPokemon} />

          <p className="rounded-xl border-2 border-slate-950 bg-blue-100 px-4 py-3 text-xs font-black uppercase tracking-wide text-blue-800 shadow-[3px_3px_0_#172033]">
            Los registros siempre se crean como usuario normal (sin permisos de administrador).
          </p>

          <button
            type="submit"
            disabled={sending}
            className="w-full cursor-pointer rounded-xl border-4 border-slate-950 bg-[#2a6ccb] px-5 py-3 text-lg font-black uppercase text-white shadow-[4px_4px_0_#0f3d8c] transition hover:-translate-y-1 hover:bg-[#3b7cd6] hover:shadow-[6px_6px_0_#0f3d8c] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#0f3d8c]"
          >
            {sending ? 'Registrando…' : 'Crear cuenta'}
          </button>

          <p className="text-center text-sm font-black text-slate-600">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-[#2a6ccb] underline decoration-4 underline-offset-4">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
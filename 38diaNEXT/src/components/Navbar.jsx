'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getSpriteUrl } from '@/lib/pokemon';

const navLink =
  'cursor-pointer rounded-xl border-4 border-slate-950 bg-white px-4 py-2 font-black uppercase text-slate-950 shadow-[3px_3px_0_#172033] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#172033]';

const navLinkActive = 'bg-[#ffcb05]';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout, status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="border-b-4 border-slate-950 bg-[#ffcb05]">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/" className="mr-auto flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border-4 border-slate-950 bg-white shadow-[3px_3px_0_#172033]">
            <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
              <rect x="2.5" y="3" width="19" height="18" rx="4" fill="#e85d4a" stroke="#172033" strokeWidth="1.6" />
              <rect x="5.5" y="6" width="9.5" height="7.5" rx="1.5" fill="#172033" />
              <rect x="6.7" y="7.2" width="7.1" height="5.1" rx="1" fill="#7dd3fc" />
              <circle cx="10.2" cy="9.75" r="1" fill="#172033" />
              <circle cx="17" cy="7.5" r="1.9" fill="#fff" stroke="#172033" strokeWidth="1.1" />
              <circle cx="17" cy="7.5" r="0.85" fill="#60a5fa" />
              <circle cx="16.8" cy="14" r="1.3" fill="#ffcb05" stroke="#172033" strokeWidth="0.9" />
              <circle cx="16.8" cy="17.6" r="1.3" fill="#fff" stroke="#172033" strokeWidth="0.9" />
            </svg>
          </span>
          <span className="text-xl font-black uppercase text-slate-950">
            Post<span className="text-[#e85d4a]">Dex</span>
          </span>
        </Link>

        {status !== 'ready' ? null : isAuthenticated ? (
          <> 
            <Link href="/" className={`${navLink} hover:bg-[#ffcb05]`}>
              Feed
            </Link>
            <Link href="/users" className={`${navLink} hover:bg-[#ffcb05] ${isActive('/users') ? navLinkActive : ''}`}>
              {isAdmin ? 'Usuadex' : 'Mi usuario'}
            </Link>
            <Link href="/posts/new" className={`${navLink} ${navLinkActive} hover:bg-[#ffcb05]`}>
              Nueva publicación
            </Link>
            <span className="hidden text-sm font-black text-slate-800 sm:inline">
              {user.name}
              {user.is_admin && <span className="ml-1 text-[#a855f7]">· Admin</span>}
            </span>
            <button type="button" onClick={handleLogout} className={`${navLink} bg-[#ff1e00]  hover:bg-[#ff0000]`}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={`${navLink} hover:bg-[#ffcb05] ${isActive('/login') ? navLinkActive : ''}`}>
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className={`${navLink} text-[#2a6ccb]  hover:bg-[#3b7cd6] hover:text-white ${
                isActive('/register') ? navLinkActive : ''
              }`}
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
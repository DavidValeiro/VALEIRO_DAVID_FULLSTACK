'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/Spinner';

export default function RequireAuth({ children }) {
  const { status, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'ready' && !isAuthenticated) {
      router.replace('/login');
    }
  }, [status, isAuthenticated, router]);

  if (status !== 'ready' || !isAuthenticated) {
    return <Spinner label="Comprobando sesión…" />;
  }

  return children;
}

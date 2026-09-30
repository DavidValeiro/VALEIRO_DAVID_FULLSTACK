import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'PostDex',
  description: 'PostDex es una red social para compartir publicaciones y comentarios sobre Pokémon.',
  favicon: '/favicon.svg',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen font-sans">
        <AuthProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

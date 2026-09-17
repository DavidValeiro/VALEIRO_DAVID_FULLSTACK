import { Link } from "react-router-dom";
import { useUser } from '../context/UserContext';

const Home = () => {
  const { name } = useUser();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-8">
      <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center">Bienvenido a My App</h1>
      <p className="text-lg text-gray-600 mb-12 text-center max-w-xl">
        Elige una de las opciones para empezar.
      </p>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link
          to="/set-user"
          className="group flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:shadow-xl"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{name || 'Define tu Usuario'}</h2>
          <p className="text-gray-600">{name ? 'Cierra sesión' : 'Establece tu nombre'}</p>
        </Link>

        <Link
          to="/post/1"
          className="group flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-lg transition-all duration-300 hover:scale-105 hover:border-green-300 hover:shadow-xl"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ver un Post</h2>
          <p className="text-gray-600">Carga un post desde jsonplaceholder.</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
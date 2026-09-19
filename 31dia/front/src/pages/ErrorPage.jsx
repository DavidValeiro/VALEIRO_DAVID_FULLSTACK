import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-8">
      <h1 className="text-4xl font-bold text-red-600 mb-4">¡Algo salió mal!</h1>
      <p className="text-lg text-red-500 mb-8">No se pudo cargar el post. Verifica el enlace e intenta nuevamente.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
      >
        Volver a Home
      </Link>
    </div>
  );
};

export default ErrorPage;
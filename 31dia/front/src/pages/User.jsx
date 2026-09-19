import { useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const User = () => {
  const { id } = useParams();
  const { name } = useUser();

  const displayName = name || id || 'Invitado';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to My App</h1>
        <p className="text-lg text-gray-600 mb-8">Bienvenido, usuario <span className="font-semibold text-gray-800">{displayName}</span></p>
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
            Get Started
        </button>
    </div>
  );
}

export default User
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const SetUser = () => {
  const { name, setName } = useUser();
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setName(value.trim() || 'Invitado');
    navigate('/user/Invitado');
  };

  const deleteUser = () => {
    setName('');
    navigate('/user/Invitado');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-8">
      {name ? (
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Usuario Actual: {name}</h1>
          <button
            onClick={deleteUser}
            className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Define tu Usuario</h1>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter your name"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button
              type="submit"
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Set User
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SetUser;
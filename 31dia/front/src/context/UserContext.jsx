import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

const STORAGE_KEY = 'username';

export const UserProvider = ({ children }) => {
  const [name, setNameState] = useState(() => localStorage.getItem(STORAGE_KEY) || '');

  const setName = (value) => {
    setNameState(value);
    localStorage.setItem(STORAGE_KEY, value);
  };

  return (
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser debe usarse dentro de <UserProvider>');
  return context;
};
import { createContext, useContext, useState } from 'react'

const UserContext = createContext(undefined)

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('Invitado')

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser debe usarse dentro de UserProvider')
  }
  return context
}

export default UserContext
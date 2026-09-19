import { useUser } from './UserContext'
import {useTheme} from '../ThemeContext/ThemeContext.jsx'
export const UserDisplay = () => {
  const { username, setUsername } = useUser()

  return (
    <div>
      <h2>Usuario: {username}</h2>
      <input
        type="text"
        placeholder="Escribe tu nombre..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={useTheme().toggleTheme}>Cambiar tema desde usuario</button>
    </div>
  )
}

export default UserDisplay
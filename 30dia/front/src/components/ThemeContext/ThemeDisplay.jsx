import { useTheme } from './ThemeContext'
import {useCounter} from '../CounterContext/CounterContext.jsx'

export const ThemeDisplay = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div>
      <h2>Tema actual: {theme}</h2>
      <button onClick={toggleTheme}>Cambiar a {theme === 'light' ? 'dark' : 'light'}</button>
        <button onClick={useCounter().increment}>Incrementar contador desde tema</button>
        <button onClick={useCounter().decrement}>Decrementar contador desde tema</button>
    </div>
  )
}

export default ThemeDisplay
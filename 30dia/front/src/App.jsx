import './App.css'
import { UserProvider } from './components/UserContext/UserContext.jsx'
import UserDisplay from './components/UserContext/UserDisplay.jsx'
import { CounterProvider } from './components/CounterContext/CounterContext.jsx'
import CounterDisplay from './components/CounterContext/CounterDisplay.jsx'
import { ThemeProvider } from './components/ThemeContext/ThemeContext.jsx'
import ThemeDisplay from './components/ThemeContext/ThemeDisplay.jsx'

function App() {
  return (
    <UserProvider>
      <CounterProvider>
        <ThemeProvider>
          <h1>Ejercicios de Context</h1>
          <UserDisplay />
          <CounterDisplay />
          <ThemeDisplay />
        </ThemeProvider>
      </CounterProvider>
    </UserProvider>
  )
}

export default App
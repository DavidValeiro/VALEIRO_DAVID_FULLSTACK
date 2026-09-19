import { createContext, useContext, useState } from 'react'

const CounterContext = createContext(undefined)

export const CounterProvider = ({ children }) => {
  const [count, setCount] = useState(0)

  const increment = () => setCount((count) => count + 1)
  const decrement = () => setCount((count) => count - 1)

  return (
    <CounterContext.Provider value={{ count, increment, decrement }}>
      {children}
    </CounterContext.Provider>
  )
}

export const useCounter = () => {
  const context = useContext(CounterContext)
  if (context === undefined) {
    throw new Error('useCounter debe usarse dentro de CounterProvider')
  }
  return context
}

export default CounterContext
import { useCounter } from './CounterContext'
import {useUser} from '../UserContext/UserContext.jsx'

export const CounterDisplay = () => {
  const { count, increment, decrement } = useCounter()

  return (
    <div>
      <h2>Contador: {count}</h2>
      <h2>Usuario: {useUser().username}</h2>
      <button onClick={increment}>Incrementar</button>
      <button onClick={decrement}>Decrementar</button>
    </div>
  )
}

export default CounterDisplay
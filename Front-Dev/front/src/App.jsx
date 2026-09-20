import Menu from './components/Menu/Menu'
import Buying from './components/Buying/Buying'
import Cataloge from './pages/Cataloge'
import {CartProvider} from './context/CartContext'
function App() {
  return (
    <>
    <CartProvider>  
      <Menu />
      <Cataloge />
      <Buying />
    </CartProvider>
    </>
  )
}

export default App
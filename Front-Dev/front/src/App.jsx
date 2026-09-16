import { useState } from 'react'
import Menu from './components/Menu/Menu'
import Buying from './components/Buying/Buying'
import Cataloge from './pages/Cataloge'

function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.title,
          price: product.price,
          qty: 1,
        },
      ]
    })
  }

  return (
    <>
      <Menu onCartClick={() => setCartOpen(true)} />
      <Cataloge onAddToCart={addToCart} />
      <Buying
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        setItems={setCart}
      />
    </>
  )
}

export default App
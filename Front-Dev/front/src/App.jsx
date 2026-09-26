import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './components/Layout/Layout'
import Cataloge from './pages/Cataloge'
import ProductDetail from './pages/ProductDetail'
import {CartProvider} from './context/CartContext'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Cataloge /> },
      { path: "/producto/:id", element: <ProductDetail /> },
    ],
  },
])

function App() {
  return (
    <>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
    </>
  )
}

export default App

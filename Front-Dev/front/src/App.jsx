import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './components/Layout/Layout'
import Catalog from './pages/Catalog'
import Manage from './pages/Manage'
import Home from './pages/Home'
import ProductDetail from './components/ProductDetail/ProductDetail'
import {CartProvider} from './context/CartContext'
import {ProductProvider} from './context/ProductContext'
import {CurrencyProvider} from './context/CurrencyContext'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/Catalog", element: <Catalog /> },
      { path: "/Producto/:slug", element: <ProductDetail /> },
      { path: "/Manage", element: <Manage /> },
    ],
  },
])

function App() {
  return (
    <>
    <CurrencyProvider>
    <ProductProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </ProductProvider>
    </CurrencyProvider>
    </>
  )
}

export default App

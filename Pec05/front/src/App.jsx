import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Users from './pages/Users'
import { getToken } from './api'

function RequireAuth({ children }) {
  const location = useLocation()
  if (!getToken()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/users"
        element={
          <RequireAuth>
            <Users />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to={getToken() ? '/users' : '/login'} replace />} />
    </Routes>
  )
}

export default App
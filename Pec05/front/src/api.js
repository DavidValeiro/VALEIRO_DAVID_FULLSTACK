const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function getToken() {
  return localStorage.getItem('pec05_token')
}

export function getIsAdmin() {
  return localStorage.getItem('pec05_is_admin') === 'true'
}

export function setToken(token) {
  localStorage.setItem('pec05_token', token)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    localStorage.setItem('pec05_is_admin', String(!!payload.is_admin))
  } catch {
    localStorage.setItem('pec05_is_admin', 'false')
  }
}

export function clearToken() {
  localStorage.removeItem('pec05_token')
  localStorage.removeItem('pec05_is_admin')
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || data.error || 'Error en la petición')
  }

  return response.json()
}

export const api = {
  login: (email, password) =>
    request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getUsers: () => request('/users'),
  getUserById: (id) => request(`/users/${id}`),
  createUser: (user) =>
    request('/users', { method: 'POST', body: JSON.stringify(user) }),
  updateUser: (id, user) =>
    request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(user) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
}
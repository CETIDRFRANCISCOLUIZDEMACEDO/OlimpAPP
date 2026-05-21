import api from './api'

const TOKEN_KEY = 'olimpapp_token'

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  localStorage.setItem(TOKEN_KEY, data.token)
  return data.token
}

export async function register({ email, password, name, school, city, state, grade, olimpiadas }) {
  const { data } = await api.post('/auth/register', {
    email, password, name, school, city, state, grade, olimpiadas,
  })
  localStorage.setItem(TOKEN_KEY, data.token)
  return data.token
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

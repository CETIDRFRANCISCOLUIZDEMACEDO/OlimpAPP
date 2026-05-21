import api from './api'

export async function getMe() {
  const { data } = await api.get('/me')
  return data
}

export async function updateMe(fields) {
  const { data } = await api.put('/me', fields)
  return data
}

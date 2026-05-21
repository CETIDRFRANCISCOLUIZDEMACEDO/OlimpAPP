import api from './api'

export async function getConquistas() {
  const { data } = await api.get('/conquistas')
  return data
}

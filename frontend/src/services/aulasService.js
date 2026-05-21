import api from './api'

export async function markAsWatched(aulaId) {
  const { data } = await api.post('/aulas/watched', { aula_id: aulaId })
  return data
}

export async function getWatchedAulas() {
  const { data } = await api.get('/aulas/watched')
  return new Set(data)
}

import api from './api'

export async function getTrilhas() {
  const { data } = await api.get('/trilhas')
  return data
}

export async function getTrilha(olimpiada) {
  const { data } = await api.get(`/trilhas/${olimpiada}`)
  return data
}

export async function getTotalModulos(olimpiada) {
  const { data } = await api.get(`/trilhas/${olimpiada}/total`)
  return data.total
}

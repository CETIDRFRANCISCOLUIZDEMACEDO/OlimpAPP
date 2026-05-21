import api from './api'

export async function getProgresso() {
  const { data } = await api.get('/progresso')
  return data
}

export async function concluirModulo(module_id, olimpiada, stars = 1) {
  const { data } = await api.post('/progresso', { module_id, olimpiada, stars })
  return data
}

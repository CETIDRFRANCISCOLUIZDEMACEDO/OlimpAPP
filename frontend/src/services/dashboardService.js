import api from './api'

export async function getMissaoDoDia() {
  const { data } = await api.get('/dashboard/missao-do-dia')
  return data
}

import api from './api'

export async function getPosts(categoria) {
  const params = categoria && categoria !== 'todos' ? { categoria } : {}
  const { data } = await api.get('/forum/posts', { params })
  return data
}

export async function createPost(categoria, titulo, conteudo) {
  const { data } = await api.post('/forum/posts', { categoria, titulo, conteudo })
  return data
}

export async function getPost(id) {
  const { data } = await api.get(`/forum/posts/${id}`)
  return data
}

export async function createResposta(postId, conteudo) {
  const { data } = await api.post(`/forum/posts/${postId}/respostas`, { conteudo })
  return data
}

export async function likePost(postId) {
  const { data } = await api.post(`/forum/posts/${postId}/like`)
  return data
}

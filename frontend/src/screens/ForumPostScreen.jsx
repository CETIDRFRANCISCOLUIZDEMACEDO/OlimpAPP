import { useState, useEffect } from 'react'
import BottomNav from '../components/BottomNav'
import { getPost, createResposta, likePost } from '../services/forumService'

function tempoRelativo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'agora mesmo'
  if (mins < 60) return `há ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `há ${hours} hora${hours > 1 ? 's' : ''}`
  const days = Math.floor(hours / 24)
  return `há ${days} dia${days > 1 ? 's' : ''}`
}

function AvatarCircle({ inicial, size = 34, gradient }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: gradient || 'linear-gradient(135deg, var(--blue-mid), var(--blue))',
      color: '#fff', fontWeight: 800, fontSize: size * 0.41,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {inicial}
    </div>
  )
}

const categoriaCor = {
  OBMEP:   { bg: 'var(--blue-soft)',   color: 'var(--blue)' },
  OBA:     { bg: 'var(--yellow-soft)', color: '#A07800' },
  OBQ:     { bg: '#fce7f3',            color: '#be185d' },
  OBF:     { bg: '#ede9fe',            color: '#6d28d9' },
  default: { bg: 'var(--border-soft)', color: 'var(--text-dim)' },
}

export default function ForumPostScreen({ onNavigate, onBack, activeNav, currentPost }) {
  const [post,       setPost]       = useState(null)
  const [respostas,  setRespostas]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [resposta,   setResposta]   = useState('')
  const [sending,    setSending]    = useState(false)
  const [liked,      setLiked]      = useState(false)

  useEffect(() => {
    if (!currentPost?.id) return
    getPost(currentPost.id)
      .then(({ post, respostas }) => {
        setPost(post)
        setRespostas(respostas)
        setLiked(post.user_liked ?? false)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [currentPost?.id])

  if (!currentPost) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontFamily: 'var(--font)' }}>
        Post não encontrado
      </div>
    )
  }

  const dadosPost = post ?? currentPost
  const cor = categoriaCor[dadosPost.categoria] || categoriaCor.default

  const handleEnviar = async () => {
    if (!resposta.trim() || sending) return
    setSending(true)
    try {
      await createResposta(dadosPost.id, resposta.trim())
      setResposta('')
      const updated = await getPost(dadosPost.id)
      setPost(updated.post)
      setRespostas(updated.respostas)
    } catch {
      // falha silenciosa
    } finally {
      setSending(false)
    }
  }

  const handleLike = async () => {
    if (liked) return
    setLiked(true)
    setPost(p => p ? { ...p, likes: (p.likes ?? 0) + 1 } : p)
    try {
      const res = await likePost(dadosPost.id)
      if (!res.liked) {
        // servidor ignorou (já curtido em outra sessão) — reverte otimismo
        setLiked(true)
        setPost(p => p ? { ...p, likes: Math.max(0, (p.likes ?? 1) - 1) } : p)
      }
    } catch {
      setLiked(false)
      setPost(p => p ? { ...p, likes: Math.max(0, (p.likes ?? 1) - 1) } : p)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      <div className="db-scroll" style={{ paddingBottom: '8px' }}>

        <div className="tr-topbar" style={{ marginBottom: '-4px' }}>
          <button className="icon-btn" onClick={() => onBack()}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7"/>
            </svg>
          </button>
          <div className="tr-topbar-title">Dúvida</div>
          <button
            onClick={handleLike}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', border: 'none', background: 'none', cursor: liked ? 'default' : 'pointer', padding: '4px 8px', borderRadius: '8px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? 'var(--blue)' : 'none'} stroke={liked ? 'var(--blue)' : 'var(--text-dim)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span style={{ fontSize: '13px', fontWeight: 700, color: liked ? 'var(--blue)' : 'var(--text-dim)' }}>
              {dadosPost.likes ?? 0}
            </span>
          </button>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, letterSpacing: '.3px', background: cor.bg, color: cor.color }}>
            {dadosPost.categoria}
          </span>
          <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, background: 'var(--green-soft)', color: '#15803d', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {respostas.length} {respostas.length === 1 ? 'resposta' : 'respostas'}
          </span>
        </div>

        <div style={{ fontWeight: 900, fontSize: '18px', color: 'var(--text)', lineHeight: 1.25, letterSpacing: '-.2px' }}>
          {dadosPost.titulo}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '-4px' }}>
          <AvatarCircle inicial={(dadosPost.autor_nome?.[0] ?? '?').toUpperCase()} size={28} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)' }}>
            {dadosPost.autor_nome} · {tempoRelativo(dadosPost.created_at)}
          </span>
        </div>

        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '16px', fontSize: '14.5px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
          {loading ? 'Carregando…' : dadosPost.conteudo}
        </div>

        {/* Respostas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
          <div style={{ fontWeight: 900, fontSize: '15px', color: 'var(--text)' }}>
            Respostas ({respostas.length})
          </div>
          <div style={{ flex: 1, height: '1.5px', background: 'var(--border)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-mute)', fontWeight: 600 }}>Carregando…</div>
          ) : respostas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-mute)', fontWeight: 600, fontSize: '13px' }}>
              Seja o primeiro a responder!
            </div>
          ) : (
            respostas.map(r => (
              <div
                key={r.id}
                style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AvatarCircle inicial={(r.autor_nome?.[0] ?? '?').toUpperCase()} size={30} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)' }}>
                    {r.autor_nome} · {tempoRelativo(r.created_at)}
                  </span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {r.conteudo}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ height: '4px' }} />
      </div>

      {/* Input fixo */}
      <div style={{ background: '#fff', borderTop: '1.5px solid var(--border)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <input
          value={resposta}
          onChange={e => setResposta(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleEnviar()}
          placeholder="Escreva sua resposta..."
          style={{ flex: 1, border: '1.5px solid var(--border)', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font)', fontSize: '14px', fontWeight: 500, color: 'var(--text)', background: 'var(--bg)', outline: 'none' }}
          onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.background = '#fff' }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg)' }}
        />
        <button
          onClick={handleEnviar}
          disabled={!resposta.trim() || sending}
          style={{ padding: '10px 16px', borderRadius: '12px', border: 'none', background: resposta.trim() && !sending ? 'var(--blue)' : 'var(--border-soft)', color: resposta.trim() && !sending ? '#fff' : 'var(--text-mute)', fontFamily: 'var(--font)', fontWeight: 800, fontSize: '14px', cursor: resposta.trim() && !sending ? 'pointer' : 'default', transition: 'all .15s', boxShadow: resposta.trim() && !sending ? '0 3px 0 var(--blue-dark)' : 'none', flexShrink: 0 }}
        >
          {sending ? '…' : 'Enviar'}
        </button>
      </div>

      <BottomNav activeTab={activeNav} onNavigate={onNavigate} />
    </div>
  )
}

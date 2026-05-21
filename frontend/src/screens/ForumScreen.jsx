import { useState, useEffect, useRef } from 'react'
import BottomNav from '../components/BottomNav'
import { getPosts, createPost } from '../services/forumService'

const CATEGORIAS = ['todos', 'OBMEP', 'OBA', 'OBQ', 'OBF', 'Álgebra', 'Geometria', 'Astronomia']

const categoriaCor = {
  OBMEP:      { bg: 'var(--blue-soft)',   color: 'var(--blue)' },
  OBA:        { bg: 'var(--yellow-soft)', color: '#A07800' },
  OBQ:        { bg: '#fce7f3',            color: '#be185d' },
  OBF:        { bg: '#ede9fe',            color: '#6d28d9' },
  default:    { bg: 'var(--border-soft)', color: 'var(--text-dim)' },
}

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

function TagCategoria({ nome }) {
  const cor = categoriaCor[nome] || categoriaCor.default
  return (
    <span style={{
      display: 'inline-block', padding: '3px 9px', borderRadius: '999px',
      fontSize: '11px', fontWeight: 800, letterSpacing: '.3px',
      background: cor.bg, color: cor.color,
    }}>
      {nome}
    </span>
  )
}

function PostCard({ post, onNavigate }) {
  const preview = (post.conteudo ?? '').slice(0, 120)
  return (
    <button
      onClick={() => onNavigate('screen-forum-post', { post })}
      style={{
        width: '100%', background: '#fff', border: '1.5px solid var(--border)',
        borderRadius: '16px', padding: '14px', textAlign: 'left', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <TagCategoria nome={post.categoria} />
        {post.resolvido && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '3px 9px', borderRadius: '999px',
            fontSize: '11px', fontWeight: 800,
            background: 'var(--green-soft)', color: '#15803d',
          }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#15803d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6l3 3 5-5"/>
            </svg>
            Resolvido
          </span>
        )}
      </div>

      <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text)', lineHeight: 1.3 }}>
        {post.titulo}
      </div>

      <div style={{
        fontSize: '12.5px', fontWeight: 500, color: 'var(--text-dim)', lineHeight: 1.4,
        overflow: 'hidden', display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
      }}>
        {preview}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
        <div style={{
          width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--blue-mid), var(--blue))',
          color: '#fff', fontWeight: 800, fontSize: '11px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {(post.autor_nome?.[0] ?? '?').toUpperCase()}
        </div>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', flex: 1, minWidth: 0 }}>
          {post.autor_nome} · {tempoRelativo(post.created_at)}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke={post.total_respostas > 0 ? 'var(--green)' : 'var(--text-mute)'}
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span style={{ fontSize: '12px', fontWeight: 700, color: post.total_respostas > 0 ? 'var(--green)' : 'var(--text-mute)' }}>
            {post.total_respostas}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-mute)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-mute)' }}>{post.likes}</span>
        </div>
      </div>
    </button>
  )
}

function ModalNovaDuvida({ onClose, onPublicar }) {
  const [categoria, setCategoria] = useState('OBMEP')
  const [titulo,    setTitulo]    = useState('')
  const [conteudo,  setConteudo]  = useState('')
  const [saving,    setSaving]    = useState(false)

  const handlePublicar = async () => {
    if (!titulo.trim() || !conteudo.trim()) return
    setSaving(true)
    try {
      await createPost(categoria, titulo.trim(), conteudo.trim())
      onPublicar()
    } catch {
      setSaving(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'absolute', inset: 0, background: 'rgba(18,18,42,.55)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', background: '#fff', borderRadius: '24px 24px 0 0', padding: '20px 18px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 900, fontSize: '17px', color: 'var(--text)' }}>Nova dúvida</div>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border-soft)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', marginLeft: '2px' }}>Categoria</label>
          <select className="cfg-input" style={{ borderRadius: '12px' }} value={categoria} onChange={e => setCategoria(e.target.value)}>
            <option>OBMEP</option>
            <option>OBA</option>
            <option>Álgebra</option>
            <option>Geometria</option>
            <option>Astronomia</option>
            <option>Outro</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', marginLeft: '2px' }}>Pergunta</label>
          <input
            className="cfg-input"
            type="text"
            placeholder="Escreva sua pergunta de forma clara"
            style={{ borderRadius: '12px' }}
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', marginLeft: '2px' }}>Detalhes</label>
          <textarea
            className="cfg-input"
            rows={4}
            placeholder="Quanto mais detalhes, melhor!"
            style={{ borderRadius: '12px', resize: 'none', lineHeight: 1.5 }}
            value={conteudo}
            onChange={e => setConteudo(e.target.value)}
          />
        </div>

        <button
          className="btn-primary"
          style={{ borderRadius: '14px', fontSize: '16px', marginTop: '2px', opacity: saving || !titulo.trim() || !conteudo.trim() ? 0.6 : 1 }}
          onClick={handlePublicar}
          disabled={saving || !titulo.trim() || !conteudo.trim()}
        >
          {saving ? 'Publicando…' : 'Publicar dúvida'}
        </button>
        <button
          onClick={onClose}
          style={{ width: '100%', padding: '13px', borderRadius: '14px', border: '2px solid var(--border)', background: 'transparent', fontFamily: 'var(--font)', fontWeight: 700, fontSize: '15px', color: 'var(--text-dim)', cursor: 'pointer' }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default function ForumScreen({ onNavigate, onBack, activeNav }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos')
  const [posts,          setPosts]          = useState([])
  const [loading,        setLoading]        = useState(true)
  const [modalAberto,    setModalAberto]    = useState(false)
  const categoriasRef = useRef(null)
  const dragState     = useRef({ dragging: false, startX: 0, scrollLeft: 0 })

  const fetchPosts = (cat) => {
    setLoading(true)
    getPosts(cat)
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPosts(categoriaAtiva) }, [categoriaAtiva])

  const handleCategoria = (cat) => {
    setCategoriaAtiva(cat)
  }

  const handlePublicar = () => {
    setModalAberto(false)
    fetchPosts(categoriaAtiva)
  }

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="db-scroll">

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 0 0' }}>
          <div style={{ width: '40px' }} />
          <div style={{ fontWeight: 900, fontSize: '18px', color: 'var(--text)' }}>Fórum</div>
          <button
            onClick={() => setModalAberto(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 14px', borderRadius: '999px', background: 'var(--blue)', border: 'none', color: '#fff', fontFamily: 'var(--font)', fontWeight: 800, fontSize: '14px', cursor: 'pointer', boxShadow: '0 3px 0 var(--blue-dark)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Nova
          </button>
        </div>

        <div
          ref={categoriasRef}
          className="forum-categorias"
          style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px', marginRight: '-18px', paddingRight: '18px', scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab' }}
          onMouseDown={e => { const el = categoriasRef.current; dragState.current = { dragging: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft }; el.style.cursor = 'grabbing' }}
          onMouseLeave={() => { dragState.current.dragging = false; if (categoriasRef.current) categoriasRef.current.style.cursor = 'grab' }}
          onMouseUp={() => { dragState.current.dragging = false; if (categoriasRef.current) categoriasRef.current.style.cursor = 'grab' }}
          onMouseMove={e => { if (!dragState.current.dragging) return; e.preventDefault(); const el = categoriasRef.current; el.scrollLeft = dragState.current.scrollLeft - (e.pageX - el.offsetLeft - dragState.current.startX) }}
        >
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoria(cat)}
              style={{
                flexShrink: 0, padding: '8px 16px', borderRadius: '999px',
                border: categoriaAtiva === cat ? 'none' : '1.5px solid var(--border)',
                background: categoriaAtiva === cat ? 'var(--blue)' : '#fff',
                color: categoriaAtiva === cat ? '#fff' : 'var(--text-dim)',
                fontFamily: 'var(--font)', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                transition: 'all .15s',
                boxShadow: categoriaAtiva === cat ? '0 3px 0 var(--blue-dark)' : 'none',
              }}
            >
              {cat === 'todos' ? 'Todos' : cat}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-mute)', marginTop: '-4px' }}>
          {loading ? '…' : `${posts.length} ${posts.length === 1 ? 'pergunta' : 'perguntas'}`}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-mute)', fontWeight: 600 }}>
              Carregando…
            </div>
          ) : posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post.id} post={post} onNavigate={onNavigate} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-mute)', fontWeight: 600, fontSize: '14px' }}>
              Nenhuma dúvida nessa categoria ainda.
              <br />
              <span style={{ color: 'var(--blue)', fontWeight: 800, cursor: 'pointer' }} onClick={() => setModalAberto(true)}>
                Seja o primeiro a perguntar!
              </span>
            </div>
          )}
        </div>

        <div style={{ height: '4px' }} />
      </div>

      <BottomNav activeTab={activeNav} onNavigate={onNavigate} />

      {modalAberto && <ModalNovaDuvida onClose={() => setModalAberto(false)} onPublicar={handlePublicar} />}
    </div>
  )
}

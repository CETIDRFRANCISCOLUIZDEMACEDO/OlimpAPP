import { useState, useRef, useEffect } from 'react'
import { getWatchedAulas, markAsWatched } from '../services/aulasService'

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)

export default function AulaVideoScreen({ onNavigate, onBack, currentAula, onMarkWatched }) {
  const aula = currentAula
  const iframeRef = useRef(null)

  const [watched, setWatched] = useState(false)

  useEffect(() => {
    if (!aula?.id) return
    getWatchedAulas()
      .then(set => setWatched(set.has(aula.id)))
      .catch(() => setWatched(aula?.watched ?? false))
  }, [aula?.id])

  if (!aula) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font)', color: 'var(--text-dim)' }}>
        Aula não encontrada
      </div>
    )
  }

  const nextAula       = aula.allAulas?.[aula.aulaIndex + 1] ?? null
  const aulaNumeral    = `Aula ${aula.aulaIndex + 1} de ${aula.allAulas?.length ?? 1}`
  const olimpiadaLabel = aula.olimpiada ? aula.olimpiada.toUpperCase() + ' · Fase 1' : 'Fase 1'
  const embedUrl    = aula.videoId
    ? `https://www.youtube.com/embed/${aula.videoId}?rel=0&modestbranding=1&enablejsapi=1`
    : null

  const pauseVideo = () => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
      '*'
    )
  }

  const handleBack = () => {
    pauseVideo()
    onBack('screen-modulo')
  }

  const handleMarkWatched = async () => {
    setWatched(true)
    try {
      await markAsWatched(aula.id)
      onMarkWatched?.(aula.id)
    } catch {
      // falha silenciosa — o state local já foi atualizado
    }
  }

  const goToNext = () => {
    pauseVideo()
    onNavigate('screen-aula-video', {
      aula: {
        ...nextAula,
        aulaIndex:   aula.aulaIndex + 1,
        moduleId:    aula.moduleId,
        moduleTitle: aula.moduleTitle,
        moduleNum:   aula.moduleNum,
        allAulas:    aula.allAulas,
      },
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      {/* Top bar */}
      <div className="av-topbar">
        <button className="icon-btn" onClick={handleBack}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7"/>
          </svg>
        </button>
        <div className="av-topbar-info">
          <div className="av-topbar-eyebrow">
            {aula.moduleTitle} · {aulaNumeral}
          </div>
          <div className="av-topbar-title">{aula.title}</div>
        </div>
      </div>

      {/* Player */}
      <div className="av-player">
        {embedUrl ? (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={aula.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="av-player-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <span>Vídeo indisponível</span>
          </div>
        )}
      </div>

      {/* Scroll body */}
      <div className="av-scroll">
        {/* Info */}
        <div className="av-info">
          <div className="av-info-tag">
            Módulo {String(aula.moduleNum ?? '').padStart(2, '0')} · {aula.moduleTitle}
          </div>
          <div className="av-info-title">{aula.title}</div>
          <div className="av-info-meta">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            {aula.dur}
            <span style={{ color: 'var(--border)' }}>·</span>
            {olimpiadaLabel}
          </div>
        </div>

        {/* Actions */}
        <div className="av-actions">
          <button
            className={`av-btn-watched${watched ? ' done' : ''}`}
            onClick={handleMarkWatched}
            disabled={watched}
          >
            <CheckIcon />
            {watched ? 'Aula assistida!' : 'Marcar como assistida'}
          </button>

          {nextAula && (
            <button className="av-btn-next" onClick={goToNext}>
              Próxima aula: {nextAula.title.split(' ').slice(0, 3).join(' ')}…
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4"/>
              </svg>
            </button>
          )}

          {!nextAula && watched && (
            <button
              className="av-btn-next"
              style={{ background: 'var(--green)', boxShadow: '0 4px 0 rgba(34,197,94,.4)' }}
              onClick={handleBack}
            >
              <CheckIcon />
              Voltar ao módulo
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

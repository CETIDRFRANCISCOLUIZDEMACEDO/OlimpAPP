import { useState, useEffect } from 'react'

const PlayIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
)

const CheckIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 1 1 8 0v3"/>
  </svg>
)

export default function ModuloScreen({ onNavigate, onBack, currentModule }) {
  const mod = currentModule

  const [watchedIds, setWatchedIds] = useState(
    () => new Set((mod?.aulas ?? []).filter(a => a.watched).map(a => a.id))
  )

  useEffect(() => {
    setWatchedIds(new Set((mod?.aulas ?? []).filter(a => a.watched).map(a => a.id)))
  }, [currentModule])

  if (!mod) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font)', color: 'var(--text-dim)' }}>
        Módulo não encontrado
      </div>
    )
  }

  const allWatched   = mod.aulas.every(a => watchedIds.has(a.id))
  const watchedCount = watchedIds.size
  const atividadeUnlocked = allWatched || mod.atividade.concluida

  const handleAulaClick = (aula, index) => {
    onNavigate('screen-aula-video', {
      aula: {
        ...aula,
        aulaIndex:   index,
        moduleId:    mod.id,
        moduleTitle: mod.title,
        moduleNum:   mod.num,
        olimpiada:   mod.olimpiada,
        allAulas:    mod.aulas,
      },
    })
  }

  const handleMarkWatched = (aulaId) => {
    setWatchedIds(prev => {
      const next = new Set(prev)
      next.add(aulaId)
      return next
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      {/* Top bar */}
      <div className="au-topbar">
        <button className="icon-btn" onClick={() => onBack('screen-trilhas')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7"/>
          </svg>
        </button>
        <div className="au-topbar-center">
          <div className="au-topbar-label" style={{ fontSize: '12px', fontWeight: 700 }}>
            Módulo {String(mod.num).padStart(2, '0')}
          </div>
          <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text)', textAlign: 'center', lineHeight: 1.2 }}>
            {mod.title}
          </div>
        </div>
        <div style={{ width: '40px' }} />
      </div>

      {/* Scroll body */}
      <div className="db-scroll" style={{ paddingTop: '16px' }}>

        {/* Module header card */}
        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--blue-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontWeight: 900, fontSize: '16px', color: 'var(--blue)' }}>{String(mod.num).padStart(2, '0')}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '17px', color: 'var(--text)', lineHeight: 1.2 }}>{mod.title}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginTop: '2px' }}>{mod.desc}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div className="pbar-track" style={{ flex: 1 }}>
              <div className="pbar-fill" style={{ width: `${Math.round(watchedCount / mod.aulas.length * 100)}%` }} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue)', whiteSpace: 'nowrap' }}>
              {watchedCount}/{mod.aulas.length} aulas
            </span>
          </div>
        </div>

        {/* Aulas section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div className="ml-section-label">Aulas</div>
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            {mod.aulas.map((aula, index) => {
              const isWatched = watchedIds.has(aula.id)
              const isNext    = !isWatched && mod.aulas.slice(0, index).every(a => watchedIds.has(a.id))
              return (
                <button
                  key={aula.id}
                  className="ml-aula-item"
                  style={{ borderBottom: index < mod.aulas.length - 1 ? '1px solid var(--border-soft)' : 'none' }}
                  onClick={() => handleAulaClick(aula, index)}
                >
                  {/* Icon */}
                  <div className={`ml-aula-icon${isWatched ? ' watched' : isNext ? ' next' : ''}`}>
                    {isWatched
                      ? <CheckIcon size={14} />
                      : <PlayIcon  size={13} />
                    }
                  </div>

                  {/* Info */}
                  <div className="ml-aula-body">
                    <div className="ml-aula-title">{aula.title}</div>
                    <div className="ml-aula-meta">
                      <span>{String(index + 1).padStart(2, '0')} · {aula.dur}</span>
                    </div>
                  </div>

                  {/* Status badge */}
                  {isWatched ? (
                    <span className="ml-aula-badge watched">Assistida</span>
                  ) : isNext ? (
                    <span className="ml-aula-badge next">Assistir</span>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-mute)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Atividade section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div className="ml-section-label">Atividade</div>
          <div className={`ml-activity-card${atividadeUnlocked ? '' : ' locked'}`}>
            <div className={`ml-activity-icon${atividadeUnlocked ? '' : ' locked'}`}>
              {atividadeUnlocked ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2 L5 14 L11 14 L9 22 L19 9 L13 9 Z" fill="var(--blue)" stroke="none"/>
                </svg>
              ) : (
                <LockIcon />
              )}
            </div>
            <div className="ml-activity-body">
              <div className={`ml-activity-title${atividadeUnlocked ? '' : ' locked'}`}>
                {mod.atividade.concluida ? 'Atividade concluída' : 'Atividade do módulo'}
              </div>
              <div className="ml-activity-sub">
                {atividadeUnlocked
                  ? `${mod.atividade.questoes} questões · Praticar o módulo`
                  : `Assista todas as aulas para desbloquear`
                }
              </div>
            </div>
            <button
              className={`ml-activity-btn${atividadeUnlocked ? '' : ' locked'}`}
              disabled={!atividadeUnlocked}
              onClick={atividadeUnlocked ? () => onNavigate('screen-aula') : undefined}
            >
              {mod.atividade.concluida ? (
                <CheckIcon size={14} />
              ) : atividadeUnlocked ? (
                <>
                  Iniciar
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8h10M9 4l4 4-4 4"/>
                  </svg>
                </>
              ) : (
                <LockIcon />
              )}
            </button>
          </div>
        </div>

        <div style={{ height: '8px' }} />
      </div>
    </div>
  )
}

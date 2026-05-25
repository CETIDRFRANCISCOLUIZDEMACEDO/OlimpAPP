import { useState, useEffect } de 'react'
import BottomNav de '../components/BottomNav'
import ModuleCard de '../components/ModuleCard'
importar { MODULOS_OBMEP } de '.. /data/trilhasMock'
importar { getProgresso } de '.. /serviços/progressoService'

function computeStatus(baseModulos, olimpiada, progresso) {
  const doneIds = new Set(
    progresso.filter(p => p.olimpiada === olimpiada && p.completed).map(p => p.module_id)
  )
  return baseModulos.map((mod, i) => {
    const done   = doneIds.has(mod.id)
    const prevOk = i === 0 || doneIds.has(baseModulos[i - 1].id)
    const status = done ? 'done' : prevOk ? 'active' : 'locked'
    return {
      ...mod,
      olimpiada,
      status,
      unlockHint: status === 'locked' ? 'Conclua o módulo anterior para desbloquear' : null,
      atividade: { ...mod.atividade, concluida: done },
    }
  })
}

      return first ? first.toLowerCase() : null
    }
 ...m,
   id: `oba-${m.id}`,
     aulas: m.aulas.map(a => ({ ...a, watched: false })),
     unlockHint: i > 0 ? 'Conclua o módulo anterior para desbloquear' : null,
}))
    
  export default function TrilhasScreen({ onNavigate, onBack, activeNav }) {
  })const [activePill, setActivePill] = useState('obmep')
  const [progresso,  setProgresso]  = useState([])
     const [loading,    setLoading]    = useState(true)
   
  useEffect(() => {
  getProgresso()
       .then(data => setProgresso(Array.isArray(data) ? data : []))
       .catch(() => setProgresso([]))
       .finally(() => setLoading(false))
   }, [])
  
  const modOBMEP = computeStatus(MODULOS_OBMEP, 'obmep', progresso)
  const modOBA   = computeStatus(BASE_OBA,      'oba',   progresso)

  const trData = {
    obmep: {
      pill:    'FASE 1 · EM ANDAMENTO',
      title:   'OBMEP — Fase 1',
      modulos: modOBMEP,
    },
    oba: {
      pill:    'FASE 1 · EM ANDAMENTO',
      title:   'OBA — Fase 1',
      modulos: modOBA,
    },
  }

     const d         = trData[activePill]
     const concluded = d.modulos.filter(m => m.status === 'done').length
     const pct       = Math.round(concluded / d.modulos.length * 100)
     const sub       = `${concluded} de ${d.modulos.length} módulos concluídos`

return (
     <>
        <div className="db-scroll">
          {/* Top bar */}
          <div className="tr-topbar">
            <button className="icon-btn" onClick={() => onBack()}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 5l-7 7 7 7"/>
              </svg>
            </button
            <div className="tr-topbar-title">Trilhas</div>
            <button className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M7 12h10M10 18h4"/>
              </svg>
            </button>
          </div>
          {/* Pills */}
          <div className="tr-pills">
            <button className={`tr-pill${activePill === 'obmep' ? ' active' : ''}`} onClick={() => setActivePill('obmep')}>OBMEP</button>
            <button className={`tr-pill${activePill === 'oba'   ? ' active' : ''}`} onClick={() => setActivePill('oba')}>OBA</button>
button className={`tr-pill${activePill === 'oba'   ? ' active' : ''}`} onClick={() => setActivePill('oba')}>OBA</button>
  const d         = activePill ? trData[activePill] : null
  const concluded = d ? d.modulos.filter(m => m.status === 'done').length : 0
  const pct       = d && d.modulos.length > 0 ? Math.round(concluded / d.modulos.length * 100) : 0
  const sub       = d ? `${concluded} de ${d.modulos.length} módulos concluídos` : ''

  return (
    <>
      <div className="db-scroll">
        {/* Top bar */}
        <div className="tr-topbar">
          <button className="icon-btn" onClick={() => onBack()}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7"/>
            </svg>
          </button>
          
          <div style={{ width: '40px' }} />
        </div>

          <div className="tr-banner-sub">{loading ? 'Carregando…' : sub}</div>
        
          {olimpiadas.map(o => {
            const key     = o.toLowerCase()
            const hasData = OLIMPIADAS_COM_CONTEUDO.includes(o)
            const active  = activePill === key
            if (hasData) {
              return (
                <button
                  key={o}
                  onClick={() => setActivePill(key)}
                  style={{
                    height: '56px', borderRadius: '14px', border: active ? 'none' : '1.5px solid var(--border)',
                    background: active ? 'var(--blue)' : '#fff',
                    color: active ? '#fff' : 'var(--text)',
                    fontFamily: 'var(--font)', fontWeight: 800, fontSize: '15px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: active ? '0 3px 0 var(--blue-dark)' : 'none',
                    transition: 'all .15s',
                  }}
                >
                  {o}
                </button>
              )
            }
            return (
              <button
                key={o}
                disabled
                style={{
                  height: '56px', borderRadius: '14px', border: 'none',
                  background: 'var(--border-soft)', color: 'var(--text-mute)',
                  fontFamily: 'var(--font)', cursor: 'not-allowed', opacity: 0.5,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px',
                }}
              >
                <span style={{ fontWeight: 800, fontSize: '15px' }}>{o}</span>
                <span style={{ fontWeight: 600, fontSize: '11px' }}>Em breve</span>
              </button>
            )
          })}
        </div>

        {activePill === null ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '15px' }}>
            Conteúdo chegando em breve para suas olimpíadas.
          </div>
        ) : (
          <>
            {/* Banner */}
            <div className="tr-banner">
              <div className="tr-banner-glow" />
              <div className="tr-banner-rocket">
                <svg width="82" height="82" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="28" fill="rgba(255,255,255,0.12)"/>
                  <path d="M32 8 C 39 18, 42 28, 42 36 L 42 46 L 22 46 L 22 36 C 22 28, 25 18, 32 8 Z" fill="#fff" stroke="#F5C518" strokeWidth="2.4" strokeLinejoin="round"/>
                  <circle cx="32" cy="26" r="5" fill="#1A3DAA" stroke="#F5C518" strokeWidth="2"/>
                  <path d="M22 38 L 14 46 L 22 46 Z" fill="#F5C518" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M42 38 L 50 46 L 42 46 Z" fill="#F5C518" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
                  <rect x="22" y="40" width="20" height="3" fill="#F5C518"/>
                  <path d="M27 46 Q 32 60 37 46 Q 34 53 32 48 Q 30 53 27 46 Z" fill="#F5C518" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="tr-banner-body">
                <span className="tr-banner-pill">{d.pill}</span>
                <div className="tr-banner-title">{d.title}</div>
                <div className="tr-banner-sub">{loading ? 'Carregando…' : sub}</div>
              </div>
              <div style={{ position: 'relative', marginTop: '12px' }}>
                <div className="pbar-track pbar-translucent">
                  <div className="pbar-fill-white" style={{ width: `${pct}%` }} />
                </div>
                <div className="tr-banner-pct">{pct}% completo</div>
              </div>
            </div>

            {/* Module list header */}
            <div className="tr-mods-header">
              <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text)' }}>Módulos</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)' }}>
                {concluded} de {d.modulos.length} concluídos
              </div>
            </div>

            {/* Modules */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {d.modulos.map(mod => (
                <ModuleCard
                  key={mod.id}
                  status={mod.status}
                  num={mod.num}
                  title={mod.title}
                  desc={mod.desc}
                  unlockHint={mod.unlockHint}
                  aulaCount={mod.aulas.length}
                  onClick={mod.status !== 'locked'
                    ? () => onNavigate('screen-modulo', { module: mod })
                    : undefined
                  }
                />
              ))}
            </div>
          </>
        )}

        <div style={{ height: '4px' }} />
      </div>

      {/* Motivational footer */}
      <div className="tr-motivational">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2 L14.6 9 L22 9.6 L16.3 14.4 L18 22 L12 17.8 L6 22 L7.7 14.4 L2 9.6 L9.4 9 Z" fill="#fff" stroke="#12122A" strokeWidth="1.6" strokeLinejoin="round"/>
        </svg>
        <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--text)', lineHeight: 1.3 }}>
          Continue assim! Você está no <span style={{ color: 'var(--blue)' }}>top 15%</span> da sua escola.
        </div>
      </div>

      <BottomNav activeTab={activeNav} onNavigate={onNavigate} />
    </>
  )
}

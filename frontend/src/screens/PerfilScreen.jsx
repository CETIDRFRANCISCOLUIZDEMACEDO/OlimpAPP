import BottomNav from '../components/BottomNav'
import { CONQUISTAS_META } from '../data/conquistasMeta'

const LEVEL_TITLES = ['Iniciante', 'Explorador', 'Aventureiro', 'Campeão', 'Lendário']

export default function PerfilScreen({ onNavigate, activeNav, profile, progresso = [], totais = {}, conquistas = [], onLogout }) {

  const name       = profile?.name     || 'Usuário'
  const school     = profile?.school   || ''
  const city       = profile?.city     || ''
  const state      = profile?.state    || ''
  const xp         = profile?.xp       ?? 0
  const level      = profile?.level    ?? 1
  const streak     = profile?.streak   ?? 0
  const olimpiadas = profile?.olimpiadas ?? []

  const initial    = name[0]?.toUpperCase() || 'U'
  const levelTitle = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
  const xpInLevel  = xp - (level - 1) * 100
  const xpPercent  = Math.min(100, Math.max(0, xpInLevel))
  const nextLevelXp = level * 100

  const completedModules = progresso.filter(p => p.completed).length
  const schoolLine = [school, [city, state].filter(Boolean).join(', ')].filter(Boolean).join(' · ')

  return (
    <>
      <div className="db-scroll">
        {/* Top bar */}
        <div className="tr-topbar">
          <div style={{ width: '40px' }} />
          <div className="tr-topbar-title">Meu Perfil</div>
          <button className="icon-btn" onClick={() => onNavigate('screen-configuracoes')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8L4.2 7a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
            </svg>
          </button>
        </div>

        {/* Profile header */}
        <div className="pf-header">
          <div style={{ position: 'relative', padding: '4px' }}>
            <div className="pf-avatar">{initial}</div>
            <div className="pf-level-badge">{level}</div>
          </div>
          <div className="pf-name">{name}</div>
          {schoolLine && <div className="pf-school">{schoolLine}</div>}
          <div className="pf-rank-pill">
            <svg width="14" height="14" viewBox="0 0 20 20">
              <path d="M10 2 L12.6 7.4 L18.5 8 L14.1 12 L15.3 17.8 L10 14.5 L4.7 17.8 L5.9 12 L1.5 8 L7.4 7.4 Z" fill="var(--text)"/>
            </svg>
            Nível {level} · {levelTitle}
          </div>
        </div>

        {/* XP bar */}
        <div className="db-xp-card">
          <div className="db-xp-row">
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-dim)' }}>
              <b style={{ color: 'var(--text)', fontWeight: 800 }}>{xpInLevel}</b> / {nextLevelXp} XP para Nível {level + 1}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue)' }}>{xpPercent}%</span>
          </div>
          <div className="pbar-track"><div className="pbar-fill" style={{ width: `${xpPercent}%` }} /></div>
        </div>

        {/* Stats grid */}
        <div className="pf-stats-grid">
          <div className="pf-stat-cell">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2 C 16 7, 18 10, 18 14 A 6 6 0 1 1 6 14 C 6 11, 8 9, 10 6 C 10 9, 12 9, 12 6 Z" fill="#F5C518" stroke="#12122A" strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
            <div><div className="pf-stat-val">{streak}</div><div className="pf-stat-label">Dias de streak</div></div>
          </div>
          <div className="pf-stat-cell">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" fill="var(--green-soft)" stroke="var(--green)" strokeWidth="2"/>
              <path d="M7.5 12.2 L10.6 15.3 L16.5 9.4"/>
            </svg>
            <div><div className="pf-stat-val">{completedModules}</div><div className="pf-stat-label">Módulos concluídos</div></div>
          </div>
          <div className="pf-stat-cell">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M13 2 L5 14 L11 14 L9 22 L19 9 L13 9 Z" fill="var(--blue-mid)" stroke="var(--text)" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            <div><div className="pf-stat-val">{xp}</div><div className="pf-stat-label">XP total</div></div>
          </div>
          <div className="pf-stat-cell">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M7 4 H17 V10 A5 5 0 0 1 7 10 Z" fill="var(--yellow)" stroke="var(--text)" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M4 5 H7 V8 A2 2 0 0 1 4 8 Z M20 5 H17 V8 A2 2 0 0 0 20 8 Z" fill="var(--yellow)" stroke="var(--text)" strokeWidth="1.4"/>
              <path d="M10 15 H14 V18 H10 Z" fill="var(--yellow)" stroke="var(--text)" strokeWidth="1.4"/>
              <path d="M7 20 H17" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div><div className="pf-stat-val">{olimpiadas.length}</div><div className="pf-stat-label">Olimpíadas ativas</div></div>
          </div>
        </div>

        {/* Conquistas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text)' }}>Conquistas</div>
            <a href="#" onClick={e => { e.preventDefault(); onNavigate('screen-conquistas') }} style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue-mid)' }}>Ver todas →</a>
          </div>
          <div className="pf-badges-grid">
            {[
              ...CONQUISTAS_META.filter(m =>  conquistas.find(c => c.id === m.id)?.unlocked),
              ...CONQUISTAS_META.filter(m => !conquistas.find(c => c.id === m.id)?.unlocked),
            ].map(({ id, bg, shadow, label, icon }) => {
              const unlocked = conquistas.find(c => c.id === id)?.unlocked ?? false
              return (
                <div key={id} className="pf-badge-item" style={{ opacity: unlocked ? 1 : 0.7 }}>
                  <div className="pf-badge-circle" style={{
                    background: unlocked ? bg : '#C7CAD8',
                    boxShadow: unlocked && shadow ? `0 0 0 2px ${bg},0 6px 14px ${shadow}` : 'none',
                    ...(unlocked ? {} : { border: '2px dashed var(--text-mute)' }),
                  }}>{icon}</div>
                  <div className="pf-badge-label" style={{ color: unlocked ? undefined : 'var(--text-mute)' }}>{label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Olimpíadas ativas */}
        {olimpiadas.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text)' }}>Olimpíadas ativas</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {olimpiadas.map(id => {
                const upper   = id.toUpperCase()
                const isObmep = id === 'obmep'
                const isOba   = id === 'oba'
                const hasData = isObmep || isOba
                const done    = hasData ? progresso.filter(p => p.olimpiada === id && p.completed).length : 0
                const total   = totais[id] ?? 0
                const pct     = hasData && total > 0 ? Math.round(done / total * 100) : 0
                const color   = isObmep ? 'var(--blue)' : isOba ? 'var(--yellow)' : 'var(--text-dim)'

                return (
                  <div key={id} className="db-olimp-card">
                    <div className="db-olimp-head">
                      {isObmep ? (
                        <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
                          <rect x="6" y="4" width="28" height="32" rx="6" fill="var(--blue)"/>
                          <rect x="10" y="8" width="20" height="6" rx="2" fill="#fff"/>
                          <g fill="#fff">
                            <circle cx="13" cy="20" r="1.8"/><circle cx="20" cy="20" r="1.8"/><circle cx="27" cy="20" r="1.8"/>
                            <circle cx="13" cy="26" r="1.8"/><circle cx="20" cy="26" r="1.8"/><circle cx="27" cy="26" r="1.8"/>
                            <circle cx="13" cy="32" r="1.8"/><circle cx="20" cy="32" r="1.8"/>
                          </g>
                          <circle cx="27" cy="32" r="1.8" fill="var(--yellow)"/>
                        </svg>
                      ) : isOba ? (
                        <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
                          <path d="M20 4 L24 16 L36 16.6 L26.6 23.6 L30 35 L20 28.8 L10 35 L13.4 23.6 L4 16.6 L16 16 Z" fill="var(--yellow)" stroke="var(--text)" strokeWidth="1.6" strokeLinejoin="round"/>
                          <circle cx="20" cy="20" r="3" fill="#fff" fillOpacity="0.85"/>
                        </svg>
                      ) : (
                        <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
                          <path d="M7 4 H33 V18 A13 13 0 0 1 7 18 Z" fill="var(--border)" stroke="var(--text-dim)" strokeWidth="2" strokeLinejoin="round"/>
                          <path d="M4 6 H7 V14 A4 4 0 0 1 4 14 Z M36 6 H33 V14 A4 4 0 0 0 36 14 Z" fill="var(--border)" stroke="var(--text-dim)" strokeWidth="1.6"/>
                          <path d="M17 24 H23 V30 H17 Z" fill="var(--border)" stroke="var(--text-dim)" strokeWidth="1.6"/>
                          <path d="M13 36 H27" stroke="var(--text-dim)" strokeWidth="2.4" strokeLinecap="round"/>
                        </svg>
                      )}
                      <div>
                        <div className="db-olimp-name">{upper}</div>
                        <div className="db-olimp-phase" style={{ color: hasData ? color : 'var(--text-mute)' }}>
                          {hasData ? `Fase 1 · ${pct}%` : 'Em breve'}
                        </div>
                      </div>
                    </div>
                    {hasData ? (
                      <div className="pbar-track">
                        <div className="pbar-fill" style={{ width: `${pct}%`, background: isOba ? 'var(--yellow)' : undefined }} />
                      </div>
                    ) : (
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-mute)' }}>Conteúdo chegando em breve</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            style={{ width: '100%', padding: '14px 18px', background: '#fff', color: 'var(--blue)', border: '2px solid var(--blue)', borderRadius: '14px', fontFamily: 'var(--font)', fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}
            onClick={() => onNavigate('screen-configuracoes')}
          >
            Editar perfil
          </button>
          <button
            style={{ width: '100%', padding: '14px 18px', background: 'transparent', color: 'var(--text-dim)', border: '2px solid var(--border)', borderRadius: '14px', fontFamily: 'var(--font)', fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}
            onClick={onLogout}
          >
            Sair
          </button>
        </div>

        <div style={{ height: '4px' }} />
      </div>

      <BottomNav activeTab={activeNav} onNavigate={onNavigate} />
    </>
  )
}

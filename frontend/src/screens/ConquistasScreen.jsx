import BottomNav from '../components/BottomNav'
import { CONQUISTAS_META } from '../data/conquistasMeta'

export default function ConquistasScreen({ onNavigate, onBack, activeNav, conquistas = [] }) {
  const total     = CONQUISTAS_META.length
  const unlocked  = CONQUISTAS_META.filter(m => conquistas.find(c => c.id === m.id)?.unlocked)
  const locked    = CONQUISTAS_META.filter(m => !conquistas.find(c => c.id === m.id)?.unlocked)
  const unlockedN = unlocked.length
  const pct       = total > 0 ? Math.round(unlockedN / total * 100) : 0

  return (
    <>
      <div className="cq-scroll">
        {/* Top bar */}
        <div className="tr-topbar">
          <button className="icon-btn" onClick={() => onBack('screen-perfil')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7"/>
            </svg>
          </button>
          <div className="tr-topbar-title">Conquistas</div>
          <div className="cq-topbar-counter">{unlockedN} de {total}</div>
        </div>

        {/* Progresso geral */}
        <div className="cq-progress-card">
          <div className="cq-progress-label"><strong>{unlockedN}</strong> conquistadas de <strong>{total}</strong> disponíveis</div>
          <div className="pbar-track" style={{ height: '10px' }}>
            <div className="pbar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Conquistadas */}
        {unlocked.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="cq-section-header">
              <div className="cq-section-title">Conquistadas</div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <div className="cq-grid">
              {unlocked.map(m => (
                <div key={m.id} className="cq-card">
                  <div className="cq-circle" style={{ background: m.bg, boxShadow: m.shadow ? `0 0 0 2px ${m.bg},0 4px 12px ${m.shadow}` : 'none' }}>
                    {m.icon}
                  </div>
                  <div className="cq-card-name">{m.label}</div>
                  <div className="cq-card-desc">{m.desc}</div>
                  <div className="cq-card-date">Desbloqueada ✓</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bloqueadas */}
        {locked.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="cq-section-header">
              <div className="cq-section-title">Bloqueadas</div>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-mute)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 1 1 8 0v3"/>
              </svg>
            </div>
            <div className="cq-grid">
              {locked.map(m => (
                <div key={m.id} className="cq-card cq-card-locked">
                  <div className="cq-circle cq-circle-locked">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 1 1 8 0v3"/>
                    </svg>
                  </div>
                  <div className="cq-card-name cq-card-name-locked">{m.label}</div>
                  <div className="cq-card-desc">{m.desc}</div>
                  <div className="cq-card-hint">{m.hint}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ height: '4px' }} />
      </div>

      <BottomNav activeTab={activeNav} onNavigate={onNavigate} />
    </>
  )
}

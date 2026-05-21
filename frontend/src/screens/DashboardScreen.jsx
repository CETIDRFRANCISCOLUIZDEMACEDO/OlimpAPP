import { useState, useEffect } from 'react'
import BottomNav from '../components/BottomNav'
import { getMissaoDoDia } from '../services/dashboardService'
import { CONQUISTAS_META } from '../data/conquistasMeta'

const LEVEL_TITLES = ['Iniciante', 'Explorador', 'Aventureiro', 'Campeão', 'Lendário']

export default function DashboardScreen({ onNavigate, activeNav, profile, progresso = [], totais = {}, conquistas = [] }) {
  const [missao, setMissao] = useState(null)

  useEffect(() => {
    getMissaoDoDia().then(setMissao).catch(() => {})
  }, [profile?.olimpiadas])

  const name        = profile?.name || 'Usuário'
  const initial     = name[0]?.toUpperCase() || 'U'
  const xp          = profile?.xp ?? 0
  const level       = profile?.level ?? 1
  const streak      = profile?.streak ?? 0
  const xpInLevel   = xp - (level - 1) * 100
  const xpPercent   = Math.min(100, Math.max(0, xpInLevel))
  const levelTitle  = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
  const nextLevelXp = level * 100

  const olimpiadasConcluidas = (profile?.olimpiadas ?? []).filter(id => {
    const total = totais[id] ?? 0
    const done  = progresso.filter(p => p.olimpiada === id && p.completed).length
    return total > 0 && done >= total
  })

  const olimpiadasComConteudo = (profile?.olimpiadas ?? []).filter(id => (totais[id] ?? 0) > 0)
  const todasConcluidas       = olimpiadasComConteudo.length > 0 && olimpiadasConcluidas.length >= olimpiadasComConteudo.length

  const totalGeral = olimpiadasComConteudo.reduce((s, id) => s + (totais[id] ?? 0), 0)
  const doneGeral  = olimpiadasComConteudo.reduce((s, id) =>
    s + progresso.filter(p => p.olimpiada === id && p.completed).length, 0)
  const pctGeral   = totalGeral > 0 ? Math.round(doneGeral / totalGeral * 100) : 0

  const missaoOlimp = missao?.concluido ? null : missao?.olimpiada
  const missaoDone  = missaoOlimp ? progresso.filter(p => p.olimpiada === missaoOlimp && p.completed).length : 0
  const missaoTotal = missaoOlimp ? (totais[missaoOlimp] ?? 0) : 0

  const olimpiadas = profile?.olimpiadas ?? []

  return (
    <>
      <div className="db-scroll">
        {/* Top bar */}
        <div className="db-topbar">
          <div className="db-topbar-left">
            <div className="db-avatar">{initial}</div>
            <div>
              <div className="db-ola">Olá,</div>
              <div className="db-nome">{name.split(' ')[0]}!</div>
            </div>
          </div>
          <div className="db-streak">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2 C 16 7, 18 10, 18 14 A 6 6 0 1 1 6 14 C 6 11, 8 9, 10 6 C 10 9, 12 9, 12 6 Z" fill="#F5C518" stroke="#12122A" strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M12 10 C 14 12, 15 14, 15 16 A 3 3 0 1 1 9 16 C 9 14, 10 13, 11 11 Z" fill="#FFE070"/>
            </svg>
            <span className="db-streak-n">{streak}</span>
            <span className="db-streak-label">dias</span>
          </div>
        </div>

        {/* XP bar */}
        <div className="db-xp-card">
          <div className="db-xp-row">
            <span className="db-xp-level">Nível {level} <span className="db-xp-sub">· {levelTitle}</span></span>
            <span className="db-xp-val"><b>{xpInLevel}</b> / 100 XP</span>
          </div>
          <div className="pbar-track">
            <div className="pbar-fill" style={{ width: `${xpPercent}%` }} />
          </div>
        </div>

        {/* Mission card */}
        <div className="db-mission" style={{ cursor: 'pointer' }} onClick={() => onNavigate('screen-trilhas')}>
          <div className="db-mission-glow" />
          <div className="db-mission-rocket">
            <svg width="84" height="84" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28" fill="rgba(255,255,255,0.12)"/>
              <path d="M32 8 C 39 18, 42 28, 42 36 L 42 46 L 22 46 L 22 36 C 22 28, 25 18, 32 8 Z" fill="#fff" stroke="#F5C518" strokeWidth="2.4" strokeLinejoin="round"/>
              <circle cx="32" cy="26" r="5" fill="#1A3DAA" stroke="#F5C518" strokeWidth="2"/>
              <path d="M22 38 L 14 46 L 22 46 Z" fill="#F5C518" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M42 38 L 50 46 L 42 46 Z" fill="#F5C518" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
              <rect x="22" y="40" width="20" height="3" fill="#F5C518"/>
              <path d="M27 46 Q 32 60 37 46 Q 34 53 32 48 Q 30 53 27 46 Z" fill="#F5C518" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="db-mission-body">
            <span className="db-mission-pill" style={missao?.concluido ? { background: 'rgba(34,197,94,.25)', color: '#86efac' } : undefined}>
              {missao?.semConteudo
                ? 'EM BREVE'
                : missao?.concluido
                  ? (todasConcluidas ? 'TODAS AS TRILHAS CONCLUÍDAS ✓' : 'TRILHA CONCLUÍDA ✓')
                  : `${missao?.olimpiada?.toUpperCase() ?? '…'} · FASE 1`}
            </span>
            <div className="db-mission-eyebrow">Missão do dia</div>
            <div className="db-mission-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {!missao
                ? '…'
                : missao.semConteudo
                  ? 'Conteúdo chegando em breve'
                  : missao.concluido
                    ? 'Parabéns! Trilhas Concluídas'
                    : `${missao.titulo} — ${missao.subtitulo.split(',')[0]}`}
            </div>
            {missao?.concluido && (
              <div style={{ marginTop: '2px', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,.75)' }}>
                {olimpiadasConcluidas.map(id => id.toUpperCase()).join(' e ')} {olimpiadasConcluidas.length === 1 ? 'concluída' : 'concluídas'} com sucesso!
              </div>
            )}
            {missao?.concluido && (
              <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {olimpiadasConcluidas.map(id => {
                  const done  = progresso.filter(p => p.olimpiada === id && p.completed).length
                  const total = totais[id] ?? 0
                  return (
                    <div key={id} style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,.85)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{id.toUpperCase()}</span>
                      <span>{done} de {total} módulos · 100%</span>
                    </div>
                  )
                })}
                <div className="pbar-track pbar-translucent" style={{ marginTop: '2px' }}>
                  <div className="pbar-fill-white" style={{ width: `${pctGeral}%`, background: 'rgba(34,197,94,.6)' }} />
                </div>
                <div className="db-mission-progress">{doneGeral} de {totalGeral} módulos</div>
              </div>
            )}
            {!missao?.semConteudo && !missao?.concluido && (
              <div style={{ marginTop: '2px' }}>
                <div className="pbar-track pbar-translucent">
                  <div className="pbar-fill-white" style={{ width: `${missaoTotal > 0 ? Math.min(100, missaoDone / missaoTotal * 100) : 0}%` }} />
                </div>
                <div className="db-mission-progress">{missaoDone} de {missaoTotal} módulos</div>
              </div>
            )}
          </div>
        </div>

        {/* Suas olimpíadas */}
        <div className="db-section-label">Suas olimpíadas</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {olimpiadas.map(id => {
            const isObmep = id === 'obmep'
            const isOba   = id === 'oba'
            const hasData = isObmep || isOba
            const done    = progresso.filter(p => p.olimpiada === id && p.completed).length
            const total   = totais[id] ?? 0
            const pct     = total > 0 ? Math.round(done / total * 100) : 0
            const color   = isObmep ? 'var(--blue)' : isOba ? 'var(--yellow)' : 'var(--text-dim)'

            return (
              <div key={id} className="db-olimp-card">
                <div className="db-olimp-head">
                  {isObmep ? (
                    <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                      <rect x="6" y="4" width="28" height="32" rx="6" fill="#1A3DAA"/>
                      <rect x="10" y="8" width="20" height="6" rx="2" fill="#fff"/>
                      <g fill="#fff">
                        <circle cx="13" cy="20" r="1.8"/><circle cx="20" cy="20" r="1.8"/><circle cx="27" cy="20" r="1.8"/>
                        <circle cx="13" cy="26" r="1.8"/><circle cx="20" cy="26" r="1.8"/><circle cx="27" cy="26" r="1.8"/>
                        <circle cx="13" cy="32" r="1.8"/><circle cx="20" cy="32" r="1.8"/>
                      </g>
                      <circle cx="27" cy="32" r="1.8" fill="#F5C518"/>
                    </svg>
                  ) : isOba ? (
                    <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                      <path d="M20 4 L24 16 L36 16.6 L26.6 23.6 L30 35 L20 28.8 L10 35 L13.4 23.6 L4 16.6 L16 16 Z" fill="#F5C518" stroke="#12122A" strokeWidth="1.6" strokeLinejoin="round"/>
                      <circle cx="20" cy="20" r="3" fill="#fff" fillOpacity="0.85"/>
                    </svg>
                  ) : (
                    <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                      <path d="M7 4 H33 V18 A13 13 0 0 1 7 18 Z" fill="var(--border)" stroke="var(--text-dim)" strokeWidth="2" strokeLinejoin="round"/>
                      <path d="M4 6 H7 V14 A4 4 0 0 1 4 14 Z M36 6 H33 V14 A4 4 0 0 0 36 14 Z" fill="var(--border)" stroke="var(--text-dim)" strokeWidth="1.6"/>
                      <path d="M17 24 H23 V30 H17 Z" fill="var(--border)" stroke="var(--text-dim)" strokeWidth="1.6"/>
                      <path d="M13 36 H27" stroke="var(--text-dim)" strokeWidth="2.4" strokeLinecap="round"/>
                    </svg>
                  )}
                  <div>
                    <div className="db-olimp-name">{id.toUpperCase()}</div>
                    <div className="db-olimp-phase">{hasData ? 'Fase 1' : 'Em breve'}</div>
                  </div>
                </div>
                {hasData ? (
                  <>
                    <div className="db-olimp-stats">
                      <span>{done} de {total} módulos</span>
                      <span style={{ color, fontWeight: 800 }}>{pct}%</span>
                    </div>
                    <div className="pbar-track">
                      <div className="pbar-fill" style={{ width: `${pct}%`, background: isOba ? 'var(--yellow)' : undefined }} />
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-mute)' }}>Conteúdo chegando em breve</div>
                )}
              </div>
            )
          })}
        </div>

        {/* Conquistas */}
        <div className="db-conquistas-header">
          <div className="db-section-label" style={{ margin: 0 }}>Conquistas</div>
          <a href="#" onClick={e => { e.preventDefault(); onNavigate('screen-conquistas') }} style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue-mid)' }}>Ver todas →</a>
        </div>
        <div className="db-badges">
          {[
            ...CONQUISTAS_META.filter(m =>  conquistas.find(c => c.id === m.id)?.unlocked),
            ...CONQUISTAS_META.filter(m => !conquistas.find(c => c.id === m.id)?.unlocked),
          ].slice(0, 4).map(({ id, bg, shadow, icon, label }) => {
            const unlocked = conquistas.find(c => c.id === id)?.unlocked ?? false
            return (
              <div key={id} className="db-badge-item" style={{ opacity: unlocked ? 1 : 0.45 }}>
                <div className="db-badge-circle" style={{
                  background: unlocked ? bg : '#C7CAD8',
                  boxShadow: unlocked && shadow ? `0 0 0 2px ${bg}, 0 6px 14px ${shadow}` : 'none',
                  ...(unlocked ? {} : { border: '2px dashed var(--text-mute)' }),
                }}>
                  {icon}
                </div>
                <div className="db-badge-label" style={{ color: unlocked ? undefined : 'var(--text-mute)' }}>{label}</div>
              </div>
            )
          })}
        </div>

        <div style={{ height: '4px' }} />
      </div>

      <BottomNav activeTab={activeNav} onNavigate={onNavigate} />
    </>
  )
}

import { useState, useEffect } from 'react'
import BottomNav from '../components/BottomNav'
import { getRanking } from '../services/rankingService'

const PODIUM_SIZES = {
  0: { avatar: 68, fontSize: 28, border: '#F5C518', nameColor: 'var(--text)', nameFontSize: '15px', xpFontSize: '13px', marginTop: '-18px', crown: true },
  1: { avatar: 56, fontSize: 22, border: '#C0C0C0', nameColor: '#888', nameFontSize: '13px', xpFontSize: '12px', marginTop: '0',    crown: false },
  2: { avatar: 50, fontSize: 20, border: '#CD7F32', nameColor: '#888', nameFontSize: '13px', xpFontSize: '12px', marginTop: '0',    crown: false },
}
const PODIUM_BASE_CLASS = ['rk-gold', 'rk-silver', 'rk-bronze']
const PODIUM_ORDER      = [1, 0, 2] // 2º, 1º, 3º

function formatXp(n) {
  return n >= 1000
    ? n.toLocaleString('pt-BR') + ' XP'
    : n + ' XP'
}

export default function RankingScreen({ onNavigate, onBack, activeNav, profile }) {
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRanking()
      .then(setRanking)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const myName = profile?.name || ''

  const myIndex = ranking.findIndex(r =>
    r.name === myName && r.xp === (profile?.xp ?? -1)
  )
  const myPos    = myIndex >= 0 ? myIndex + 1 : null
  const myEntry  = myIndex >= 0 ? ranking[myIndex] : null
  const xpToNext = myIndex > 0
    ? (ranking[myIndex - 1]?.xp ?? 0) - (profile?.xp ?? 0)
    : null

  const podium = ranking.slice(0, 3)
  const list   = ranking.slice(3)

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
          <div className="tr-topbar-title">Ranking · OBMEP</div>
          <div style={{ width: '40px' }} />
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0', color: 'var(--text-dim)', fontWeight: 700 }}>
            Carregando...
          </div>
        ) : ranking.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0', color: 'var(--text-mute)', fontWeight: 600 }}>
            Nenhum dado ainda
          </div>
        ) : (
          <>
            {/* Pódio */}
            {podium.length >= 1 && (
              <div className="rk-podium">
                {PODIUM_ORDER.map(rankIdx => {
                  const entry = podium[rankIdx]
                  if (!entry) return null
                  const s = PODIUM_SIZES[rankIdx]
                  const isMe = entry.name === myName
                  return (
                    <div key={rankIdx} className="rk-podium-item" style={{ marginTop: s.marginTop }}>
                      {s.crown && <div className="rk-crown">👑</div>}
                      <div
                        className="rk-avatar"
                        style={{ width: `${s.avatar}px`, height: `${s.avatar}px`, fontSize: `${s.fontSize}px`, border: `3px solid ${s.border}`, background: isMe ? 'linear-gradient(135deg,var(--blue-mid),var(--blue))' : undefined }}
                      >
                        {entry.name[0]?.toUpperCase()}
                      </div>
                      <div className="rk-pod-name" style={{ color: s.nameColor, fontSize: s.nameFontSize }}>
                        {isMe ? `${entry.name.split(' ')[0]} (você)` : entry.name.split(' ')[0]}
                      </div>
                      <div className="rk-pod-xp" style={{ fontSize: s.xpFontSize, fontWeight: s.crown ? 800 : 700 }}>
                        {formatXp(entry.xp)}
                      </div>
                      <div className={`rk-pod-base ${PODIUM_BASE_CLASS[rankIdx]}`}>{rankIdx + 1}º</div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Lista 4º+ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {list.map((entry, i) => {
                const pos  = i + 4
                const isMe = entry.name === myName
                return (
                  <div key={i} className={`rk-row${isMe ? ' rk-row-me' : ''}`}>
                    <span className="rk-pos" style={isMe ? { color: 'var(--blue)' } : {}}>
                      {pos}º
                    </span>
                    <div
                      className="rk-row-avatar"
                      style={isMe ? { background: 'linear-gradient(135deg,var(--blue-mid),var(--blue))' } : {}}
                    >
                      {entry.name[0]?.toUpperCase()}
                    </div>
                    <div className="rk-row-info">
                      <div className="rk-row-name" style={isMe ? { color: 'var(--blue)', fontWeight: 900 } : {}}>
                        {isMe ? `${entry.name.split(' ')[0]} (você)` : entry.name}
                      </div>
                      <div className="rk-row-school">{entry.school || '—'}</div>
                    </div>
                    <div className="rk-row-xp" style={isMe ? { color: 'var(--blue)', fontWeight: 900 } : {}}>
                      {formatXp(entry.xp)}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        <div style={{ height: '8px' }} />
      </div>

      {/* Card fixo "sua posição" */}
      <div className="rk-my-card">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2 L14.6 9 L22 9.6 L16.3 14.4 L18 22 L12 17.8 L6 22 L7.7 14.4 L2 9.6 L9.4 9 Z" fill="var(--blue-mid)" stroke="var(--blue)" strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
        {myPos ? (
          <span>
            Você está em <strong>{myPos}º lugar</strong>
            {xpToNext && xpToNext > 0 && <> · <strong>{xpToNext} XP</strong> para subir</>}
          </span>
        ) : (
          <span>Complete módulos para entrar no ranking!</span>
        )}
      </div>

      <BottomNav activeTab={activeNav} onNavigate={onNavigate} />
    </>
  )
}

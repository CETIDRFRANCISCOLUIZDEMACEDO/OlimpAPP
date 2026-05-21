import { useState } from 'react'
import { concluirModulo } from '../services/progressoService'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

function StarIcon({ filled }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? '#F5C518' : 'none'} stroke="#F5C518" strokeWidth="2" strokeLinejoin="round">
      <path d="M12 2 L14.6 9 L22 9.6 L16.3 14.4 L18 22 L12 17.8 L6 22 L7.7 14.4 L2 9.6 L9.4 9 Z"/>
    </svg>
  )
}

export default function AulaScreen({ onBack, currentModule, onProgressUpdate }) {
  const mod      = currentModule
  const questoes = mod?.questoes ?? []

  const [idx,       setIdx]       = useState(0)
  const [selected,  setSelected]  = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [acertos,   setAcertos]   = useState(0)
  const [fase,      setFase]      = useState('quiz')
  const [xpGanho,   setXpGanho]   = useState(0)
  const [saving,    setSaving]    = useState(false)
  const [finalAcertos, setFinalAcertos] = useState(0)

  if (!mod || questoes.length === 0) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font)', color: 'var(--text-dim)', flexDirection: 'column', gap: '12px' }}>
        <span>Módulo não encontrado</span>
        <button className="icon-btn" onClick={() => onBack('screen-modulo')}>Voltar</button>
      </div>
    )
  }

  const questao  = questoes[idx]
  const isLast   = idx === questoes.length - 1
  const isCorrect = confirmed && selected === questao.correta
  const progress  = ((idx + (confirmed ? 1 : 0)) / questoes.length) * 100

  const handleConfirm = () => {
    if (selected === null) return
    if (selected === questao.correta) setAcertos(a => a + 1)
    setConfirmed(true)
  }

  const handleNext = async () => {
    if (isLast) {
      const total = acertos + (selected === questao.correta ? 1 : 0)
      setFinalAcertos(total)
      setSaving(true)
      const pct   = total / questoes.length
      const stars = pct >= 1 ? 3 : pct >= 0.6 ? 2 : 1
      try {
        const res = await concluirModulo(mod.id, mod.olimpiada ?? 'obmep', stars)
        setXpGanho(res?.xpGained ?? stars * 10)
        if (onProgressUpdate) await onProgressUpdate()
      } catch {
        setXpGanho(stars * 10)
      } finally {
        setSaving(false)
        setFase('resultado')
      }
    } else {
      setIdx(i => i + 1)
      setSelected(null)
      setConfirmed(false)
    }
  }

  const getAltClass = (i) => {
    if (!confirmed) return selected === i ? 'au-alt selected' : 'au-alt'
    if (i === questao.correta) return 'au-alt correct'
    if (i === selected)        return 'au-alt wrong'
    return 'au-alt'
  }

  /* ── Tela de resultado ── */
  if (fase === 'resultado') {
    const pct    = finalAcertos / questoes.length
    const stars  = pct >= 1 ? 3 : pct >= 0.6 ? 2 : 1
    const msg    = pct >= 1 ? 'Perfeito! Módulo dominado!' : pct >= 0.6 ? 'Muito bem! Continue assim!' : 'Continue estudando, você consegue!'
    const msgColor = pct >= 0.6 ? 'var(--green)' : 'var(--blue)'

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
        <div className="db-scroll" style={{ alignItems: 'center', justifyContent: 'center', gap: '20px' }}>

          {/* Ícone de troféu */}
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(245,197,24,.4)' }}>
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
              <path d="M7 4 H17 V10 A5 5 0 0 1 7 10 Z" fill="#fff" stroke="var(--text)" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M4 5 H7 V8 A2 2 0 0 1 4 8 Z M20 5 H17 V8 A2 2 0 0 0 20 8 Z" fill="#fff" stroke="var(--text)" strokeWidth="1.4"/>
              <path d="M10 15 H14 V18 H10 Z" fill="#fff" stroke="var(--text)" strokeWidth="1.4"/>
              <path d="M7 20 H17" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Estrelas */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3].map(n => <StarIcon key={n} filled={n <= stars} />)}
          </div>

          {/* Placar */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: '38px', color: 'var(--text)', lineHeight: 1 }}>
              {finalAcertos}<span style={{ fontSize: '22px', color: 'var(--text-dim)', fontWeight: 700 }}>/{questoes.length}</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dim)', marginTop: '4px' }}>questões corretas</div>
          </div>

          {/* Mensagem */}
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '16px 20px', textAlign: 'center', width: '100%' }}>
            <div style={{ fontWeight: 800, fontSize: '15px', color: msgColor }}>{msg}</div>
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M13 2 L5 14 L11 14 L9 22 L19 9 L13 9 Z" fill="var(--blue-mid)" stroke="var(--text)" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontWeight: 900, fontSize: '20px', color: 'var(--blue)' }}>+{xpGanho} XP</span>
            </div>
          </div>

          {/* Botão voltar */}
          <button
            className="btn-primary"
            style={{ borderRadius: '14px', fontSize: '16px', width: '100%' }}
            onClick={() => onBack('screen-modulo')}
          >
            Voltar ao módulo
          </button>
        </div>
      </div>
    )
  }

  /* ── Tela de questão ── */
  const bannerBg    = confirmed ? (isCorrect ? '#dcfce7' : '#fef2f2') : undefined
  const bannerColor = confirmed ? (isCorrect ? '#15803d' : '#b91c1c') : undefined
  const bannerMsg   = confirmed
    ? (isCorrect ? '✓ Correto!' : `✗ Resposta certa: alternativa ${LETTERS[questao.correta]}`)
    : ''

  return (
    <>
      {/* Top bar */}
      <div className="au-topbar">
        <button className="icon-btn" onClick={() => onBack('screen-modulo')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <div className="au-topbar-center">
          <div className="au-topbar-label">{mod.title} · Questão {idx + 1} de {questoes.length}</div>
          <div className="au-progress-track">
            <div className="au-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div style={{ width: '40px' }} />
      </div>

      {/* Corpo */}
      <div className="db-scroll" style={{ paddingTop: '12px' }}>
        {/* Card da questão */}
        <div className="au-card">
          <div className="au-card-tag">{questao.fonte}</div>
          <div className="au-question">{questao.enunciado}</div>
        </div>

        {/* Alternativas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {questao.alternativas.map((alt, i) => (
            <button key={i} className={getAltClass(i)} onClick={() => !confirmed && setSelected(i)}>
              <span className="au-alt-letter">{LETTERS[i]}</span>
              <span className="au-alt-text">{alt}</span>
            </button>
          ))}
        </div>

        {/* Confirmar */}
        <div className="au-confirm-row">
          <button
            className="au-confirm-btn"
            disabled={selected === null || confirmed}
            onClick={handleConfirm}
          >
            Confirmar
          </button>
          <div className="au-xp-badge">+{saving ? '…' : (isLast ? '30' : '10')} XP</div>
        </div>

        <div style={{ height: '8px' }} />
      </div>

      {/* Banner de feedback */}
      {confirmed && (
        <div className="au-banner" style={{ background: bannerBg }}>
          <div className="au-banner-msg" style={{ color: bannerColor }}>{bannerMsg}</div>
          <button className="au-next-btn" onClick={handleNext} disabled={saving}>
            {saving ? '…' : isLast ? 'Ver resultado' : 'Próxima →'}
          </button>
        </div>
      )}
    </>
  )
}

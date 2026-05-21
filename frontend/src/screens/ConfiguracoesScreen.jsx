import { useState, useRef, useCallback } from 'react'
import { updateMe } from '../services/userService'
import { UFS } from '../data/ufs'

const OLIMPIADS_CFG = [
  {
    id: 'obmep', name: 'OBMEP', sub: 'Matemática',
    icon: <svg width="32" height="32" viewBox="0 0 40 40" fill="none"><rect x="2" y="2" width="36" height="36" rx="10" fill="#1A3DAA"/><path d="M12 10 L 28 10 L 22 20 L 28 30 L 12 30" stroke="#F5C518" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>,
  },
  {
    id: 'oba', name: 'OBA', sub: 'Astronomia',
    icon: <svg width="32" height="32" viewBox="0 0 40 40" fill="none"><rect x="2" y="2" width="36" height="36" rx="10" fill="#1A3DAA"/><circle cx="20" cy="20" r="7" fill="#F5C518"/><ellipse cx="20" cy="20" rx="12" ry="4" stroke="#fff" strokeWidth="2.4" fill="none" transform="rotate(-18 20 20)"/><circle cx="30" cy="11" r="1.6" fill="#fff"/><circle cx="10" cy="29" r="1.2" fill="#fff"/></svg>,
  },
  {
    id: 'obq', name: 'OBQ', sub: 'Química',
    icon: <svg width="32" height="32" viewBox="0 0 40 40" fill="none"><rect x="2" y="2" width="36" height="36" rx="10" fill="#1A3DAA"/><path d="M16 9 L 16 17 L 11 28 Q 10 32 14 32 L 26 32 Q 30 32 29 28 L 24 17 L 24 9" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" fill="none"/><path d="M14 22 L 26 22 L 28 28 Q 29 31 26 31 L 14 31 Q 11 31 12 28 Z" fill="#F5C518"/><circle cx="18" cy="27" r="1.4" fill="#fff"/><circle cx="23" cy="25" r="1" fill="#fff"/><line x1="14" y1="9" x2="26" y2="9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/></svg>,
  },
  {
    id: 'obf', name: 'OBF', sub: 'Física',
    icon: <svg width="32" height="32" viewBox="0 0 40 40" fill="none"><rect x="2" y="2" width="36" height="36" rx="10" fill="#1A3DAA"/><circle cx="20" cy="20" r="3" fill="#F5C518"/><ellipse cx="20" cy="20" rx="11" ry="4" stroke="#fff" strokeWidth="2.2" fill="none"/><ellipse cx="20" cy="20" rx="11" ry="4" stroke="#fff" strokeWidth="2.2" fill="none" transform="rotate(60 20 20)"/><ellipse cx="20" cy="20" rx="11" ry="4" stroke="#fff" strokeWidth="2.2" fill="none" transform="rotate(-60 20 20)"/></svg>,
  },
]

export default function ConfiguracoesScreen({ onNavigate, onBack, profile, onProfileUpdate, onLogout }) {
  const [name,   setName]   = useState(profile?.name   || '')
  const [school, setSchool] = useState(profile?.school || '')
  const [city,   setCity]   = useState(profile?.city   || '')
  const [state,  setState]  = useState(profile?.state  || '')
  const [grade,  setGrade]  = useState(profile?.grade  || '1')

  const [activeOlimps, setActiveOlimps] = useState(profile?.olimpiadas ?? ['obmep'])
  const [switches, setSwitches]         = useState({
    whatsapp: profile?.notif_whatsapp ?? true,
    email:    profile?.notif_email    ?? true,
    novos:    profile?.notif_novos    ?? false,
  })
  const [horario, setHorario]           = useState(
    profile?.study_time
      ? profile.study_time.charAt(0).toUpperCase() + profile.study_time.slice(1)
      : 'Tarde'
  )
  const [meta, setMeta] = useState(String(profile?.daily_goal ?? 10))

  const [saving, setSaving] = useState(false)
  const [toastMsg,      setToastMsg]      = useState('✓ Salvo com sucesso!')
  const [toastVisible,  setToastVisible]  = useState(false)
  const toastTimer = useRef(null)

  const showToast = useCallback((msg = '✓ Salvo com sucesso!') => {
    setToastMsg(msg)
    setToastVisible(true)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastVisible(false), 2200)
  }, [])

  const toggleOlimp = (id) => {
    if (activeOlimps.includes(id) && activeOlimps.length === 1) {
      showToast('Selecione ao menos uma olimpíada.')
      return
    }
    setActiveOlimps(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleSwitch = (key) => {
    setSwitches(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const updated = await updateMe({
        name,
        school,
        city,
        state,
        grade,
        daily_goal:     Number(meta),
        study_time:     horario.toLowerCase(),
        olimpiadas:     activeOlimps,
        notif_whatsapp: switches.whatsapp,
        notif_email:    switches.email,
        notif_novos:    switches.novos,
      })
      if (onProfileUpdate) onProfileUpdate({ ...profile, ...updated })
      showToast('✓ Alterações salvas!')
    } catch {
      showToast('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="cfg-scroll">
        {/* Top bar */}
        <div className="tr-topbar">
          <button className="icon-btn" onClick={() => onBack('screen-perfil')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7"/>
            </svg>
          </button>
          <div className="tr-topbar-title">Configurações</div>
          <div style={{ width: '40px' }} />
        </div>

        {/* Dados pessoais */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="cfg-section-label">Dados pessoais</div>
          <div className="cfg-card">
            <div className="cfg-field">
              <div className="cfg-field-label">Nome completo</div>
              <input className="cfg-input" type="text" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="cfg-field">
              <div className="cfg-field-label">Escola</div>
              <input className="cfg-input" type="text" value={school} onChange={e => setSchool(e.target.value)} />
            </div>
            <div className="cfg-field">
              <div className="cfg-field-label">Cidade</div>
              <input className="cfg-input" type="text" value={city} onChange={e => setCity(e.target.value)} />
            </div>
            <div className="cfg-field">
              <div className="cfg-field-label">Estado</div>
              <select className="cfg-input" value={state} onChange={e => setState(e.target.value)}>
                <option value="">Selecione o estado</option>
                {UFS.map(uf => (
                  <option key={uf.sigla} value={uf.sigla}>{uf.nome}</option>
                ))}
              </select>
            </div>
            <div className="cfg-field">
              <div className="cfg-field-label">Série</div>
              <select className="cfg-input" value={grade} onChange={e => setGrade(e.target.value)}>
                <option value="1">1º ano</option>
                <option value="2">2º ano</option>
                <option value="3">3º ano</option>
              </select>
            </div>
          </div>
        </div>

        {/* Olimpíadas de interesse */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="cfg-section-label">Olimpíadas de interesse</div>
          <div className="cfg-card">
            <div className="cfg-olimp-grid">
              {OLIMPIADS_CFG.map(o => (
                <button
                  key={o.id}
                  className={`cfg-olimp-card${activeOlimps.includes(o.id) ? ' active' : ''}`}
                  onClick={() => toggleOlimp(o.id)}
                >
                  <div className="cfg-olimp-card-top">
                    {o.icon}
                    <div className="cfg-olimp-check">✓</div>
                  </div>
                  <div className="cfg-olimp-name">{o.name}</div>
                  <div className="cfg-olimp-sub">{o.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notificações */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="cfg-section-label">Notificações</div>
          <div className="cfg-card">
            <div className="cfg-toggle-row">
              <div className="cfg-toggle-icon" style={{ background: '#E7F7EE' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.11-1.34A9.93 9.93 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="#25D366"/>
                  <path d="M17.2 14.8c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.55.13-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.46-.16 0-.34-.02-.52-.02s-.48.07-.73.34c-.25.27-.95.93-.95 2.27s.97 2.63 1.1 2.81c.14.18 1.91 2.91 4.63 4.08.65.28 1.15.45 1.54.57.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z" fill="#fff"/>
                </svg>
              </div>
              <div className="cfg-toggle-info">
                <div className="cfg-toggle-name">WhatsApp</div>
                <div className="cfg-toggle-sub">Lembretes e metas diárias</div>
              </div>
              <button className={`cfg-switch${switches.whatsapp ? ' on' : ''}`} onClick={() => toggleSwitch('whatsapp')} />
            </div>
            <div className="cfg-toggle-row">
              <div className="cfg-toggle-icon" style={{ background: '#EAF0FF' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 7l9 6 9-6"/>
                </svg>
              </div>
              <div className="cfg-toggle-info">
                <div className="cfg-toggle-name">E-mail</div>
                <div className="cfg-toggle-sub">Resumo semanal de progresso</div>
              </div>
              <button className={`cfg-switch${switches.email ? ' on' : ''}`} onClick={() => toggleSwitch('email')} />
            </div>
            <div className="cfg-toggle-row">
              <div className="cfg-toggle-icon" style={{ background: '#F5F5F5' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <div className="cfg-toggle-info">
                <div className="cfg-toggle-name">Novos conteúdos</div>
                <div className="cfg-toggle-sub">Quando novos módulos forem adicionados</div>
              </div>
              <button className={`cfg-switch${switches.novos ? ' on' : ''}`} onClick={() => toggleSwitch('novos')} />
            </div>
          </div>
        </div>

        {/* Preferências de estudo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="cfg-section-label">Preferências de estudo</div>
          <div className="cfg-card">
            <div className="cfg-prefs-block">
              <div className="cfg-prefs-label">Horário preferido de estudo</div>
              <div className="cfg-pills">
                {['Manhã', 'Tarde', 'Noite'].map(h => (
                  <button key={h} className={`cfg-pill${horario === h ? ' active' : ''}`} onClick={() => setHorario(h)}>{h}</button>
                ))}
              </div>
            </div>
            <div className="cfg-prefs-block">
              <div className="cfg-prefs-label">Quantas questões por dia?</div>
              <div className="cfg-pills">
                {['5', '10', '15', '20'].map(m => (
                  <button key={m} className={`cfg-pill${meta === m ? ' active' : ''}`} onClick={() => setMeta(m)}>{m}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Botão único de salvar */}
        <button
          className="btn-primary"
          style={{ borderRadius: '14px', fontSize: '16px' }}
          onClick={handleSaveAll}
          disabled={saving}
        >
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </button>

        {/* Rodapé */}
        <div className="cfg-footer">
          <button className="btn-danger" onClick={onLogout}>Sair da conta</button>
          <div className="cfg-version">OlimpAPP v0.1 · Feito no Brasil 🇧🇷</div>
        </div>
      </div>

      {/* Toast */}
      <div className={`cfg-toast${toastVisible ? ' show' : ''}`}>{toastMsg}</div>
    </div>
  )
}

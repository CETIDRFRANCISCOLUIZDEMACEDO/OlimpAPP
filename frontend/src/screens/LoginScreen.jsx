import { useState, useRef, useCallback } from 'react'
import OlympiadCard from '../components/OlympiadCard'
import { login, register } from '../services/authService'
import { getMe } from '../services/userService'
import { UFS } from '../data/ufs'

const OLIMPIADS = [
  { id: 'obmep', name: 'OBMEP', sub: 'Matemática' },
  { id: 'oba',   name: 'OBA',   sub: 'Astronomia' },
  { id: 'obq',   name: 'OBQ',   sub: 'Química' },
  { id: 'obf',   name: 'OBF',   sub: 'Física' },
]

export default function LoginScreen({ onNavigate, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState('entrar')
  const [loading, setLoading] = useState(false)

  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form
  const [regName, setRegName]         = useState('')
  const [regEmail, setRegEmail]       = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regState, setRegState]       = useState('')
  const [selectedOlimps, setSelectedOlimps] = useState(['obmep'])

  const [toastMsg, setToastMsg]       = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimer = useRef(null)

  const showToast = useCallback((msg) => {
    setToastMsg(msg)
    setToastVisible(true)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastVisible(false), 2800)
  }, [])

  const toggleOlimp = useCallback((id) => {
    setSelectedOlimps(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }, [])

  const errMsg = (err) =>
    err?.response?.data?.error || 'Erro de conexão. Tente novamente.'

  const handleLogin = async () => {
    if (!loginEmail.trim() || !loginPassword) {
      showToast('Preencha e-mail e senha')
      return
    }
    setLoading(true)
    try {
      await login(loginEmail.trim(), loginPassword)
      const profileData = await getMe()
      onProfileUpdate(profileData)
      onNavigate('screen-dashboard')
    } catch (err) {
      showToast(errMsg(err))
    } finally {
      setLoading(false)
    }
  }

  const handleCadastrar = async () => {
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      showToast('Preencha nome, e-mail e senha')
      return
    }
    if (regPassword.length < 6) {
      showToast('A senha deve ter pelo menos 6 caracteres')
      return
    }
    if (selectedOlimps.length === 0) {
      showToast('Selecione pelo menos uma olimpíada')
      return
    }
    setLoading(true)
    try {
      await register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        state: regState || null,
        olimpiadas: selectedOlimps,
      })
      const profileData = await getMe()
      onProfileUpdate(profileData)
      onNavigate('screen-dashboard')
    } catch (err) {
      showToast(errMsg(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="login-blob" />

      <div className="login-scroll">
        {/* Header */}
        <div className="login-header">
          <img src="/image.png" width="92" height="92" alt="OlimpAPP" style={{ objectFit: 'contain' }} />
          <div className="login-title">Olimp<span>APP</span></div>
          <div className="login-tagline">Sua jornada olímpica começa aqui</div>
        </div>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab${activeTab === 'entrar' ? ' active' : ''}`}
            onClick={() => setActiveTab('entrar')}
          >
            Entrar
          </button>
          <button
            className={`login-tab${activeTab === 'cadastrar' ? ' active' : ''}`}
            onClick={() => setActiveTab('cadastrar')}
          >
            Cadastrar
          </button>
        </div>

        {/* Form: Entrar */}
        <div className={`login-form${activeTab !== 'entrar' ? ' hidden' : ''}`} style={{ gap: '12px' }}>
          <div className="field">
            <div className="field-label">E-mail</div>
            <div className="field-input">
              <div className="field-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 7l9 6 9-6"/>
                </svg>
              </div>
              <input
                type="email"
                placeholder="seunome@escola.br"
                autoComplete="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>
          <div className="field">
            <div className="field-label">Senha</div>
            <div className="field-input">
              <div className="field-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 1 1 8 0v3"/>
                </svg>
              </div>
              <input
                type="password"
                placeholder="Sua senha"
                autoComplete="current-password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>
          <a
            href="#"
            className="login-forgot"
            onClick={e => { e.preventDefault(); showToast('Vamos te ajudar a recuperar 💪') }}
          >
            Esqueci minha senha
          </a>
          <button
            className="btn-primary"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>

        {/* Form: Cadastrar */}
        <div className={`login-form${activeTab !== 'cadastrar' ? ' hidden' : ''}`} style={{ gap: '7px' }}>
          <div className="field">
            <div className="field-label">Nome</div>
            <div className="field-input">
              <div className="field-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Como te chamam?"
                autoComplete="given-name"
                value={regName}
                onChange={e => setRegName(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="field-label">E-mail</div>
            <div className="field-input">
              <div className="field-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 7l9 6 9-6"/>
                </svg>
              </div>
              <input
                type="email"
                placeholder="seunome@escola.br"
                autoComplete="email"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="field-label">Senha</div>
            <div className="field-input">
              <div className="field-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 1 1 8 0v3"/>
                </svg>
              </div>
              <input
                type="password"
                placeholder="Crie uma senha forte"
                autoComplete="new-password"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Estado */}
          <div className="field">
            <div className="field-label">Estado</div>
            <div className="field-input" style={{ padding: '0' }}>
              <select
                className="field-select"
                value={regState}
                onChange={e => setRegState(e.target.value)}
              >
                <option value="">Selecione seu estado</option>
                {UFS.map(uf => (
                  <option key={uf.sigla} value={uf.sigla}>{uf.nome}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Olympiad selector */}
          <div style={{ marginTop: '4px' }}>
            <div className="olimp-section-label">Qual olimpíada você quer mandar bem?</div>
            <div className="olimp-grid">
              {OLIMPIADS.map(o => (
                <OlympiadCard
                  key={o.id}
                  id={o.id}
                  name={o.name}
                  sub={o.sub}
                  selected={selectedOlimps.includes(o.id)}
                  onSelect={toggleOlimp}
                />
              ))}
            </div>
          </div>

          <div style={{ marginTop: '6px' }}>
            <button
              className="btn-primary"
              onClick={handleCadastrar}
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar conta grátis'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <div className="login-footer-line" />
          <p>Feito para estudantes de <strong style={{ color: 'var(--text)', fontWeight: 700 }}>escolas públicas do Brasil</strong> 🇧🇷</p>
        </div>
      </div>

      {/* Toast */}
      <div className={`login-toast${toastVisible ? ' show' : ''}`}>{toastMsg}</div>
    </>
  )
}

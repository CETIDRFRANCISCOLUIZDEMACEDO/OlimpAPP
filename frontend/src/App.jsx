import { useState, useRef, useCallback, useEffect } from 'react'
import { isAuthenticated, logout } from './services/authService'
import { getMe } from './services/userService'
import { getProgresso } from './services/progressoService'
import { getWatchedAulas } from './services/aulasService'
import { getTotalModulos } from './services/trilhasService'
import { getConquistas } from './services/conquistasService'
import LoginScreen from './screens/LoginScreen'
import DashboardScreen from './screens/DashboardScreen'
import TrilhasScreen from './screens/TrilhasScreen'
import ModuloScreen from './screens/ModuloScreen'
import AulaVideoScreen from './screens/AulaVideoScreen'
import RankingScreen from './screens/RankingScreen'
import AulaScreen from './screens/AulaScreen'
import PerfilScreen from './screens/PerfilScreen'
import ConquistasScreen from './screens/ConquistasScreen'
import ConfiguracoesScreen from './screens/ConfiguracoesScreen'
import ForumScreen from './screens/ForumScreen'
import ForumPostScreen from './screens/ForumPostScreen'

const navMap = {
  'screen-dashboard':     'home',
  'screen-trilhas':       'trilhas',
  'screen-modulo':        'trilhas',
  'screen-aula-video':    'trilhas',
  'screen-forum':         'forum',
  'screen-forum-post':    'forum',
  'screen-perfil':        'perfil',
  'screen-ranking':       'perfil',
  'screen-conquistas':    'perfil',
  'screen-configuracoes': 'perfil',
  'screen-aula':          'trilhas',
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('screen-login')
  const [profile,        setProfile]       = useState(null)
  const [progresso,      setProgresso]     = useState([])
  const [totais,         setTotais]        = useState({})
  const [conquistas,     setConquistas]    = useState([])
  const [authChecking,   setAuthChecking]  = useState(true)
  const [currentModule,  setCurrentModule] = useState(null)
  const [currentAula,    setCurrentAula]   = useState(null)
  const [currentPost,    setCurrentPost]   = useState(null)
  const history = useRef([])

  useEffect(() => {
    const applyDeviceScale = () => {
      if (window.innerWidth <= 480) {
        document.documentElement.style.removeProperty('--device-scale')
        return
      }
      const scale = Math.min(1.35, window.innerHeight / 812)
      document.documentElement.style.setProperty('--device-scale', scale.toFixed(4))
    }
    applyDeviceScale()
    window.addEventListener('resize', applyDeviceScale)
    return () => window.removeEventListener('resize', applyDeviceScale)
  }, [])

  const refreshData = useCallback(async () => {
    if (!isAuthenticated()) return
    try {
      const [profileData, progressoData, conquistasData] = await Promise.all([getMe(), getProgresso(), getConquistas()])
      setProfile(profileData)
      setProgresso(Array.isArray(progressoData) ? progressoData : [])
      setConquistas(Array.isArray(conquistasData) ? conquistasData : [])

      const olimps = profileData?.olimpiadas ?? []
      const totaisEntries = await Promise.all(
        olimps.map(id => getTotalModulos(id).then(t => [id, t]).catch(() => [id, 0]))
      )
      setTotais(Object.fromEntries(totaisEntries))

      if (currentModule) {
        const watchedSet = await getWatchedAulas()
        setCurrentModule(prev => {
          if (!prev) return prev
          return {
            ...prev,
            aulas: prev.aulas.map(a => ({ ...a, watched: watchedSet.has(a.id) })),
          }
        })
      }
    } catch {}
  }, [currentModule])

  useEffect(() => {
    if (!isAuthenticated()) {
      setAuthChecking(false)
      return
    }
    refreshData()
      .then(() => setCurrentScreen('screen-dashboard'))
      .finally(() => setAuthChecking(false))
  }, [])

  const showScreen = useCallback(async (screenId, data = null) => {
    setCurrentScreen(prev => {
      if (prev !== screenId) history.current.push(prev)
      return screenId
    })
    if (data?.module !== undefined) setCurrentModule(data.module)
    if (data?.aula   !== undefined) setCurrentAula(data.aula)
    if (data?.post   !== undefined) setCurrentPost(data.post)
    await refreshData()
  }, [refreshData])

  const goBack = useCallback(async (fallback = 'screen-dashboard') => {
    const prev = history.current.pop()
    setCurrentScreen(prev || fallback)
    await refreshData()
  }, [refreshData])

  const handleMarkWatched = refreshData

  const handleProfileUpdate = useCallback((profileData) => {
    setProfile(profileData)
  }, [])

  const handleProgressUpdate = refreshData

  const handleLogout = useCallback(() => {
    logout()
    setProfile(null)
    history.current = []
    setCurrentScreen('screen-login')
  }, [])

  const activeNav = navMap[currentScreen]

  const screenProps = {
    onNavigate: showScreen,
    onBack: goBack,
    activeNav,
    profile,
    onProfileUpdate: handleProfileUpdate,
    onProgressUpdate: handleProgressUpdate,
    progresso,
    totais,
    conquistas,
    onLogout: handleLogout,
    onMarkWatched: handleMarkWatched,
    currentModule,
    currentAula,
    currentPost,
  }

  const screens = {
    'screen-login':          <LoginScreen {...screenProps} />,
    'screen-dashboard':      <DashboardScreen {...screenProps} />,
    'screen-trilhas':        <TrilhasScreen {...screenProps} />,
    'screen-modulo':         <ModuloScreen {...screenProps} />,
    'screen-aula-video':     <AulaVideoScreen {...screenProps} />,
    'screen-ranking':        <RankingScreen {...screenProps} />,
    'screen-aula':           <AulaScreen {...screenProps} />,
    'screen-perfil':         <PerfilScreen {...screenProps} />,
    'screen-conquistas':     <ConquistasScreen {...screenProps} />,
    'screen-configuracoes':  <ConfiguracoesScreen {...screenProps} />,
    'screen-forum':          <ForumScreen {...screenProps} />,
    'screen-forum-post':     <ForumPostScreen {...screenProps} />,
  }

  return (
    <div id="app">
      <div id="device">
        {authChecking ? (
          <div className="auth-loading">
            <div className="auth-loading-spinner" />
            <span>Carregando...</span>
          </div>
        ) : (
          Object.entries(screens).map(([id, component]) => (
            <div
              key={id}
              id={id}
              className={`screen${currentScreen === id ? ' active' : ''}`}
            >
              {component}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

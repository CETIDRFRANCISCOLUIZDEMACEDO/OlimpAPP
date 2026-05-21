export default function BottomNav({ activeTab, onNavigate }) {
  const tabs = [
    {
      id: 'home', label: 'Início', screen: 'screen-dashboard',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>
        </svg>
      ),
    },
    {
      id: 'trilhas', label: 'Trilhas', screen: 'screen-trilhas',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 20c4 0 4-7 8-7s4 7 8 7"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="13" r="2"/>
        </svg>
      ),
    },
    {
      id: 'forum', label: 'Fórum', screen: 'screen-forum',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
    {
      id: 'perfil', label: 'Perfil', screen: 'screen-perfil',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`bnav-btn${activeTab === tab.id ? ' active' : ''}`}
          data-nav={tab.id}
          onClick={() => onNavigate(tab.screen)}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

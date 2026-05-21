import ProgressBar from './ProgressBar'

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20">
    <path d="M10 2 L12.6 7.4 L18.5 8 L14.1 12 L15.3 17.8 L10 14.5 L4.7 17.8 L5.9 12 L1.5 8 L7.4 7.4 Z" fill="#F5C518" stroke="#12122A" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
)

const LockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#9CA0B6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="8" height="6" rx="1.5"/><path d="M3.5 5V3.5a2.5 2.5 0 1 1 5 0V5"/>
  </svg>
)

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-mute)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
)

const ModMeta = ({ aulaCount, concluida }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-mute)', display: 'flex', alignItems: 'center', gap: '4px' }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
      {aulaCount} aulas
    </span>
    <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--border)', display: 'inline-block' }} />
    <span style={{ fontSize: '11px', fontWeight: 700, color: concluida ? 'var(--green)' : 'var(--text-mute)', display: 'flex', alignItems: 'center', gap: '4px' }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
      {concluida ? 'Atividade concluída' : '1 atividade'}
    </span>
  </div>
)

export default function ModuleCard({ status, num, title, desc, progress, total, unlockHint, onContinue, onClick, aulaCount }) {
  const isClickable = !!onClick && status !== 'locked'
  const wrapProps = isClickable
    ? { onClick, role: 'button', style: { cursor: 'pointer' } }
    : {}

  if (status === 'done') {
    return (
      <div className="mod-done mod-clickable" {...wrapProps}>
        <div className="mod-num" style={{ color: 'var(--blue)' }}>{String(num).padStart(2, '0')}</div>
        <div className="mod-body">
          <div className="mod-title">{title}</div>
          <div className="mod-desc">{desc}</div>
          <div className="mod-stars">
            <StarIcon /><StarIcon /><StarIcon />
          </div>
          {aulaCount && <ModMeta aulaCount={aulaCount} concluida />}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
          <div className="mod-done-badge">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8 L7 12 L13 5"/>
            </svg>
            Concluído
          </div>
          {isClickable && <ChevronRight />}
        </div>
      </div>
    )
  }

  if (status === 'active') {
    return (
      <div className="mod-active mod-clickable" {...wrapProps}>
        <div className="mod-num" style={{ color: 'var(--blue)' }}>{String(num).padStart(2, '0')}</div>
        <div className="mod-body">
          <div className="mod-title">{title}</div>
          <div className="mod-desc">{desc}</div>
          {aulaCount && <ModMeta aulaCount={aulaCount} concluida={false} />}
          {!onClick && (
            <div className="mod-prog-row">
              <div className="pbar-track" style={{ flex: 1 }}>
                <div className="pbar-fill" style={{ width: `${Math.round((progress / total) * 100)}%` }} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                {progress}/{total}
              </span>
            </div>
          )}
        </div>
        {onClick ? (
          <ChevronRight />
        ) : (
          <button className="mod-btn" onClick={onContinue}>
            Continuar
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4"/>
            </svg>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="mod-locked">
      <div className="mod-num" style={{ color: '#A6A9BD' }}>{String(num).padStart(2, '0')}</div>
      <div className="mod-body">
        <div className="mod-title" style={{ color: '#A6A9BD' }}>{title}</div>
        <div className="mod-desc" style={{ color: '#A6A9BD' }}>{desc}</div>
        {aulaCount && (
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#C7CAD8', marginTop: '5px' }}>
            {aulaCount} aulas · 1 atividade
          </div>
        )}
        <div className="mod-unlock-hint">
          <LockIcon />
          {unlockHint}
        </div>
      </div>
      <div className="mod-lock-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A6A9BD" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 1 1 8 0v3"/>
        </svg>
      </div>
    </div>
  )
}

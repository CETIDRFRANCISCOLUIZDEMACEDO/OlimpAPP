const icons = {
  obmep: (size = 36) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="OBMEP">
      <rect x="2" y="2" width="36" height="36" rx="10" fill="#1A3DAA"/>
      <path d="M12 10 L 28 10 L 22 20 L 28 30 L 12 30" stroke="#F5C518" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  oba: (size = 36) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="OBA">
      <rect x="2" y="2" width="36" height="36" rx="10" fill="#1A3DAA"/>
      <circle cx="20" cy="20" r="7" fill="#F5C518"/>
      <ellipse cx="20" cy="20" rx="12" ry="4" stroke="#fff" strokeWidth="2.4" fill="none" transform="rotate(-18 20 20)"/>
      <circle cx="30" cy="11" r="1.6" fill="#fff"/>
      <circle cx="10" cy="29" r="1.2" fill="#fff"/>
    </svg>
  ),
  obq: (size = 36) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="OBQ">
      <rect x="2" y="2" width="36" height="36" rx="10" fill="#1A3DAA"/>
      <path d="M16 9 L 16 17 L 11 28 Q 10 32 14 32 L 26 32 Q 30 32 29 28 L 24 17 L 24 9" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" fill="none"/>
      <path d="M14 22 L 26 22 L 28 28 Q 29 31 26 31 L 14 31 Q 11 31 12 28 Z" fill="#F5C518"/>
      <circle cx="18" cy="27" r="1.4" fill="#fff"/>
      <circle cx="23" cy="25" r="1" fill="#fff"/>
      <line x1="14" y1="9" x2="26" y2="9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
    </svg>
  ),
  obf: (size = 36) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="OBF">
      <rect x="2" y="2" width="36" height="36" rx="10" fill="#1A3DAA"/>
      <circle cx="20" cy="20" r="3" fill="#F5C518"/>
      <ellipse cx="20" cy="20" rx="11" ry="4" stroke="#fff" strokeWidth="2.2" fill="none"/>
      <ellipse cx="20" cy="20" rx="11" ry="4" stroke="#fff" strokeWidth="2.2" fill="none" transform="rotate(60 20 20)"/>
      <ellipse cx="20" cy="20" rx="11" ry="4" stroke="#fff" strokeWidth="2.2" fill="none" transform="rotate(-60 20 20)"/>
    </svg>
  ),
}

export default function OlympiadCard({ id, name, sub, selected, onSelect, iconSize }) {
  return (
    <button
      className={`olimp-card${selected ? ' selected' : ''}`}
      data-id={id}
      onClick={() => onSelect(id)}
    >
      <div className="olimp-card-top">
        {icons[id] ? icons[id](iconSize || 36) : null}
        <div className="olimp-check">✓</div>
      </div>
      <div>
        <div className="olimp-name">{name}</div>
        <div className="olimp-sub">{sub}</div>
      </div>
    </button>
  )
}

export { icons as olympiadIcons }

export default function ProgressBar({ value, color, height, translucent }) {
  const trackStyle = {}
  const fillStyle = { width: `${value}%` }

  if (color) fillStyle.background = color
  if (height) {
    trackStyle.height = `${height}px`
    fillStyle.height = '100%'
  }

  return (
    <div className={`pbar-track${translucent ? ' pbar-translucent' : ''}`} style={trackStyle}>
      {translucent
        ? <div className="pbar-fill-white" style={{ width: `${value}%` }} />
        : <div className="pbar-fill" style={fillStyle} />
      }
    </div>
  )
}

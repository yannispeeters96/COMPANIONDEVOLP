import CanonWolf from './CanonWolf'
const items = [
  ['home', '⌂', 'Home', null],
  ['feed', '▶', 'Feed', 'creatorFeed'],
  ['live', '●', 'Live', 'liveCenter'],
  ['studio', '✦', 'Studio', 'creatorStudio'],
  ['stats', '↗', 'Analytics', 'analyticsPro'],
  ['projects', '◆', 'Projecten', 'projects'],
  ['profile', '◎', 'Profiel', 'profile'],
]

export default function Sidebar({ page, onNavigate, flags }) {
  const visibleItems = items.filter(([, , , flag]) => !flag || flags?.[flag] !== false)

  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <div className="brand-mark brand-wolf">
          <CanonWolf
            className="brand-wolf-image"
            view="front"
          />
        </div>
        <div>
          <strong>Pet BonBazaar</strong>
          <span>Creator OS · V2.2</span>
        </div>
      </div>

      <nav aria-label="Hoofdnavigatie">
        {visibleItems.map(([id, icon, label]) => (
          <button
            key={id}
            className={`nav-item ${page === id ? 'active' : ''}`}
            onClick={() => onNavigate(id)}
            aria-current={page === id ? 'page' : undefined}
            aria-label={label}
          >
            <span className="nav-icon">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="pulse-dot" />
        <div>
          <strong>Lokale modus</strong>
          <small>Data blijft op je toestel</small>
        </div>
      </div>
    </aside>
  )
}

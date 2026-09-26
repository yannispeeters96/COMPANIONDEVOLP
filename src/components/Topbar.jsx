import CanonWolf from './CanonWolf'
const labels = {
  home: ['Dashboard', 'Creator command center'],
  feed: ['Creator Feed', 'Short-form planning & performance'],
  live: ['Live Center', 'Sessies, doelen en live-notities'],
  studio: ['Creator Studio', 'Ideeën, scripts en planning'],
  stats: ['Analytics', 'TikTok-gerichte KPI’s'],
  projects: ['Projecten', 'Van idee tot release'],
  profile: ['Profiel', 'Creator-identiteit en back-up'],
}

export default function Topbar({ page, profile }) {
  const [title, subtitle] = labels[page] || labels.home
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">PET BONBAZAAR · {profile.stageName}</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-actions">
        <CanonWolf
          className="topbar-wolf"
          view="portrait"
          decorative
        />
        <a className="creator-credit" href={profile.tiktokUrl} target="_blank" rel="noreferrer">Creator {profile.handle}</a>
        <span className="version-pill">V2.2.0</span>
      </div>
    </header>
  )
}

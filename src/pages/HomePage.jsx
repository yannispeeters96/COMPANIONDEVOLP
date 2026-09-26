import MetricCard from '../components/MetricCard'
import ProgressBar from '../components/ProgressBar'

export default function HomePage({ state, onNavigate }) {
  const { stats, projects, live, profile, studio, feed } = state
  const activeProjects = projects.filter((p) => p.status !== 'Klaar')
  const leadProject = activeProjects[0] || projects[0]
  const nextDraft = studio.drafts.find((draft) => draft.status !== 'Gepubliceerd') || studio.drafts[0]

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <p className="eyebrow">CREATOR CONTROL ROOM</p>
          <h2>Welkom terug, {profile.stageName}.</h2>
          <p>Live muziek, short-form content, TikTok-groei, Studio en projecten in één snelle creator-interface.</p>
          <div className="button-row">
            <button className="primary-button" onClick={() => onNavigate('live')}>Start live workflow</button>
            <button className="secondary-button" onClick={() => onNavigate('studio')}>Open Creator Studio</button>
            <button className="ghost-button" onClick={() => onNavigate('feed')}>Bekijk feed</button>
          </div>
          <div className="credit-line">Creator credit: <a href={profile.tiktokUrl} target="_blank" rel="noreferrer">{profile.handle}</a></div>
        </div>
        <div className="hero-orb" aria-hidden="true"><span>2.2</span></div>
      </section>

      <section className="metrics-grid">
        <MetricCard label="Volgers" value={stats.followers.toLocaleString('nl-BE')} helper={`${stats.weeklyGrowth >= 0 ? '+' : ''}${stats.weeklyGrowth}% deze week`} accent />
        <MetricCard label="Views" value={stats.views.toLocaleString('nl-BE')} helper={`${stats.posts} posts geregistreerd`} />
        <MetricCard label="Engagement" value={`${stats.engagementRate}%`} helper="Handmatig / importeerbaar" />
        <MetricCard label="Gem. live kijkers" value={stats.avgViewers} helper={`Doel: ${live.viewerGoal}`} />
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-heading">
            <div><p className="eyebrow">PROJECT FOCUS</p><h3>{leadProject?.name || 'Nieuw project'}</h3></div>
            <span className="status-chip">{leadProject?.status || 'Open'}</span>
          </div>
          <p>{leadProject?.notes || 'Maak een project aan om je volgende stap zichtbaar te maken.'}</p>
          <ProgressBar value={leadProject?.progress || 0} />
          <div className="progress-caption"><span>Voortgang</span><strong>{leadProject?.progress || 0}%</strong></div>
        </article>

        <article className="panel live-panel">
          <p className="eyebrow">LIVE STATUS</p>
          <h3>{live.title}</h3>
          <p>{live.platform} · kijkersdoel {live.viewerGoal}</p>
          <div className={`live-indicator ${live.isLive ? 'on' : ''}`}><span /> {live.isLive ? 'LIVE NU' : 'Klaar voor je volgende sessie'}</div>
          <button className="secondary-button" onClick={() => onNavigate('live')}>Open Live Center</button>
        </article>

        <article className="panel">
          <p className="eyebrow">STUDIO NEXT</p>
          <h3>{nextDraft?.title || 'Nieuwe content'}</h3>
          <p>{nextDraft?.notes || 'Plan je volgende short, live teaser of zangfragment.'}</p>
          <span className="status-chip">{nextDraft?.status || 'Nieuw'}</span>
        </article>

        <article className="panel">
          <p className="eyebrow">FEED LIBRARY</p>
          <h3>{feed.items.length} creator-items</h3>
          <p>Concepten en geplande short-form content met lokale engagementvelden.</p>
          <button className="ghost-button" onClick={() => onNavigate('feed')}>Open Creator Feed</button>
        </article>
      </section>
    </div>
  )
}

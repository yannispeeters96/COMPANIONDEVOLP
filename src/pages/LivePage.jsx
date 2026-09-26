export default function LivePage({ live, onChange, onAudit }) {
  const update = (key, value) => onChange({ ...live, [key]: value })

  const toggleLive = () => {
    const nextLive = !live.isLive
    onChange({ ...live, isLive: nextLive, startedAt: nextLive ? new Date().toISOString() : null })
    onAudit?.(nextLive ? `Livesessie gestart: ${live.title}` : `Livesessie gestopt: ${live.title}`)
  }

  return (
    <div className="page-stack">
      <section className={`live-stage ${live.isLive ? 'active' : ''}`}>
        <div>
          <p className="eyebrow">LIVE CENTER</p>
          <h2>{live.isLive ? 'Je sessie is actief.' : 'Maak je livesessie startklaar.'}</h2>
          <p>{live.isLive ? 'De timercontext staat lokaal aan. TikTok zelf wordt niet automatisch bestuurd.' : 'Alle velden worden lokaal bewaard en zijn klaar voor je volgende TikTok Live.'}</p>
        </div>
        <button className={live.isLive ? 'danger-button' : 'primary-button'} onClick={toggleLive}>{live.isLive ? 'Stop livesessie' : 'Start livesessie'}</button>
      </section>

      <section className="live-kpis">
        <div className="mini-kpi"><span>Kijkersdoel</span><strong>{live.viewerGoal}</strong></div>
        <div className="mini-kpi"><span>Piek kijkers</span><strong>{live.peakViewers}</strong></div>
        <div className="mini-kpi"><span>Nieuwe volgers</span><strong>{live.newFollowers}</strong></div>
        <div className="mini-kpi"><span>Gifts</span><strong>{live.gifts}</strong></div>
      </section>

      <section className="form-grid panel">
        <label>Live titel<input value={live.title} onChange={(e) => update('title', e.target.value)} /></label>
        <label>Platform<select value={live.platform} onChange={(e) => update('platform', e.target.value)}><option>TikTok Live</option><option>Instagram Live</option><option>YouTube Live</option><option>Andere</option></select></label>
        <label>Kijkersdoel<input type="number" min="0" value={live.viewerGoal} onChange={(e) => update('viewerGoal', Number(e.target.value))} /></label>
        <label>Gespeelde songs<input type="number" min="0" value={live.songsPlayed} onChange={(e) => update('songsPlayed', Number(e.target.value))} /></label>
        <label>Piek kijkers<input type="number" min="0" value={live.peakViewers} onChange={(e) => update('peakViewers', Number(e.target.value))} /></label>
        <label>Nieuwe volgers<input type="number" min="0" value={live.newFollowers} onChange={(e) => update('newFollowers', Number(e.target.value))} /></label>
        <label>Gifts<input type="number" min="0" value={live.gifts} onChange={(e) => update('gifts', Number(e.target.value))} /></label>
        <label className="full-width">Sessienotities<textarea rows="6" value={live.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Setlist, verzoeknummers, ideeën, opvallende reacties..." /></label>
      </section>
    </div>
  )
}

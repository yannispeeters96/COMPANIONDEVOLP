import MetricCard from '../components/MetricCard'

const fields = [
  ['followers', 'Volgers'],
  ['totalLikes', 'Totaal likes'],
  ['views', 'Views'],
  ['posts', 'Posts'],
  ['comments', 'Comments'],
  ['shares', 'Shares'],
  ['saves', 'Saves'],
  ['avgViewers', 'Gem. live kijkers'],
  ['liveHours', 'Live uren'],
  ['weeklyGrowth', 'Wekelijkse groei %'],
  ['engagementRate', 'Engagement %'],
]

export default function StatsPage({ stats, onChange }) {
  const update = (key, value) => onChange({ ...stats, [key]: Number(value) || 0 })
  const interactions = stats.totalLikes + stats.comments + stats.shares + stats.saves
  const calculatedEngagement = stats.views > 0 ? ((interactions / stats.views) * 100).toFixed(2) : '0.00'

  return (
    <div className="page-stack">
      <section className="metrics-grid">
        <MetricCard label="Volgers" value={stats.followers.toLocaleString('nl-BE')} helper={`${stats.weeklyGrowth}% weekgroei`} accent />
        <MetricCard label="Views" value={stats.views.toLocaleString('nl-BE')} helper={`${stats.posts} posts`} />
        <MetricCard label="Opgegeven engagement" value={`${stats.engagementRate}%`} helper="Jouw KPI" />
        <MetricCard label="Berekend engagement" value={`${calculatedEngagement}%`} helper="(likes + reacties + shares + saves) / views" />
      </section>

      <section className="panel">
        <div className="panel-heading"><div><p className="eyebrow">CREATOR ANALYTICS</p><h3>Werk je TikTok-KPI’s bij</h3></div><span className="status-chip">Lokale data</span></div>
        <p>V2.2 heeft de analytics-interface ingebouwd. Zonder gekoppelde TikTok API vul of importeer je de waarden handmatig.</p>
        <div className="analytics-form-grid">
          {fields.map(([key, label]) => <label key={key}>{label}<input type="number" step="any" min={key === 'weeklyGrowth' ? undefined : 0} value={stats[key]} onChange={(e) => update(key, e.target.value)} /></label>)}
        </div>
      </section>

      <section className="analytics-bars panel">
        <p className="eyebrow">ENGAGEMENT MIX</p>
        {[['Likes', stats.totalLikes], ['Comments', stats.comments], ['Shares', stats.shares], ['Saves', stats.saves]].map(([label, value]) => {
          const max = Math.max(stats.totalLikes, stats.comments, stats.shares, stats.saves, 1)
          return <div className="bar-row" key={label}><span>{label}</span><div className="bar-track"><div className="bar-fill" style={{ width: `${Math.min(100, (value / max) * 100)}%` }} /></div><strong>{value.toLocaleString('nl-BE')}</strong></div>
        })}
      </section>
    </div>
  )
}

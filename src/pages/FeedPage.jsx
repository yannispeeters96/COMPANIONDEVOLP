import { useState } from 'react'

const blank = { title: '', hook: '', caption: '', status: 'Concept', category: 'Music' }

export default function FeedPage({ feed, onChange, profile }) {
  const [draft, setDraft] = useState(blank)
  const selected = feed.items.find((item) => item.id === feed.selectedId) || feed.items[0]

  const updateItem = (id, patch) => {
    onChange({ ...feed, items: feed.items.map((item) => item.id === id ? { ...item, ...patch } : item) })
  }

  const addItem = (event) => {
    event.preventDefault()
    if (!draft.title.trim()) return
    const item = {
      ...draft,
      id: globalThis.crypto?.randomUUID?.() ?? `feed-${Date.now()}`,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      bookmarked: false,
    }
    onChange({ ...feed, selectedId: item.id, items: [item, ...feed.items] })
    setDraft(blank)
  }

  return (
    <div className="feed-layout">
      <section className="feed-rail panel">
        <div className="panel-heading"><div><p className="eyebrow">SHORT-FORM LIBRARY</p><h3>Creator Feed</h3></div><span className="status-chip">{feed.items.length}</span></div>
        <div className="feed-list">
          {feed.items.map((item) => (
            <button key={item.id} className={`feed-list-item ${selected?.id === item.id ? 'active' : ''}`} onClick={() => onChange({ ...feed, selectedId: item.id })}>
              <span>{item.category}</span>
              <strong>{item.title}</strong>
              <small>{item.status}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="phone-preview-wrap">
        {selected ? (
          <article className="phone-preview">
            <div className="video-surface">
              <div className="video-gradient" />
              <div className="video-copy">
                <span className="status-chip">{selected.status}</span>
                <h2>{selected.title}</h2>
                <p>{selected.hook}</p>
                <strong>{profile.handle}</strong>
                <small>{selected.caption}</small>
              </div>
              <div className="social-stack" aria-label="Lokale engagementvelden">
                <button onClick={() => updateItem(selected.id, { likes: selected.likes + 1 })}>♥<small>{selected.likes}</small></button>
                <button onClick={() => updateItem(selected.id, { comments: selected.comments + 1 })}>◉<small>{selected.comments}</small></button>
                <button onClick={() => updateItem(selected.id, { shares: selected.shares + 1 })}>↗<small>{selected.shares}</small></button>
                <button className={selected.bookmarked ? 'active' : ''} onClick={() => updateItem(selected.id, { bookmarked: !selected.bookmarked })}>◆</button>
              </div>
            </div>
            <div className="feed-metrics">
              <label>Views<input type="number" min="0" value={selected.views} onChange={(e) => updateItem(selected.id, { views: Number(e.target.value) })} /></label>
              <label>Status<select value={selected.status} onChange={(e) => updateItem(selected.id, { status: e.target.value })}><option>Concept</option><option>Gepland</option><option>Gepubliceerd</option><option>Archief</option></select></label>
            </div>
          </article>
        ) : <div className="empty-state">Voeg je eerste creator-item toe.</div>}
      </section>

      <form className="panel quick-form" onSubmit={addItem}>
        <p className="eyebrow">NIEUW ITEM</p>
        <h3>Short-form idee</h3>
        <label>Titel<input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
        <label>Hook<input value={draft.hook} onChange={(e) => setDraft({ ...draft, hook: e.target.value })} /></label>
        <label>Caption<textarea rows="3" value={draft.caption} onChange={(e) => setDraft({ ...draft, caption: e.target.value })} /></label>
        <label>Categorie<select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}><option>Music</option><option>Live</option><option>BTS</option><option>Community</option><option>Promo</option></select></label>
        <button className="primary-button" type="submit">Voeg aan feed toe</button>
      </form>
    </div>
  )
}

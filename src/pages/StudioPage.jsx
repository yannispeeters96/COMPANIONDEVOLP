import { useState } from 'react'

const blank = { title: '', format: 'Short video', status: 'Idee', scheduledFor: '', notes: '' }

export default function StudioPage({ studio, onChange }) {
  const [draft, setDraft] = useState(blank)
  const [pillar, setPillar] = useState('')

  const addDraft = (event) => {
    event.preventDefault()
    if (!draft.title.trim()) return
    onChange({ ...studio, drafts: [{ ...draft, id: globalThis.crypto?.randomUUID?.() ?? `draft-${Date.now()}` }, ...studio.drafts] })
    setDraft(blank)
  }

  const updateDraft = (id, patch) => onChange({ ...studio, drafts: studio.drafts.map((item) => item.id === id ? { ...item, ...patch } : item) })
  const removeDraft = (id) => onChange({ ...studio, drafts: studio.drafts.filter((item) => item.id !== id) })
  const addPillar = () => {
    const value = pillar.trim()
    if (!value || studio.contentPillars.includes(value)) return
    onChange({ ...studio, contentPillars: [...studio.contentPillars, value] })
    setPillar('')
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-heading"><div><p className="eyebrow">CONTENT PILLARS</p><h3>Jouw vaste creator-rubrieken</h3></div></div>
        <div className="pill-row">{studio.contentPillars.map((item) => <span key={item} className="content-pill">{item}</span>)}</div>
        <div className="inline-add"><input aria-label="Nieuwe content pillar" value={pillar} onChange={(e) => setPillar(e.target.value)} placeholder="Bijv. Song requests" /><button className="secondary-button" type="button" onClick={addPillar}>Toevoegen</button></div>
      </section>

      <form className="panel project-form" onSubmit={addDraft}>
        <div className="panel-heading"><div><p className="eyebrow">CREATOR STUDIO</p><h3>Nieuw contentstuk</h3></div></div>
        <div className="form-grid">
          <label>Titel<input aria-label="Contenttitel" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
          <label>Format<select value={draft.format} onChange={(e) => setDraft({ ...draft, format: e.target.value })}><option>Short video</option><option>Live teaser</option><option>Foto</option><option>Story</option><option>Long video</option></select></label>
          <label>Status<select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}><option>Idee</option><option>Script</option><option>Opname</option><option>Edit</option><option>Gepland</option><option>Gepubliceerd</option></select></label>
          <label>Planning<input type="datetime-local" value={draft.scheduledFor} onChange={(e) => setDraft({ ...draft, scheduledFor: e.target.value })} /></label>
          <label className="full-width">Notities<textarea rows="4" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></label>
        </div>
        <button className="primary-button" type="submit">Opslaan in Studio</button>
      </form>

      <section className="studio-board">
        {studio.drafts.map((item) => (
          <article className="studio-card" key={item.id}>
            <div className="panel-heading"><div><span className="status-chip">{item.status}</span><h3>{item.title}</h3></div><button className="icon-button" aria-label={`Verwijder ${item.title}`} onClick={() => removeDraft(item.id)}>×</button></div>
            <p>{item.notes || 'Geen notities.'}</p>
            <small>{item.format}{item.scheduledFor ? ` · ${new Date(item.scheduledFor).toLocaleString('nl-BE')}` : ''}</small>
            <select value={item.status} onChange={(e) => updateDraft(item.id, { status: e.target.value })}><option>Idee</option><option>Script</option><option>Opname</option><option>Edit</option><option>Gepland</option><option>Gepubliceerd</option></select>
          </article>
        ))}
      </section>
    </div>
  )
}

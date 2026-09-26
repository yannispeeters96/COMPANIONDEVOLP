import { useState } from 'react'
import ProgressBar from '../components/ProgressBar'

const emptyProject = { name: '', status: 'Actief', progress: 0, targetDate: '', notes: '' }

export default function ProjectsPage({ projects, onChange }) {
  const [draft, setDraft] = useState(emptyProject)

  const addProject = (e) => {
    e.preventDefault()
    if (!draft.name.trim()) return
    onChange([...projects, { ...draft, id: globalThis.crypto?.randomUUID?.() ?? `project-${Date.now()}-${Math.random().toString(16).slice(2)}` }])
    setDraft(emptyProject)
  }

  const updateProject = (id, patch) => {
    onChange(projects.map((project) => project.id === id ? { ...project, ...patch } : project))
  }

  const removeProject = (id) => onChange(projects.filter((project) => project.id !== id))

  return (
    <div className="page-stack">
      <form className="panel project-form" onSubmit={addProject}>
        <div className="panel-heading"><div><p className="eyebrow">NIEUW</p><h3>Voeg een project toe</h3></div></div>
        <div className="form-grid">
          <label>Projectnaam<input aria-label="Projectnaam" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Bijv. Nieuwe live-set" /></label>
          <label>Status<select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}><option>Actief</option><option>Gepland</option><option>On hold</option><option>Klaar</option></select></label>
          <label>Voortgang<input type="number" min="0" max="100" value={draft.progress} onChange={(e) => setDraft({ ...draft, progress: Number(e.target.value) })} /></label>
          <label>Streefdatum<input type="date" value={draft.targetDate} onChange={(e) => setDraft({ ...draft, targetDate: e.target.value })} /></label>
          <label className="full-width">Notities<textarea rows="3" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></label>
        </div>
        <button className="primary-button" type="submit">Project toevoegen</button>
      </form>

      <section className="project-list">
        {projects.map((project) => (
          <article className="project-card" key={project.id}>
            <div className="panel-heading">
              <div><span className="status-chip">{project.status}</span><h3>{project.name}</h3></div>
              <button className="icon-button" aria-label={`Verwijder ${project.name}`} onClick={() => removeProject(project.id)}>×</button>
            </div>
            <p>{project.notes || 'Nog geen notities.'}</p>
            <ProgressBar value={project.progress} />
            <div className="project-controls">
              <label>Voortgang <input type="range" min="0" max="100" value={project.progress} onChange={(e) => updateProject(project.id, { progress: Number(e.target.value) })} /></label>
              <strong>{project.progress}%</strong>
            </div>
          </article>
        ))}
        {projects.length === 0 && <div className="empty-state">Nog geen projecten. Geef je volgende idee hier een landingsbaan.</div>}
      </section>
    </div>
  )
}

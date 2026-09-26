import { useRef, useState } from 'react'
import { availableSoundThemes, playSound, themeSoundName } from '../sounds'

export default function ProfilePage({ profile, preferences, fullState, onProfileChange, onPreferencesChange, onImport, onReset }) {
  const inputRef = useRef(null)
  const [message, setMessage] = useState('')
  const update = (key, value) => onProfileChange({ ...profile, [key]: value })
  const soundPrefs = preferences || { uiSounds: true, soundTheme: 'dark' }

  const exportData = () => {
    const safeState = {
      ...fullState,
      admin: { ...fullState.admin, passwordHash: null, passwordSalt: null },
    }
    const blob = new Blob([JSON.stringify(safeState, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `PetBonBazaar-V2.2-backup-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    setMessage('Back-up aangemaakt. God Mode-wachtwoord is bewust niet geëxporteerd.')
  }

  const importData = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      onImport(data)
      setMessage('Back-up succesvol geïmporteerd.')
    } catch {
      setMessage('Dit bestand is geen geldige Pet BonBazaar-back-up.')
    } finally {
      event.target.value = ''
    }
  }

  const setSounds = (enabled) => {
    onPreferencesChange({ ...soundPrefs, uiSounds: enabled })
    if (enabled) playSound('notifySoft', true, 0.18)
  }

  const setSoundTheme = (soundTheme) => {
    const next = { ...soundPrefs, soundTheme }
    onPreferencesChange(next)
    playSound(themeSoundName(soundTheme), next.uiSounds, 0.16)
  }

  return (
    <div className="page-stack">
      <section className="profile-grid">
        <article className="profile-card">
          <div className="avatar-ring">{profile.stageName.slice(0, 2).toUpperCase()}</div>
          <h2>{profile.stageName}</h2>
          <a href={profile.tiktokUrl} target="_blank" rel="noreferrer">{profile.handle}</a>
          <span className="status-chip">Live music creator</span>
        </article>

        <article className="panel">
          <div className="form-grid">
            <label>Artiestennaam<input value={profile.stageName} onChange={(e) => update('stageName', e.target.value)} /></label>
            <label>TikTok-handle<input value={profile.handle} onChange={(e) => update('handle', e.target.value)} /></label>
            <label>TikTok-link<input value={profile.tiktokUrl} onChange={(e) => update('tiktokUrl', e.target.value)} /></label>
            <label>Stad<input value={profile.city} onChange={(e) => update('city', e.target.value)} /></label>
            <label className="full-width">Hoofddoel<input value={profile.goal} onChange={(e) => update('goal', e.target.value)} /></label>
            <label className="full-width">Bio<textarea rows="5" value={profile.bio} onChange={(e) => update('bio', e.target.value)} /></label>
          </div>
        </article>
      </section>

      <section className="panel sound-settings">
        <div><p className="eyebrow">APP SOUND</p><h3>Interfacegeluiden</h3><p>Alle BonBazaar taps en themes zitten lokaal in de build. Je kunt ze altijd uitschakelen.</p></div>
        <div className="form-grid">
          <label className="toggle-row"><span><strong>Tap- en meldingsgeluiden</strong><small>{soundPrefs.uiSounds ? 'ingeschakeld' : 'uitgeschakeld'}</small></span><input aria-label="Interfacegeluiden" type="checkbox" checked={soundPrefs.uiSounds} onChange={(e) => setSounds(e.target.checked)} /></label>
          <label>Sound theme<select aria-label="Sound theme" value={soundPrefs.soundTheme} onChange={(e) => setSoundTheme(e.target.value)}>{availableSoundThemes.map((theme) => <option key={theme.value} value={theme.value}>{theme.label}</option>)}</select></label>
        </div>
      </section>

      <section className="panel backup-panel">
        <div><p className="eyebrow">DATA CONTROL</p><h3>Lokale back-up</h3><p>Exporteer je volledige creator-data naar JSON of zet een eerdere V2.1/V2.2-back-up terug.</p></div>
        <div className="button-row">
          <button className="secondary-button" onClick={exportData}>Exporteer back-up</button>
          <button className="ghost-button" onClick={() => inputRef.current?.click()}>Importeer back-up</button>
          <input ref={inputRef} className="visually-hidden" type="file" accept="application/json,.json" onChange={importData} />
          <button className="danger-button subtle" onClick={onReset}>Reset lokale data</button>
        </div>
        {message && <p className="success-message">{message}</p>}
      </section>
    </div>
  )
}

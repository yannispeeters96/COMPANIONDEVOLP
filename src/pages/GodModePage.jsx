import { useMemo, useState } from 'react'

function bytesToHex(buffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function makeSalt() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return bytesToHex(bytes)
}

async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle || !salt || typeof salt !== 'string') throw new Error('secure-crypto-unavailable')
  const encoder = new TextEncoder()
  const baseKey = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const saltBytes = new Uint8Array(salt.match(/.{1,2}/g).map((value) => parseInt(value, 16)))
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: saltBytes, iterations: 120000, hash: 'SHA-256' }, baseKey, 256)
  return bytesToHex(bits)
}

export default function GodModePage({ admin, fullState, onChange, onAudit, onReset }) {
  const [adminIdInput, setAdminIdInput] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [message, setMessage] = useState('')

  const allEnabled = useMemo(() => Object.values(admin.flags).every(Boolean), [admin.flags])

  const setupPassword = async (event) => {
    event.preventDefault()
    if (adminIdInput.trim() !== admin.id) return setMessage('Developer ID niet herkend.')
    if (password.length < 8) return setMessage('Gebruik minstens 8 tekens.')
    if (password !== confirmPassword) return setMessage('De wachtwoorden komen niet overeen.')
    if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) return setMessage('Veilige lokale crypto is niet beschikbaar in deze omgeving.')
    const salt = makeSalt()
    const passwordHash = await hashPassword(password, salt)
    onChange({ ...admin, passwordSalt: salt, passwordHash })
    onAudit?.('God Mode-wachtwoord ingesteld')
    setAdminIdInput('')
    setPassword('')
    setConfirmPassword('')
    setUnlocked(true)
    setMessage('Superadmin-console ontgrendeld.')
  }

  const login = async (event) => {
    event.preventDefault()
    if (adminIdInput.trim() !== admin.id) return setMessage('Developer ID niet herkend.')
    try {
      const candidate = await hashPassword(password, admin.passwordSalt)
      if (candidate !== admin.passwordHash) return setMessage('Onjuist wachtwoord.')
    } catch {
      return setMessage('Veilige lokale crypto is niet beschikbaar of de lokale adminconfig is beschadigd.')
    }
    setAdminIdInput('')
    setPassword('')
    setUnlocked(true)
    setMessage('Superadmin-console ontgrendeld.')
  }

  const setFlag = (key, value) => {
    onChange({ ...admin, flags: { ...admin.flags, [key]: value } })
    onAudit?.(`Feature flag ${key}: ${value ? 'aan' : 'uit'}`)
  }

  const unlockAll = () => {
    onChange({ ...admin, godModeEnabled: true, flags: Object.fromEntries(Object.keys(admin.flags).map((key) => [key, true])) })
    onAudit?.('God Mode: alle Pet BonBazaar-features ontgrendeld')
  }

  const rotatePassword = () => {
    onChange({ ...admin, passwordHash: null, passwordSalt: null })
    setUnlocked(false)
    setMessage('Wachtwoord verwijderd. Stel nu een nieuw lokaal wachtwoord in.')
    onAudit?.('God Mode-wachtwoord gereset')
  }

  const downloadDiagnostics = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      version: fullState.meta.version,
      admin: { id: admin.id, role: admin.role, access: admin.access, godModeEnabled: admin.godModeEnabled, legacyMode: admin.legacyMode, flags: admin.flags },
      counts: { projects: fullState.projects.length, feedItems: fullState.feed.items.length, studioDrafts: fullState.studio.drafts.length, auditEntries: admin.audit.length },
      userAgent: navigator.userAgent,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `PetBonBazaar-diagnostics-${Date.now()}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    onAudit?.('Diagnostiekbestand geëxporteerd')
  }

  if (!admin.passwordHash) {
    return (
      <div className="page-stack">
        <section className="god-hero"><div><p className="eyebrow">FIRST-RUN SECURITY</p><h2>God Mode is ingebouwd.</h2><p>Bevestig je vaste Developer ID en stel daarna een lokaal wachtwoord in. Er staat bewust geen standaardwachtwoord in de broncode.</p></div><span>⚡</span></section>
        <form className="panel auth-card" onSubmit={setupPassword}>
          <h3>Superadmin activeren</h3>
          <label>Admin ID<input aria-label="Admin ID" autoComplete="username" value={adminIdInput} onChange={(e) => setAdminIdInput(e.target.value)} /></label>
          <label>Nieuw wachtwoord<input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          <label>Bevestig wachtwoord<input type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></label>
          <button className="primary-button" type="submit">Activeer veilige God Mode</button>
          {message && <p className="success-message">{message}</p>}
        </form>
      </div>
    )
  }

  if (!unlocked) {
    return (
      <div className="page-stack">
        <section className="god-hero"><div><p className="eyebrow">SUPERADMIN</p><h2>{admin.id}</h2><p>{admin.role} · {admin.access} access · lokale authenticatie</p></div><span>⚡</span></section>
        <form className="panel auth-card" onSubmit={login}><h3>Ontgrendel console</h3><label>Admin ID<input aria-label="Admin ID" autoComplete="username" value={adminIdInput} onChange={(e) => setAdminIdInput(e.target.value)} /></label><label>Wachtwoord<input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label><button className="primary-button" type="submit">Ontgrendel</button>{message && <p className="success-message">{message}</p>}</form>
      </div>
    )
  }

  return (
    <div className="page-stack">
      <section className="god-hero unlocked"><div><p className="eyebrow">GOD MODE · UNLOCKED</p><h2>{admin.id}</h2><p>{admin.role} + alle appfeatures · legacy compatibility · lokale developer controls</p></div><span>⚡</span></section>

      <section className="god-grid">
        <article className="panel">
          <div className="panel-heading"><div><p className="eyebrow">FEATURE FLAGS</p><h3>Appmodules</h3></div><button className="secondary-button" onClick={unlockAll} disabled={allEnabled}>Unlock all</button></div>
          <div className="toggle-list">
            {Object.entries(admin.flags).map(([key, enabled]) => <label className="toggle-row" key={key}><span><strong>{key}</strong><small>{enabled ? 'ingeschakeld' : 'uitgeschakeld'}</small></span><input type="checkbox" checked={enabled} onChange={(e) => setFlag(key, e.target.checked)} /></label>)}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">SYSTEM MODES</p><h3>Runtime</h3>
          <label className="toggle-row"><span><strong>God Mode</strong><small>In-app power-userlaag</small></span><input type="checkbox" checked={admin.godModeEnabled} onChange={(e) => { onChange({ ...admin, godModeEnabled: e.target.checked }); onAudit?.(`God Mode ${e.target.checked ? 'aan' : 'uit'}`) }} /></label>
          <label className="toggle-row"><span><strong>Legacy Mode</strong><small>V2.1 compatibiliteitslaag</small></span><input type="checkbox" checked={admin.legacyMode} onChange={(e) => { onChange({ ...admin, legacyMode: e.target.checked }); onAudit?.(`Legacy Mode ${e.target.checked ? 'aan' : 'uit'}`) }} /></label>
          <div className="button-row"><button className="secondary-button" onClick={downloadDiagnostics}>Exporteer diagnostiek</button><button className="ghost-button" onClick={rotatePassword}>Roteer wachtwoord</button></div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading"><div><p className="eyebrow">AUDIT LOG</p><h3>Laatste beheeracties</h3></div><span className="status-chip">{admin.audit.length}</span></div>
        <div className="audit-log">{admin.audit.length ? admin.audit.map((entry) => <div key={entry.id}><time>{new Date(entry.at).toLocaleString('nl-BE')}</time><span>{entry.action}</span></div>) : <p>Geen logregels.</p>}</div>
      </section>

      <section className="panel danger-zone"><p className="eyebrow">DANGER ZONE</p><h3>Lokale appdata</h3><p>Dit wist alleen de lokaal opgeslagen Pet BonBazaar-data. Windows/Android-beveiliging of externe accounts worden nooit omzeild.</p><button className="danger-button" onClick={onReset}>Reset volledige lokale appdata</button></section>
    </div>
  )
}

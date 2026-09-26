import { useState } from 'react'
import GodModePage from '../pages/GodModePage'
import { playSound } from '../sounds'

export default function DevLegacyWindow({ admin, fullState, soundEnabled, onChange, onAudit, onReset, onClose }) {
  const [popped, setPopped] = useState(false)

  const close = () => {
    playSound('gmClose', soundEnabled)
    onClose()
  }

  const togglePop = () => {
    setPopped((value) => !value)
    playSound('tapGlass', soundEnabled)
  }

  return (
    <div className={`devlegacy-backdrop ${popped ? 'popped' : ''}`} role="dialog" aria-modal="true" aria-label="devLegacy developer console">
      <section className="devlegacy-window">
        <header className="devlegacy-titlebar">
          <div>
            <p className="eyebrow">DEV ONLY</p>
            <strong>+devLegacy</strong>
            <small>Trigger: yannis · beveiligde devconsole</small>
          </div>
          <div className="button-row">
            <button className="ghost-button" type="button" onClick={togglePop}>{popped ? 'Dock terug' : 'Pop-out'}</button>
            <button className="icon-button" type="button" aria-label="Sluit devLegacy" onClick={close}>×</button>
          </div>
        </header>
        <div className="devlegacy-scroll">
          <GodModePage admin={admin} fullState={fullState} onChange={onChange} onAudit={onAudit} onReset={onReset} />
        </div>
      </section>
    </div>
  )
}

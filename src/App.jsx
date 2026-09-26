import { useEffect, useMemo, useRef, useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import DevLegacyWindow from './components/DevLegacyWindow'
import HomePage from './pages/HomePage'
import FeedPage from './pages/FeedPage'
import LivePage from './pages/LivePage'
import StudioPage from './pages/StudioPage'
import StatsPage from './pages/StatsPage'
import ProjectsPage from './pages/ProjectsPage'
import ProfilePage from './pages/ProfilePage'
import { loadState, normalizeState, resetState, saveState } from './storage'
import { playSound } from './sounds'
import { advanceDevShortcut } from './devShortcut'

export default function App() {
  const [page, setPage] = useState('home')
  const [devLegacyOpen, setDevLegacyOpen] = useState(false)
  const shortcutRef = useRef({ step: 0, at: 0 })
  const [state, setState] = useState(() => {
    const loaded = loadState()
    if (import.meta.env.VITE_GOD_MODE === 'true') {
      loaded.admin.godModeEnabled = true
      loaded.admin.flags = Object.fromEntries(Object.keys(loaded.admin.flags).map((key) => [key, true]))
    }
    return loaded
  })

  const soundEnabled = state.preferences?.uiSounds !== false

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    document.documentElement.dataset.legacyMode = state.admin.legacyMode ? 'on' : 'off'
    document.documentElement.dataset.godMode = state.admin.godModeEnabled ? 'on' : 'off'
  }, [state.admin.legacyMode, state.admin.godModeEnabled])

  useEffect(() => {
    const handleShortcut = (event) => {
      const result = advanceDevShortcut(shortcutRef.current, event.key)
      shortcutRef.current = result.state
      if (result.triggered) {
        event.preventDefault()
        setDevLegacyOpen(true)
        playSound('gmPopup', soundEnabled)
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [soundEnabled])

  useEffect(() => {
    const handleTap = (event) => {
      if (!event.target?.closest?.('button')) return
      playSound('tapGlass', soundEnabled, 0.18)
    }
    document.addEventListener('click', handleTap)
    return () => document.removeEventListener('click', handleTap)
  }, [soundEnabled])

  const patch = (key, value) => setState((current) => ({ ...current, [key]: value }))

  const addAudit = (action) => {
    setState((current) => ({
      ...current,
      admin: {
        ...current.admin,
        audit: [
          { id: `audit-${Date.now()}-${Math.random().toString(16).slice(2)}`, at: new Date().toISOString(), action },
          ...current.admin.audit,
        ].slice(0, 100),
      },
    }))
  }

  const navigate = (nextPage) => {
    setPage(nextPage)
    playSound('navSwipe', soundEnabled, 0.16)
  }

  const handleReset = () => {
    const confirmed = window.confirm('Alle lokaal opgeslagen Pet BonBazaar-data resetten?')
    if (!confirmed) return
    setState(resetState())
    setPage('home')
    setDevLegacyOpen(false)
  }

  const featurePages = useMemo(() => ({
    feed: state.admin.flags.creatorFeed,
    live: state.admin.flags.liveCenter,
    studio: state.admin.flags.creatorStudio,
    stats: state.admin.flags.analyticsPro,
    projects: state.admin.flags.projects,
    profile: state.admin.flags.profile,
  }), [state.admin.flags])

  useEffect(() => {
    if (page !== 'home' && featurePages[page] === false) setPage('home')
  }, [page, featurePages])

  return (
    <>
      <div className="app-shell">
        <Sidebar page={page} onNavigate={navigate} flags={state.admin.flags} />
        <main className="main-area">
          <Topbar page={page} profile={state.profile} />
          <div className="content-area">
            {page === 'home' && <HomePage state={state} onNavigate={navigate} />}
            {page === 'feed' && <FeedPage feed={state.feed} onChange={(value) => patch('feed', value)} profile={state.profile} />}
            {page === 'live' && <LivePage live={state.live} onChange={(value) => patch('live', value)} onAudit={addAudit} />}
            {page === 'studio' && <StudioPage studio={state.studio} onChange={(value) => patch('studio', value)} />}
            {page === 'stats' && <StatsPage stats={state.stats} onChange={(value) => patch('stats', value)} />}
            {page === 'projects' && <ProjectsPage projects={state.projects} onChange={(value) => patch('projects', value)} />}
            {page === 'profile' && (
              <ProfilePage
                profile={state.profile}
                preferences={state.preferences}
                fullState={state}
                onProfileChange={(value) => patch('profile', value)}
                onPreferencesChange={(value) => patch('preferences', value)}
                onImport={(data) => {
                  setState(normalizeState(data))
                  addAudit('Lokale back-up geïmporteerd')
                }}
                onReset={handleReset}
              />
            )}
          </div>
        </main>
      </div>

      {devLegacyOpen && (
        <DevLegacyWindow
          admin={state.admin}
          fullState={state}
          soundEnabled={soundEnabled}
          onChange={(admin) => patch('admin', admin)}
          onAudit={addAudit}
          onReset={handleReset}
          onClose={() => setDevLegacyOpen(false)}
        />
      )}
    </>
  )
}

import { beforeEach, describe, expect, it } from 'vitest'
import { LEGACY_STORAGE_KEYS, STORAGE_KEY, loadState, normalizeState, resetState, saveState } from '../storage'

describe('lokale state en dev-beveiliging', () => {
  beforeEach(() => localStorage.clear())

  it('laat een import de vaste developer-identiteit niet overschrijven', () => {
    const normalized = normalizeState({ admin: { id: 'ander-account', role: 'guest', access: 'none' } })
    expect(normalized.admin.id).toBe('bonbazaar-admin.dev')
    expect(normalized.admin.role).toBe('superadmin')
    expect(normalized.admin.access).toBe('full')
  })

  it('migreert lokale V2.1-data naar de V2.2 storage key', () => {
    localStorage.setItem(LEGACY_STORAGE_KEYS[0], JSON.stringify({ profile: { stageName: 'Legacy Artist' }, projects: [] }))
    const state = loadState()
    expect(state.profile.stageName).toBe('Legacy Artist')
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
  })

  it('kan state opslaan en veilig resetten', () => {
    const state = normalizeState({ preferences: { uiSounds: false, soundTheme: 'neon' } })
    expect(saveState(state)).toBe(true)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).preferences.soundTheme).toBe('neon')
    const fresh = resetState()
    expect(fresh.meta.version).toBe('2.2.0')
    expect(fresh.admin.id).toBe('bonbazaar-admin.dev')
  })
})

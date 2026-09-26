import { describe, expect, it } from 'vitest'
import { advanceDevShortcut, DEV_SHORTCUT_TRIGGER } from '../devShortcut'

describe('devLegacy sneltoets', () => {
  it('activeert op het woord yannis, hoofdletterongevoelig', () => {
    let state = { buffer: '' }
    for (const key of 'Yanni') {
      const result = advanceDevShortcut(state, key)
      state = result.state
      expect(result.triggered).toBe(false)
    }
    const result = advanceDevShortcut(state, 's')
    expect(result.triggered).toBe(true)
    expect(result.state.buffer).toBe('')
  })

  it('weigert oude GM Enter-combinatie en niet-lettertoetsen', () => {
    let state = { buffer: '' }
    for (const key of ['G', 'M', 'Enter']) {
      const result = advanceDevShortcut(state, key)
      state = result.state
      expect(result.triggered).toBe(false)
    }
    expect(DEV_SHORTCUT_TRIGGER).toBe('yannis')
  })
})

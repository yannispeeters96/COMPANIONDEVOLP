export const DEV_SHORTCUT_TRIGGER = 'yannis'
export const DEV_SHORTCUT_BUFFER_LIMIT = DEV_SHORTCUT_TRIGGER.length

export function advanceDevShortcut(current, key) {
  const state = current && typeof current === 'object' ? current : { buffer: '' }

  if (typeof key !== 'string' || key.length !== 1) return { state, triggered: false }

  const nextBuffer = `${state.buffer || ''}${key.toLowerCase()}`.slice(-DEV_SHORTCUT_BUFFER_LIMIT)
  const triggered = nextBuffer === DEV_SHORTCUT_TRIGGER

  return { state: { buffer: triggered ? '' : nextBuffer }, triggered }
}

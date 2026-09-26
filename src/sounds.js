const SOUND_FILES = {
  tapGlass: 'tap_glass.wav',
  tapPop: 'tap_pop.wav',
  tapDeep: 'tap_deep.wav',
  navSwipe: 'nav_swipe.wav',
  notifySoft: 'notify_soft.wav',
  notifyPriority: 'notify_priority.wav',
  messageIn: 'message_in.wav',
  uploadStart: 'upload_start.wav',
  uploadDone: 'upload_done.wav',
  publish: 'publish.wav',
  like: 'like.wav',
  follower: 'follower.wav',
  gift: 'gift.wav',
  milestone: 'milestone.wav',
  liveEnter: 'live_enter.wav',
  liveExit: 'live_exit.wav',
  recordStart: 'record_start.wav',
  recordStop: 'record_stop.wav',
  gmUnlock: 'gm_unlock.wav',
  gmPopup: 'gm_popup.wav',
  gmClose: 'gm_close.wav',
  themeDark: 'theme_dark.wav',
  themeNeon: 'theme_neon.wav',
  themeLive: 'theme_live.wav',
}

const cache = new Map()

function soundUrl(file) {
  const base = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : './'
  return `${base}sounds/${file}`
}

export function playSound(name, enabled = true, volume = 0.28) {
  if (!enabled || typeof Audio === 'undefined') return
  const file = SOUND_FILES[name]
  if (!file) return

  try {
    const audio = cache.get(name) || new Audio(soundUrl(file))
    cache.set(name, audio)
    audio.volume = Math.max(0, Math.min(1, volume))
    audio.currentTime = 0
    const pending = audio.play()
    pending?.catch?.(() => {})
  } catch {
    // Audio is cosmetic. Never let a blocked/unsupported sound break the app.
  }
}

export function themeSoundName(theme) {
  if (theme === 'neon') return 'themeNeon'
  if (theme === 'live') return 'themeLive'
  return 'themeDark'
}

export const availableSoundThemes = [
  { value: 'dark', label: 'Dark' },
  { value: 'neon', label: 'Neon' },
  { value: 'live', label: 'Live Mode' },
]

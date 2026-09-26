export const STORAGE_KEY = 'petbonbazaar.v2.2.state'
export const LEGACY_STORAGE_KEYS = ['petbonbazaar.v2.1.state']

export const defaultState = {
  meta: {
    version: '2.2.0',
    dataVersion: 3,
    installedAt: null,
  },
  preferences: {
    uiSounds: true,
    soundTheme: 'dark',
  },
  profile: {
    stageName: 'BonBazaar',
    handle: '@.yannispeeters',
    tiktokUrl: 'https://www.tiktok.com/@.yannispeeters',
    bio: 'Live music, creativiteit en groei in één creator dashboard.',
    city: 'Antwerpen',
    goal: 'Een sterke TikTok Live-community uitbouwen.',
  },
  live: {
    title: 'BonBazaar Live',
    platform: 'TikTok Live',
    viewerGoal: 250,
    songsPlayed: 0,
    notes: '',
    isLive: false,
    startedAt: null,
    peakViewers: 0,
    newFollowers: 0,
    gifts: 0,
  },
  stats: {
    followers: 0,
    totalLikes: 0,
    liveHours: 0,
    avgViewers: 0,
    weeklyGrowth: 0,
    views: 0,
    posts: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    engagementRate: 0,
  },
  projects: [
    {
      id: 'v22-launch',
      name: 'Pet BonBazaar V2.2',
      status: 'Actief',
      progress: 90,
      targetDate: '',
      notes: 'Creator OS, analytics, Studio, feed en God Mode upgrade.',
    },
  ],
  feed: {
    selectedId: 'feed-1',
    items: [
      {
        id: 'feed-1',
        title: 'Live zangmoment',
        hook: 'Eerste 2 seconden: meteen de sterkste noot.',
        caption: 'Van repetitie naar live. 🎤',
        status: 'Concept',
        category: 'Music',
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        bookmarked: false,
      },
      {
        id: 'feed-2',
        title: 'Behind the scenes',
        hook: 'Wat gebeurt er 5 minuten voor de live?',
        caption: 'Creator setup in real life.',
        status: 'Gepland',
        category: 'BTS',
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        bookmarked: true,
      },
    ],
  },
  studio: {
    contentPillars: ['Live vocals', 'Song requests', 'Behind the scenes'],
    drafts: [
      {
        id: 'draft-1',
        title: 'Live teaser',
        format: 'Short video',
        status: 'Script',
        scheduledFor: '',
        notes: 'Hook + 15 seconden zang + CTA naar volgende live.',
      },
    ],
  },
  admin: {
    id: 'bonbazaar-admin.dev',
    role: 'superadmin',
    access: 'full',
    godModeEnabled: true,
    legacyMode: true,
    passwordHash: null,
    passwordSalt: null,
    flags: {
      creatorFeed: true,
      liveCenter: true,
      creatorStudio: true,
      analyticsPro: true,
      projects: true,
      profile: true,
      creatorCredit: true,
      experimental: true,
    },
    audit: [
      {
        id: 'audit-install',
        at: new Date(0).toISOString(),
        action: 'V2.2 God Mode-configuratie aanwezig',
      },
    ],
  },
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export function normalizeState(data) {
  const input = data && typeof data === 'object' ? data : {}
  return {
    ...clone(defaultState),
    ...input,
    meta: { ...defaultState.meta, ...(input.meta || {}), version: '2.2.0', dataVersion: 3 },
    preferences: { ...defaultState.preferences, ...(input.preferences || {}) },
    profile: { ...defaultState.profile, ...(input.profile || {}) },
    live: { ...defaultState.live, ...(input.live || {}) },
    stats: { ...defaultState.stats, ...(input.stats || {}) },
    projects: Array.isArray(input.projects) ? input.projects : clone(defaultState.projects),
    feed: {
      ...defaultState.feed,
      ...(input.feed || {}),
      items: Array.isArray(input.feed?.items) ? input.feed.items : clone(defaultState.feed.items),
    },
    studio: {
      ...defaultState.studio,
      ...(input.studio || {}),
      contentPillars: Array.isArray(input.studio?.contentPillars) ? input.studio.contentPillars : clone(defaultState.studio.contentPillars),
      drafts: Array.isArray(input.studio?.drafts) ? input.studio.drafts : clone(defaultState.studio.drafts),
    },
    admin: {
      ...defaultState.admin,
      ...(input.admin || {}),
      id: defaultState.admin.id,
      role: defaultState.admin.role,
      access: defaultState.admin.access,
      flags: { ...defaultState.admin.flags, ...(input.admin?.flags || {}) },
      audit: Array.isArray(input.admin?.audit) ? input.admin.audit : clone(defaultState.admin.audit),
    },
  }
}

export function loadState() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY)
    let migrated = false

    if (!raw) {
      for (const key of LEGACY_STORAGE_KEYS) {
        raw = localStorage.getItem(key)
        if (raw) {
          migrated = true
          break
        }
      }
    }

    if (!raw) {
      const fresh = normalizeState(defaultState)
      fresh.meta.installedAt = new Date().toISOString()
      return fresh
    }

    const next = normalizeState(JSON.parse(raw))
    if (migrated) {
      next.admin.audit = [
        ...next.admin.audit,
        { id: `audit-migrate-${Date.now()}`, at: new Date().toISOString(), action: 'Lokale V2.1-data gemigreerd naar V2.2' },
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }
    return next
  } catch {
    return normalizeState(defaultState)
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(state)))
    return true
  } catch {
    return false
  }
}

export function resetState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage can be blocked by browser privacy settings; reset still returns a fresh in-memory state.
  }
  const fresh = normalizeState(defaultState)
  fresh.meta.installedAt = new Date().toISOString()
  return fresh
}

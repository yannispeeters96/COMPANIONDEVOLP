import { BONBAZAAR_CANON } from '../config/bonbazaar-canon'
import {
  BONBAZAAR_CANON_ASSETS,
  BONBAZAAR_CANON_ASSET_LIST,
} from '../config/bonbazaar-canon-assets'

const VIEW_MAP = Object.freeze({
  front: BONBAZAAR_CANON_ASSETS.FRONT_FULL,
  portrait: BONBAZAAR_CANON_ASSETS.PORTRAIT_SIDE,
  full: BONBAZAAR_CANON_ASSETS.FULL_BODY,
  'full-alt': BONBAZAAR_CANON_ASSETS.FULL_BODY_ALT,
  closeup: BONBAZAAR_CANON_ASSETS.FRONT_CLOSEUP,
})

export function assertBonBazaarCanon() {
  if (!BONBAZAAR_CANON.locked) {
    throw new Error('[BONBAZAAR CANON] Canon lock is disabled.')
  }

  if (!BONBAZAAR_CANON.mascot.originalOnly) {
    throw new Error(
      '[BONBAZAAR CANON] Original-only protection is disabled.'
    )
  }

  if (BONBAZAAR_CANON.policy.allowFallback) {
    throw new Error(
      '[BONBAZAAR CANON] Fallback mascots are forbidden.'
    )
  }

  return true
}

export function assertMascotId(id) {
  assertBonBazaarCanon()

  if (id !== BONBAZAAR_CANON.identity.id) {
    throw new Error(
      `[BONBAZAAR CANON BLOCK] Mascot rejected: ${id}`
    )
  }

  return true
}

export function assertCanonAsset(asset) {
  assertBonBazaarCanon()

  if (!BONBAZAAR_CANON_ASSET_LIST.includes(asset)) {
    throw new Error(
      `[BONBAZAAR CANON BLOCK] Non-canon asset rejected: ${asset}`
    )
  }

  return asset
}

export function getBonBazaarMascot(view = 'front') {
  assertBonBazaarCanon()

  const image = VIEW_MAP[view]

  if (!image) {
    throw new Error(
      `[BONBAZAAR CANON BLOCK] Unknown mascot view: ${view}`
    )
  }

  assertCanonAsset(image)

  return Object.freeze({
    id: BONBAZAAR_CANON.identity.id,
    name: BONBAZAAR_CANON.identity.name,
    species: BONBAZAAR_CANON.mascot.species,
    image,
    canon: true,
    locked: true,
    originalOnly: true,
    visualIdentity: BONBAZAAR_CANON.mascot.visualIdentity,
  })
}
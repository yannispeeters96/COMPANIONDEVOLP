import { describe, expect, it } from 'vitest'

import { BONBAZAAR_CANON } from '../config/bonbazaar-canon'
import {
  BONBAZAAR_CANON_ASSET_LIST,
  BONBAZAAR_CANON_ASSETS,
} from '../config/bonbazaar-canon-assets'

import {
  assertCanonAsset,
  assertMascotId,
  getBonBazaarMascot,
} from '../lib/mascot-loader'

describe('BonBazaar Spectral Wolf canon lock', () => {

  it('locks identity to the approved spectral wolf', () => {
    expect(BONBAZAAR_CANON.locked).toBe(true)
    expect(BONBAZAAR_CANON.mascot.originalOnly).toBe(true)

    expect(BONBAZAAR_CANON.identity.id).toBe(
      'bonbazaar-spectral-wolf'
    )
  })

  it('contains exactly five approved canon assets', () => {

    expect(BONBAZAAR_CANON_ASSET_LIST).toHaveLength(5)

    for (const asset of BONBAZAAR_CANON_ASSET_LIST) {
      expect(asset).toMatch(
        /^\/canon\/bonbazaar-wolf-.*\.jpg$/
      )
    }
  })

  it('rejects legacy and replacement mascots', () => {

    expect(() =>
      assertMascotId('legacy-puppy')
    ).toThrow()

    expect(() =>
      assertMascotId('generic-dog')
    ).toThrow()

    expect(() =>
      assertMascotId('white-teal-pet')
    ).toThrow()

    expect(() =>
      assertCanonAsset('/canon/pet-yannis-front.jpg')
    ).toThrow()
  })

  it('loads only approved front mascot', () => {

    const mascot = getBonBazaarMascot('front')

    expect(mascot.id).toBe(
      'bonbazaar-spectral-wolf'
    )

    expect(mascot.canon).toBe(true)
    expect(mascot.originalOnly).toBe(true)

    expect(mascot.image).toBe(
      BONBAZAAR_CANON_ASSETS.FRONT_FULL
    )
  })
})
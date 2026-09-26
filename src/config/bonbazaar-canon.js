export const BONBAZAAR_CANON = Object.freeze({
  schemaVersion: 1,
  canonVersion: '1.0.0',

  project: 'BONBAZAAR',
  projectFamily: 'PROJECT MOON',

  locked: true,
  status: 'ORIGINAL_CANON_ONLY',

  identity: Object.freeze({
    id: 'bonbazaar-spectral-wolf',
    name: 'BonBazaar Spectral Wolf',
    creator: 'Yannis Peeters',
    developerIdentity: 'DEV-YANNIS',
  }),

  mascot: Object.freeze({
    species: 'wolf',
    approved: true,
    originalOnly: true,

    visualIdentity: Object.freeze({
      fur: 'black-charcoal',
      glow: 'neon-magenta-pink',
      eyes: 'bright-green',
      horns: true,
      harness: 'brown-leather',
      pendant: 'rune-medallion',
      environment: 'dark-mystical-forest',
      crystals: 'pink-magenta',
    }),
  }),

  policy: Object.freeze({
    allowSubstitution: false,
    allowFallback: false,
    allowGeneratedReplacement: false,
    allowAutomaticRedesign: false,
    allowGenericWolf: false,
    allowDogMascot: false,
    allowWhiteTealMascot: false,
    allowAlternativeAnimal: false,
    missingAssetBehaviour: 'FAIL_VISIBLE',
  }),

  forbidden: Object.freeze([
    'legacy-puppy',
    'dog-mascot',
    'white-teal-pet',
    'generic-wolf',
    'replacement-animal',
    'generated-replacement',
    'fallback-mascot',
    'unapproved-redesign',
    'alternative-pet-look',
  ]),
})
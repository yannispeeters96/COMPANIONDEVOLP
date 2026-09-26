import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const src = path.join(root, 'src')
const files = []

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) walk(full)
    else if (/\.(js|jsx)$/.test(name)) files.push(full)
  }
}
walk(src)

const missing = []
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8')
  for (const match of text.matchAll(/from\s+['"](\.\.?\/[^'"]+)['"]/g)) {
    const base = path.resolve(path.dirname(file), match[1])
    const candidates = [base, `${base}.js`, `${base}.jsx`, path.join(base, 'index.js'), path.join(base, 'index.jsx')]
    if (!candidates.some((candidate) => fs.existsSync(candidate))) missing.push(`${path.relative(root, file)} -> ${match[1]}`)
  }
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
if (pkg.version !== '2.2.0') throw new Error('package version is niet 2.2.0')
if (pkg.main && !fs.existsSync(path.join(root, pkg.main))) throw new Error(`Electron main ontbreekt: ${pkg.main}`)
if (missing.length) throw new Error(`Ontbrekende imports:\n${missing.join('\n')}`)

const storage = fs.readFileSync(path.join(root, 'src', 'storage.js'), 'utf8')
for (const required of ["id: 'bonbazaar-admin.dev'", "role: 'superadmin'", "access: 'full'"]) {
  if (!storage.includes(required)) throw new Error(`Vaste dev-config ontbreekt: ${required}`)
}

const shortcut = fs.readFileSync(path.join(root, 'src', 'devShortcut.js'), 'utf8')
if (!shortcut.includes("DEV_SHORTCUT_TRIGGER = 'yannis'") || shortcut.includes("key === 'G'") || shortcut.includes("key === 'M'")) {
  throw new Error('yannis devLegacy-trigger ontbreekt of oude GM-trigger is nog aanwezig.')
}

const requiredSounds = [
  'tap_glass.wav', 'tap_pop.wav', 'tap_deep.wav', 'nav_swipe.wav',
  'notify_soft.wav', 'notify_priority.wav', 'message_in.wav',
  'upload_start.wav', 'upload_done.wav', 'publish.wav',
  'like.wav', 'follower.wav', 'gift.wav', 'milestone.wav',
  'live_enter.wav', 'live_exit.wav', 'record_start.wav', 'record_stop.wav',
  'gm_unlock.wav', 'gm_popup.wav', 'gm_close.wav',
  'theme_dark.wav', 'theme_neon.wav', 'theme_live.wav',
]
const soundsRoot = path.join(root, 'public', 'sounds')
const missingSounds = requiredSounds.filter((name) => !fs.existsSync(path.join(soundsRoot, name)))
if (missingSounds.length) throw new Error(`Sound assets ontbreken:\n${missingSounds.join('\n')}`)

if (pkg.main) {
  const preload = fs.readFileSync(path.join(root, 'electron', 'preload.cjs'), 'utf8')
  if (!preload.includes("version: '2.2.0'")) throw new Error('Electron preload-versie is niet 2.2.0')
}

console.log(`OK: ${files.length} bronbestanden gecontroleerd; alle relatieve imports bestaan.`)
console.log(`OK: package.json geldig; versie ${pkg.version}${pkg.main ? '; desktop main aanwezig' : '; web/Android package'}.`)
console.log('OK: vaste dev-identiteit bonbazaar-admin.dev / superadmin / full is aanwezig.')
console.log('OK: yannis devLegacy-trigger is aanwezig; oude GM-trigger is verwijderd.')
console.log(`OK: ${requiredSounds.length} BonBazaar SoundPack v2 assets zijn preinstalled.`)

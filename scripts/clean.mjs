import fs from 'node:fs'
for (const dir of ['dist', 'release']) {
  fs.rmSync(dir, { recursive: true, force: true })
  console.log(`Opgeruimd: ${dir}`)
}

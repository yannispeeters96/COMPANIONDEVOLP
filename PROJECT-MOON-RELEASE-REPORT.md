# Project Moon — BonBazaar / Abonazaar release report

Date: 2026-09-16

## Included

- Abonazaar V2.2 web/Android-PWA source
- `yannis` developer legacy trigger; the old GM trigger is absent
- 24 preinstalled SoundPack v2 assets
- the supplied BonBazaar / spectral-wolf canon references under `public/canon/`
- source verification output and canon asset SHA-256 manifest

## Verification

- Source/import verification: PASS (22 source files; all relative imports resolve)
- Package metadata verification: PASS (version 2.2.0)
- Developer identity and trigger verification: PASS
- Canon asset copy: PASS
- Vitest/Vite production verification: BLOCKED in this environment because the npm registry was unreachable during dependency installation. No test or production-build pass is claimed without those dependencies.

## Local Windows build

From the `Abonazaar` directory on the developer PC:

```powershell
npm install
npm run verify
```

The `verify` command runs source checks, Vitest, and the Vite production build. Only after that completes green should the resulting `dist/` be published.

## Hosting state

A private Netlify project named `bonbazaar-project-moon` was created. It has no deploy yet, so there is no honest public live URL in this report.


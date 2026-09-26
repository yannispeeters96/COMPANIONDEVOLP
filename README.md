# Abonazaar V2.2.0 · Android/PWA

Android-vriendelijke editie van Pet BonBazaar Creator OS, met dezelfde creatorfuncties vooraf in de bron ingebouwd.

Creator credit: **@.yannispeeters**  
TikTok: https://www.tiktok.com/@.yannispeeters

## Preinstalled functies

- Home / Creator Control Room
- verticale Creator Feed
- Live Center
- Creator Studio
- TikTok-gerichte Analytics
- Projecten
- Profiel
- veilige God Mode
- Admin ID `bonbazaar-admin.dev`
- `superadmin` + `full` in-app access
- alle feature flags standaard aan
- Unlock All + Legacy Mode
- auditlog + diagnostiek
- lokale opslag, JSON-back-up/import en V2.1-migratie
- PWA manifest + service worker
- mobiele bottom navigation en touch-vriendelijke UI

## Installeren in Termux

```bash
termux-setup-storage
pkg update -y
pkg install -y nodejs-lts
cd /pad/naar/Abonazaar
bash INSTALL-ABONAZAAR-ANDROID.sh
```

Daarna opent de app via `http://127.0.0.1:4173`. Kies in Chrome **App installeren** of **Toevoegen aan startscherm**.

## Commando's

```bash
npm install
npm run dev:android
npm run godmode
npm run check:source
npm run test
npm run verify
npm run build
npm run preview:android
bash START-ABONAZAAR-ANDROID.sh
bash STOP-ABONAZAAR-ANDROID.sh
```

## APK-status

Dit ZIP-pakket is Android/PWA-installatieklaar, maar is geen gecompileerde `.apk`. Een echte APK moet met een Android SDK/toolchain worden gebouwd. Er wordt geen nep-APK meegeleverd.

#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

printf '\n=========================================\n'
printf ' Abonazaar V2.2 - Android Full Setup\n'
printf '=========================================\n\n'

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  pkg update -y
  pkg install -y nodejs-lts
fi

printf 'Node: '; node --version
printf 'npm: '; npm --version

printf '\n[1/4] Dependencies installeren...\n'
npm install --no-audit --no-fund

printf '\n[2/4] Broncontrole...\n'
npm run check:source

printf '\n[3/4] Tests + productiebuild...\n'
npm run verify

printf '\n[4/4] Lokale Android/PWA server starten...\n'
bash START-ABONAZAAR-ANDROID.sh

printf '\nKlaar. Open http://127.0.0.1:4173 in Chrome en kies App installeren / Toevoegen aan startscherm.\n'

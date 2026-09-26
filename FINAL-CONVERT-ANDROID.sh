#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

REPORT="FINAL-VERIFY-ANDROID.txt"
LOG="FINAL-CONVERT-ANDROID.log"
: > "$LOG"
{
  echo "Abonazaar V2.2 FINAL VERIFY"
  echo "Started: $(date -Iseconds)"
  echo "Status: RUNNING"
} > "$REPORT"

run_step() {
  local label="$1"; shift
  printf '\n%s\n' "$label" | tee -a "$LOG"
  if ! "$@" 2>&1 | tee -a "$LOG"; then
    echo "FAIL: $label" >> "$REPORT"
    printf '\nSTOP. Bekijk %s en %s.\n' "$REPORT" "$LOG"
    exit 1
  fi
  echo "PASS: $label" >> "$REPORT"
}

printf '\n============================================\n'
printf ' Abonazaar V2.2 - FINAL CONVERT + VERIFY\n'
printf '============================================\n'
printf 'Tip: laat Termux open tot alle stappen klaar zijn.\n'
printf 'Dit bouwt de Android/PWA-release opnieuw op jouw toestel.\n'

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  printf 'Node/npm ontbreekt. Termux installeert nodejs-lts...\n'
  pkg update -y | tee -a "$LOG"
  pkg install -y nodejs-lts | tee -a "$LOG"
fi

if ! node -e "const [M,m]=process.versions.node.split('.').map(Number); process.exit(((M===20&&m>=19)||M>=22)?0:1)"; then
  echo "FAIL: Node-versie te oud" >> "$REPORT"
  printf 'Gebruik Node 20.19+ of Node 22.12+.\n'
  exit 1
fi

echo "PASS: Node $(node --version) / npm $(npm --version)" >> "$REPORT"
run_step "npm install" npm install --no-audit --no-fund
run_step "source audit + preinstalled features" npm run check:source
run_step "Vitest full suite" npm run test:verbose
run_step "Vite production build" npm run build

if [[ ! -f dist/index.html ]]; then
  echo "FAIL: dist/index.html ontbreekt" >> "$REPORT"
  exit 1
fi

echo "PASS: dist/index.html" >> "$REPORT"
echo "PASS: FINAL CONVERSION COMPLETE" >> "$REPORT"
echo "Status: 100% PASS FOR THIS TEST MATRIX" >> "$REPORT"
echo "Finished: $(date -Iseconds)" >> "$REPORT"

printf '\nALLE ANDROID/PWA RELEASECONTROLES ZIJN GESLAAGD.\n'
printf 'Rapport: %s\n' "$REPORT"
printf 'Start daarna met: bash START-ABONAZAAR-ANDROID.sh\n'
printf 'Open Chrome op http://127.0.0.1:4173 en kies App installeren.\n'
printf 'Stuur het rapport terug vóór de definitieve releasebeslissing.\n'

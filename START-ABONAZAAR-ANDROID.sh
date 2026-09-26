#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d dist ]; then
  npm run build
fi

if [ -f .abonazaar.pid ] && kill -0 "$(cat .abonazaar.pid)" 2>/dev/null; then
  printf 'Abonazaar draait al op http://127.0.0.1:4173\n'
else
  nohup npm run preview:android > .abonazaar.log 2>&1 &
  echo $! > .abonazaar.pid
  sleep 2
  printf 'Abonazaar gestart op http://127.0.0.1:4173\n'
fi

if command -v termux-open-url >/dev/null 2>&1; then
  termux-open-url http://127.0.0.1:4173 || true
fi

#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

if [ -f .abonazaar.pid ]; then
  pid="$(cat .abonazaar.pid)"
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" || true
  fi
  rm -f .abonazaar.pid
fi
printf 'Abonazaar gestopt.\n'

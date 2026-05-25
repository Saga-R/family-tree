#!/usr/bin/env bash
# Serve the family tree app locally on http://localhost:8765
# (file:// won't work because Babel-standalone fetches the .jsx via XHR.)

set -e
cd "$(dirname "$0")"
PORT="${PORT:-8765}"
URL="http://localhost:${PORT}/"

echo "Family Tree → ${URL}"
echo "Press Ctrl-C to stop."

# open browser in background once server is up
(sleep 0.6 && open "${URL}") &

exec python3 -m http.server "${PORT}" --bind 127.0.0.1

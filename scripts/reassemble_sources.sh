#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/source/archives"
DST="$ROOT/reconstructed"
mkdir -p "$DST"
for name in Forms Lib مجلد١; do
  out="$DST/$name.zip"
  cat "$SRC/$name.zip."*.part > "$out"
  (cd "$SRC" && sha256sum -c "$name.zip.sha256")
done
echo "Rebuilt archives are in $DST"

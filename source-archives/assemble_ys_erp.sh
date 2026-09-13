#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")" && pwd)"
out="$root/reassembled/YS_ERP-نسخة_2.7z"
mkdir -p "$root/reassembled"
cat "$root"/parts/YS_ERP-نسخة_2.7z.part-* > "$out"
expected=$(awk '$2=="YS_ERP-نسخة_2.7z" {print $1}' "$root/MANIFEST.sha256")
actual=$(sha256sum "$out" | awk '{print $1}')
if [[ -z "$expected" || "$actual" != "$expected" ]]; then
  echo "SHA-256 mismatch: expected=$expected actual=$actual" >&2
  exit 1
fi
echo "Reassembled and verified: $out"

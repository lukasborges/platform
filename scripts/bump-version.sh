#!/usr/bin/env bash
# Bump fork release version in package.json files.
# Usage: ./scripts/bump-version.sh <N>
#   Sets root package.json and packages/app/package.json version to "3.3.0-fork.<N>".
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <N>" >&2
  echo "  e.g. $0 4   # sets version to 3.3.0-fork.4" >&2
  exit 64
fi

n="$1"
if ! [[ "$n" =~ ^[0-9]+$ ]]; then
  echo "error: <N> must be a positive integer, got '$n'" >&2
  exit 64
fi

new_version="3.3.0-fork.${n}"
repo_root="$(cd "$(dirname "$0")/.." && pwd)"

bump() {
  local file="$1"
  local current
  current="$(node -p "require('$file').version")"
  if [[ "$current" == "$new_version" ]]; then
    echo "  $file already at $new_version"
    return
  fi
  # Patch only the top-level "version" key, leaving nested ones alone.
  node - "$file" "$new_version" <<'NODE'
const fs = require('fs');
const [, , file, version] = process.argv;
const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
pkg.version = version;
fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
NODE
  echo "  $file: $current -> $new_version"
}

echo "bumping to $new_version"
bump "$repo_root/package.json"
bump "$repo_root/packages/app/package.json"
echo "done. review with: git diff package.json packages/app/package.json"

#!/usr/bin/env bash

set -euo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repository_root"

if ! command -v makepkg >/dev/null 2>&1; then
  echo 'makepkg is required. Install it with: sudo pacman -S --needed base-devel' >&2
  exit 1
fi

# The Electron app consumes the App Store's generated dist directory. Build it
# explicitly so the Arch package never reuses a stale workspace artifact.
yarn workspace @getstation/appstore build:1
yarn workspace platform-desktop-app build
yarn workspace platform-desktop-app exec electron-builder --linux dir
PKGDEST="$repository_root/release" makepkg -f --clean

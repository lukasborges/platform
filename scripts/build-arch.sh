#!/usr/bin/env bash

set -euo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repository_root"

if ! command -v makepkg >/dev/null 2>&1; then
  echo 'makepkg is required. Install it with: sudo pacman -S --needed base-devel' >&2
  exit 1
fi

yarn workspace platform-desktop-app build
yarn workspace platform-desktop-app exec electron-builder --linux dir
PKGDEST="$repository_root/release" makepkg -f --clean

pkgname=platform-desktop-app
pkgver=3.3.0.b1
pkgrel=1
pkgdesc='Platform desktop application'
arch=('x86_64')
url='https://github.com/lukasborges/platform'
license=('Apache-2.0')
provides=('station-desktop-app')
conflicts=('station-desktop-app')
replaces=('station-desktop-app')
depends=(
  'at-spi2-core'
  'gtk3'
  'libsecret'
  'libxss'
  'libxtst'
  'nss'
  'xdg-utils'
)
options=('!strip')

package() {
  local appdir="${startdir}/release/linux-unpacked"

  if [[ ! -x "${appdir}/platform-desktop-app" ]]; then
    error 'release/linux-unpacked is missing; build the Linux release first'
    return 1
  fi

  install -d "${pkgdir}/opt/Platform"
  cp -a "${appdir}/." "${pkgdir}/opt/Platform/"
  rm -f "${pkgdir}/opt/Platform/resources/package-type"

  install -d "${pkgdir}/usr/bin"
  ln -s '/opt/Platform/platform-desktop-app' "${pkgdir}/usr/bin/platform"
  ln -s '/opt/Platform/platform-desktop-app' "${pkgdir}/usr/bin/station"

  install -Dm644 "${startdir}/packages/app/src/static/icon-app.png" \
    "${pkgdir}/usr/share/icons/hicolor/512x512/apps/platform-desktop-app.png"

  install -Dm644 /dev/stdin \
    "${pkgdir}/usr/share/applications/platform-desktop-app.desktop" <<'DESKTOP'
[Desktop Entry]
Name=Platform
Comment=Platform desktop application
Exec=platform %U
Terminal=false
Type=Application
Icon=platform-desktop-app
Categories=Network;
MimeType=x-scheme-handler/platform;x-scheme-handler/station;
StartupWMClass=platform-desktop-app
DESKTOP
}

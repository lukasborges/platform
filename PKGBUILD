pkgname=station-desktop-app
pkgver=3.3.0.b1
pkgrel=8
pkgdesc='Station desktop application'
arch=('x86_64')
url='https://github.com/lukasborges/desktop-app'
license=('Apache-2.0')
depends=(
  'at-spi2-core'
  'gtk3'
  'libsecret'
  'libxss'
  'libxtst'
  'nss'
  'xdg-utils'
)
optdepends=('libappindicator-gtk3: system tray integration')
options=('!strip')

package() {
  local appdir="${startdir}/release/linux-unpacked"

  if [[ ! -x "${appdir}/station-desktop-app" ]]; then
    error 'release/linux-unpacked is missing; build the Linux release first'
    return 1
  fi

  install -d "${pkgdir}/opt/Station"
  cp -a "${appdir}/." "${pkgdir}/opt/Station/"
  rm -f "${pkgdir}/opt/Station/resources/package-type"

  install -d "${pkgdir}/usr/bin"
  ln -s '/opt/Station/station-desktop-app' "${pkgdir}/usr/bin/station"

  install -Dm644 "${startdir}/packages/app/src/static/icon-app.png" \
    "${pkgdir}/usr/share/icons/hicolor/512x512/apps/station-desktop-app.png"

  install -Dm644 /dev/stdin \
    "${pkgdir}/usr/share/applications/station-desktop-app.desktop" <<'DESKTOP'
[Desktop Entry]
Name=Station
Comment=Station desktop application
Exec=station %U
Terminal=false
Type=Application
Icon=station-desktop-app
Categories=Network;
MimeType=x-scheme-handler/station;
StartupWMClass=station-desktop-app
DESKTOP
}

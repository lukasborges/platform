#!/usr/bin/env bash
# Build a Platform rpm from release/linux-unpacked using rpmbuild directly.
# Used because electron-builder's bundled fpm 1.9.3 is incompatible with
# rpm >= 4.20 (Fedora 41+).
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
unpacked="$repo_root/release/linux-unpacked"
icon_src="$repo_root/packages/app/src/static/icon-app.png"
out_rpm="$repo_root/release/Platform-x86_64.rpm"

if [[ ! -d "$unpacked" ]]; then
  echo "error: $unpacked not found — run electron-builder first" >&2
  exit 1
fi

version="$(node -p "require('$repo_root/packages/app/package.json').version" | tr - _)"

work="$(mktemp -d /tmp/platform-rpm-XXXX)"
trap 'rm -rf "$work"' EXIT

mkdir -p "$work/SOURCES" "$work/SPECS" "$work/BUILD" "$work/RPMS" "$work/SRPMS" "$work/BUILDROOT"

cat > "$work/SOURCES/platform-desktop-app.desktop" <<'EOF'
[Desktop Entry]
Name=Platform
Comment=A smarter web browser for busy people
Exec=/opt/Platform/platform-desktop-app %U
Terminal=false
Type=Application
Icon=platform-desktop-app
StartupWMClass=platform-desktop-app
Categories=Network;
MimeType=x-scheme-handler/platform;x-scheme-handler/station;
EOF

cp "$icon_src" "$work/SOURCES/platform-desktop-app.png"
tar -C "$(dirname "$unpacked")" -czf "$work/SOURCES/platform-linux-unpacked.tar.gz" "$(basename "$unpacked")"

cat > "$work/SPECS/platform-desktop-app.spec" <<EOF
Name:           platform-desktop-app
Version:        $version
Release:        1%{?dist}
Summary:        Platform — a smarter web browser for busy people
License:        ASL 2.0
URL:            https://github.com/lukasborges/platform
Source0:        platform-linux-unpacked.tar.gz
Source1:        platform-desktop-app.desktop
Source2:        platform-desktop-app.png
BuildArch:      x86_64
AutoReqProv:    no
Requires:       gtk3, libnotify, nss, libXScrnSaver, libXtst, xdg-utils, at-spi2-core, libuuid

%global debug_package %{nil}
%global __strip /bin/true
%global __os_install_post %{nil}
%global _build_id_links none

%description
Platform is a desktop app that turns the chaos of work apps into productive flow.

%prep
%setup -q -n linux-unpacked

%build
# nothing to compile — prebuilt by electron-builder

%install
mkdir -p %{buildroot}/opt/Platform
cp -a . %{buildroot}/opt/Platform/
mkdir -p %{buildroot}%{_bindir}
ln -s ../../opt/Platform/platform-desktop-app %{buildroot}%{_bindir}/platform
ln -s ../../opt/Platform/platform-desktop-app %{buildroot}%{_bindir}/station
mkdir -p %{buildroot}%{_datadir}/applications
install -m 644 %{SOURCE1} %{buildroot}%{_datadir}/applications/platform-desktop-app.desktop
mkdir -p %{buildroot}%{_datadir}/icons/hicolor/512x512/apps
install -m 644 %{SOURCE2} %{buildroot}%{_datadir}/icons/hicolor/512x512/apps/platform-desktop-app.png

%files
/opt/Platform
%attr(4755, root, root) /opt/Platform/chrome-sandbox
%{_bindir}/platform
%{_bindir}/station
%{_datadir}/applications/platform-desktop-app.desktop
%{_datadir}/icons/hicolor/512x512/apps/platform-desktop-app.png

%post
update-desktop-database -q || :
gtk-update-icon-cache -q %{_datadir}/icons/hicolor || :

%postun
update-desktop-database -q || :
gtk-update-icon-cache -q %{_datadir}/icons/hicolor || :
EOF

rpmbuild -bb \
  --define "_topdir $work" \
  --define "_rpmdir $work/RPMS" \
  --define "_sourcedir $work/SOURCES" \
  --define "_specdir $work/SPECS" \
  --define "_builddir $work/BUILD" \
  --define "_buildrootdir $work/BUILDROOT" \
  "$work/SPECS/platform-desktop-app.spec"

built="$(find "$work/RPMS" -name '*.rpm' | head -1)"
[[ -n "$built" ]] || { echo "error: no rpm produced" >&2; exit 1; }
mv -f "$built" "$out_rpm"
echo "wrote $out_rpm"

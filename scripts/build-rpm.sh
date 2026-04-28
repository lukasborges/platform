#!/usr/bin/env bash
# Build a Station rpm from release/linux-unpacked using rpmbuild directly.
# Used because electron-builder's bundled fpm 1.9.3 is incompatible with
# rpm >= 4.20 (Fedora 41+).
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
unpacked="$repo_root/release/linux-unpacked"
icon_src="$repo_root/packages/app/src/static/icon-app.png"
out_rpm="$repo_root/release/Station-x86_64.rpm"

if [[ ! -d "$unpacked" ]]; then
  echo "error: $unpacked not found — run electron-builder first" >&2
  exit 1
fi

version="$(node -p "require('$repo_root/packages/app/package.json').version" | tr - _)"

work="$(mktemp -d /tmp/station-rpm-XXXX)"
trap 'rm -rf "$work"' EXIT

mkdir -p "$work/SOURCES" "$work/SPECS" "$work/BUILD" "$work/RPMS" "$work/SRPMS" "$work/BUILDROOT"

cat > "$work/SOURCES/Station.desktop" <<'EOF'
[Desktop Entry]
Name=Station
Comment=A smarter web browser for busy people
Exec=/opt/Station/station-desktop-app %U
Terminal=false
Type=Application
Icon=station-desktop-app
StartupWMClass=Station
Categories=Network;
MimeType=x-scheme-handler/station;
EOF

cp "$icon_src" "$work/SOURCES/station-desktop-app.png"
tar -C "$(dirname "$unpacked")" -czf "$work/SOURCES/station-linux-unpacked.tar.gz" "$(basename "$unpacked")"

cat > "$work/SPECS/station-desktop-app.spec" <<EOF
Name:           station-desktop-app
Version:        $version
Release:        1%{?dist}
Summary:        Station — a smarter web browser for busy people
License:        ASL 2.0
URL:            https://getstation.com
Source0:        station-linux-unpacked.tar.gz
Source1:        Station.desktop
Source2:        station-desktop-app.png
BuildArch:      x86_64
AutoReqProv:    no
Requires:       gtk3, libnotify, nss, libXScrnSaver, libXtst, xdg-utils, at-spi2-core, libuuid

%global debug_package %{nil}
%global __strip /bin/true
%global __os_install_post %{nil}
%global _build_id_links none

%description
Station is a desktop app that turns the chaos of work apps into productive flow.

%prep
%setup -q -n linux-unpacked

%build
# nothing to compile — prebuilt by electron-builder

%install
mkdir -p %{buildroot}/opt/Station
cp -a . %{buildroot}/opt/Station/
mkdir -p %{buildroot}%{_bindir}
ln -s ../../opt/Station/station-desktop-app %{buildroot}%{_bindir}/station-desktop-app
mkdir -p %{buildroot}%{_datadir}/applications
install -m 644 %{SOURCE1} %{buildroot}%{_datadir}/applications/Station.desktop
mkdir -p %{buildroot}%{_datadir}/icons/hicolor/512x512/apps
install -m 644 %{SOURCE2} %{buildroot}%{_datadir}/icons/hicolor/512x512/apps/station-desktop-app.png

%files
/opt/Station
%attr(4755, root, root) /opt/Station/chrome-sandbox
%{_bindir}/station-desktop-app
%{_datadir}/applications/Station.desktop
%{_datadir}/icons/hicolor/512x512/apps/station-desktop-app.png

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
  "$work/SPECS/station-desktop-app.spec"

built="$(find "$work/RPMS" -name '*.rpm' | head -1)"
[[ -n "$built" ]] || { echo "error: no rpm produced" >&2; exit 1; }
mv -f "$built" "$out_rpm"
echo "wrote $out_rpm"

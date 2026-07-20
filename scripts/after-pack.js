
exports.default = async function(context) {

  const { appOutDir, targets } = context;

  const isLinux = targets.find(target => target.name === 'appImage');
  if (!isLinux) {
    return;
  }
  
  const fs = require('fs-extra');
  const originalDir = process.cwd();
  
  process.chdir(appOutDir);

  fs.moveSync('platform-desktop-app', 'platform-desktop-app.bin');

  const wrapperScript = 
  `#!/bin/sh
if [ -z \${WAYLAND_DISPLAY+x} ]; then 
  WAYLAND_PARAMS=""
else 
  WAYLAND_PARAMS="--enable-features=UseOzonePlatform --ozone-platform=wayland"
fi
nohup "$(dirname "$(readlink -f "$0")")/platform-desktop-app.bin" \$WAYLAND_PARAMS --no-sandbox "$@" >/dev/null 2>&1 &
      `;
    fs.writeFileSync('platform-desktop-app', wrapperScript);
  fs.chmodSync('platform-desktop-app', '755');

  process.chdir(originalDir);
}

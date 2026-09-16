import { autoUpdater as autoUpdaterProd } from 'electron-updater';

import { isPackaged } from '../../../utils/env';

import AutoUpdaterMock from './AutoUpdaterMock';

function supportsAutoDownload(): boolean {
  if (process.platform === 'darwin' || process.platform === 'win32') {
    return true;
  }
  if (process.platform === 'linux') {
    // electron-updater only knows how to replace the running executable on
    // AppImage. .deb / .rpm / pacman packages need the user to install via
    // their package manager, so we keep the detection-only path there.
    return !!process.env.APPIMAGE;
  }
  return false;
}

if (isPackaged) {
  // Platform beta releases are tagged as prerelease (v3.3.0-beta.N), so the GitHub
  // /releases/latest endpoint returns 406. Opt in to prereleases.
  autoUpdaterProd.allowPrerelease = true;
  autoUpdaterProd.autoDownload = supportsAutoDownload();
  // Installation is triggered by the user pressing "Restart Now" in the UI
  // (or by quitting the app while a downloaded update is pending, via the
  // existing sagaPrepareQuit hook in app/sagas.js).
  autoUpdaterProd.autoInstallOnAppQuit = false;
}

export const autoUpdater = isPackaged ? autoUpdaterProd : new AutoUpdaterMock();

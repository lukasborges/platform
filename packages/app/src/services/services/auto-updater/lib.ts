import { isPackaged } from '../../../utils/env';
import AutoUpdaterMock from './AutoUpdaterMock';
import { autoUpdater as autoUpdaterProd } from 'electron-updater';

if (isPackaged) {
    // Fork releases are tagged as prerelease (v3.3.0-fork.N), so the GitHub
    // /releases/latest endpoint returns 406. Opt in to prereleases.
    autoUpdaterProd.allowPrerelease = true;
}

export const autoUpdater = isPackaged ? autoUpdaterProd : new AutoUpdaterMock();

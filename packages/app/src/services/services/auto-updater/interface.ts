import { ServiceBase } from '../../lib/class';
import { service } from '../../lib/decorator';
import { RPC } from '../../lib/types';

@service('auto-updater')
export class AutoUpdaterService extends ServiceBase implements RPC.Interface<AutoUpdaterService> {
  /**
   * Restarts the app and installs the update after it has been downloaded.
   * Poxy for `electron.autoUpdater.quitAndInstall()`
   */
  // @ts-ignore
  quitAndInstall(): Promise<void> {}

  /**
   * Asks the server whether there is an update.
   * Poxy for `electron.autoUpdater.checkForUpdates()`
   */
  // @ts-ignore
  checkForUpdates(): Promise<void> {}

  /**
   * Will bind a set of event listeners to `electron.autoUpdater`.
   */
  // @ts-ignore
  addObserver(observer: RPC.ObserverNode<AutoUpdaterServiceObserver>): Promise<RPC.Subscription> {}
}

@service('auto-updater')
export class AutoUpdaterServiceObserver extends ServiceBase implements RPC.Interface<AutoUpdaterServiceObserver> {

  /**
   * Will be called when `electron.autoUpdater` emits `'update-downloaded'`.
   * @param param.releaseName the name of the release
   */
  // @ts-ignore
  onUpdateDownloaded(param: { releaseName: string }) {}

  /**
   * Will be called when `electron.autoUpdater` emits `'checking-for-update'`.
   */
    // @ts-ignore
  onCheckingForUpdate() {}

  /**
   * Will be called when `electron.autoUpdater` emits `'update-not-available'`.
   */
    // @ts-ignore
  onUpdateNotAvailable() {}

  /**
  * Will be called when `electron.autoUpdater` emits `'update-available'`.
  * @param param.releaseName the version of the available release
  */
  // @ts-ignore
  onUpdateAvailable(param: { releaseName: string }) {}

  /**
   * Will be called when `electron.autoUpdater` emits `'error'`.
   */
  // @ts-ignore
  onError(param: { message: string }) {}

  /**
   * Will be called when `electron.autoUpdater` emits `'download-progress'`.
   * @param param.percent the integer percentage (0-100) of the downloaded bytes
   * @param param.bytesPerSecond the current transfer rate in bytes/second
   * @param param.transferred the number of bytes already transferred
   * @param param.total the total number of bytes to transfer
   */
  // @ts-ignore
  onDownloadProgress(param: { percent: number, bytesPerSecond: number, transferred: number, total: number }) {}
}

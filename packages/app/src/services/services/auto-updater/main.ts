import { app } from 'electron';
import { fromEvent, Subscription } from 'rxjs';

import { ServiceSubscription } from '../../lib/class';
import { RPC, ServiceBaseConstructorOptions } from '../../lib/types';

import { AutoUpdaterService, AutoUpdaterServiceObserver } from './interface';
import { autoUpdater } from './lib';

export class AutoUpdaterServiceImpl extends AutoUpdaterService implements RPC.Interface<AutoUpdaterService> {
  private updateDownloaded: boolean;

  constructor(uuid?: string, options?: ServiceBaseConstructorOptions) {
    super(uuid, options);
    this.updateDownloaded = false;
  }

  async quitAndInstall() {
    if (this.updateDownloaded) {
      autoUpdater.quitAndInstall();
    } else {
      app.quit();
    }
  }

  async checkForUpdates() {
    autoUpdater.checkForUpdates();
  }

  async addObserver(observer: RPC.ObserverNode<AutoUpdaterServiceObserver>) {
    const subscriptions: Subscription[] = [];

    if (observer.onCheckingForUpdate) {
      subscriptions.push(
        fromEvent(autoUpdater, 'checking-for-update').subscribe(() => {
          observer.onCheckingForUpdate!();
        })
      );
    }

    if (observer.onUpdateDownloaded) {
      subscriptions.push(
        fromEvent(autoUpdater, 'update-downloaded', (eventOrInfo, _releaseNotes, releaseName) => releaseName || eventOrInfo.version)
          .subscribe(releaseName => {
            this.updateDownloaded = true;
            observer.onUpdateDownloaded!({ releaseName });
          })
      );
    }

    if (observer.onUpdateNotAvailable) {
      subscriptions.push(
        fromEvent(autoUpdater, 'update-not-available').subscribe(() => {
          observer.onUpdateNotAvailable!();
        })
      );
    }

    if (observer.onUpdateAvailable) {
      subscriptions.push(
        fromEvent(autoUpdater, 'update-available', (info: { version: string }) => info.version)
          .subscribe(releaseName => {
            observer.onUpdateAvailable!({ releaseName });
          })
      );
    }

    if (observer.onError) {
      subscriptions.push(
        fromEvent<[Error]>(autoUpdater, 'error').subscribe(e => {
          observer.onError!({ message: e[0].message });
        })
      );
    }

    if (observer.onDownloadProgress) {
      subscriptions.push(
        fromEvent(autoUpdater, 'download-progress', (info: { percent: number, bytesPerSecond: number, transferred: number, total: number }) => info)
          .subscribe(info => {
            observer.onDownloadProgress!({
              percent: info.percent,
              bytesPerSecond: info.bytesPerSecond,
              transferred: info.transferred,
              total: info.total,
            });
          })
      );
    }

    return new ServiceSubscription(() => {
      subscriptions.forEach(s => s.unsubscribe());
    }, observer);
  }

}

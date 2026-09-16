import { Notification, webContents } from 'electron';
import log from 'electron-log';

import { ServiceSubscription } from '../../lib/class';
import { RPC } from '../../lib/types';

import { IOSNotificationServiceShowParam, OSNotification, OSNotificationObserver, OSNotificationService } from './interface';
import { getDoNotDisturb, asNativeImage } from './utils';

export class OSNotificationServiceImpl extends OSNotificationService implements RPC.Interface<OSNotificationService> {
  private activeNotifications = new Map<string, Notification>();

  async show(param: IOSNotificationServiceShowParam) {

    // log.info(`>>> OSNotificationServiceImpl.show ${JSON.stringify(param)}`);

    const notificationOptions: Electron.NotificationConstructorOptions = {
      title: param.title,
      actions: [],
      body: '',
      silent: param.silent,
      urgency: 'normal',
    };

    if (param.imageURL) {
      try {
        const icon = await asNativeImage(param.imageURL);
        if (!icon.isEmpty()) notificationOptions.icon = icon;
      } catch (error) {
        log.warn('Unable to load notification icon; showing notification without it');
      }
    }
    if (param.body) {
      notificationOptions.body = param.body;
    }

    const notification = new Notification(notificationOptions);
    this.activeNotifications.set(param.notificationId, notification);
    notification.on('close', () => this.activeNotifications.delete(param.notificationId));
    notification.on('click', () => this.activeNotifications.delete(param.notificationId));
    notification.show();

    return new OSNotificationImpl(notification);
  }

  async triggerClick(webContentsId: number, notificationId: string) {
    try {
      const myWebcontent = webContents.fromId(webContentsId);
      if (!myWebcontent) return;
      // Send signal back to the webview to trigger click callbacks if any
      myWebcontent.send('trigger-notification-click', notificationId);
    } catch (e) {}
  }

  async dismiss(notificationId: string) {
    const notification = this.activeNotifications.get(notificationId);
    if (notification) {
      try {
        notification.close();
      } catch (e) {
        log.warn('Failed to close OS notification', e);
      }
      this.activeNotifications.delete(notificationId);
    }
  }

  async closeAll() {
    // Snapshot to avoid mutating the map while iterating (close fires 'close' synchronously).
    const ids = [...this.activeNotifications.keys()];
    for (const id of ids) {
      await this.dismiss(id);
    }
  }

  async isDoNotDisturbEnabled() {
    return getDoNotDisturb();
  }

}

export class OSNotificationImpl extends OSNotification implements RPC.Interface<OSNotification> {
  notif: Notification;

  constructor(notif: Notification) {
    super();
    this.notif = notif;
  }

  async addObserver(obs: RPC.Node<OSNotificationObserver>) {
    const onClick = () => {
      // Dismiss the OS-level notification so it leaves the shell notification
      // center (and its badge count drops). The resulting `close` event will
      // also flow through `onClose` to remove the entry from our badge list.
      obs.onClick();
      this.notif.close();
    };
    const onClose = () => obs.onClose();
    this.notif.on('click', onClick);
    this.notif.on('close', onClose);
    return new ServiceSubscription({
      unsubscribe: () => {
        this.notif.removeListener('click', onClick);
        this.notif.removeListener('close', onClose);
      },
    }, obs);
  }
}

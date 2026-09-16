import { ServiceBase } from '../../lib/class';
import { service } from '../../lib/decorator';
import { RPC } from '../../lib/types';

export type IOSNotificationServiceShowParam = {
  /**
   * Identifier we use to look the notification up later (e.g. when the user
   * marks it as read in the in-app center).
   */
  notificationId: string,
  /**
   * Title of the notification.
   */
  title: string,
  /**
   * Body of the notification.
   */
  body?: string,
  /**
   * The URL to the image that should be used.
   */
  imageURL?: string,
  /**
   * True if the notification should not emit any sound.
   */
  silent?: boolean,
};
/**
 * Service used to display and interact with OS Notifications.
 *
 * Leverage `electron.Notification`.
 */
@service('os-notification')
export class OSNotificationService extends ServiceBase implements RPC.Interface<OSNotificationService> {
  /**
   * Forward a click event to the notification on the webContents
   */
  // @ts-ignore
  triggerClick(webContentsId: number, notificationId: string): Promise<void> {}
  /**
   * Show an OS notification.
   */
  // @ts-ignore
  show(param: IOSNotificationServiceShowParam): Promise<RPC.Node<OSNotification>> {}
  /**
   * Dismiss a single OS notification identified by `notificationId`.
   */
  // @ts-ignore
  dismiss(notificationId: string): Promise<void> {}
  /**
   * Dismiss every OS notification that is still on screen. Used when the user
   * clears the in-app notification center so the shell notification panel
   * (and its badge counter) drops to zero as well.
   */
  // @ts-ignore
  closeAll(): Promise<void> {}
  // @ts-ignore
  isDoNotDisturbEnabled(): Promise<boolean> {}
}

/**
 * Represents an OS Notification.
 */
@service('os-notification')
export class OSNotification extends ServiceBase implements RPC.Interface<OSNotification> {
  /**
   * Add an observer (click, close) to this Notification.
   */
  // @ts-ignore
  addObserver(obs: RPC.Node<OSNotificationObserver>): Promise<RPC.Subscription> {}
}

@service('os-notification')
export class OSNotificationObserver extends ServiceBase implements RPC.Interface<OSNotificationObserver> {
  /**
   * Will be called when the subject's notification is clicked.
   */
  // @ts-ignore
  onClick(): void {}

  /**
   * Will be called when the subject's notification is dismissed by the user
   * (close button, swipe, auto-close) without being clicked.
   */
  // @ts-ignore
  onClose(): void {}
}

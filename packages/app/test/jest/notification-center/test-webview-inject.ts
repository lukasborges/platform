import { readFileSync } from 'fs';
import { resolve } from 'path';
import { runInNewContext } from 'vm';

const injectSource = readFileSync(
  resolve(__dirname, '../../../src/static/preload/webview-inject.js'),
  'utf8'
);

interface SentNotificationPayload {
  id: string,
  title: string,
  body: string,
  icon: string,
  silent: boolean,
}

interface SentNotification {
  id: string,
  notification: SentNotificationPayload,
}

const createContext = () => {
  const sent: SentNotification[] = [];
  const originalPermissionQuery = jest.fn(() => Promise.resolve({ state: 'prompt' }));

  class MockEventTarget {}
  class MockServiceWorkerRegistration {}
  class MockXMLHttpRequest {
    readyState = 0;
    response = {};
    responseType = '';
    onreadystatechange?: () => void;

    open() {}

    send() {
      this.readyState = 4;
      if (this.onreadystatechange) this.onreadystatechange();
    }
  }
  class MockFileReader {
    onload?: (event: { target: { result: string } }) => void;

    readAsDataURL() {
      if (this.onload) this.onload({ target: { result: 'data:image/png;base64,AA==' } });
    }
  }

  const windowObject: any = {
    EventTarget: MockEventTarget,
    ServiceWorkerRegistration: MockServiceWorkerRegistration,
    navigator: {
      permissions: {
        query: originalPermissionQuery,
      },
    },
    bxApi: {
      notificationCenter: {
        addNotificationClickListener: jest.fn(),
        removeNotificationClickListener: jest.fn(),
        closeNotification: jest.fn(),
        sendNotification: (id: string, notification: SentNotificationPayload) => {
          sent.push({ id, notification });
        },
      },
    },
  };
  const documentObject = {
    readyState: 'complete',
    addEventListener: jest.fn(),
    getElementsByTagName: () => [],
  };

  runInNewContext(injectSource, {
    console: { log: jest.fn() },
    document: documentObject,
    EventTarget: MockEventTarget,
    FileReader: MockFileReader,
    Promise,
    window: windowObject,
    XMLHttpRequest: MockXMLHttpRequest,
  });

  return { originalPermissionQuery, sent, windowObject };
};

describe('webview notification injection', () => {
  it('forwards service-worker notifications through the Platform notification API', async () => {
    const { originalPermissionQuery, sent, windowObject } = createContext();
    const registration = new windowObject.ServiceWorkerRegistration();

    await registration.showNotification('New message', {
      body: 'Hello from a service worker',
      icon: 'https://example.com/avatar.png',
      silent: true,
    });

    expect(sent).toHaveLength(1);
    expect(sent[0].id).toMatch(/^notif\//);
    expect(sent[0].notification).toMatchObject({
      id: sent[0].id,
      title: 'New message',
      body: 'Hello from a service worker',
      icon: 'https://example.com/avatar.png',
      silent: true,
    });
    await expect(registration.getNotifications()).resolves.toEqual([]);

    await expect(windowObject.navigator.permissions.query({ name: 'notifications' }))
      .resolves.toMatchObject({ state: 'granted' });
    expect(originalPermissionQuery).not.toHaveBeenCalled();

    await windowObject.navigator.permissions.query({ name: 'geolocation' });
    expect(originalPermissionQuery).toHaveBeenCalledWith({ name: 'geolocation' });
  });

  it('keeps the notification id while converting blob icons', () => {
    const { sent, windowObject } = createContext();

    new windowObject.Notification('Blob icon', {
      body: 'Notification body',
      icon: 'blob:https://example.com/icon-id',
    });

    expect(sent).toHaveLength(1);
    expect(sent[0].id).toBe(sent[0].notification.id);
    expect(sent[0].notification.icon).toBe('data:image/png;base64,AA==');
  });
});

import { nativeImage } from 'electron';
import * as memoize from 'memoizee';

const NOTIFICATION_ICON_FETCH_TIMEOUT_MS = 2000;

export const asNativeImage = memoize((url: string): Promise<Electron.NativeImage> => {
  return new Promise((resolve, reject) => {
    if (url.startsWith('data:')) {
      resolve(nativeImage.createFromDataURL(url));
      return;
    }

    if (url.startsWith('http:') || url.startsWith('https:')) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), NOTIFICATION_ICON_FETCH_TIMEOUT_MS);
      fetch(url, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`Unable to download notification icon (${res.status})`);
          return res.arrayBuffer();
        })
        .then((arrayBuffer) => nativeImage.createFromBuffer(Buffer.from(arrayBuffer)))
        .then(
          (image) => {
            clearTimeout(timeout);
            resolve(image);
          },
          (error) => {
            clearTimeout(timeout);
            reject(error);
          }
        );
      return;
    }

    try {
      resolve(nativeImage.createFromPath(url));
    } catch (e) {
      reject(new Error(`Unknow schema for ${url}`));
    }
  });
}, { promise: true, max: 20 });

export function getDoNotDisturb(): boolean {
  if (process.platform === 'win32') {
    const { getFocusAssist } = require('windows-focus-assist');
    const focusAssist: string = getFocusAssist().name;
    return focusAssist === 'PRIORITY_ONLY' || focusAssist === 'ALARMS_ONLY';
  }

  if (process.platform === 'darwin') {
//  vk: 2023.09.22 Looks like we don't have a library that works on modern OS (i.e 13.6)
//      "macos-notification-state": "3.0.0" - uses modern API but it causes application crash on M1 CPU
//      "@stack-inc/macos-notification-state": "2.0.1" - fork of prevoius library. no crush, but it doesn't return correct value too.
    // const { getDoNotDisturb: getMacOsDoNotDisturb } = require('@stack-inc/macos-notification-state');
    // return getMacOsDoNotDisturb();
  }

  return false;
}

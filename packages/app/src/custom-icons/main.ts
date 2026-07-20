import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { promises as fs } from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';

import { PICK_CUSTOM_ICON_CHANNEL, REMOVE_CUSTOM_ICON_CHANNEL } from './channels';
import {
  customIconCandidates,
  customIconPath,
  customIconsDirectory,
  getSupportedIconExtension,
  MAX_CUSTOM_ICON_SIZE,
  validateApplicationId,
} from './paths';

const removeIconCandidates = async (userDataPath: string, applicationId: string, except?: string): Promise<boolean> => {
  let removed = false;
  for (const candidate of customIconCandidates(userDataPath, applicationId)) {
    if (candidate === except) continue;
    try {
      await fs.unlink(candidate);
      removed = true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
  }
  return removed;
};

export const registerCustomIconIpcHandlers = () => {
  ipcMain.removeHandler(PICK_CUSTOM_ICON_CHANNEL);
  ipcMain.removeHandler(REMOVE_CUSTOM_ICON_CHANNEL);

  ipcMain.handle(PICK_CUSTOM_ICON_CHANNEL, async (event, rawApplicationId: unknown) => {
    try {
      const applicationId = validateApplicationId(rawApplicationId);
      const senderWindow = BrowserWindow.getFocusedWindow() || BrowserWindow.fromWebContents(event.sender);
      const options: Electron.OpenDialogOptions = {
        title: 'Choose a custom icon',
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp', 'ico'] }],
      };
      const result = senderWindow
        ? await dialog.showOpenDialog(senderWindow, options)
        : await dialog.showOpenDialog(options);

      if (result.canceled || result.filePaths.length === 0) return null;

      const sourcePath = path.resolve(result.filePaths[0]);
      const extension = getSupportedIconExtension(sourcePath);
      if (!extension) return null;

      const sourceStat = await fs.stat(sourcePath);
      if (!sourceStat.isFile() || sourceStat.size === 0 || sourceStat.size > MAX_CUSTOM_ICON_SIZE) return null;

      const userDataPath = app.getPath('userData');
      const iconsDirectory = customIconsDirectory(userDataPath);
      const destinationPath = customIconPath(userDataPath, applicationId, extension);
      await fs.mkdir(iconsDirectory, { recursive: true });

      if (sourcePath !== destinationPath) {
        await fs.copyFile(sourcePath, destinationPath);
      }
      await removeIconCandidates(userDataPath, applicationId, destinationPath);
      return pathToFileURL(destinationPath).href;
    } catch (error) {
      console.error('[custom-icons] Unable to save custom icon', error);
      return null;
    }
  });

  ipcMain.handle(REMOVE_CUSTOM_ICON_CHANNEL, async (_event, rawApplicationId: unknown) => {
    try {
      const applicationId = validateApplicationId(rawApplicationId);
      return await removeIconCandidates(app.getPath('userData'), applicationId);
    } catch (error) {
      console.error('[custom-icons] Unable to remove custom icon', error);
      return false;
    }
  });
};

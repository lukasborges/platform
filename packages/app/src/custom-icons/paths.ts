import { createHash } from 'crypto';
import * as path from 'path';

export const CUSTOM_ICON_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.ico'];
export const MAX_CUSTOM_ICON_SIZE = 10 * 1024 * 1024;

export const validateApplicationId = (applicationId: unknown): string => {
  if (typeof applicationId !== 'string' || applicationId.length === 0 || applicationId.length > 512) {
    throw new Error('Invalid application id');
  }
  return applicationId;
};

export const customIconKey = (applicationId: string): string =>
  createHash('sha256').update(validateApplicationId(applicationId)).digest('hex');

export const customIconsDirectory = (userDataPath: string): string =>
  path.join(userDataPath, 'custom-icons');

export const getSupportedIconExtension = (filePath: string): string | null => {
  const extension = path.extname(filePath).toLowerCase();
  return CUSTOM_ICON_EXTENSIONS.includes(extension) ? extension : null;
};

export const customIconPath = (userDataPath: string, applicationId: string, extension: string): string => {
  if (!CUSTOM_ICON_EXTENSIONS.includes(extension)) throw new Error('Unsupported custom icon extension');
  return path.join(customIconsDirectory(userDataPath), `${customIconKey(applicationId)}${extension}`);
};

export const customIconCandidates = (userDataPath: string, applicationId: string): string[] =>
  CUSTOM_ICON_EXTENSIONS.map(extension => customIconPath(userDataPath, applicationId, extension));

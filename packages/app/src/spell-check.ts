import { app, Session } from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import log from 'electron-log';

const FILENAME = 'spell-check-languages.json';

const filePath = () => path.join(app.getPath('userData'), FILENAME);

export const readSpellCheckLanguages = (): string[] => {
  try {
    const data = fs.readJsonSync(filePath());
    return Array.isArray(data) ? data.filter((s: any) => typeof s === 'string') : [];
  } catch {
    return [];
  }
};

export const writeSpellCheckLanguages = (langs: string[]) => {
  try {
    fs.outputJsonSync(filePath(), langs);
  } catch (err) {
    log.warn('Failed to persist spell-check languages', err);
  }
};

// Empty `langs` keeps Electron's default (Chromium picks from OS locale).
export const applySpellCheckLanguages = (sess: Session, langs?: string[]) => {
  const desired = langs && langs.length ? langs : readSpellCheckLanguages();
  if (!desired.length) return;
  const available = sess.availableSpellCheckerLanguages;
  const valid = desired.filter(l => available.includes(l));
  if (valid.length) sess.setSpellCheckerLanguages(valid);
};

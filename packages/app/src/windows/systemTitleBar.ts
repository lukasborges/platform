export const SYSTEM_TITLE_BAR_STORAGE_KEY = 'platform.use-system-title-bar';
export const SYSTEM_TITLE_BAR_ARGUMENT = '--platform-system-title-bar';

export const getUseSystemTitleBar = (): boolean => {
  try {
    return window.localStorage.getItem(SYSTEM_TITLE_BAR_STORAGE_KEY) === 'true';
  } catch (_error) {
    return false;
  }
};

export const setUseSystemTitleBar = (enabled: boolean): void => {
  window.localStorage.setItem(SYSTEM_TITLE_BAR_STORAGE_KEY, String(enabled));
};

export const hasSystemTitleBar = (): boolean => process.argv.includes(SYSTEM_TITLE_BAR_ARGUMENT);

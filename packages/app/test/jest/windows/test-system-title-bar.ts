/** @jest-environment jsdom */

jest.mock('../../../src/app/duck', () => ({ changeAppFocusState: jest.fn() }));
jest.mock('../../../src/windows/duck', () => ({ windowCreated: jest.fn(), windowDeleted: jest.fn() }));
jest.mock('../../../src/services/api/helpers', () => ({ handleError: () => jest.fn() }));
jest.mock('../../../src/services/lib/helpers', () => ({ observer: (value: any) => value }));
jest.mock('../../../src/utils/env', () => ({ isPackaged: true }));
jest.mock('../../../src/services/servicesManager', () => ({
  __esModule: true,
  default: {
    electronApp: { addObserver: jest.fn().mockResolvedValue(undefined) },
    browserWindow: {
      create: jest.fn().mockResolvedValue({
        getId: jest.fn().mockResolvedValue(1),
        getWebContentsId: jest.fn().mockResolvedValue(2),
        addObserver: jest.fn(),
      }),
    },
  },
}));

import { getUseSystemTitleBar, hasSystemTitleBar, setUseSystemTitleBar,
  SYSTEM_TITLE_BAR_ARGUMENT, SYSTEM_TITLE_BAR_STORAGE_KEY } from '../../../src/windows/systemTitleBar';

describe('system title bar', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.resetModules();
  });

  test('defaults to custom controls and persists both preference values', () => {
    expect(getUseSystemTitleBar()).toBe(false);
    setUseSystemTitleBar(true);
    expect(getUseSystemTitleBar()).toBe(true);
    setUseSystemTitleBar(false);
    expect(getUseSystemTitleBar()).toBe(false);
    window.localStorage.setItem(SYSTEM_TITLE_BAR_STORAGE_KEY, 'invalid');
    expect(getUseSystemTitleBar()).toBe(false);
  });

  test('uses the actual window mode even when the saved preference changes', () => {
    const originalArgv = process.argv;
    try {
      process.argv = ['electron', SYSTEM_TITLE_BAR_ARGUMENT];
      setUseSystemTitleBar(false);
      expect(hasSystemTitleBar()).toBe(true);
      process.argv = ['electron'];
      setUseSystemTitleBar(true);
      expect(hasSystemTitleBar()).toBe(false);
    } finally {
      process.argv = originalArgv;
    }
  });

  test.each([false, true])('keeps window creation consistent until restart with preference %s', async enabled => {
    setUseSystemTitleBar(enabled);
    const GenericWindowManager = require('../../../src/windows/utils/GenericWindowManager').default;
    const services = require('../../../src/services/servicesManager').default;
    setUseSystemTitleBar(!enabled);

    await new GenericWindowManager().create({ frame: false, transparent: true });

    expect(services.browserWindow.create).toHaveBeenCalledWith(expect.objectContaining({
      frame: enabled,
      transparent: !enabled,
      webPreferences: expect.objectContaining({
        additionalArguments: enabled ? [SYSTEM_TITLE_BAR_ARGUMENT] : [],
      }),
    }));
  });
});

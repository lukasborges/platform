jest.mock('electron', () => ({
  app: { on: jest.fn() },
  BrowserWindow: { getAllWindows: jest.fn() },
}));
jest.mock('../../../src/services/services/browser-window/interface', () => ({
  BrowserWindowManagerService: class {},
}));
jest.mock('../../../src/services/services/browser-window/main', () => ({
  BrowserWindowServiceImpl: class {
    window = { setAutoHideMenuBar: jest.fn(), setMenuBarVisibility: jest.fn() };
  },
}));

import { BrowserWindow } from 'electron';
import { BrowserWindowManagerServiceImpl } from '../../../src/services/services/browser-window/manager';

test('keeps the toolbar window menu hidden when the saved menu preference is restored', async () => {
  const manager = new BrowserWindowManagerServiceImpl();
  const provider = { setHideMainMenu: jest.fn() };
  await manager.setProvider(provider as any);
  const main = await manager.create({ hasToolbarMenu: true });
  const secondary = await manager.create({});
  (BrowserWindow.getAllWindows as jest.Mock).mockReturnValue([main.window, secondary.window]);

  expect(main.window.setMenuBarVisibility).toHaveBeenLastCalledWith(false);
  expect(main.window.setAutoHideMenuBar).toHaveBeenLastCalledWith(false);

  for (const hide of [true, false]) {
    await manager.hideMainMenu(hide);
    expect(main.window.setMenuBarVisibility).toHaveBeenLastCalledWith(false);
    expect(main.window.setAutoHideMenuBar).toHaveBeenLastCalledWith(false);
    expect(secondary.window.setMenuBarVisibility).toHaveBeenLastCalledWith(!hide);
    expect(secondary.window.setAutoHideMenuBar).toHaveBeenLastCalledWith(hide);
    expect(provider.setHideMainMenu).toHaveBeenLastCalledWith(hide);
  }
});

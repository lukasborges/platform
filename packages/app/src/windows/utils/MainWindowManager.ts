import services from '../../services/servicesManager';
import { getUrlToLoad } from '../../utils/dev';
import { getResourceIconPath } from '../../utils/resources';
// @ts-ignore: no declaration file
import { windowCreated } from '../duck';

import GenericWindowManager from './GenericWindowManager';

export default class MainWindowManager extends GenericWindowManager {

  static instance: MainWindowManager;
  static FILEPATH = getUrlToLoad('main.html');

  constructor() {
    super();
    MainWindowManager.instance = this;
  }

  async create() {
    if (this.isCreated()) {
      return this.window;
    }

    await super.create({
      show: true,
      frame: false,
      icon: getResourceIconPath(),
      acceptFirstMouse: true,
      savePosition: 'main-window',
    });

    this.on('minimize', async () => {
      const trayIconVisible = await services.electronApp.trayIconVisible();
      if (trayIconVisible) {
        services.browserWindow.hideAllWindows();
      }
    });

    await super.load();

    return this.window!;
  }

  // @overdide
  initDispatch() {
    MainWindowManager.dispatch(windowCreated(this.windowId, true));
  }
}

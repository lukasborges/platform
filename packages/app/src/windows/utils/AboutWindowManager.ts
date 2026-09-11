import { getUrlToLoad } from '../../utils/dev';
import GenericWindowManager from './GenericWindowManager';
import { BrowserWindowServiceConstructorOptions } from '../../services/services/browser-window/interface';

class AboutWindowManager extends GenericWindowManager {
  static FILEPATH = getUrlToLoad('about.html');

  static async show() {
    await (new AboutWindowManager()).create();
  }

  async create() {
    if (this.isCreated()) {
      return this.window;
    }

    const params: BrowserWindowServiceConstructorOptions = {
      width: 390,
      height: 610,
      useContentSize: true,
      show: false,
      frame: false,
      skipTaskbar: true,
      resizable: false,
      transparent: true,
    };

    await super.create(params);
    await super.load();

    return this.window!;
  }
}

export default AboutWindowManager;

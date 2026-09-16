jest.mock('bluebird', () => ({
  delay: () => Promise.resolve(),
}));

import AutoUpdaterMock from '../../../src/services/services/auto-updater/AutoUpdaterMock';

describe('AutoUpdaterMock', () => {
  const previousScenario = process.env.STATION_AUTOUPDATER_MOCK_SCENARIO;

  afterEach(() => {
    if (previousScenario === undefined) {
      delete process.env.STATION_AUTOUPDATER_MOCK_SCENARIO;
    } else {
      process.env.STATION_AUTOUPDATER_MOCK_SCENARIO = previousScenario;
    }
  });

  test('emits the available update sequence', async () => {
    process.env.STATION_AUTOUPDATER_MOCK_SCENARIO = 'available';
    const updater = new AutoUpdaterMock();
    const events: string[] = [];

    updater.setFeedURL('https://example.test/latest.yml');
    updater.on('checking-for-update', () => events.push('checking'));
    const updateAvailable = new Promise(resolve => {
      updater.once('update-available', info => {
        events.push(`available:${info.version}`);
        resolve();
      });
    });

    updater.checkForUpdates();
    await updateAvailable;

    expect(events).toEqual([
      'checking',
      'available:3.3.0-beta.999',
    ]);
  });

  test('emits the not-available update sequence', async () => {
    process.env.STATION_AUTOUPDATER_MOCK_SCENARIO = 'not-available';
    const updater = new AutoUpdaterMock();
    const events: string[] = [];

    updater.setFeedURL('https://example.test/latest.yml');
    updater.on('checking-for-update', () => events.push('checking'));
    const updateNotAvailable = new Promise(resolve => {
      updater.once('update-not-available', () => {
        events.push('not-available');
        resolve();
      });
    });

    updater.checkForUpdates();
    await updateNotAvailable;

    expect(events).toEqual([
      'checking',
      'not-available',
    ]);
  });

  test('emits the downloading update sequence with progress and a final downloaded event', async () => {
    process.env.STATION_AUTOUPDATER_MOCK_SCENARIO = 'downloading';
    const updater = new AutoUpdaterMock();
    const events: string[] = [];
    const progressValues: number[] = [];

    updater.setFeedURL('https://example.test/latest.yml');
    updater.on('checking-for-update', () => events.push('checking'));
    updater.on('update-available', info => events.push(`available:${info.version}`));
    updater.on('download-progress', info => progressValues.push(Math.round(info.percent)));
    const updateDownloaded = new Promise<void>(resolve => {
      updater.once('update-downloaded', info => {
        events.push(`downloaded:${info.version}`);
        resolve();
      });
    });

    updater.checkForUpdates();
    await updateDownloaded;

    expect(events).toEqual([
      'checking',
      'available:3.3.0-beta.999',
      'downloaded:3.3.0-beta.999',
    ]);
    expect(progressValues).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  });

  test('emits the downloaded update sequence', async () => {
    process.env.STATION_AUTOUPDATER_MOCK_SCENARIO = 'downloaded';
    const updater = new AutoUpdaterMock();
    const events: string[] = [];

    updater.setFeedURL('https://example.test/latest.yml');
    updater.on('checking-for-update', () => events.push('checking'));
    updater.on('update-available', info => events.push(`available:${info.version}`));
    const updateDownloaded = new Promise<void>(resolve => {
      updater.once('update-downloaded', info => {
        events.push(`downloaded:${info.version}`);
        resolve();
      });
    });

    updater.checkForUpdates();
    await updateDownloaded;

    expect(events).toEqual([
      'checking',
      'available:3.3.0-beta.999',
      'downloaded:3.3.0-beta.999',
    ]);
  });
});

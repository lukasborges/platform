# Testing auto-update

Platform uses a deterministic updater mock in development and `electron-updater` in packaged builds.

## Development scenarios

Start the app with one of the supported mock scenarios:

```bash
STATION_AUTOUPDATER_MOCK_SCENARIO=available yarn dev
STATION_AUTOUPDATER_MOCK_SCENARIO=not-available yarn dev
STATION_AUTOUPDATER_MOCK_SCENARIO=downloading yarn dev
STATION_AUTOUPDATER_MOCK_SCENARIO=downloaded yarn dev
```

Use **Check for updates** in Settings or in the About window.

- `available` emits "checking" immediately and "available" after about 3 seconds.
- `not-available` emits "checking" and then "not available" after about 3 seconds.
- `downloading` emits "checking", then "available", then ten `download-progress`
  events (10% → 100%), then "downloaded". Use this to exercise the progress
  bar in the auto-update subdock and Settings.
- `downloaded` jumps straight from "available" to "downloaded" so the UI shows
  the "Restart Now" button.

`STATION_NO_CHECK_FOR_UPDATE=1` disables the initial automatic check and the
30-minute polling timer. It does not disable a manual check, which makes it safe
to keep in `.env.development` while testing the mock.

## Packaged-build behavior

`autoDownload` is enabled in packaged builds on macOS, Windows, and Linux
AppImage. On Linux `.deb`, `.rpm`, and Arch packages the running executable is
not replaceable by `electron-updater`, so the app keeps the detection-only
behavior (the update subdock links to the GitHub release where the appropriate
asset can be installed via the system package manager).

Downloaded updates are not installed automatically; the user clicks
**Restart Now** in the auto-update subdock or in Settings. Quitting the app
while a downloaded update is pending still triggers the install via the
existing `sagaPrepareQuit` hook in `app/sagas.js`.

To test the complete path on a packaged build:

1. Install an older Platform pre-release on a disposable profile or test
   machine.
2. Confirm that a newer pre-release exists with the installer and update
   metadata for that operating system.
3. Run **Check for updates**.
4. Verify that the download progress appears in the subdock and in Settings
   while the update is being fetched.
5. Click **Restart Now** once the update finishes downloading.
6. Confirm the new version in the About window and verify that the existing
   profile still opens.

The old "Station QA" commands and dummy update server no longer exist in this fork.

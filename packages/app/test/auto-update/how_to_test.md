# Testing auto-update

Platform uses a deterministic updater mock in development and `electron-updater` in packaged builds.

## Development scenarios

Start the app with one of the supported mock scenarios:

```bash
STATION_AUTOUPDATER_MOCK_SCENARIO=available yarn dev
STATION_AUTOUPDATER_MOCK_SCENARIO=not-available yarn dev
```

Use **Check for updates** in Settings or in the About window.

- `available` emits “checking” immediately, “available” after about 3 seconds and “downloaded” about 15 seconds later.
- `not-available` emits “checking” and then “not available” after about 3 seconds.

`STATION_NO_CHECK_FOR_UPDATE=1` disables the automatic 30-minute polling timer. It does not disable a manual check, which makes it safe to keep in `.env.development` while testing the mock.

The mock never downloads or installs a real package. Use the application logs and the update controls to verify state transitions.

## Packaged-build check

Packaged builds read update metadata from the GitHub pre-releases produced by the release workflow. To test the complete path:

1. Install an older Platform pre-release on a disposable profile or test machine.
2. Confirm that a newer pre-release exists with the installer and update metadata for that operating system.
3. Run **Check for updates**, wait for the download, and restart from the update prompt.
4. Confirm the new version in the About window and verify that the existing profile still opens.

The old “Station QA” commands and dummy update server no longer exist in this fork.

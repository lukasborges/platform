# Build and Webpack layout

Platform still uses `electron-webpack` for the Electron main and renderer bundles. A separate Webpack configuration builds the browser-targeted web UI used by the multi-instance configurator.

## Build commands

Run these commands from the repository root:

```bash
yarn dev
yarn build
```

`yarn dev` generates GraphQL types and CSS, builds the web UI, then starts `electron-webpack` in development mode. `yarn build` performs the same preparation and writes production bundles without creating an installer.

## Configuration files

- [`packages/app/webpack.config.main.js`](../packages/app/webpack.config.main.js) customizes the Electron main-process bundle.
- [`packages/app/webpack.config.renderer.js`](../packages/app/webpack.config.renderer.js) defines the main window, subwindow, About window and worker entries.
- [`packages/app/webpack.config.webui.js`](../packages/app/webpack.config.webui.js) builds the browser-targeted multi-instance configuration UI.
- [`packages/app/webpack.config.common.js`](../packages/app/webpack.config.common.js) applies shared `electron-webpack` changes.
- [`packages/app/webpack.config.base.js`](../packages/app/webpack.config.base.js) is the base for direct Webpack builds such as the web UI.
- [`packages/app/electron-builder.yml`](../packages/app/electron-builder.yml) controls packaging after the bundles are built.

## Renderer entries

The renderer configuration emits four main entries:

- `mainRenderer` for the main Platform window.
- `subRenderer` for detached subwindows.
- `aboutRenderer` for the About window.
- `worker` for the background Redux and service process.

Database migration files are also compiled into `dist/renderer/umzug-runs/` so Umzug can load them at runtime. The App Store build is copied into the renderer output as a local resource.

## Development behavior

- Electron renderer pages are served by the development server with hot-module replacement.
- The main process and worker can restart the application when their bundles change.
- The separate web UI is written to disk and does not use HMR.
- Some runtime resources must remain on disk because they are loaded by path rather than imported into a bundle.

When adding a new entry or resource, verify both `yarn dev` and `yarn build`; a path that works through the development server may still be missing from a packaged build.

## Packaging

`electron-builder.yml` adds runtime assets such as the production environment file, provider icons and illustrations. Keep `files` and `extraResources` limited to assets that cannot be bundled normally.

Installer creation is documented in the root [README](../README.md#manual-packaging).

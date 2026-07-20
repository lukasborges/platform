# Platform upstream policy

Platform monitors these active Station forks for fixes and useful features:

- `agenciaingenium/desktop-app` is the primary source for regular fixes and features.
- `Mathijs003/station-app` is a secondary source for runtime and architectural changes.

The scheduled Upstream Radar only reports changes. It must never merge, cherry-pick,
push a branch, or modify `main` automatically.

## Platform invariants

Every upstream change must preserve:

- the Platform name, logo, links, package names, and repository references;
- no system tray, background-on-close, background activity, or auto-launch behavior;
- the existing `Stationv2` data directory compatibility needed by current users;
- the shared Linux, macOS, and Windows visual language;
- Google authentication, App Store, Quick Switch, and persisted sessions;
- the current Linux, Windows, and macOS packaging behavior.

Changes that add tray, auto-launch, minimize-to-tray, or background-on-close behavior
are policy conflicts and should be rejected. A larger upstream commit containing one
of these changes may only be reimplemented selectively.

## Applying a reported change

1. Read the upstream commit and its surrounding commits, not only its message.
2. Check the files listed by the radar and compare them with Platform customizations.
3. Use `git cherry-pick -x <sha>` only for a small, isolated fix with no overlap.
4. Reimplement UI, runtime, persistence, packaging, and branding changes when they
   overlap Platform behavior.
5. Work on `sync/ingenium-<sha>` or `sync/mathijs-<sha>`, never directly on `main`.
6. Open a pull request describing what was adopted, adapted, or intentionally left out.

## Validation checklist

- Build on Linux, macOS, and Windows.
- Run the automated tests.
- Smoke-test startup, normal window close, and full process exit.
- Test Google login, App Store, Quick Switch, and session persistence.
- Search the diff for Station branding and links that should remain Platform-branded.
- Search for tray, auto-launch, and background execution regressions.
- Check generated package names and update metadata.


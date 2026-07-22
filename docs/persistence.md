# Persistence

Platform persists Redux state in a local SQLite database. The persistence layer converts between Immutable.js state and Sequelize models; Umzug keeps the database schema compatible between releases.

## Main pieces

- [`packages/app/src/database/model.ts`](../packages/app/src/database/model.ts) defines the Sequelize models.
- [`packages/app/src/persistence/local.backend.ts`](../packages/app/src/persistence/local.backend.ts) maps Redux state to those models and registers each persisted state branch.
- [`packages/app/src/persistence/mixins.ts`](../packages/app/src/persistence/mixins.ts) contains reusable model adapters.
- [`packages/app/src/persistence/backend.ts`](../packages/app/src/persistence/backend.ts) coordinates reading, writing and caching state.
- [`packages/app/src/persistence/umzug-runs/`](../packages/app/src/persistence/umzug-runs/) contains schema migrations.

The only active backend is local SQLite. It is initialized by [`persistence/index.ts`](../packages/app/src/persistence/index.ts), and pending migrations run automatically before the initial state is loaded.

## Adding or changing persisted state

Use this checklist:

1. Add or update the Sequelize model in `database/model.ts`.
2. Add the matching state-to-object and object-to-state mapping in `persistence/local.backend.ts`.
3. Register a new top-level state branch in `getBackend()` when necessary.
4. Add an Umzug migration for every database schema change.
5. Add or update a focused test under `packages/app/test/jest/persistence/`.

Do not rely only on changing the model definition. Existing profiles need a migration to reach the new schema.

## Choosing a proxy

- `SingletonProxyMixin` stores one row for a state branch, such as the application settings.
- `MapProxyMixin` stores keyed records, such as applications or tabs.
- `ListProxyMixin` stores an ordered or unordered collection.
- `KeyValueProxyMixin` stores plugin-style key/value data.

The corresponding state proxies (`SingletonStateProxy`, `MapStateProxy`, `ListStateProxy` and `KeyValueStateProxy`) are registered in `getBackend()`.

For example, the `AppProxy` maps the `app` Redux branch to the `App` Sequelize model:

```typescript
export class AppProxy extends SingletonProxyMixin({
  model: App,
  mapStateToObject: async state => ({
    version: state.get('version'),
    hideMainMenu: state.get('hideMainMenu'),
  }),
  mapObjectToState: async object => Immutable.Map({
    version: object.version,
    hideMainMenu: object.hideMainMenu,
  }),
}) {}
```

Keep both mapping directions symmetrical and explicitly list every persisted field.

## Migrations

Migration files live in `packages/app/src/persistence/umzug-runs/` and are loaded in filename order. New migrations should use a timestamped name, for example:

```text
20260720000000-add-application-custom-icon-url.js
```

Each module exports `up` and `down` functions:

```javascript
export default {
  up(query, DataTypes) {
    return query.addColumn('application', 'customIconURL', DataTypes.TEXT);
  },
  down(query) {
    return query.removeColumn('application', 'customIconURL');
  },
};
```

Platform refuses to open a database that contains unknown migrations. This protects profiles created by a newer, incompatible build.

## Database location

The database is `db/station.db` inside Electron's active user-data directory. The filename and profile directories retain their Station-era names so Platform can open existing user data.

Set `STATION_DB_PATH` to an explicit file when a development task needs an isolated database. Tests already use temporary databases and should never point at a real profile.

## Tests

Persistence tests are under `packages/app/test/jest/persistence/`. The `test-app.ts` and `test-applications.ts` files are useful starting points for singleton and keyed mappings.

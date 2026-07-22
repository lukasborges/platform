# Local GraphQL

Platform uses a local GraphQL schema as the typed boundary between renderer components and data owned by the background worker. It is not a network API and no longer routes operations to the former Station backend.

The renderer sends operations through the services framework. The worker executes them against a reactive schema with access to the Redux store, manifest provider, resource router and PubSub instance.

## Main files

- [`schema.graphql`](schema.graphql) defines queries, mutations and local types.
- [`allResolvers.ts`](allResolvers.ts) registers feature resolver maps.
- [`index.ts`](index.ts) creates the executable reactive schema.
- [`../utils/graphql.ts`](../utils/graphql.ts) creates the renderer-side Apollo client and RPC link.
- [`../../codegen-local.yml`](../../codegen-local.yml) configures resolver and component type generation.
- `resolvers-types.generated.ts` and `queries@local.gql.generated.tsx` files are generated output and must not be edited manually.

## Adding a query or mutation

1. Add the field and types to `schema.graphql`.
2. Add a resolver in the feature's `resolvers.ts` file.
3. Register a new resolver map in `allResolvers.ts` if the feature is not already listed.
4. Create or update `queries@local.gql` next to the component that consumes it.
5. Add that document to `codegen-local.yml` when it is a new generated target.
6. Regenerate types and components.

From the repository root:

```bash
yarn workspace platform-desktop-app gql-gen
```

The development, build and lint scripts also run GraphQL generation automatically.

The hide-main-menu setting is a compact working example:

- Schema fields: [`schema.graphql`](schema.graphql)
- Query and mutation: [`../settings/components/SettingsHideMainMenu/queries@local.gql`](../settings/components/SettingsHideMainMenu/queries@local.gql)
- Resolver: [`../app/resolvers.ts`](../app/resolvers.ts)
- Generated HOC usage: [`../settings/components/SettingsHideMainMenu/SettingsHideMainMenu.tsx`](../settings/components/SettingsHideMainMenu/SettingsHideMainMenu.tsx)

## Local operations

Client documents use the `@local` directive:

```graphql
query GetHideMainMenuStatus @live @local {
  hideMainMenu
}

mutation EnableHideMainMenu($hide: Boolean!) @local {
  setHideMainMenu(hide: $hide)
}
```

The former remote GraphQL schema, `codegen.yml` flow and `api.getstation.com` instructions have been removed from this fork. All current operations resolve locally.

## Reactive resolvers

A resolver may return a value, a promise or an RxJS Observable. Use `subscribeStore` when a field should track Redux state:

```typescript
const resolvers: Resolvers = {
  Query: {
    hideMainMenu: (_parent, _args, context) =>
      subscribeStore(context.store, getAppHideMainMenuStatus)
        .pipe(map(Boolean), distinctUntilChanged()),
  },
};
```

Queries that consume an Observable must include `@live`; otherwise the component receives only the normal query result. Apply `distinctUntilChanged` where practical to avoid unnecessary renderer updates.

## Resolver context

The `StationGQLContext` type name is retained for compatibility, but it represents Platform's local worker context. It exposes:

- `store`: the worker Redux store.
- `manifestProvider`: installed and bundled app manifests.
- `resourceRouter`: navigation for Platform resources.
- `pubsub`: local event delivery.

Resolvers should keep side effects in existing actions, sagas or services. A mutation normally dispatches an action and returns a small success value.

## Generated clients

Most existing targets generate React Apollo higher-order components; a few enable hooks in `codegen-local.yml`. Follow the nearest component rather than mixing styles inside a feature.

When a schema or query changes, commit the regenerated files together with the source change. Run the app package lint after generation:

```bash
yarn workspace platform-desktop-app lint
```

GraphQL errors are logged by the renderer Apollo link. In development, Apollo Client DevTools can also inspect active local queries and cache state.

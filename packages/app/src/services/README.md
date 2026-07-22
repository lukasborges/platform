# Services framework

Platform runs code in three Electron contexts: the main process, renderers and a background worker. The services framework gives those contexts a shared, typed API without exposing Electron IPC details to each feature.

A service implementation lives in one known process. Other processes receive a node with the same public methods, and calls are transported through `stream-json-rpc`.

## Core concepts

- **Interface**: a decorated `ServiceBase` class whose empty methods describe the RPC contract.
- **Implementation**: the class that performs the work in the owning process.
- **Node**: the local proxy used from another process.
- **Peer and channel**: the RPC connection joining nodes to implementations.
- **Global service**: a service created once per process at startup, usually with the `__default__` identifier.
- **Observer**: a service used for notifications or event subscriptions.

Public service methods are asynchronous and return promises. Values crossing a process boundary must be serializable, except for service nodes and subscriptions handled by the framework.

## Project layout

- [`services/`](services/) contains each service contract and implementation.
- [`types.ts`](types.ts) defines the global service registry.
- [`main/index.ts`](main/index.ts), [`renderer/index.ts`](renderer/index.ts) and [`worker/index.ts`](worker/index.ts) create implementations or remote nodes for each process.
- [`servicesManager.ts`](servicesManager.ts) connects the correct service set at startup.
- [`lib/`](lib/) contains decorators, serialization and RPC plumbing.

The [menu service](services/menu/) is a useful example of a main-process implementation consumed from the renderer and worker.

## Adding a global service

### 1. Define the contract

Create `services/example/interface.ts`:

```typescript
import { ServiceBase } from '../../lib/class';
import { service } from '../../lib/decorator';
import { RPC } from '../../lib/types';

@service('example')
export class ExampleService extends ServiceBase implements RPC.Interface<ExampleService> {
  // @ts-ignore: this empty method declares the RPC endpoint
  ping(value: string): Promise<string> {}
}
```

The service namespace must be unique. Use `@timeout(milliseconds)` from `lib/decorator` only when the default request timeout is not appropriate; a timeout of `0` disables it.

### 2. Implement it in the owning process

```typescript
import { RPC } from '../../lib/types';
import { ExampleService } from './interface';

export class ExampleServiceImpl extends ExampleService implements RPC.Interface<ExampleService> {
  async ping(value: string) {
    return `Platform: ${value}`;
  }
}
```

Keep Electron-only APIs in the main implementation and store-dependent logic in the worker whenever possible.

### 3. Register it

Add the contract to `GlobalServices` in `types.ts`. Then update the initializer maps for the owning process and every process that needs a node. Follow a nearby service with the same ownership pattern:

- Main-owned: compare with `menu` or `electronApp`.
- Worker-owned: compare with `manifest` or `apolloLink`.

All sides use the same service identifier, normally `__default__` for a global service.

### 4. Consume it

The initialized registry is exported by `servicesManager.ts`:

```typescript
import services from '../services/servicesManager';

const result = await services.example.ping('hello');
```

Saga code should prefer the existing `callService` helper so calls remain easy to test.

## Observers and subscriptions

Observers turn cross-process events into service calls. Define the observer contract with the same namespace, accept it as `RPC.ObserverNode<T>`, and return a `ServiceSubscription` so listeners are cleaned up on either side.

The current [skeleton service](services/skeleton/) demonstrates the minimum structure. The [menu observer](services/menu/interface.ts) and its [implementation](services/menu/main.ts) show a real event subscription.

Always remove native, RxJS or EventEmitter listeners when a subscription is destroyed.

## Debugging

Set `DEBUG=service:*` when starting Platform to inspect service registration and RPC activity:

```bash
DEBUG=service:* yarn dev
```

Architecture diagrams:

- [Process overview](doc/overview.svg)
- [Node initialization](doc/newpeer.svg)
- [Request sequence](doc/request.svg)

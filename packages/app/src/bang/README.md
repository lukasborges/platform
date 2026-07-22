# Bang search lifecycle

Bang powers Platform's quick switcher. It combines open apps, tabs, favorites, history and SDK search providers, then ranks the results using text relevance and frecency.

## Search flow

1. [`BangInput`](components/BangInput.tsx) sends the current text through the `SET_SEARCH_VALUE` action in [`duck.ts`](duck.ts).
2. [`sdkQueryValueEmitter`](sagas.ts) forwards that value to the SDK search query stream.
3. Local consumers and integrations publish sections of results. The built-in app consumer searches home tabs, regular tabs and favorites.
4. [`produceResults`](sagas.ts) serializes provider callbacks, calculates the top hits and passes every section through [`organizeSearchResults`](helpers/organizeSearchResults.ts).
5. `SET_SEARCH_RESULTS` stores the organized sections in Redux. [`BangPresenter`](components/BangPresenter.tsx) renders them through [`BangList`](components/BangList.tsx).

Selecting an item is handled in the same saga. Platform records the selection for future frecency scoring, closes the switcher when needed, and then runs the provider callback or opens the result URL.

## Ranking

The search engine in [`search/`](search/) combines three signals:

- Fuse text matching.
- Contextual frecency for a result previously chosen with the same query.
- Global frecency based on recent activity and selections.

The generic score composition utility is documented in the [score engine guide](../lib/score-engine/README.md).

## Where to make changes

- UI and keyboard behavior: `components/`, `BangContainer.tsx` and `BangSubdock.tsx`.
- Redux state and actions: `duck.ts` and `selectors.ts`.
- Search orchestration and selection: `sagas.ts`.
- Ranking weights and algorithms: `search/score/`.
- Section order and grouping: `helpers/organizeSearchResults.ts`.

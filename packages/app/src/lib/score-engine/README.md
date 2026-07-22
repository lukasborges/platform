# Score engine

The score engine is a small internal TypeScript utility for combining independent ranking signals. Platform's Bang search uses it to blend text relevance with contextual and global frecency.

It does not contain search algorithms itself. An algorithm is a pure function that receives items and a context, then returns a `ScoreMap`:

```typescript
type ScoreMap = Record<string, number[]>;
```

Each key is an item identifier. The number array keeps the individual scores produced by composed algorithms.

## Basic usage

```typescript
import ScoreEngine, { ScoreAlgorithm, ScoreMap } from './lib/score-engine';

type Item = { id: string; label: string };
type Context = { query: string };

const labelLength: ScoreAlgorithm<Item, Context> = (items) =>
  items.reduce((scores, item) => ({
    ...scores,
    [item.id]: [item.label.length],
  }), {} as ScoreMap);

const computeScores = ScoreEngine<'id', Item, Context>(labelLength, {
  idSelector: 'id',
});

const result = computeScores(
  [{ id: 'platform', label: 'Platform' }],
  { query: '' },
);
```

The returned items preserve their original fields and receive an `_scores` array. Items missing from the algorithm's map receive `[0]`.

The import above is illustrative; adjust the relative path from the calling module. The utility is not published as a separate npm package.

## Composing algorithms

`pipeAlgorithms` runs several algorithms with the same inputs and concatenates their score arrays:

```typescript
import { pipeAlgorithms } from './lib/score-engine';

const combined = pipeAlgorithms(
  textAlgorithm,
  contextualFrecencyAlgorithm,
  globalFrecencyAlgorithm,
);
```

Keep score ranges comparable before applying weights. A signal returning values in the hundreds will otherwise dominate one returning values between `0` and `1`.

## Enhancers

- `withWeight(weight, algorithm)` multiplies every score by a fixed weight.
- `withPercentages(algorithm)` divides scores by the sum of all absolute scores.
- `withStrictBound(algorithm)` scales scores by the highest absolute item score.
- `withFx(effect, algorithm)` observes the resulting map, mainly for logging and diagnostics.

Enhancers wrap from the inside out:

```typescript
const weighted = withWeight(100, withPercentages(myAlgorithm));
```

Apply normalization before weighting, as shown above.

## Identifier rules

- Every item must resolve to a stable string identifier.
- `idSelector` can be a string property name or a selector function.
- Every algorithm in a composition must use the same identifiers.
- Algorithms are synchronous. Put external data in the context or prepare it before scoring.

## Platform usage

The production composition is in [`bang/search/score/index.ts`](../../bang/search/score/index.ts). Its weights are defined in [`bang/search/score/config.ts`](../../bang/search/score/config.ts), and focused tests live in [`test-score-engine.ts`](../../../test/jest/lib/test-score-engine.ts).

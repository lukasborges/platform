import { EMPTY, of } from 'rxjs';
import { ensureActivator } from '../../../src/plugins/api';

describe('plugin runtime activator', () => {
  test('returns the shared empty observable when an activator returns nothing', async () => {
    const activate = ensureActivator(async () => undefined);
    await expect(activate({} as any)).resolves.toBe(EMPTY);
  });

  test('keeps an observable returned by an activator', async () => {
    const result = of(new Error('runtime error'));
    const activate = ensureActivator(async () => result);
    await expect(activate({} as any)).resolves.toBe(result);
  });
});

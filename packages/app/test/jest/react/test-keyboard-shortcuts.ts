/** @jest-environment jsdom */

jest.mock('mousetrap', () => {
  const Mousetrap = function () { } as any;
  Mousetrap.bind = jest.fn();
  Mousetrap.unbind = jest.fn();
  Mousetrap.prototype.handleKey = jest.fn();
  return Mousetrap;
});

jest.mock('../../../src/utils/process', () => ({ isDarwin: false }));

import * as Mousetrap from 'mousetrap';
import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';

import KeyboardShortcuts from '../../../src/dock/components/KeyboardShortcuts';

const { act } = React;
const originalHandleKey = Mousetrap.prototype.handleKey;

describe.each([false, true])('KeyboardShortcuts with isDarwin=%s', isDarwin => {
  let host: HTMLDivElement;
  let root: Root | undefined;

  beforeAll(() => {
    (global as any).IS_REACT_ACT_ENVIRONMENT = true;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    require('../../../src/utils/process').isDarwin = isDarwin;
    Mousetrap.prototype.handleKey = originalHandleKey;
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    if (root) {
      act(() => root!.unmount());
    }
    Mousetrap.prototype.handleKey = originalHandleKey;
    host.remove();
  });

  test.each([['ctrl', 'alt'], ['alt', 'ctrl']])(
    'finishes application cycling after releasing %s then %s',
    (firstKey, lastKey) => {
      const onCtrlAltArrowEnd = jest.fn();
      const shortcuts = React.createRef<KeyboardShortcuts>();
      act(() => root!.render(React.createElement(KeyboardShortcuts, {
        ref: shortcuts,
        onCtrlAltArrowEnd,
      })));
      const press = (key: string, event: string) => {
        const bindings = (Mousetrap.bind as jest.Mock).mock.calls;
        const binding = bindings.find(([keys, , action]) =>
          (Array.isArray(keys) ? keys.includes(key) : keys === (key === 'ctrl' && isDarwin ? 'mod' : key))
            && action === event
        );
        act(() => binding![1]());
      };

      press('mod+alt', 'keydown');
      act(() => shortcuts.current!.handleControlAltArrowAndHoldCtrlAlt(false));
      press(firstKey, 'keyup');
      expect(onCtrlAltArrowEnd).not.toHaveBeenCalled();
      press(lastKey, 'keyup');
      expect(onCtrlAltArrowEnd).toHaveBeenCalledTimes(1);
      expect(shortcuts.current!.state.ctrlAltCycling).toBe(false);
      press(lastKey, 'keyup');
      expect(onCtrlAltArrowEnd).toHaveBeenCalledTimes(1);
    }
  );

  test('finishes cycling once when modifier releases are batched', () => {
    const onCtrlAltArrowEnd = jest.fn();
    const shortcuts = React.createRef<KeyboardShortcuts>();
    act(() => root!.render(React.createElement(KeyboardShortcuts, {
      ref: shortcuts,
      onCtrlAltArrowEnd,
    })));
    act(() => shortcuts.current!.setModifierState({ mod: true, alt: true }));
    act(() => shortcuts.current!.handleControlAltArrowAndHoldCtrlAlt(false));

    act(() => {
      shortcuts.current!.setModifierState({ mod: false });
      shortcuts.current!.setModifierState({ alt: false });
    });

    expect(onCtrlAltArrowEnd).toHaveBeenCalledTimes(1);
    expect(shortcuts.current!.state.ctrlAltCycling).toBe(false);
  });

  test('unbinds shortcuts and restores Mousetrap when unmounted', () => {
    act(() => {
      root!.render(React.createElement(KeyboardShortcuts));
    });

    expect(Mousetrap.bind).toHaveBeenCalled();
    expect(Mousetrap.prototype.handleKey).not.toBe(originalHandleKey);

    act(() => root!.unmount());
    root = undefined;

    expect(Mousetrap.unbind).toHaveBeenCalledTimes(isDarwin ? 8 : 7);
    expect(Mousetrap.unbind).toHaveBeenCalledWith('ctrl');
    if (isDarwin) {
      expect(Mousetrap.unbind).toHaveBeenCalledWith('mod');
    } else {
      expect(Mousetrap.bind).not.toHaveBeenCalledWith('mod', expect.any(Function), expect.any(String));
      expect(Mousetrap.unbind).not.toHaveBeenCalledWith('mod');
    }
    expect(Mousetrap.unbind).toHaveBeenCalledWith('alt');
    expect(Mousetrap.unbind).toHaveBeenCalledWith('ctrl+KeyAboveTab');
    expect(Mousetrap.prototype.handleKey).toBe(originalHandleKey);
  });
});

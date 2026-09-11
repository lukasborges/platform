/** @jest-environment jsdom */

jest.mock('../../../src/theme/appearance', () => ({
  getAppearanceTheme: () => 'system',
  setAppearanceTheme: jest.fn(),
}));

import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import SettingsAppearance from '../../../src/settings/components/SettingsAppearance';
import { getUseSystemTitleBar, hasSystemTitleBar } from '../../../src/windows/systemTitleBar';

const { act } = React;

describe('system title bar preference', () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeAll(() => {
    (global as any).IS_REACT_ACT_ENVIRONMENT = true;
  });

  beforeEach(() => {
    window.localStorage.clear();
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
    act(() => root.render(React.createElement(SettingsAppearance)));
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
    jest.restoreAllMocks();
  });

  test('saves changes and clears the restart notice when the original mode is restored', () => {
    const checkbox = host.querySelector('input[aria-label="Use system title bar"]') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    expect(host.querySelector('[role="status"]')).toBeNull();

    act(() => checkbox.click());
    expect(getUseSystemTitleBar()).toBe(true);
    expect(checkbox.checked).toBe(true);
    expect(hasSystemTitleBar()).toBe(false);
    expect(host.querySelector('[role="status"]')!.textContent).toContain('Restart Platform');

    act(() => checkbox.click());
    expect(getUseSystemTitleBar()).toBe(false);
    expect(host.querySelector('[role="status"]')).toBeNull();
  });

  test('shows a save failure without changing the selected preference', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage unavailable');
    });
    const checkbox = host.querySelector('input[aria-label="Use system title bar"]') as HTMLInputElement;

    act(() => checkbox.click());

    expect(checkbox.checked).toBe(false);
    expect(host.querySelector('[role="alert"]')!.textContent).toContain('Could not save');
    expect(host.querySelector('[role="status"]')).toBeNull();
  });
});

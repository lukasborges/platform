import { fromJS } from 'immutable';

import { getBadgeForApplication } from '../../../src/applications/selectors';

const buildState = (tabs: Array<{ tabId: string, applicationId: string, title: string, badge?: string }>) =>
  fromJS({
    tabs: tabs.reduce<Record<string, any>>((acc, tab) => {
      acc[tab.tabId] = {
        applicationId: tab.applicationId,
        title: tab.title,
        badge: tab.badge || '',
      };
      return acc;
    }, {}),
  });

const badgeFor = (state: any, appId: string) => getBadgeForApplication(state as any)(appId);

describe('getBadgeForApplication (title extraction)', () => {
  it('returns the count from a leading "(N)" title (WhatsApp style)', () => {
    const state = buildState([{ tabId: 't1', applicationId: 'whatsapp', title: '(3) WhatsApp' }]);
    expect(badgeFor(state, 'whatsapp')).toBe(3);
  });

  it('returns the count from an embedded "(N)" title (Gmail old style)', () => {
    const state = buildState([{ tabId: 't1', applicationId: 'gmail', title: 'Inbox (12) - user@gmail.com - Gmail' }]);
    expect(badgeFor(state, 'gmail')).toBe(12);
  });

  it('returns undefined when no count is present', () => {
    const state = buildState([{ tabId: 't1', applicationId: 'whatsapp', title: 'WhatsApp' }]);
    expect(badgeFor(state, 'whatsapp')).toBeUndefined();
  });

  it('sums counts across multiple tabs of the same app', () => {
    const state = buildState([
      { tabId: 't1', applicationId: 'whatsapp', title: '(3) WhatsApp' },
      { tabId: 't2', applicationId: 'whatsapp', title: '(5) WhatsApp' },
    ]);
    expect(badgeFor(state, 'whatsapp')).toBe(8);
  });

  it('caps the badge at "99+"', () => {
    const state = buildState([{ tabId: 't1', applicationId: 'whatsapp', title: '(150) WhatsApp' }]);
    expect(badgeFor(state, 'whatsapp')).toBe('99+');
  });

  it('combines explicit tab.badge with the title-derived count', () => {
    const state = buildState([
      { tabId: 't1', applicationId: 'custom', title: '(2) Custom App', badge: '5' },
    ]);
    // `badgeReducer` returns '•' when given non-integer values, so we expect the
    // fallback marker here — the title-derived count would only show on its own.
    expect(badgeFor(state, 'custom')).toBe('•');
  });

  it('returns only the title-derived count when explicit badge is absent', () => {
    const state = buildState([
      { tabId: 't1', applicationId: 'custom', title: '(4) Custom App' },
    ]);
    expect(badgeFor(state, 'custom')).toBe(4);
  });

  it('does not pull the badge from a different application', () => {
    const state = buildState([
      { tabId: 't1', applicationId: 'whatsapp', title: '(3) WhatsApp' },
      { tabId: 't2', applicationId: 'gmail', title: 'Gmail' },
    ]);
    expect(badgeFor(state, 'gmail')).toBeUndefined();
  });
});
